"use client";

import React, { useState } from "react";
import { ChevronDown, Plus, Search, SlidersHorizontal, RefreshCw, MessageSquare } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Icon } from "@iconify/react";
import { useChat, ChatItem } from "@/context/ChatContext";
import { UserAvatar } from "@/components/chat/UserAvatar";

interface ChatListProps {
  viewMode: "agent" | "spv";
}

export const ChatList: React.FC<ChatListProps> = ({ viewMode }) => {
  const {
    chats,
    activeChatId,
    setActiveChatId,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filterTags,
    filterDivision,
    unassignedCount,
    hasUnassignedNotification,
    latestUnassignedTime,
    handleGetNewChat,
    setIsFilterModalOpen,
    sortOrder,
    toggleSortOrder,
    triggerNewUnassignedChat,
  } = useChat();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [spvSubTab, setSpvSubTab] = useState<string>("all");

  const optionalTabsMap: Record<string, string> = {
    resolved: "Resolved",
    ignored: "Ignored",
    expired: "Expired",
    flying: "Flying",
  };

  const isOptionalTabActive = ["resolved", "ignored", "expired", "flying"].includes(activeTab);
  const isSpvOptionalActive = ["resolved", "ignored", "expired", "flying"].includes(spvSubTab);
  const mineCount = chats.filter((c) => c.assignedTo === "Admin" || c.assignedTo === "SPV").length;

  const getTabCount = (tabKey: string) => {
    if (tabKey === "assigned") return chats.filter((c) => c.status === "Assigned").length;
    if (tabKey === "resolved") return chats.filter((c) => c.status === "Resolved").length;
    if (tabKey === "ignored") return chats.filter((c) => c.status === "Ignored").length;
    if (tabKey === "expired") return chats.filter((c) => c.status === "Expired").length;
    if (tabKey === "flying") return chats.filter((c) => c.status === "Flying").length;
    return chats.length;
  };

  // Filter logic
  const rawFilteredChats = chats.filter((chat) => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = chat.name.toLowerCase().includes(q);
      const matchMsg = chat.lastMessage.toLowerCase().includes(q);
      if (!matchName && !matchMsg) return false;
    }

    // Tags filter
    if (filterTags.length > 0) {
      const hasAllTags = filterTags.every((t) => chat.tags.includes(t));
      if (!hasAllTags) return false;
    }

    // Division filter
    if (filterDivision !== "All" && chat.division !== filterDivision) {
      return false;
    }

    // Tab Filter
    if (viewMode === "agent") {
      // CRITICAL RULE: Agent cannot see or open Unassigned chats directly.
      // Unassigned chats only show in notification banner and must be acquired via "Get New Chat".
      if (chat.status === "Unassigned") return false;

      if (activeTab === "assigned") return chat.status === "Assigned";
      if (activeTab === "resolved") return chat.status === "Resolved";
      if (activeTab === "ignored") return chat.status === "Ignored";
      if (activeTab === "expired") return chat.status === "Expired";
      if (activeTab === "flying") return chat.status === "Flying";
    } else if (viewMode === "spv") {
      if (activeTab === "mine") {
        return chat.assignedTo === "Admin" || chat.assignedTo === "SPV";
      }
      // If activeTab === "all"
      if (spvSubTab === "unassigned") return chat.status === "Unassigned";
      if (spvSubTab === "assigned") return chat.status === "Assigned";
      if (spvSubTab === "resolved") return chat.status === "Resolved";
      if (spvSubTab === "ignored") return chat.status === "Ignored";
      if (spvSubTab === "expired") return chat.status === "Expired";
      if (spvSubTab === "flying") return chat.status === "Flying";
    }

    return true;
  });

  const filteredChats = sortOrder === "oldest" ? [...rawFilteredChats].reverse() : rawFilteredChats;

  const getStatusBadgeStyle = (status: ChatItem["status"]) => {
    switch (status) {
      case "Unassigned":
        return "bg-red-50 text-red-600 border-red-200";
      case "Assigned":
        return "bg-sky-50 text-sky-600 border-sky-200";
      case "Expired":
        return "bg-slate-100 text-slate-500 border-slate-200";
      case "Unreply":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "Resolved":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Ignored":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "Flying":
        return "bg-indigo-50 text-indigo-600 border-indigo-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-1.5 font-bold text-slate-800 text-sm hover:text-sky-600 transition-colors">
            <span>All Channels</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          <div className="flex items-center gap-1.5">
            {/* Add Channel */}
            <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors" title="Add">
              <Plus size={16} />
            </button>

            {/* Toggle Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-1.5 rounded-lg transition-colors ${
                isSearchOpen ? "bg-sky-50 text-sky-600" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
              title="Search"
            >
              <Search size={16} />
            </button>

            {/* Filter Modal Trigger */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className={`p-1.5 rounded-lg transition-colors relative ${
                filterTags.length > 0 || filterDivision !== "All"
                  ? "bg-sky-50 text-sky-600"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
              title="Filter"
            >
              <SlidersHorizontal size={16} />
              {(filterTags.length > 0 || filterDivision !== "All") && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-sky-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Input (Collapsible or visible) */}
        {isSearchOpen && (
          <div className="relative animate-in fade-in duration-150">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat or customer..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              autoFocus
            />
          </div>
        )}

        {/* Status Tabs Navigation */}
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-2 relative z-20">
          {viewMode === "agent" ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {/* 2 Main Primary Tabs */}
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                    activeTab === "all"
                      ? "bg-sky-100/80 text-sky-700 font-bold shadow-2xs"
                      : "bg-slate-100/60 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  All
                </button>
                {/* Agent Assigned Pill with Floating Red Dot Animation */}
                <div className="relative inline-flex items-center">
                  <button
                    onClick={() => setActiveTab("assigned")}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                      activeTab === "assigned"
                        ? "bg-sky-100/80 text-sky-700 font-bold shadow-2xs"
                        : "bg-slate-100/60 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Agent Assigned
                  </button>
                  <img
                    src="/dot-recording-red.svg"
                    alt="Recording indicator"
                    className="w-2.5 h-2.5 absolute -top-0.5 -right-0.5 pointer-events-none z-10"
                  />
                </div>

                {/* Dynamic Active Optional Status Pill */}
                {isOptionalTabActive && (
                  <div className="relative inline-flex items-center">
                    <button
                      onClick={() => setActiveTab(activeTab)}
                      className="px-3 py-1 text-xs font-bold rounded-full transition-all whitespace-nowrap bg-sky-100/80 text-sky-700 shadow-2xs animate-in fade-in zoom-in-95 duration-150"
                    >
                      {optionalTabsMap[activeTab]}
                    </button>
                    <img
                      src="/dot-recording-red.svg"
                      alt="Recording indicator"
                      className="w-2.5 h-2.5 absolute -top-0.5 -right-0.5 pointer-events-none z-10"
                    />
                  </div>
                )}

                {/* Arrow Down Dropdown Trigger Button */}
                <div className="relative">
                  <button
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
                      isStatusDropdownOpen || isOptionalTabActive
                        ? "bg-sky-50 text-sky-600 border border-sky-200"
                        : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/70"
                    }`}
                    title="Pilih status filter opsional"
                  >
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isStatusDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu for Optional Statuses */}
                  {isStatusDropdownOpen && (
                    <div className="absolute left-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl p-1.5 z-50 w-44 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
                      <span className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                        Status Opsional
                      </span>
                      {Object.entries(optionalTabsMap).map(([key, label]) => {
                        const isSelected = activeTab === key;
                        const count = getTabCount(key);
                        return (
                          <button
                            key={key}
                            onClick={() => {
                              setActiveTab(key);
                              setIsStatusDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg font-semibold transition-all flex items-center justify-between ${
                              isSelected
                                ? "bg-sky-50 text-sky-600 font-bold"
                                : "text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span>{label} ({count})</span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Iconify Sort Button */}
              <div className="relative group shrink-0">
                <button
                  onClick={toggleSortOrder}
                  className="p-1.5 rounded-lg bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-600 border border-slate-200/80 transition-all active:scale-95 flex items-center justify-center"
                  aria-label={`Sort: ${sortOrder === "newest" ? "Newest" : "Older"}`}
                >
                  {sortOrder === "newest" ? (
                    <Icon icon="solar:sort-from-bottom-to-top-bold-duotone" className="w-5 h-5 text-sky-500" />
                  ) : (
                    <Icon icon="solar:sort-from-top-to-bottom-line-duotone" className="w-5 h-5 text-sky-500" />
                  )}
                </button>
                <div className="absolute right-0 top-full mt-1 px-2.5 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-md whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                  Sort: {sortOrder === "newest" ? "Newest" : "Older"}
                </div>
              </div>
            </div>
          ) : (
            /* SPV View Layout - Matching User Screenshot */
            <div className="flex flex-col gap-2 w-full">
              {/* Row 1: Primary Tabs for SPV (All Message | Mine) */}
              <div className="flex items-center gap-4 border-b border-slate-100 pb-1.5">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`text-xs font-bold transition-all relative pb-1 ${
                    activeTab === "all"
                      ? "text-sky-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-sky-500"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  All Message
                </button>
                <button
                  onClick={() => {
                    setActiveTab("mine");
                    if (spvSubTab === "unassigned") setSpvSubTab("all");
                  }}
                  className={`text-xs font-bold transition-all relative pb-1 ${
                    activeTab === "mine"
                      ? "text-sky-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-sky-500"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Mine ({mineCount})
                </button>
              </div>

              {/* Row 2: Sub-filter bar for SPV - always visible on both All Message & Mine tabs */}
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSpvSubTab("all")}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-full transition-all whitespace-nowrap ${
                      spvSubTab === "all"
                        ? "bg-slate-200/80 text-slate-800 font-bold"
                        : "bg-slate-100/60 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    All
                  </button>
                  {activeTab === "all" && (
                    <button
                      onClick={() => setSpvSubTab("unassigned")}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-full transition-all whitespace-nowrap ${
                        spvSubTab === "unassigned"
                          ? "bg-red-100/80 text-red-700 font-bold"
                          : "bg-slate-100/60 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Unassigned
                    </button>
                  )}
                  <div className="relative inline-flex items-center">
                    <button
                      onClick={() => setSpvSubTab("assigned")}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-full transition-all whitespace-nowrap ${
                        spvSubTab === "assigned"
                          ? "bg-sky-100/80 text-sky-700 font-bold"
                          : "bg-slate-100/60 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Agent Assigned
                    </button>
                    <img
                      src="/dot-recording-red.svg"
                      alt="Recording indicator"
                      className="w-2.5 h-2.5 absolute -top-0.5 -right-0.5 pointer-events-none z-10"
                    />
                  </div>

                  {isSpvOptionalActive && (
                    <div className="relative inline-flex items-center">
                      <button
                        onClick={() => setSpvSubTab(spvSubTab)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-full transition-all whitespace-nowrap bg-sky-100/80 text-sky-700 shadow-2xs"
                      >
                        {optionalTabsMap[spvSubTab]}
                      </button>
                      <img
                        src="/dot-recording-red.svg"
                        alt="Recording indicator"
                        className="w-2.5 h-2.5 absolute -top-0.5 -right-0.5 pointer-events-none z-10"
                      />
                    </div>
                  )}

                  {/* ChevronDown Dropdown Trigger */}
                  <div className="relative">
                    <button
                      onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                      className={`p-1 rounded-full transition-all flex items-center justify-center ${
                        isStatusDropdownOpen || isSpvOptionalActive
                          ? "bg-sky-50 text-sky-600 border border-sky-200"
                          : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/70"
                      }`}
                    >
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isStatusDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isStatusDropdownOpen && (
                      <div className="absolute left-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl p-1.5 z-50 w-44 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
                        <span className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                          Status Opsional
                        </span>
                        {Object.entries(optionalTabsMap).map(([key, label]) => {
                          const isSelected = spvSubTab === key;
                          const count = getTabCount(key);
                          return (
                            <button
                              key={key}
                              onClick={() => {
                                setSpvSubTab(key);
                                setIsStatusDropdownOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg font-semibold transition-all flex items-center justify-between ${
                                isSelected
                                  ? "bg-sky-50 text-sky-600 font-bold"
                                  : "text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <span>{label} ({count})</span>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Iconify Sort Button */}
                <div className="relative group shrink-0">
                  <button
                    onClick={toggleSortOrder}
                    className="p-1 rounded-lg bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-600 border border-slate-200/80 transition-all active:scale-95 flex items-center justify-center"
                    aria-label={`Sort: ${sortOrder === "newest" ? "Newest" : "Older"}`}
                  >
                    {sortOrder === "newest" ? (
                      <Icon icon="solar:sort-from-bottom-to-top-bold-duotone" className="w-4 h-4 text-sky-500" />
                    ) : (
                      <Icon icon="solar:sort-from-top-to-bottom-line-duotone" className="w-4 h-4 text-sky-500" />
                    )}
                  </button>
                  <div className="absolute right-0 top-full mt-1 px-2.5 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-md whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                    Sort: {sortOrder === "newest" ? "Newest" : "Older"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CORE USER TESTING FEATURE FOR AGENT VIEW: Notification Banner & 0 Unassigned State */}
      {viewMode === "agent" && (
        <div className="p-3 bg-slate-50 border-b border-slate-100">
          {unassignedCount === 0 ? (
            /* State when 0 Chat Unassigned - matches user screenshot */
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                <MessageSquare size={16} className="text-slate-400" />
                <span>0 Chat Unassigned</span>
              </div>

              <button
                onClick={triggerNewUnassignedChat}
                className="bg-sky-500 hover:bg-sky-600 active:scale-95 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 transition-all"
                title="Klik Refresh untuk mensimulasikan chat unassigned baru"
              >
                <RefreshCw size={13} className="stroke-[2.5]" />
                <span>Refresh</span>
              </button>
            </div>
          ) : hasUnassignedNotification ? (
            /* Interactive Blue Banner with "Get New Chat" button */
            <div className="bg-sky-600 text-white rounded-xl p-3 shadow-lg shadow-sky-500/20 flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2">
                {/* Lottie Animation replacing green dot */}
                <div className="w-7 h-7 shrink-0 flex items-center justify-center -ml-1">
                  <DotLottieReact
                    src="https://lottie.host/5f107f85-2929-4653-b67c-cbef742eb33e/jXea3hCHfq.lottie"
                    loop
                    autoplay
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">
                    {unassignedCount} Chat Unassigned!
                  </div>
                  <div className="text-[10px] text-sky-100 leading-tight">
                    {latestUnassignedTime}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGetNewChat}
                className="bg-white text-sky-600 hover:bg-sky-50 text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition-all whitespace-nowrap"
              >
                Get New Chat
              </button>
            </div>
          ) : (
            /* Standard state banner when notification is dismissed */
            <div className="flex items-center justify-between text-xs text-slate-600 px-1 py-0.5">
              <span className="font-semibold">{unassignedCount} Chat Unassigned</span>
              <button
                onClick={handleGetNewChat}
                className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm transition-all"
              >
                <RefreshCw size={12} />
                Refresh
              </button>
            </div>
          )}
        </div>
      )}

      {/* Chat List Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredChats.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-xs font-medium">Tidak ada chat ditemukan</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isSelected = chat.id === activeChatId;

            return (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                  isSelected ? "bg-sky-50/70 border-l-4 border-sky-500" : "hover:bg-slate-50/80"
                }`}
              >
                {/* User Avatar */}
                <div className="relative shrink-0">
                  <UserAvatar src={chat.avatar} name={chat.name} className="w-10 h-10" />
                  {chat.unreadCount && chat.unreadCount > 0 ? (
                    <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white">
                      {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                    </span>
                  ) : null}
                </div>

                {/* Chat Card Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="font-bold text-xs text-slate-800 truncate">{chat.name}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">{chat.time}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-2 leading-relaxed">
                    {chat.lastMessage}
                  </p>

                  {/* Badges & Tags */}
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusBadgeStyle(
                        chat.status
                      )}`}
                    >
                      {chat.status === "Assigned" && chat.assignedTo
                        ? `Assigned (${chat.assignedTo})`
                        : chat.status}
                    </span>

                    {/* Tags Pills */}
                    <div className="flex items-center gap-1 overflow-hidden">
                      {chat.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[9px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                      {chat.tags.length > 2 && (
                        <span className="text-[9px] text-slate-400 font-bold">+{chat.tags.length - 2}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

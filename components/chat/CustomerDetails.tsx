"use client";

import React, { useState } from "react";
import { Edit3, Plus, ChevronRight, UserX, Tag, Clock, Phone, Building, History, X } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { UserAvatar } from "@/components/chat/UserAvatar";

interface CustomerDetailsProps {
  viewMode: "agent" | "spv";
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({ viewMode }) => {
  const { activeChat, handleBlockContact, handleAddTag, handleRemoveTag } = useChat();
  const [newTagInput, setNewTagInput] = useState("");
  const [showAddTag, setShowAddTag] = useState(false);

  if (!activeChat) {
    return <div className="w-72 lg:w-80 bg-white border-l border-slate-200 h-full shrink-0"></div>;
  }

  const handleAddTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim()) {
      handleAddTag(activeChat.id, newTagInput.trim());
      setNewTagInput("");
      setShowAddTag(false);
    }
  };

  return (
    <div className="w-72 lg:w-80 bg-white border-l border-slate-200 flex flex-col h-full overflow-y-auto text-slate-800 shrink-0">
      {/* Top Customer Header Card */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserAvatar src={activeChat.avatar} name={activeChat.name} className="w-11 h-11 text-sm font-bold" />
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1">
              {activeChat.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">{activeChat.phone}</p>
          </div>
        </div>

        <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Edit3 size={16} />
        </button>
      </div>

      {/* Accordion / Info Sections */}
      <div className="p-5 space-y-6 text-xs divide-y divide-slate-100">
        {/* Contact Profile */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-slate-800 text-xs tracking-tight">Contact Profile</h4>
          <div className="space-y-2 text-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Channel</span>
              <span className="font-semibold text-slate-800">{activeChat.channel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Phone Number</span>
              <span className="font-semibold text-slate-800">{activeChat.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Company</span>
              <span className="font-semibold text-slate-800 truncate max-w-[140px]" title={activeChat.company}>
                {activeChat.company}
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="pt-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-xs">Tags</h4>
            <button
              onClick={() => setShowAddTag(!showAddTag)}
              className="p-1 text-slate-400 hover:text-sky-600 rounded transition-colors"
              title="Add Tag"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {activeChat.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg text-[11px] group border border-slate-200/60"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(activeChat.id, tag)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>

          {showAddTag && (
            <form onSubmit={handleAddTagSubmit} className="mt-2 flex gap-1">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="New tag..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                autoFocus
              />
              <button type="submit" className="bg-sky-500 text-white px-2.5 py-1 rounded-lg font-bold text-xs">
                Add
              </button>
            </form>
          )}
        </div>

        {/* Rate */}
        <div className="pt-4 space-y-1">
          <h4 className="font-bold text-slate-800 text-xs">Rate</h4>
          <p className="text-[11px] text-slate-400 italic">There is no reviews from this customer yet.</p>
        </div>

        {/* Summary */}
        <div className="pt-4 space-y-1">
          <h4 className="font-bold text-slate-800 text-xs">Summary</h4>
          <p className="text-slate-400 text-xs">-</p>
        </div>

        {/* History Chat */}
        <div className="pt-4">
          <button className="w-full flex items-center justify-between font-bold text-slate-800 hover:text-sky-600 transition-colors">
            <span>History Chat (2)</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* History Agent */}
        <div className="pt-4 space-y-2">
          <h4 className="font-bold text-slate-800 text-xs">History Agent</h4>
          <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-600 font-bold flex items-center justify-center text-[10px]">
                I
              </div>
              <span className="font-semibold text-slate-800">{activeChat.assignedTo || "Irul"}</span>
            </div>
            <span className="text-[10px] text-slate-400">11:45 WIB - Now</span>
          </div>
        </div>

        {/* Conversation Details */}
        <div className="pt-4 space-y-2">
          <h4 className="font-bold text-slate-800 text-xs">Conversation Details</h4>
          <div className="space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Created</span>
              <span className="font-medium text-slate-800">{activeChat.created}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last seen</span>
              <span className="font-medium text-slate-800">{activeChat.lastSeen}</span>
            </div>
          </div>
        </div>

        {/* SPV ONLY Action: Block Contact Button */}
        {viewMode === "spv" && (
          <div className="pt-6">
            <button
              onClick={() => handleBlockContact(activeChat.id)}
              className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                activeChat.isBlocked
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                  : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
              }`}
            >
              <UserX size={14} />
              {activeChat.isBlocked ? "Unblock Contact" : "Block Contact"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

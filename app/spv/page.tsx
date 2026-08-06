"use client";

import React from "react";
import { SidebarNav } from "@/components/chat/SidebarNav";
import { TopNavbar } from "@/components/chat/TopNavbar";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { CustomerDetails } from "@/components/chat/CustomerDetails";
import { FilterModal } from "@/components/chat/FilterModal";

export default function SpvPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      {/* Far Left Navigation Sidebar */}
      <SidebarNav />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Top Navbar Header */}
        <TopNavbar />

        {/* 3-Column Chat Application Layout for SPV */}
        <main className="flex-1 flex h-[calc(100vh-3.5rem)] overflow-hidden">
          <ChatList viewMode="spv" />
          <ChatWindow viewMode="spv" />
          <CustomerDetails viewMode="spv" />
        </main>
      </div>

      {/* Filter Modal Dialog */}
      <FilterModal />
    </div>
  );
}

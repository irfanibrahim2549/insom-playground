"use client";

import React from "react";
import { Bell, Wallet, Compass, UserCheck, ShieldCheck, RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useChat } from "@/context/ChatContext";

export const TopNavbar: React.FC = () => {
  const pathname = usePathname();
  const isAgent = pathname === "/agent" || pathname === "/";
  const isSpv = pathname === "/spv";
  const { autoTimerActive, toggleAutoTimer, unassignedCount } = useChat();

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10 shrink-0">
      {/* Left: Brand Name & View Selector for Testing */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-2xl tracking-tight text-slate-800">
            Ins<span className="text-sky-500">o</span>mnia
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
            User Testing Mode
          </span>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <Link
            href="/agent"
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              isAgent
                ? "bg-white text-sky-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <UserCheck size={14} />
            Agent View
          </Link>
          <Link
            href="/spv"
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              isSpv
                ? "bg-white text-sky-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldCheck size={14} />
            SPV / Owner View
          </Link>
        </div>
      </div>

      {/* Right: Setup Guides, Balance, Notification, Profile */}
      <div className="flex items-center gap-4">
        {/* Toggle Simulation Timer */}
        <button
          onClick={toggleAutoTimer}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
            autoTimerActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
          }`}
          title="Toggle automatic incoming chat simulation timer"
        >
          <RefreshCw size={13} className={autoTimerActive ? "animate-spin" : ""} />
          Timer Chat Masuk: <span className="font-bold">{autoTimerActive ? "ON (15s)" : "OFF"}</span>
        </button>

        <button className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
          <Compass size={16} className="text-slate-400" />
          Setup guides
        </button>

        {/* Balance */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <Wallet size={16} className="text-sky-500" />
          <span>Balance</span>
          <span className="text-slate-900 font-bold">Rp1.345.000.000</span>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
          <Bell size={18} />
          {unassignedCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 font-bold flex items-center justify-center text-sm border border-sky-200 shadow-sm">
            A
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-tight">Admin</span>
            <span className="text-[10px] text-slate-400 leading-tight">Admin@gmail.com</span>
          </div>
        </div>
      </div>
    </header>
  );
};

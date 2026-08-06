"use client";

import React from "react";
import { MessageSquare, Radio, Users, BarChart3, Settings, HelpCircle, Bot, Sliders } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const SidebarNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { id: "chat", icon: MessageSquare, label: "Live Chat", href: "/agent" },
    { id: "broadcast", icon: Radio, label: "Broadcast", href: "#" },
    { id: "contacts", icon: Users, label: "Contacts", href: "#" },
    { id: "analytics", icon: BarChart3, label: "Analytics", href: "#" },
    { id: "bot", icon: Bot, label: "AI Bot", href: "#" },
  ];

  return (
    <aside className="w-16 bg-white border-r border-slate-200 flex flex-col justify-between items-center py-4 z-20 shrink-0">
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Insomnia Brand Logo Icon */}
        <Link href="/" className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md hover:scale-105 transition-transform">
          In
        </Link>

        {/* Top Nav Items */}
        <nav className="flex flex-col gap-2 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href) && item.href !== "#";
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full h-11 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-sky-50 text-sky-600 shadow-sm border border-sky-100"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
                title={item.label}
              >
                <Icon size={20} className={isActive ? "stroke-[2.5]" : "stroke-2"} />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings & Help */}
      <div className="flex flex-col gap-2 w-full px-2">
        <button className="w-full h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors" title="Settings">
          <Settings size={20} />
        </button>
        <button className="w-full h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors" title="Help">
          <HelpCircle size={20} />
        </button>
      </div>
    </aside>
  );
};

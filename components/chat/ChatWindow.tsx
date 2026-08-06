"use client";

import React, { useState } from "react";
import { ChevronDown, CheckCircle2, Smile, Paperclip, Send, Sparkles, AlertCircle } from "lucide-react";
import { useChat } from "@/context/ChatContext";

interface ChatWindowProps {
  viewMode?: "agent" | "spv";
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ viewMode = "agent" }) => {
  const { activeChat, handleSendMessage, handleResolveChat } = useChat();
  const [inputText, setInputText] = useState("");

  if (!activeChat) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-8 text-center">
        <div className="max-w-sm text-slate-400">
          <AlertCircle size={48} className="mx-auto mb-3 opacity-40 text-sky-500" />
          <h3 className="font-bold text-slate-700 text-sm mb-1">Pilih Chat untuk Memulai</h3>
          <p className="text-xs">Klik salah satu antrean obrolan di sebelah kiri untuk melihat pesan.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleSendMessage(inputText, viewMode);
    setInputText("");
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full min-w-0 border-r border-slate-200">
      {/* Top Bar of Active Chat */}
      <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Assigned to:</span>
          <button className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg hover:bg-slate-200 transition-colors">
            <span>{activeChat.assignedTo || "Unassigned"}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
        </div>

        <button
          onClick={() => handleResolveChat(activeChat.id)}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl shadow-sm transition-all ${
            activeChat.status === "Resolved"
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-sky-500 hover:bg-sky-600 active:scale-95 text-white"
          }`}
        >
          <CheckCircle2 size={14} />
          {activeChat.status === "Resolved" ? "Resolved" : "Resolved"}
        </button>
      </div>

      {/* Message Stream Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Date Divider */}
        <div className="text-center">
          <span className="text-[10px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
            today
          </span>
        </div>

        {/* Messages */}
        {activeChat.messages.map((msg) => {
          if (msg.sender === "system") {
            return (
              <div key={msg.id} className="text-center my-3">
                <span className="text-[11px] text-slate-400 font-medium bg-slate-100/80 px-3 py-1 rounded-lg border border-slate-200 inline-block">
                  {msg.text}
                </span>
              </div>
            );
          }

          if (msg.sender === "user") {
            return (
              <div key={msg.id} className="flex flex-col items-start max-w-[80%] space-y-1">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-sm text-xs text-slate-800 leading-relaxed">
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 font-medium px-1">{msg.time}</span>
              </div>
            );
          }

          // Agent Message
          return (
            <div key={msg.id} className="flex flex-col items-end max-w-[80%] ml-auto space-y-1">
              <div className="bg-sky-50 border border-sky-100 rounded-2xl rounded-tr-none p-3.5 shadow-sm text-xs text-slate-800 leading-relaxed">
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 font-medium px-1">
                ✓ Sent - {msg.time}
              </span>
            </div>
          );
        })}

        {/* AI Summary Banner (ICHA.ai) as shown in Figma */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 text-amber-900 text-xs flex items-start gap-2.5 shadow-2xs my-4">
          <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-[11px] text-amber-700 block">
              Summary latest chat by ICHA.ai
            </span>
            <p className="text-[11px] leading-relaxed">
              Ini adalah summary percakapan terakhir setelah percakapan di assign ke agen lainnya.
            </p>
          </div>
        </div>
      </div>

      {/* Message Input Box */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Action Icons */}
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Emoji"
          >
            <Smile size={18} />
          </button>
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Attachment"
          >
            <Paperclip size={18} />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='Type a message or type "/" to use template...'
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:hover:bg-sky-500 text-white rounded-xl shadow-md transition-all active:scale-95"
            title="Send Message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { X, Filter, Check } from "lucide-react";
import { useChat } from "@/context/ChatContext";

export const FilterModal: React.FC = () => {
  const {
    isFilterModalOpen,
    setIsFilterModalOpen,
    filterTags,
    setFilterTags,
    filterDivision,
    setFilterDivision,
  } = useChat();

  const [tempTags, setTempTags] = useState<string[]>(filterTags);
  const [tempDivision, setTempDivision] = useState<string>(filterDivision);

  if (!isFilterModalOpen) return null;

  const availableTags = ["Register", "Login", "Pembayaran"];
  const availableDivisions = ["All", "Customer Service", "Technical Support", "Sales", "Billing"];

  const handleToggleTag = (tag: string) => {
    if (tempTags.includes(tag)) {
      setTempTags(tempTags.filter((t) => t !== tag));
    } else {
      setTempTags([...tempTags, tag]);
    }
  };

  const handleApply = () => {
    setFilterTags(tempTags);
    setFilterDivision(tempDivision);
    setIsFilterModalOpen(false);
  };

  const handleReset = () => {
    setTempTags([]);
    setTempDivision("All");
    setFilterTags([]);
    setFilterDivision("All");
    setIsFilterModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-sky-500" />
            <h3 className="font-bold text-slate-800 text-sm">Filter Chat</h3>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-sky-600 font-medium transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Division Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Division</label>
            <select
              value={tempDivision}
              onChange={(e) => setTempDivision(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            >
              {availableDivisions.map((div) => (
                <option key={div} value={div}>
                  {div === "All" ? "All Divisions" : div}
                </option>
              ))}
            </select>
          </div>

          {/* Tags Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = tempTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-sky-500 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected && <Check size={12} />}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={() => setIsFilterModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 active:scale-95 rounded-xl shadow-md transition-all"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

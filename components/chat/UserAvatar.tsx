"use client";

import React, { useState } from "react";

interface UserAvatarProps {
  src?: string;
  name: string;
  className?: string;
  textClassName?: string;
}

export function getInitials(name: string): string {
  if (!name || !name.trim()) return "?";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

const BG_COLORS = [
  "bg-sky-500 text-white",
  "bg-indigo-500 text-white",
  "bg-emerald-500 text-white",
  "bg-amber-500 text-white",
  "bg-purple-500 text-white",
  "bg-rose-500 text-white",
  "bg-teal-500 text-white",
  "bg-blue-600 text-white",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % BG_COLORS.length;
  return BG_COLORS[index];
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  className = "w-10 h-10",
  textClassName = "text-xs font-bold",
}) => {
  const [hasError, setHasError] = useState(false);
  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);

  // If image URL exists and hasn't errored
  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setHasError(true)}
        className={`${className} rounded-full object-cover border border-slate-200 shadow-2xs shrink-0`}
      />
    );
  }

  // Fallback Initials Avatar
  return (
    <div
      className={`${className} rounded-full ${colorClass} ${textClassName} flex items-center justify-center border border-white/20 shadow-2xs shrink-0 select-none uppercase tracking-wider`}
      title={name}
    >
      {initials}
    </div>
  );
};

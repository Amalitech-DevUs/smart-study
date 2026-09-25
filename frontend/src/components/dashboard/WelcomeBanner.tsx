"use client";

import React from "react";

type Props = {
  username: string | undefined;
};

export function WelcomeBanner({ username }: Props) {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  })();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0e1726] p-6 sm:p-8 shadow-sm mb-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative z-10">
        {/* Left greeting text */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-300 mb-3">
            BECE Revision Portal
          </div>
          <p className="text-sm font-semibold text-slate-300">
            {greeting},
          </p>
          <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {username || "Student"}
          </h2>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-400">
            Stay updated with your academic journey and prepare effectively for your upcoming BECE examinations.
          </p>
        </div>

        {/* Right SVG illustration — black, white, and slate */}
        <div className="hidden md:flex items-center justify-center shrink-0 pr-4">
          <svg
            className="w-44 h-28 drop-shadow-md"
            viewBox="0 0 200 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Pot */}
            <path d="M48 95 L56 122 H72 L80 95 Z" fill="#1E293B" stroke="#334155" strokeWidth="2" />
            <ellipse cx="64" cy="95" rx="16" ry="4" fill="#475569" />
            {/* Leaves */}
            <path d="M64 95 Q52 70 42 62 Q58 64 64 88" fill="#334155" />
            <path d="M64 90 Q62 55 64 45 Q70 60 64 90" fill="#1E293B" />
            <path d="M64 92 Q78 72 86 66 Q74 66 64 88" fill="#475569" />
            {/* Bottom book — white */}
            <rect x="75" y="95" width="105" height="18" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
            <rect x="78" y="99" width="6" height="10" rx="1" fill="#0E1726" />
            <rect x="88" y="99" width="88" height="10" rx="1" fill="#F1F5F9" />
            {/* Middle book — dark */}
            <rect x="82" y="75" width="95" height="18" rx="4" fill="#0E1726" stroke="#1E293B" strokeWidth="1.5" />
            <rect x="85" y="79" width="88" height="10" rx="1" fill="#1E293B" />
            {/* Top book — white */}
            <rect x="90" y="55" width="85" height="18" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <rect x="98" y="55" width="7" height="14" rx="1" fill="#0E1726" />
            <rect x="110" y="59" width="60" height="10" rx="1" fill="#F8FAFC" />
          </svg>
        </div>
      </div>
    </div>
  );
}

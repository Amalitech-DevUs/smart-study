"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User as UserIcon } from "lucide-react";
import { NotificationCenter } from "@/components/shared/notification-center";
import type { DailyGoalData } from "@/lib/learning-tracker";

type Props = {
  username: string | undefined;
  streak: number;
  dailyGoal: DailyGoalData;
};

export function DashboardHeader({ username }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/flashcards?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-3.5 sm:px-5 sm:py-3.5 border border-slate-200 shadow-2xs">
      {/* Top row on mobile: Dashboard Title + Right-corner action controls */}
      <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
        <h1 className="font-heading text-xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>

        {/* Mobile-only corner controls: Notification bell + user avatar button */}
        <div className="flex sm:hidden items-center gap-2">
          <NotificationCenter />
          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition-colors hover:bg-slate-100 active:scale-95 shadow-xs"
            aria-label="View Profile"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 border border-slate-700 font-bold text-xs text-amber-400">
              {username ? username.charAt(0).toUpperCase() : <UserIcon className="h-3.5 w-3.5" />}
            </div>
          </Link>
        </div>
      </div>

      {/* Search Bar: full-width on mobile, centered/flex-1 with max-w-md on desktop */}
      <form onSubmit={handleSearchSubmit} className="relative w-full sm:flex-1 sm:max-w-md sm:mx-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search past papers, topics, questions..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-slate-400 focus:bg-white focus:outline-none"
        />
      </form>

      {/* Desktop-only corner controls: Notification bell + expanded profile pill */}
      <div className="hidden sm:flex items-center justify-end gap-3 shrink-0">
        <NotificationCenter />

        <Link
          href="/profile"
          className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pr-3 transition-colors hover:bg-slate-100"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-700 font-bold text-xs text-amber-400 shadow-xs">
            {username ? username.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              Hello, {username || "Student"}
            </p>
            <p className="text-[10px] font-medium text-slate-500 leading-tight">
              BECE Candidate
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}

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
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white px-5 py-3.5 border border-slate-200 shadow-2xs">
      <h1 className="font-heading text-xl font-bold tracking-tight text-slate-900">
        Dashboard
      </h1>

      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md mx-auto sm:mx-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search past papers, topics, questions..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-slate-400 focus:bg-white focus:outline-none"
        />
      </form>

      <div className="flex items-center justify-between sm:justify-end gap-3.5">
        <NotificationCenter />

        <Link
          href="/profile"
          className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pr-3 transition-colors hover:bg-slate-100"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0e1726] font-bold text-xs text-white shadow-xs">
            {username ? username.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
          </div>
          <div className="text-left hidden sm:block">
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

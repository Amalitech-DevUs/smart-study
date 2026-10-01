"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  User as UserIcon,
  X,
  BookOpen,
  FileText,
  Tag,
  ArrowUpRight,
  CornerDownLeft,
} from "lucide-react";
import { NotificationCenter } from "@/components/shared/notification-center";
import type { DailyGoalData } from "@/lib/learning-tracker";
import { SUBJECTS } from "@/lib/constants/subjects";
import { placeholderSubjects } from "@/lib/placeholder-subjects";

type Props = {
  username: string | undefined;
  streak: number;
  dailyGoal: DailyGoalData;
};

type ResultItem = {
  id: string;
  type: "subject" | "topic" | "paper";
  title: string;
  subtitle: string;
  category: string;
  url: string;
};

export function DashboardHeader({ username }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchYear, setSearchYear] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams({ q: searchQuery.trim() });
      if (searchYear) params.set("year", searchYear);
      router.push(`/flashcards/search?${params.toString()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (!isOpen || !hasResults) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatList.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatList.length) % flatList.length);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setIsOpen(false);
  };

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white px-5 py-3.5 border border-slate-200 shadow-2xs">
      <h1 className="font-heading text-xl font-bold tracking-tight text-slate-900">
        Dashboard
      </h1>

      <form
        onSubmit={handleSearchSubmit}
        className="relative flex flex-1 items-center gap-2 mx-auto max-w-xl sm:mx-4"
      >
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past papers, topics, questions..."
            aria-label="Search past papers, questions, and articles"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-slate-400 focus:bg-white focus:outline-none"
          />
        </div>
        <select
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)}
          aria-label="Filter question results by year"
          className="w-28 shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-700 focus:border-slate-400 focus:bg-white focus:outline-none"
        >
          <option value="">Any year</option>
          {Array.from({ length: 7 }, (_, index) => 2026 - index).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </form>

      <div className="flex items-center justify-between sm:justify-end gap-3.5">
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

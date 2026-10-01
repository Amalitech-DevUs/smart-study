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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute matching search results
  const categorizedResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return { subjects: [], topics: [], papers: [], flatList: [] as ResultItem[] };
    }

    // 1. Matching subjects (max 3)
    const subjects: ResultItem[] = SUBJECTS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.displayName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q)
    )
      .slice(0, 3)
      .map((s) => ({
        id: `subj-${s.slug}`,
        type: "subject" as const,
        title: s.name,
        subtitle: `${s.paperCount} past papers (${s.years})`,
        category: "Subjects",
        url: `/flashcards/${s.slug}`,
      }));

    // 2. Matching topics across all subjects (max 4)
    const topics: ResultItem[] = [];
    for (const subj of SUBJECTS) {
      for (const topic of subj.topics) {
        if (topic.toLowerCase().includes(q)) {
          topics.push({
            id: `topic-${subj.slug}-${topic}`,
            type: "topic" as const,
            title: topic,
            subtitle: `Topic in ${subj.displayName}`,
            category: "Topics",
            url: `/flashcards/${subj.slug}`,
          });
        }
      }
    }
    const slicedTopics = topics.slice(0, 3);

    // 3. Matching past papers (max 3)
    const papers: ResultItem[] = [];
    for (const subj of placeholderSubjects) {
      const subjConfig = SUBJECTS.find((s) => s.slug === subj.slug);
      const subjName = subjConfig?.displayName || subj.name;
      for (const paper of subj.papers) {
        const yearStr = String(paper.year);
        const fullPaperName = `${subjName} ${yearStr}`.toLowerCase();
        if (yearStr.includes(q) || fullPaperName.includes(q)) {
          papers.push({
            id: `paper-${subj.slug}-${paper.year}`,
            type: "paper" as const,
            title: `${subjName} · ${paper.year} BECE`,
            subtitle: `${paper.questionCount} Objective Questions`,
            category: "Exam Papers",
            url: `/flashcards/${subj.slug}/${paper.year}?mode=practice`,
          });
        }
      }
    }
    const slicedPapers = papers.slice(0, 3);

    const flatList = [...subjects, ...slicedTopics, ...slicedPapers];

    return {
      subjects,
      topics: slicedTopics,
      papers: slicedPapers,
      flatList,
    };
  }, [searchQuery]);

  const flatList = categorizedResults.flatList;
  const hasResults = flatList.length > 0;

  const handleNavigate = useCallback(
    (url: string) => {
      setIsOpen(false);
      router.push(url);
    },
    [router]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (isOpen && hasResults && flatList[selectedIndex]) {
      handleNavigate(flatList[selectedIndex].url);
    } else {
      setIsOpen(false);
      router.push(`/flashcards?q=${encodeURIComponent(searchQuery.trim())}`);
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

      {/* Search Bar with Professional Command-Palette Dropdown */}
      <div ref={containerRef} className="relative w-full sm:flex-1 sm:max-w-md sm:mx-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (searchQuery.trim().length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search subjects, topics, or papers..."
            className="w-full rounded-3xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-14 text-xs font-medium text-slate-900 placeholder-slate-400 transition-all focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/5 shadow-2xs"
          />

          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery ? (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search query"
                className="rounded-md p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 shadow-2xs">
                /
              </kbd>
            )}
          </div>
        </form>

        {/* Command-Palette Style Live Results */}
        {isOpen && searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-xl ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 duration-100">
            {hasResults ? (
              <div>
                <div className="max-h-[380px] overflow-y-auto p-1.5 space-y-3">
                  {/* 1. Subjects Group */}
                  {categorizedResults.subjects.length > 0 && (
                    <div>
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Subjects
                      </div>
                      <div className="space-y-0.5">
                        {categorizedResults.subjects.map((item) => {
                          const itemIndex = flatList.findIndex((x) => x.id === item.id);
                          const isSelected = itemIndex === selectedIndex;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleNavigate(item.url)}
                              onMouseEnter={() => setSelectedIndex(itemIndex)}
                              className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors cursor-pointer ${
                                isSelected ? "bg-slate-100/90 text-slate-900" : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                                  <BookOpen className="h-3.5 w-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-slate-900 truncate">
                                    {item.title}
                                  </p>
                                  <p className="text-[11px] text-slate-400 truncate">
                                    {item.subtitle}
                                  </p>
                                </div>
                              </div>
                              <span className="shrink-0 text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                <span>Subject</span>
                                <ArrowUpRight className="h-3 w-3" />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Topics Group */}
                  {categorizedResults.topics.length > 0 && (
                    <div>
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Topics
                      </div>
                      <div className="space-y-0.5">
                        {categorizedResults.topics.map((item) => {
                          const itemIndex = flatList.findIndex((x) => x.id === item.id);
                          const isSelected = itemIndex === selectedIndex;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleNavigate(item.url)}
                              onMouseEnter={() => setSelectedIndex(itemIndex)}
                              className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors cursor-pointer ${
                                isSelected ? "bg-slate-100/90 text-slate-900" : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                                  <Tag className="h-3.5 w-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-slate-900 truncate">
                                    {item.title}
                                  </p>
                                  <p className="text-[11px] text-slate-400 truncate">
                                    {item.subtitle}
                                  </p>
                                </div>
                              </div>
                              <span className="shrink-0 text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                <span>Topic</span>
                                <ArrowUpRight className="h-3 w-3" />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. Past Papers Group */}
                  {categorizedResults.papers.length > 0 && (
                    <div>
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Past Exam Papers
                      </div>
                      <div className="space-y-0.5">
                        {categorizedResults.papers.map((item) => {
                          const itemIndex = flatList.findIndex((x) => x.id === item.id);
                          const isSelected = itemIndex === selectedIndex;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleNavigate(item.url)}
                              onMouseEnter={() => setSelectedIndex(itemIndex)}
                              className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors cursor-pointer ${
                                isSelected ? "bg-slate-100/90 text-slate-900" : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                                  <FileText className="h-3.5 w-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-slate-900 truncate">
                                    {item.title}
                                  </p>
                                  <p className="text-[11px] text-slate-400 truncate">
                                    {item.subtitle}
                                  </p>
                                </div>
                              </div>
                              <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                                Practice
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Minimalist Command-Palette Footer */}
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-3 py-2 text-[11px] text-slate-400">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      router.push(`/flashcards?q=${encodeURIComponent(searchQuery.trim())}`);
                    }}
                    className="font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
                  >
                    <span>View all matching papers</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </button>

                  <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 font-mono text-[9px] text-slate-500 shadow-2xs">↑↓</kbd>
                      navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 font-mono text-[9px] text-slate-500 shadow-2xs flex items-center">
                        <CornerDownLeft className="h-2.5 w-2.5" />
                      </kbd>
                      select
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 font-mono text-[9px] text-slate-500 shadow-2xs">ESC</kbd>
                      close
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Clean Minimalist Empty State */
              <div className="p-5 text-center">
                <p className="text-xs font-semibold text-slate-800">
                  No direct matches for &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Press Enter to search all past examination questions.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/flashcards?q=${encodeURIComponent(searchQuery.trim())}`);
                  }}
                  className="mt-3 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <span>Search all resources</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

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

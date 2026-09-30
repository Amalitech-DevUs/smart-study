"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Bell,
  Megaphone,
  Calendar,
  Search,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Info,
  ExternalLink,
} from "lucide-react";
import { RequireAuth } from "@/components/shared/require-auth";
import { ALL_NOTICES } from "@/components/dashboard/NoticeBoardCard";

type FilterType = "ALL" | "URGENT" | "NEW" | "UPDATE";

const BADGE_STYLES: Record<string, string> = {
  URGENT: "bg-rose-50 text-rose-700 border-rose-200",
  NEW: "bg-emerald-50 text-emerald-700 border-emerald-200",
  UPDATE: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function NoticesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const filteredNotices = useMemo(() => {
    return ALL_NOTICES.filter((n) => {
      const matchesFilter =
        activeFilter === "ALL" ? true : n.badge === activeFilter;
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activeFilter, searchQuery]);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-16">
        <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
          {/* Top Breadcrumb & Header */}
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
                    <Megaphone className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      Notice Board
                    </h1>
                    <p className="text-xs text-slate-500">
                      Official examination notices, WAEC circulars, and study updates
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
                  Academic Session: {currentYear}
                </span>
              </div>
            </div>
          </div>

          {/* Controls: Search & Category Filters */}
          <div className="mb-6 flex flex-col gap-3">
            {/* Search Input — full width on mobile */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notices, timetable, guidelines..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 shadow-2xs transition-all"
              />
            </div>

            {/* Filter Buttons — horizontally scrollable on mobile */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 text-xs shadow-2xs overflow-x-auto scrollbar-hide flex-nowrap self-start">
              {(["ALL", "URGENT", "NEW", "UPDATE"] as FilterType[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 font-semibold transition-colors whitespace-nowrap ${
                    activeFilter === tab
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {tab === "ALL"
                    ? `All (${ALL_NOTICES.length})`
                    : tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Notices Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                            BADGE_STYLES[n.badge]
                          }`}
                        >
                          {n.badge}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                          <Calendar className="h-3 w-3" />
                          {formatDate(n.date)}
                        </span>
                      </div>
                    </div>

                    <h2 className="font-heading text-base font-bold text-slate-900 mb-1.5">
                      {n.title}
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {n.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-medium text-slate-400">
                        WAEC Official Notice
                      </span>
                      <Link
                        href={n.href}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
                      >
                        <span>Open Resource</span>
                        <ArrowRight className="h-3 w-3 text-amber-400" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                    <Bell className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-sm font-bold text-slate-900">
                    No notices match your criteria
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Try adjusting your search query or switching to All notices.
                  </p>
                </div>
              )}
            </div>

            {/* Side Information Panel */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 shadow-2xs">
                <div className="flex items-center gap-2 text-amber-800 mb-2">
                  <ShieldAlert className="h-4 w-4" />
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider">
                    Candidate Advisory
                  </h3>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  All official BECE regulations, banned items, and index verification requirements are issued directly by the West African Examinations Council (WAEC).
                </p>
                <div className="mt-3 pt-3 border-t border-amber-200/80">
                  <Link
                    href="/articles"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-950 hover:underline"
                  >
                    <span>Read candidate code of conduct</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center gap-2 text-slate-900 mb-2">
                  <Info className="h-4 w-4 text-slate-600" />
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider">
                    Stay Informed
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Important changes to the mock exam series or syllabus corrections will also trigger alert notifications directly in your top navigation.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}

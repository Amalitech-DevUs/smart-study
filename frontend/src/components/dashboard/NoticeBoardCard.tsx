"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Megaphone, Bell, Calendar, ChevronDown } from "lucide-react";

type Notice = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO format: YYYY-MM-DD
  badge: "URGENT" | "NEW" | "UPDATE";
  href: string;
};

export const ALL_NOTICES: Notice[] = [
  {
    id: "n2026-1",
    title: "BECE 2026 Examination Timetable Released",
    description: "The official WAEC examination timetable and candidate instructions are now active.",
    date: "2026-09-18",
    badge: "URGENT",
    href: "/articles",
  },
  {
    id: "n2026-2",
    title: "2026 National Mock Series Activated",
    description: "Full-length timed practice tests with instant grading now available for all 8 subjects.",
    date: "2026-09-12",
    badge: "NEW",
    href: "/flashcards",
  },
  {
    id: "n2026-3",
    title: "AI Study Companion 2.0 Deployed",
    description: "Updated formula breakdown and step-by-step reasoning for Mathematics and Science.",
    date: "2026-09-05",
    badge: "UPDATE",
    href: "/chat",
  },
  // Stale historical notices (these will be automatically filtered out if < currentYear)
  {
    id: "n2024-1",
    title: "BECE 2024 Examination Schedule",
    description: "The official WAEC examination timetable will commence from 25th May 2024.",
    date: "2024-05-15",
    badge: "UPDATE",
    href: "/articles",
  },
];

const BADGE_STYLES: Record<Notice["badge"], string> = {
  URGENT: "bg-rose-50 text-rose-700 border-rose-200",
  NEW: "bg-emerald-50 text-emerald-700 border-emerald-200",
  UPDATE: "bg-blue-50 text-blue-700 border-blue-200",
};

export function NoticeBoardCard() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [olderExpanded, setOlderExpanded] = useState(false);

  // Dynamically filter notices relative to current year
  const activeNotices = useMemo(() => {
    return ALL_NOTICES.filter((n) => {
      const noticeYear = new Date(n.date).getFullYear();
      return noticeYear >= currentYear;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [currentYear]);

  // High-yield notices (URGENT / NEW) stay prominent above fold
  const primaryNotices = useMemo(() => {
    return activeNotices.filter((n) => n.badge === "URGENT" || n.badge === "NEW");
  }, [activeNotices]);

  // Secondary updates collapsed to keep high-yield study tools above the fold
  const secondaryNotices = useMemo(() => {
    return activeNotices.filter((n) => n.badge === "UPDATE");
  }, [activeNotices]);

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

  const renderNoticeItem = (n: Notice) => (
    <Link
      key={n.id}
      href={n.href}
      className="flex items-start gap-3 py-2.5 px-1.5 group hover:bg-slate-50/80 rounded-xl transition-colors block"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-colors mt-0.5">
        <Megaphone className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span
            className={`rounded-md border px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase ${
              BADGE_STYLES[n.badge]
            }`}
          >
            {n.badge}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
            <Calendar className="h-3 w-3" />
            {formatDate(n.date)}
          </span>
        </div>
        <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-700 transition-colors leading-snug">
          {n.title}
        </h4>
        <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 line-clamp-2">
          {n.description}
        </p>
      </div>
    </Link>
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white shadow-2xs">
            <Bell className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900">Notice Board</h3>
            <p className="text-[11px] text-slate-500">Academic updates &amp; WAEC alerts ({currentYear})</p>
          </div>
        </div>
        <Link
          href="/notices"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="divide-y divide-slate-100 mt-2 flex-1">
        {primaryNotices.length > 0 ? (
          primaryNotices.map((n) => renderNoticeItem(n))
        ) : (
          <div className="py-6 text-center text-xs text-slate-400">
            No active urgent alerts.
          </div>
        )}

        {/* Collapsible secondary/older notices accordion */}
        {secondaryNotices.length > 0 && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setOlderExpanded((prev) => !prev)}
              className="flex w-full items-center justify-between py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              aria-expanded={olderExpanded}
            >
              <span>Previous Notices &amp; Updates ({secondaryNotices.length})</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                  olderExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
            {olderExpanded && (
              <div className="divide-y divide-slate-100/70 border-t border-slate-100 pt-1">
                {secondaryNotices.map((n) => renderNoticeItem(n))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

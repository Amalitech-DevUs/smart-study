"use client";

import React, { useState } from "react";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  streak?: number;
  studiedDates?: Set<string>;
};

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function StudyCalendarCard({ streak = 0, studiedDates = new Set() }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleString("default", { month: "long" });
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // First day of the month (0=Sun..6=Sat) → convert to Mon-based grid (0=Mon..6=Sun)
  const rawFirst = new Date(viewYear, viewMonth, 1).getDay();
  const adjustedFirstDay = (rawFirst + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  type CalDay = {
    day: number;
    isCurrentMonth: boolean;
    isStudied: boolean;
    isToday: boolean;
    dateKey: string;
  };

  const days: CalDay[] = [];
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  // Trailing days from previous month to fill first row
  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const pm = viewMonth === 0 ? 11 : viewMonth - 1;
    const py = viewMonth === 0 ? viewYear - 1 : viewYear;
    const dateKey = toDateKey(py, pm, d);
    days.push({ day: d, isCurrentMonth: false, isStudied: studiedDates.has(dateKey), isToday: false, dateKey });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = toDateKey(viewYear, viewMonth, d);
    days.push({
      day: d,
      isCurrentMonth: true,
      isStudied: studiedDates.has(dateKey),
      isToday: dateKey === todayKey,
      dateKey,
    });
  }

  // Leading days for next month to complete the grid
  const remaining = (7 - (days.length % 7)) % 7;
  for (let n = 1; n <= remaining; n++) {
    const nm = viewMonth === 11 ? 0 : viewMonth + 1;
    const ny = viewMonth === 11 ? viewYear + 1 : viewYear;
    const dateKey = toDateKey(ny, nm, n);
    days.push({ day: n, isCurrentMonth: false, isStudied: studiedDates.has(dateKey), isToday: false, dateKey });
  }

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  // Don't let user navigate past current month
  const isAtCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const studiedThisMonth = days.filter((d) => d.isCurrentMonth && d.isStudied).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base font-bold text-slate-900">Study Calendar</h3>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                streak > 0
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              <Flame
                className={`h-3 w-3 ${
                  streak > 0 ? "text-amber-500 fill-amber-500 animate-pulse" : "text-slate-400"
                }`}
              />
              <span>{streak}d streak</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {studiedThisMonth > 0
              ? `${studiedThisMonth} day${studiedThisMonth !== 1 ? "s" : ""} studied this month`
              : "No sessions recorded yet"}
          </p>
        </div>

        {/* Month navigation controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goToPrevMonth}
            aria-label="Previous month"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-bold text-slate-700 min-w-[84px] text-center select-none">
            {monthName} {viewYear}
          </span>
          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="Next month"
            disabled={isAtCurrentMonth}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday header row */}
      <div className="grid grid-cols-7 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-3 pb-1 border-b border-slate-50 shrink-0">
        {weekdays.map((w) => (
          <div key={w} className="py-1">{w}</div>
        ))}
      </div>

      {/* Calendar day grid */}
      <div className="grid grid-cols-7 gap-0.5 text-center text-xs mt-2 flex-1 content-start">
        {days.map((item, index) => (
          <div key={index} className="flex items-center justify-center p-0.5">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-medium transition-all ${
                item.isToday
                  ? "bg-slate-900 text-white font-bold ring-2 ring-amber-400 shadow-xs"
                  : item.isStudied && item.isCurrentMonth
                  ? "bg-emerald-500 text-white font-semibold shadow-xs"
                  : item.isStudied && !item.isCurrentMonth
                  ? "bg-emerald-100 text-emerald-600"
                  : item.isCurrentMonth
                  ? "text-slate-700 hover:bg-slate-100 cursor-default"
                  : "text-slate-300 pointer-events-none"
              }`}
              title={
                item.isToday
                  ? "Today"
                  : item.isStudied
                  ? `Studied — ${item.dateKey}`
                  : undefined
              }
            >
              {item.day}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-md bg-slate-900 ring-1 ring-amber-400" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-md bg-emerald-500" />
          <span>Session recorded</span>
        </div>
      </div>
    </div>
  );
}

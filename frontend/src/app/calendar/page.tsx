"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
} from "lucide-react";
import { RequireAuth } from "@/components/shared/require-auth";
import { useAuth } from "@/lib/use-auth";
import { useDashboardData } from "@/hooks/use-dashboard-data";

const KEY_EXAM_DATES = [
  {
    title: "National BECE Mock Series I",
    date: "12 Oct 2026",
    status: "Upcoming",
    subject: "Core Subjects Simulation",
  },
  {
    title: "School-Based Assessment Submission",
    date: "15 Nov 2026",
    status: "Upcoming",
    subject: "Project & Continuous Work",
  },
  {
    title: "Official BECE 2026 Examinations",
    date: "08 Jun 2027",
    status: "Scheduled",
    subject: "National Examinations Week",
  },
];

export default function CalendarPage() {
  const { username, isLoading: isAuthLoading } = useAuth();
  const { streak, studiedDates, dailyGoal } = useDashboardData(
    username,
    isAuthLoading
  );

  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = useMemo(() => {
    return currentDate.toLocaleString("default", { month: "long" });
  }, [currentDate]);

  // Calendar calculations
  const { daysInMonth, firstDayOfWeek, studiedThisMonthCount } = useMemo(() => {
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    let count = 0;
    for (let day = 1; day <= totalDays; day++) {
      const monthStr = String(month + 1).padStart(2, "0");
      const dayStr = String(day).padStart(2, "0");
      const dateKey = `${year}-${monthStr}-${dayStr}`;
      if (studiedDates.has(dateKey)) count++;
    }

    return {
      daysInMonth: totalDays,
      firstDayOfWeek: firstDay,
      studiedThisMonthCount: count,
    };
  }, [year, month, studiedDates]);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const currentDay = today.getDate();

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
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
                  <CalendarIcon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Study Calendar &amp; Schedule
                  </h1>
                  <p className="text-xs text-slate-500">
                    Track your daily revision consistency and upcoming BECE milestones
                  </p>
                </div>
              </div>

              {/* Streak Badge */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-1.5 shadow-2xs">
                  <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-amber-900">
                    {streak > 0 ? `${streak} Day Streak` : "0 Days Streak"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Studied This Month
                </p>
                <p className="font-heading text-lg font-bold text-slate-900">
                  {studiedThisMonthCount} Days
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Daily Question Goal
                </p>
                <p className="font-heading text-lg font-bold text-slate-900">
                  {dailyGoal.completed} / {dailyGoal.target} Questions
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Active Consistency
                </p>
                <p className="font-heading text-lg font-bold text-slate-900">
                  {dailyGoal.percent}% Complete Today
                </p>
              </div>
            </div>
          </div>

          {/* Main Layout: Calendar Grid + Key Dates */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Calendar Widget (8 cols) */}
            <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
              {/* Month Navigator */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    {monthName} {year}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {studiedThisMonthCount} active study sessions recorded
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {/* Empty cells before 1st day */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-10 sm:h-16 rounded-lg sm:rounded-xl bg-slate-50/50" />
                ))}

                {/* Day numbers */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const monthStr = String(month + 1).padStart(2, "0");
                  const dayStr = String(day).padStart(2, "0");
                  const dateKey = `${year}-${monthStr}-${dayStr}`;
                  const isStudied = studiedDates.has(dateKey);
                  const isToday = isCurrentMonth && day === currentDay;

                  return (
                    <div
                      key={`day-${day}`}
                      className={`relative flex flex-col justify-between p-1 sm:p-2 h-10 sm:h-16 rounded-lg sm:rounded-xl border transition-all ${
                        isToday
                          ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                          : isStudied
                          ? "border-emerald-200 bg-emerald-50/70 text-emerald-950 font-bold"
                          : "border-slate-100 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-[10px] sm:text-xs font-semibold">{day}</span>
                      {isStudied && (
                        <div className="flex items-center gap-1 self-end">
                          <span
                            className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
                              isToday ? "bg-amber-400" : "bg-emerald-500"
                            }`}
                          />
                        </div>
                      )}
                      {isToday && (
                        <span className="hidden sm:inline text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                          Today
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-6 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500" />
                  <span>Study Session Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-slate-900" />
                  <span>Current Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-slate-200" />
                  <span>Rest / Unlogged</span>
                </div>
              </div>
            </div>

            {/* Side Column: Key Dates & Quick Revision Links (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h3 className="font-heading text-sm font-bold text-slate-900">
                    WAEC Milestones
                  </h3>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    2026/2027
                  </span>
                </div>

                <div className="space-y-3">
                  {KEY_EXAM_DATES.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                        <span>{item.date}</span>
                        <span className="rounded bg-blue-100/80 text-blue-700 px-1.5 py-0.2 text-[9px] font-bold uppercase">
                          {item.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.subject}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Action CTA */}
              <div className="rounded-2xl border border-slate-900 bg-slate-900 p-5 text-white shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-amber-400" />
                  <h3 className="font-heading text-sm font-bold text-white">
                    Ready for today&apos;s goal?
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Log your daily questions today to maintain your study streak and build your exam readiness.
                </p>
                <Link
                  href="/flashcards"
                  className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors shadow-xs"
                >
                  <span>Practice Questions</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}

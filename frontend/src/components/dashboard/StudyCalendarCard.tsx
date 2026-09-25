"use client";

import React, { useState } from "react";
import { Flame, Calendar as CalendarIcon } from "lucide-react";

type Props = {
  streak?: number;
};

export function StudyCalendarCard({ streak = 0 }: Props) {
  const [currentDate] = useState(new Date());

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const today = currentDate.getDate();

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const adjustedFirstDay = (firstDayIndex + 6) % 7;
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const days: { day: number; isCurrentMonth: boolean; isStudied?: boolean; isToday?: boolean }[] = [];

  const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const isStudied = streak > 0 && d <= today && d >= Math.max(1, today - streak + 1);
    const isToday = d === today;
    days.push({ day: d, isCurrentMonth: true, isStudied, isToday });
  }

  const remaining = (7 - (days.length % 7)) % 7;
  for (let n = 1; n <= remaining; n++) {
    days.push({ day: n, isCurrentMonth: false });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base font-bold text-slate-900">Academic Calendar</h3>
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
          <p className="text-[11px] text-slate-500">Daily practice and revision activity</p>
        </div>
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
          <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
          {monthName} {year}
        </span>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-3 pb-1 border-b border-slate-50">
        {weekdays.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs mt-2 flex-1 items-center">
        {days.map((item, index) => (
          <div key={index} className="flex items-center justify-center p-0.5">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-medium transition-all ${
                item.isToday
                  ? "bg-slate-900 text-white font-bold ring-2 ring-amber-400 shadow-xs"
                  : item.isStudied
                  ? "bg-emerald-600 text-white font-semibold shadow-xs"
                  : item.isCurrentMonth
                  ? "text-slate-700 hover:bg-slate-100 cursor-default"
                  : "text-slate-300 pointer-events-none"
              }`}
              title={item.isStudied ? "Session completed" : item.isToday ? "Today" : undefined}
            >
              {item.day}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-md bg-slate-900 ring-1 ring-amber-400" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-md bg-emerald-600" />
          <span>Completed Session</span>
        </div>
      </div>
    </div>
  );
}

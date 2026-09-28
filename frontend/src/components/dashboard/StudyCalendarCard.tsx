"use client";

import React, { useState } from "react";

type Props = {
  streak?: number;
};

export function StudyCalendarCard({ streak = 5 }: Props) {
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs h-full flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">Academic Calendar</h3>
          <p className="text-[11px] text-slate-500">Daily sessions and revision streak</p>
        </div>
        <span className="text-xs font-bold text-slate-500">
          {monthName} {year}
        </span>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-3 pb-1 border-b border-slate-50">
        {weekdays.map((w) => (
          <div key={w} className="py-1">{w}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs mt-2 flex-1 items-center">
        {days.map((item, index) => (
          <div key={index} className="flex items-center justify-center p-0.5">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-medium transition-all ${
                item.isToday
                  ? "bg-[#0e1726] text-white font-bold shadow-xs"
                  : item.isStudied
                  ? "bg-slate-800 text-white font-semibold"
                  : item.isCurrentMonth
                  ? "text-slate-700 hover:bg-slate-100 cursor-pointer"
                  : "text-slate-300 pointer-events-none"
              }`}
            >
              {item.day}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#0e1726]" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-700" />
          <span>Study day ({streak}d streak)</span>
        </div>
      </div>
    </div>
  );
}

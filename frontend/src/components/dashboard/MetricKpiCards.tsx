"use client";

import React from "react";
import {
  FileText,
  GraduationCap,
  ClipboardCheck,
  Trophy,
  CalendarCheck,
} from "lucide-react";
import type { LearningOverviewData, DailyGoalData } from "@/lib/learning-tracker";

type Props = {
  overview: LearningOverviewData;
  dailyGoal: DailyGoalData;
  streak: number;
  subjectCount?: number;
};

export function MetricKpiCards({ overview, dailyGoal, streak, subjectCount = 4 }: Props) {
  const goalPercent = Math.min(
    100,
    dailyGoal.target > 0 ? Math.round((dailyGoal.completed / dailyGoal.target) * 100) : 0
  );

  const accuracy = overview.practiceAccuracy > 0
    ? overview.practiceAccuracy
    : overview.testAverage ?? 0;

  const exams = overview.testsCompleted > 0
    ? overview.testsCompleted
    : overview.studySessions > 0
    ? overview.studySessions
    : 0;

  const cards = [
    {
      label: "Overall Score",
      value: accuracy > 0 ? `${accuracy}%` : "—",
      subtext: "Average Accuracy",
      icon: FileText,
      dark: true,
    },
    {
      label: "Subjects",
      value: `${subjectCount}`,
      subtext: "Core Subjects",
      icon: GraduationCap,
      dark: false,
    },
    {
      label: "Exams Done",
      value: exams > 0 ? `${exams}` : "—",
      subtext: "Past Papers",
      icon: ClipboardCheck,
      dark: true,
    },
    {
      label: "Study Streak",
      value: streak > 0 ? `${streak}` : "—",
      subtext: streak > 0 ? `${streak} days active` : "No streak yet",
      icon: Trophy,
      dark: false,
    },
    {
      label: "Daily Goal",
      value: goalPercent > 0 ? `${goalPercent}%` : "—",
      subtext: "Today's Target",
      icon: CalendarCheck,
      dark: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5 mb-6">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-2xs ${
                c.dark
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-slate-500 truncate">{c.label}</p>
              <p className="font-heading text-xl font-extrabold text-slate-900 tracking-tight leading-tight mt-0.5">
                {c.value}
              </p>
              <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">{c.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

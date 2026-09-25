"use client";

import React from "react";
import Link from "next/link";
import type { LearningOverviewData } from "@/lib/learning-tracker";

type Props = {
  overview?: LearningOverviewData;
};

export function PerformanceOverviewCard({ overview }: Props) {
  const overallPercent =
    overview && overview.practiceAccuracy > 0
      ? overview.practiceAccuracy
      : overview?.testAverage ?? 84;

  const tiers = [
    { label: "Excellent",         percent: 60, color: "#0E1726", dotBg: "bg-[#0e1726]" },
    { label: "Good",              percent: 20, color: "#475569", dotBg: "bg-slate-600"  },
    { label: "Average",           percent: 12, color: "#94A3B8", dotBg: "bg-slate-400"  },
    { label: "Needs Improvement", percent:  8, color: "#E2E8F0", dotBg: "bg-slate-200"  },
  ];

  const radius = 45;
  const strokeWidth = 13;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;
  const segments = tiers.map((tier) => {
    const strokeDasharray = `${(tier.percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulated / 100) * circumference);
    accumulated += tier.percent;
    return { ...tier, strokeDasharray, strokeDashoffset };
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs h-full flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">Performance Overview</h3>
          <p className="text-[11px] text-slate-500">Diagnostic breakdown across all exams</p>
        </div>
        <Link href="/flashcards" className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline">
          View Details
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4 mt-4 flex-1">
        {/* SVG Donut */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 120 120">
            <circle
              cx="60" cy="60" r={radius}
              fill="transparent" stroke="#F1F5F9" strokeWidth={strokeWidth}
            />
            {segments.map((seg) => (
              <circle
                key={seg.label}
                cx="60" cy="60" r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-heading text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
              {overallPercent}%
            </span>
            <span className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">
              Overall
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 flex-1 min-w-0">
          {tiers.map((t) => (
            <div key={t.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${t.dotBg}`} />
                <span className="text-[11px] font-semibold text-slate-700 truncate">{t.label}</span>
              </div>
              <span className="text-xs font-bold text-slate-900 ml-2">{t.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

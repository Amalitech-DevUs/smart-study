"use client";

import React from "react";
import Link from "next/link";
import type {
  LearningOverviewData,
  PerformanceDistributionData,
} from "@/lib/learning-tracker";

type Props = {
  overview?: LearningOverviewData;
  distribution?: PerformanceDistributionData;
};

export function PerformanceOverviewCard({ overview, distribution }: Props) {
  const hasAttempts = distribution
    ? distribution.hasData
    : (overview?.questionsPracticed ?? 0) > 0 || (overview?.studySessions ?? 0) > 0;

  const overallPercent = distribution
    ? distribution.overallPercent
    : overview && overview.practiceAccuracy > 0
    ? overview.practiceAccuracy
    : overview?.testAverage ?? 0;

  // Use dynamic tiers if distribution is provided, or build standard BECE diagnostic tiers
  const defaultTiers = [
    { label: "Excellent", percent: 0, color: "#10b981", dotBg: "bg-emerald-500" },
    { label: "Good", percent: 0, color: "#3b82f6", dotBg: "bg-blue-500" },
    { label: "Average", percent: 0, color: "#f59e0b", dotBg: "bg-amber-500" },
    { label: "Needs Improvement", percent: 0, color: "#f43f5e", dotBg: "bg-rose-500" },
  ];

  const tiers = distribution?.tiers && distribution.hasData
    ? distribution.tiers.map((t) => ({
        label: t.label.split(" (")[0], // Keep clean label
        percent: t.percent,
        color: t.color,
        dotBg: t.dotBg,
      }))
    : defaultTiers;

  const radius = 45;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;
  const segments = tiers.map((tier) => {
    const strokeDasharray = `${(tier.percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulated / 100) * circumference);
    accumulated += tier.percent;
    return { ...tier, strokeDasharray, strokeDashoffset };
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">Performance Overview</h3>
          <p className="text-[11px] text-slate-500">Diagnostic breakdown across all exams</p>
        </div>
        <Link
          href="/flashcards"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
        >
          View Details
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 flex-1">
        {/* SVG Donut */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 120 120">
            {/* Background Track */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
            />
            {hasAttempts &&
              segments.map((seg) => (
                <circle
                  key={seg.label}
                  cx="60"
                  cy="60"
                  r={radius}
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
              {hasAttempts ? `${overallPercent}%` : "—"}
            </span>
            <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
              {hasAttempts ? "Overall" : "No Data"}
            </span>
          </div>
        </div>

        {/* Legend: Using whitespace-nowrap and min-w-max to prevent "Needs Impro..." truncation */}
        <div className="space-y-2.5 flex-1 w-full sm:w-auto min-w-0">
          {tiers.map((t) => (
            <div key={t.label} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-max">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${t.dotBg}`} />
                <span className="text-[11px] font-semibold text-slate-700 whitespace-nowrap">
                  {t.label}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900 tabular-nums ml-2 shrink-0">
                {t.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {!hasAttempts && (
        <p className="mt-3 text-[10px] text-slate-400 text-center border-t border-slate-50 pt-2">
          Start practicing past questions to view your personalized WAEC grade distribution.
        </p>
      )}
    </div>
  );
}

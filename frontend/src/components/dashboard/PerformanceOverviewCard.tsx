"use client";

import React from "react";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import type {
  LearningOverviewData,
  PerformanceDistributionData,
} from "@/lib/learning-tracker";

type Props = {
  overview?: LearningOverviewData;
  distribution?: PerformanceDistributionData;
};

export function PerformanceOverviewCard({ overview, distribution }: Props) {
  const testsDone = overview?.testsCompleted ?? 0;
  const questionsDone = overview?.questionsPracticed ?? 0;

  // Diagnostic Safeguard: require at least 3 completed tests OR 50 questions practiced
  const unlocked = testsDone >= 3 || questionsDone >= 50;

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

  const segments = tiers.map((tier, idx) => {
    const prevTotal = tiers.slice(0, idx).reduce((sum, t) => sum + t.percent, 0);
    const strokeDasharray = `${(tier.percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((prevTotal / 100) * circumference);
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
          href="/progress"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline inline-flex items-center gap-1"
        >
          <span>View Details</span>
          <ArrowRight className="h-3 w-3 text-slate-400" />
        </Link>
      </div>

      {unlocked ? (
        <>
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
                {segments.map((seg) => (
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
                  {overallPercent}%
                </span>
                <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                  Overall
                </span>
              </div>
            </div>

            {/* Legend: Using whitespace-nowrap and min-w-max to prevent truncation */}
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
        </>
      ) : (
        /* Diagnostic Locked Safeguard State */
        <div className="flex flex-col items-center justify-center text-center py-5 px-3 flex-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 mb-3 shadow-2xs">
            <Lock className="h-5 w-5" />
          </div>
          <h4 className="font-heading text-xs font-bold text-slate-900">
            Diagnostic Insights Locked
          </h4>
          <p className="text-[11px] text-slate-500 max-w-[240px] mt-1 leading-relaxed">
            Complete at least 3 past papers or 50 questions to generate reliable WAEC diagnostics.
          </p>

          {/* Progress towards unlock */}
          <div className="w-full max-w-xs mt-3.5 space-y-2 text-left">
            <div>
              <div className="flex justify-between text-[10px] font-medium text-slate-500 mb-1">
                <span>Mock Papers:</span>
                <span className="font-bold text-slate-700">{testsDone} / 3</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (testsDone / 3) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-medium text-slate-500 mb-1">
                <span>Questions Practiced:</span>
                <span className="font-bold text-slate-700">{questionsDone} / 50</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (questionsDone / 50) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <Link
            href="/flashcards"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <span>Start Practicing</span>
            <ArrowRight className="h-3 w-3 text-amber-400" />
          </Link>
        </div>
      )}
    </div>
  );
}

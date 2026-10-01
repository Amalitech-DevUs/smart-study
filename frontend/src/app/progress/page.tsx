"use client";

import Link from "next/link";
import {
  TrendingUp,
  CheckCircle2,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { RequireAuth } from "@/components/shared/require-auth";
import { useAuth } from "@/lib/use-auth";
import { useDashboardData } from "@/hooks/use-dashboard-data";

export default function ProgressPage() {
  const { username, isLoading: isAuthLoading } = useAuth();
  const {
    overview,
    subjectProgress,
    focusAreas,
    performanceDistribution,
  } = useDashboardData(username, isAuthLoading);

  const testsDone = overview?.testsCompleted ?? 0;
  const questionsDone = overview?.questionsPracticed ?? 0;
  const practiceAccuracy = overview?.practiceAccuracy ?? 0;

  // Standard tiers
  const defaultTiers = [
    { label: "Excellent", percent: 0, color: "#10b981", dotBg: "bg-emerald-500" },
    { label: "Good", percent: 0, color: "#3b82f6", dotBg: "bg-blue-500" },
    { label: "Average", percent: 0, color: "#f59e0b", dotBg: "bg-amber-500" },
    { label: "Needs Improvement", percent: 0, color: "#f43f5e", dotBg: "bg-rose-500" },
  ];

  const tiers = performanceDistribution?.tiers && performanceDistribution.hasData
    ? performanceDistribution.tiers.map((t) => ({
        label: t.label.split(" (")[0],
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
                  <TrendingUp className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Performance &amp; Diagnostics
                  </h1>
                  <p className="text-xs text-slate-500">
                    Comprehensive accuracy metrics, WAEC mastery levels, and diagnostic recommendations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/flashcards"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-2xs"
                >
                  <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                  <span>Start New Mock Exam</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Metric KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Overall Accuracy
              </p>
              <p className="font-heading text-2xl font-extrabold text-slate-900 mt-1">
                {practiceAccuracy}%
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Across all subjects</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Completed Mock Papers
              </p>
              <p className="font-heading text-2xl font-extrabold text-slate-900 mt-1">
                {testsDone}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Timed simulations</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Questions Answered
              </p>
              <p className="font-heading text-2xl font-extrabold text-slate-900 mt-1">
                {questionsDone}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Unique questions</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Study Sessions
              </p>
              <p className="font-heading text-2xl font-extrabold text-slate-900 mt-1">
                {overview?.studySessions ?? 0}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Logged practice runs</p>
            </div>
          </div>

          {/* Diagnostic Breakdown + Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Donut Chart (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <h2 className="font-heading text-base font-bold text-slate-900">
                  WAEC Diagnostic Grade Tiers
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Performance distribution across standardized question tiers
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-6">
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 120 120">
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
                    <span className="font-heading text-2xl font-extrabold text-slate-900 tracking-tight">
                      {practiceAccuracy}%
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      Average
                    </span>
                  </div>
                </div>

                <div className="space-y-3 w-full sm:w-auto">
                  {tiers.map((t) => (
                    <div key={t.label} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${t.dotBg}`} />
                        <span className="text-xs font-semibold text-slate-700">
                          {t.label}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 tabular-nums">
                        {t.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                Calculated according to the West African Examinations Council (WAEC) grading rubric.
              </p>
            </div>

            {/* Diagnostic Focus Recommendations (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <h2 className="font-heading text-base font-bold text-slate-900">
                      Diagnostic Focus Areas
                    </h2>
                    <p className="text-xs text-slate-500">
                      Topics requiring targeted revision based on your recent practice
                    </p>
                  </div>
                  <span className="rounded-lg bg-amber-100/70 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                    High Priority
                  </span>
                </div>

                {focusAreas && focusAreas.length > 0 ? (
                  <div className="space-y-3">
                    {focusAreas.map((area, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-100 mt-0.5">
                            <AlertCircle className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {area.topic}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {area.subject} &bull; Accuracy: {area.accuracy}%
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/flashcards`}
                          className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
                        >
                          <span>Revise</span>
                          <ArrowRight className="h-3 w-3 text-slate-400" />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">No weak topics flagged</p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                      Great job! Keep practicing past papers across all subjects to maintain your performance.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Need topic clarification?</span>
                <Link
                  href="/chat"
                  className="font-semibold text-slate-900 hover:underline inline-flex items-center gap-1"
                >
                  <span>Ask AI Tutor</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Subject-by-Subject Mastery Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h2 className="font-heading text-base font-bold text-slate-900">
                  Subject Mastery Breakdown
                </h2>
                <p className="text-xs text-slate-500">
                  Performance and question completion across all official BECE curriculum subjects
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {subjectProgress.length} Subjects
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {subjectProgress.map((subj) => {
                const percentDone = Math.min(
                  100,
                  Math.round(
                    (subj.uniquePracticed / Math.max(1, subj.totalAvailable)) * 100
                  )
                );

                const isExamReady = subj.hasData && subj.accuracy >= 80;
                const isInProgress = subj.uniquePracticed > 0 && subj.accuracy < 80;

                return (
                  <div
                    key={subj.slug}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading text-sm font-bold text-slate-900">
                          {subj.name}
                        </h3>
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            isExamReady
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isInProgress
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {isExamReady
                            ? "Exam Ready"
                            : isInProgress
                            ? "In Progress"
                            : "Not Started"}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="h-2 w-full max-w-xs bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isExamReady
                                ? "bg-emerald-500"
                                : isInProgress
                                ? "bg-amber-400"
                                : "bg-slate-300"
                            }`}
                            style={{ width: `${percentDone}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                          {subj.uniquePracticed} / {subj.totalAvailable} Qs ({percentDone}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Accuracy
                        </p>
                        <p className="font-heading text-sm font-bold text-slate-900">
                          {subj.hasData ? `${subj.accuracy}%` : "—"}
                        </p>
                      </div>

                      <Link
                        href={`/flashcards`}
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
                      >
                        <span>Practice</span>
                        <ArrowRight className="h-3 w-3 text-amber-400" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
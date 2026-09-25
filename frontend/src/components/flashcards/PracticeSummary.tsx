import React from "react";
import Link from "next/link";
import { Award, RotateCcw, ArrowLeft, Bot, Sparkles } from "lucide-react";
import { SaveProgressBanner } from "@/components/shared/save-progress-banner";

type Props = {
  timedOut: boolean;
  completedUniqueCount: number;
  practiceAccuracy: number;
  attempts: number;
  requeueCounts: Record<string, number>;
  onRestart: () => void;
  isLoading: boolean;
  loggedIn: boolean;
};

export function PracticeSummary({
  timedOut,
  completedUniqueCount,
  practiceAccuracy,
  attempts,
  requeueCounts,
  onRestart,
  isLoading,
  loggedIn,
}: Props) {
  const requeuedConqueredCount = Object.keys(requeueCounts).length;

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-6 sm:p-8 text-center shadow-xs">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
        <Award className="h-7 w-7" />
      </div>

      <h2 className="mt-4 font-heading text-xl sm:text-2xl font-bold text-slate-900">
        {timedOut ? "Time's Up!" : "Practice Session Completed!"}
      </h2>
      <p className="mt-1.5 text-xs text-slate-500 max-w-md mx-auto">
        {timedOut
          ? "Your practice interval finished. Review your performance and retry to improve speed."
          : "Great work! You have answered and mastered all unique questions in this practice set."}
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
        <div>
          <p className="font-heading text-xl font-bold text-slate-900 sm:text-2xl">
            {completedUniqueCount}
          </p>
          <p className="text-xs font-medium text-slate-500">Unique Mastered</p>
        </div>
        <div>
          <p className="font-heading text-xl font-bold text-slate-900 sm:text-2xl">
            {practiceAccuracy}%
          </p>
          <p className="text-xs font-medium text-slate-500">Overall Accuracy</p>
        </div>
        <div>
          <p className="font-heading text-xl font-bold text-slate-900 sm:text-2xl">
            {attempts}
          </p>
          <p className="text-xs font-medium text-slate-500">Total Attempts</p>
        </div>
      </div>

      {requeuedConqueredCount > 0 && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-2.5 text-xs text-amber-800 text-left flex items-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            You revised and conquered <strong>{requeuedConqueredCount}</strong>{" "}
            question(s) that were initially missed.
          </span>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0e1726] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1a2942] transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Practice Again</span>
        </button>

        <Link
          href="/flashcards"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>All Papers</span>
        </Link>

        <Link
          href="/chat"
          className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          <Bot className="h-4 w-4" />
          <span>Ask AI Tutor</span>
        </Link>
      </div>

      {!isLoading && !loggedIn && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          <SaveProgressBanner />
        </div>
      )}
    </div>
  );
}

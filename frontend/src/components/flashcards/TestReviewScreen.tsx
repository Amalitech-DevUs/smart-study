import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Award, RotateCcw, ArrowLeft, Filter } from "lucide-react";
import { McqCard, type McqQuestion } from "./mcq-card";

type FilterMode = "all" | "incorrect" | "unanswered";

type Props = {
  totalQuestions: number;
  testScorePercent: number;
  testCorrectCount: number;
  testIncorrectCount: number;
  testUnansweredCount: number;
  initialQuestions: McqQuestion[];
  testAnswers: Record<string, string>;
  onRestart: () => void;
};

export function TestReviewScreen({
  totalQuestions,
  testScorePercent,
  testCorrectCount,
  testIncorrectCount,
  testUnansweredCount,
  initialQuestions,
  testAnswers,
  onRestart,
}: Props) {
  const [reviewFilter, setReviewFilter] = useState<FilterMode>("all");

  const reviewQuestions = useMemo(() => {
    if (reviewFilter === "all") return initialQuestions;
    if (reviewFilter === "incorrect") {
      return initialQuestions.filter(
        (q) =>
          testAnswers[q.id] &&
          testAnswers[q.id].toLowerCase() !== q.correctOptionId.toLowerCase(),
      );
    }
    if (reviewFilter === "unanswered") {
      return initialQuestions.filter((q) => !testAnswers[q.id]);
    }
    return initialQuestions;
  }, [initialQuestions, testAnswers, reviewFilter]);

  return (
    <div className="space-y-6">
      {/* Score Banner */}
      <div className="w-full rounded-xl border border-slate-200 bg-white p-6 sm:p-8 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Award className="h-7 w-7" />
        </div>

        <h2 className="mt-3 font-heading text-xl sm:text-2xl font-bold text-slate-900">
          Test Results: {testScorePercent}%
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Calculated using all {totalQuestions} examination questions as the denominator.
        </p>

        {/* Metric Cards */}
        <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="text-center">
            <p className="font-heading text-xl font-bold text-emerald-700 sm:text-2xl">
              {testCorrectCount}
            </p>
            <p className="text-[11px] font-semibold text-slate-500">Correct</p>
          </div>
          <div className="text-center border-x border-slate-200">
            <p className="font-heading text-xl font-bold text-rose-600 sm:text-2xl">
              {testIncorrectCount}
            </p>
            <p className="text-[11px] font-semibold text-slate-500">Incorrect</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-xl font-bold text-slate-500 sm:text-2xl">
              {testUnansweredCount}
            </p>
            <p className="text-[11px] font-semibold text-slate-500">Unanswered</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0e1726] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1a2942] transition-colors shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retake Test</span>
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Review Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <span>Review Answers &amp; Explanations</span>
        </h3>

        <div className="flex gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setReviewFilter("all")}
            className={`rounded-lg px-3 py-1 font-semibold transition-colors ${
              reviewFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({totalQuestions})
          </button>
          <button
            type="button"
            onClick={() => setReviewFilter("incorrect")}
            className={`rounded-lg px-3 py-1 font-semibold transition-colors ${
              reviewFilter === "incorrect"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            Mistakes ({testIncorrectCount})
          </button>
          <button
            type="button"
            onClick={() => setReviewFilter("unanswered")}
            className={`rounded-lg px-3 py-1 font-semibold transition-colors ${
              reviewFilter === "unanswered"
                ? "bg-slate-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Skipped ({testUnansweredCount})
          </button>
        </div>
      </div>

      {/* List of Review Question Cards */}
      <div className="space-y-6">
        {reviewQuestions.map((q, idx) => (
          <McqCard
            key={q.id}
            {...q}
            currentIndex={idx + 1}
            totalCount={reviewQuestions.length}
            initialSelectedOptionId={testAnswers[q.id] || null}
            mode="review"
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ActiveSession } from "@/lib/learning-tracker";

type Props = {
  session: ActiveSession;
};

export function ContinueLearning({ session }: Props) {
  const progress = Math.min(
    100,
    Math.round(
      (session.uniqueQuestionsCompleted / Math.max(1, session.uniqueQuestionsTotal)) * 100,
    ),
  );

  return (
    <section aria-labelledby="continue-learning-heading">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Continue Learning
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                {session.mode === "practice" ? "Practice Mode" : "Test Mode"}
              </span>
            </div>
            <h2
              id="continue-learning-heading"
              className="mt-1 font-heading text-lg font-bold text-slate-900"
            >
              {session.subject} &mdash; {session.year} BECE
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              {session.uniqueQuestionsCompleted} of {session.uniqueQuestionsTotal} questions
              completed ({progress}%)
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:shrink-0">
            <Link
              href={`/flashcards/${session.subjectSlug}/${session.year}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0e1726] px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              <span>Resume Paper</span>
              <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
            </Link>
            <Link
              href={`/flashcards/${session.subjectSlug}`}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Change
            </Link>
          </div>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-slate-800 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}

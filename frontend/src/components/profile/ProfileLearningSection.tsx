import React from "react";
import Link from "next/link";
import type { LearningOverviewData } from "@/lib/learning-tracker";

type Props = {
  overview: LearningOverviewData;
};

export function ProfileLearningSection({ overview }: Props) {
  return (
    <section
      aria-labelledby="my-learning-heading"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          id="my-learning-heading"
          className="font-heading text-sm font-bold text-slate-900"
        >
          My Learning
        </h3>
        <Link
          href="/dashboard"
          className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          View full dashboard &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-[11px] font-medium text-slate-500">Questions Practiced</p>
          <p className="mt-1 font-heading text-xl font-bold text-slate-900">
            {overview.questionsPracticed}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-400">Unique questions</p>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-[11px] font-medium text-slate-500">Practice Accuracy</p>
          <p className="mt-1 font-heading text-xl font-bold text-slate-900">
            {overview.questionsPracticed > 0 ? `${overview.practiceAccuracy}%` : "—"}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-400">
            {overview.questionsPracticed > 0 ? "Practice mode" : "No data yet"}
          </p>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-[11px] font-medium text-slate-500">Tests Completed</p>
          <p className="mt-1 font-heading text-xl font-bold text-slate-900">
            {overview.testsCompleted}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-400">Timed simulations</p>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-[11px] font-medium text-slate-500">Study Sessions</p>
          <p className="mt-1 font-heading text-xl font-bold text-slate-900">
            {overview.studySessions}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-400">Finished sessions</p>
        </div>
      </div>
    </section>
  );
}

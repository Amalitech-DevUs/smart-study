import Link from "next/link";
import { Zap, Clock } from "lucide-react";
import type { SubjectProgressData } from "@/lib/learning-tracker";
import { getSubjectConfig } from "@/lib/constants/subjects";

type Props = {
  subject: SubjectProgressData;
};

export function SubjectCard({ subject }: Props) {
  const config = getSubjectConfig(subject.slug);
  const percent = Math.min(
    100,
    Math.round((subject.uniquePracticed / Math.max(1, subject.totalAvailable)) * 100),
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors hover:border-slate-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Subject Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base font-bold text-slate-900">{subject.name}</h3>
            {subject.hasData ? (
              <span
                className={`rounded px-2 py-0.5 text-xs font-semibold ${config.badgeBg} ${config.badgeText}`}
              >
                {subject.accuracy}% accuracy
              </span>
            ) : (
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                Not started
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {subject.uniquePracticed} / {subject.totalAvailable} questions practiced &bull;{" "}
            {config.paperCount} exam papers ({config.years})
          </p>
        </div>

        {/* Action Buttons: Practice, Mock Exam, View All */}
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
          <Link
            href={`/flashcards/${subject.slug}/${config.latestYear}?mode=practice`}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Practice</span>
          </Link>
          <Link
            href={`/flashcards/${subject.slug}/${config.latestYear}?mode=test`}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Mock Exam</span>
          </Link>
          <Link
            href={`/flashcards/${subject.slug}`}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            All Papers ({config.paperCount}) &rarr;
          </Link>
        </div>
      </div>

      {/* Thin clean progress bar */}
      <div className="mt-3.5 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full ${config.accentBarColor}`} style={{ width: `${percent}%` }} />
        </div>
        <span className="text-xs font-medium text-slate-500 tabular-nums">{percent}%</span>
      </div>
    </div>
  );
}

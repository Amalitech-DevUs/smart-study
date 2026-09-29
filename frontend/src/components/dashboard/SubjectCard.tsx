import Link from "next/link";
import { Zap, Clock, ChevronRight } from "lucide-react";
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

  // Standardized accessible accuracy badge colors
  const getAccuracyBadge = () => {
    if (!subject.hasData || subject.accuracy === 0) {
      return (
        <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
          Not started
        </span>
      );
    }
    if (subject.accuracy >= 75) {
      return (
        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
          {subject.accuracy}% accuracy &bull; Strong
        </span>
      );
    }
    if (subject.accuracy >= 50) {
      return (
        <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
          {subject.accuracy}% accuracy &bull; Average
        </span>
      );
    }
    return (
      <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
        {subject.accuracy}% accuracy &bull; Needs Focus
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Subject Info */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-base font-bold text-slate-900">{subject.name}</h3>
            {getAccuracyBadge()}
          </div>
          <p className="text-xs text-slate-500">
            {config.paperCount} official WAEC past papers ({config.years}) &bull; Core Curriculum
          </p>
        </div>

        {/* Action Buttons: Practice, Mock Exam, View All */}
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
          <Link
            href={`/flashcards/${subject.slug}/${config.latestYear}?mode=practice`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 transition-colors"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Practice</span>
          </Link>
          <Link
            href={`/flashcards/${subject.slug}/${config.latestYear}?mode=test`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 transition-colors"
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Mock Exam</span>
          </Link>
          <Link
            href={`/flashcards/${subject.slug}`}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>All Papers ({config.paperCount})</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Visual Progress Bar Section with X / Y questions practiced */}
      <div className="mt-4 pt-3.5 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-600 font-medium">
            <strong className="text-slate-900 font-bold">{subject.uniquePracticed}</strong>
            <span className="text-slate-400"> / {subject.totalAvailable} questions practiced</span>
          </span>
          <span className="shrink-0 whitespace-nowrap text-slate-700 font-semibold tabular-nums">
            {percent}% completed
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percent >= 75
                ? "bg-emerald-500"
                : percent >= 30
                ? "bg-blue-600"
                : percent > 0
                ? "bg-amber-500"
                : "bg-slate-300"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

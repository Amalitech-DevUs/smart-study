import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";
import type { FocusAreaTopic } from "@/lib/learning-tracker";

type Props = {
  focusAreas: FocusAreaTopic[];
};

export function FocusAreas({ focusAreas }: Props) {
  return (
    <section aria-labelledby="focus-areas-heading">
      <div className="mb-3">
        <h2 id="focus-areas-heading" className="font-heading text-lg font-bold text-slate-900">
          Focus Areas
        </h2>
        <p className="text-xs text-slate-500">
          Topics that need more practice based on your incorrect answers.
        </p>
      </div>

      {focusAreas.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {focusAreas.map((fa) => (
            <div
              key={`${fa.subjectSlug}-${fa.topic}`}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    {fa.subject}
                  </span>
                  <h3 className="font-heading text-sm font-bold text-slate-900 mt-0.5">
                    {fa.topic}
                  </h3>
                </div>
                <span className="rounded bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700">
                  {fa.accuracy}% accuracy
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                {fa.totalAttempts} attempts &bull; {fa.uniqueQuestions} unique questions
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/flashcards/${fa.subjectSlug}/2026?mode=practice`}
                  className="text-xs font-semibold text-slate-900 hover:text-slate-700 transition-colors inline-flex items-center gap-1"
                >
                  <span>Practice Topic</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>

                <Link
                  href={`/chat?q=${encodeURIComponent(
                    `Explain the key rules, formulas, and common exam mistakes for ${fa.topic} in BECE ${fa.subject}.`,
                  )}`}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1"
                >
                  <Bot className="h-3 w-3 text-slate-500" />
                  <span>Ask Tutor</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
          <p className="text-xs text-slate-600 font-medium">No critical weaknesses detected yet.</p>
          <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
            SmartStudy tracks weak topics once you have at least 10 question attempts per topic.
            Keep practicing to build your profile.
          </p>
        </div>
      )}
    </section>
  );
}

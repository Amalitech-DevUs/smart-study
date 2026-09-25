import React from "react";
import { Sparkles, BookOpen } from "lucide-react";
import type { SubjectColor } from "./mcq-card";

const subjectBadges: Record<SubjectColor, { bg: string; text: string; border: string }> = {
  math: {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
  },
  english: {
    bg: "bg-rose-50",
    text: "text-rose-800",
    border: "border-rose-200",
  },
  science: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  "social-studies": {
    bg: "bg-indigo-50",
    text: "text-indigo-800",
    border: "border-indigo-200",
  },
  french: {
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
  },
  computing: {
    bg: "bg-cyan-50",
    text: "text-cyan-800",
    border: "border-cyan-200",
  },
  rme: {
    bg: "bg-orange-50",
    text: "text-orange-800",
    border: "border-orange-200",
  },
  "creative-arts": {
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
  },
};

type Props = {
  subject: string;
  subjectColor: SubjectColor;
  year?: number;
  paper?: number;
  topic?: string;
  mode: "practice" | "test" | "review";
  displayQuestionNum: number;
  displayTotal: number;
};

export function QuestionHeader({
  subject,
  subjectColor,
  year,
  paper,
  topic,
  mode,
  displayQuestionNum,
  displayTotal,
}: Props) {
  const badgeStyle = subjectBadges[subjectColor] ?? subjectBadges.math;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100 pb-4">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {subject}
        </span>

        {year && (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100/70 px-3 py-1 text-xs font-semibold text-slate-700">
            <BookOpen className="h-3 w-3 text-slate-500" />
            {year} BECE {paper ? `• Paper ${paper}` : ""}
          </span>
        )}

        {topic && topic !== "Objective Test" && (
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {topic}
          </span>
        )}

        {mode === "test" && (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
            Test Mode
          </span>
        )}

        {mode === "review" && (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
            Reviewing Question
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 tabular-nums">
          Q{displayQuestionNum} of {displayTotal}
        </span>
      </div>
    </div>
  );
}

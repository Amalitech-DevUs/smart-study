"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";

export type SubjectColor = "math" | "english" | "science" | "social-studies";

export type McqOption = {
  id: string;
  text: string;
};

export type McqQuestion = {
  id: string;
  subject: string;
  subjectColor: SubjectColor;
  question: string;
  options: McqOption[];
  correctOptionId: string;
};

type McqCardProps = Omit<McqQuestion, "id"> & {
  onAnswer?: (optionId: string, isCorrect: boolean) => void;
};

const subjectBadges: Record<SubjectColor, string> = {
  math: "bg-emerald-100 text-emerald-800 border-black",
  english: "bg-rose-100 text-rose-800 border-black",
  science: "bg-amber-100 text-amber-800 border-black",
  "social-studies": "bg-indigo-100 text-indigo-800 border-black",
};

export function McqCard({
  subject,
  subjectColor,
  question,
  options,
  correctOptionId,
  onAnswer,
}: McqCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const handleAnswer = (optionId: string) => {
    if (selectedOptionId !== null) {
      return;
    }

    const isCorrect = optionId === correctOptionId;
    setSelectedOptionId(optionId);
    onAnswer?.(optionId, isCorrect);
  };

  return (
    <article className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-xl sm:p-8">
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${
            subjectBadges[subjectColor] ?? "bg-indigo-100 text-indigo-800"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {subject}
        </span>
        <span className="text-xs font-semibold text-slate-400">Multiple Choice</span>
      </div>

      <h2 className="mt-6 font-heading text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
        {question}
      </h2>

      <div className="mt-8 space-y-3.5" role="group" aria-label="Answer options">
        {options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === correctOptionId;
          const showCorrect = selectedOptionId !== null && isCorrect;
          const showIncorrect = isSelected && !isCorrect;

          let optionStyle =
            "border-slate-200 bg-slate-50/70 text-slate-800 hover:border-brand-gold hover:bg-white hover:shadow-md";

          if (showCorrect) {
            optionStyle =
              "border-black bg-emerald-50 text-emerald-900 font-medium shadow-md shadow-emerald-500/10";
          } else if (showIncorrect) {
            optionStyle =
              "border-black bg-rose-50 text-rose-900 font-medium shadow-md shadow-rose-500/10";
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={selectedOptionId !== null}
              onClick={() => handleAnswer(option.id)}
              className={`group flex min-h-14 w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 disabled:cursor-default ${optionStyle}`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-heading text-sm font-bold transition-colors ${
                  showCorrect
                    ? "bg-emerald-600 text-white"
                    : showIncorrect
                      ? "bg-rose-600 text-white"
                      : "bg-slate-200 text-slate-700 group-hover:bg-brand-gold group-hover:text-brand-indigo"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>

              <span className="flex-1 text-sm sm:text-base">{option.text}</span>

              {showCorrect && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              )}
              {showIncorrect && (
                <XCircle className="h-5 w-5 shrink-0 text-rose-600" />
              )}
            </button>
          );
        })}
      </div>
    </article>
  );
}

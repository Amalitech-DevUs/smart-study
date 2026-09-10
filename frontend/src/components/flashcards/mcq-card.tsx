"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Sparkles, BookOpen, ArrowRight, Lightbulb, Bot } from "lucide-react";

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
  year?: number;
  paper?: number;
  section?: string;
  topic?: string;
  questionNumber?: number;
  totalQuestions?: number;
  explanation?: string;
};

type McqCardProps = McqQuestion & {
  currentIndex?: number;
  totalCount?: number;
  isLastQuestion?: boolean;
  onAnswer?: (optionId: string, isCorrect: boolean) => void;
  onNext?: (optionId: string, isCorrect: boolean) => void;
};

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
};

export function McqCard({
  subject,
  subjectColor,
  question,
  options,
  correctOptionId,
  year,
  paper,
  section,
  topic,
  questionNumber,
  currentIndex,
  totalCount,
  isLastQuestion,
  onAnswer,
  onNext,
}: McqCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const handleSelectOption = (optionId: string) => {
    if (selectedOptionId !== null) {
      return;
    }

    const isCorrect = optionId.toLowerCase() === correctOptionId.toLowerCase();
    setSelectedOptionId(optionId);
    onAnswer?.(optionId, isCorrect);
  };

  const handleProceed = () => {
    if (selectedOptionId === null) return;
    const isCorrect = selectedOptionId.toLowerCase() === correctOptionId.toLowerCase();
    if (onNext) {
      onNext(selectedOptionId, isCorrect);
    } else if (onAnswer) {
      onAnswer(selectedOptionId, isCorrect);
    }
  };

  const badgeStyle = subjectBadges[subjectColor] ?? subjectBadges.math;
  const isAnswered = selectedOptionId !== null;
  const isUserCorrect = selectedOptionId?.toLowerCase() === correctOptionId.toLowerCase();

  const correctOption = options.find(
    (o) => o.id.toLowerCase() === correctOptionId.toLowerCase()
  );
  const correctText = correctOption ? correctOption.text : "";

  // Prepare AI chat prompt URL
  const aiChatPrompt = encodeURIComponent(
    `Hello! Can you help explain why the answer to this ${subject} question (${year ? `${year} BECE` : ""}) is Option ${correctOptionId.toUpperCase()} (${correctText})?\n\nQuestion: "${question}"`
  );

  const displayQuestionNum = questionNumber || currentIndex || 1;
  const displayTotal = totalCount || 40;

  return (
    <article className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl backdrop-blur-xl sm:p-8 transition-all duration-300">
      {/* Top Metadata Row */}
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

          {section && section !== "Objective Test" && (
            <span className="hidden sm:inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-500">
              {section}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 tabular-nums">
            Q{displayQuestionNum} of {displayTotal}
          </span>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="mt-6">
        <h2 className="font-heading text-xl font-bold leading-relaxed text-slate-900 sm:text-2xl">
          {question}
        </h2>
      </div>

      {/* Options List */}
      <div className="mt-8 space-y-3" role="group" aria-label="Answer options">
        {options.map((option, index) => {
          const optKey = option.id.toLowerCase();
          const isSelected = selectedOptionId?.toLowerCase() === optKey;
          const isCorrect = optKey === correctOptionId.toLowerCase();
          const showCorrect = isAnswered && isCorrect;
          const showIncorrect = isSelected && !isCorrect;

          let optionStyle =
            "border-slate-200 bg-slate-50/70 text-slate-800 hover:border-slate-400 hover:bg-slate-100/80 hover:shadow-sm";

          if (showCorrect) {
            optionStyle =
              "border-emerald-500 bg-emerald-50/90 text-emerald-950 font-semibold shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500";
          } else if (showIncorrect) {
            optionStyle =
              "border-rose-400 bg-rose-50/90 text-rose-950 font-medium shadow-md shadow-rose-500/10";
          } else if (isAnswered) {
            optionStyle = "border-slate-200 bg-slate-50/40 text-slate-400 opacity-60";
          }

          const letter = String.fromCharCode(65 + index);

          return (
            <button
              key={option.id}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelectOption(option.id)}
              className={`group flex min-h-14 w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 disabled:cursor-default ${optionStyle}`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-heading text-sm font-bold transition-all ${
                  showCorrect
                    ? "bg-emerald-600 text-white shadow-sm"
                    : showIncorrect
                      ? "bg-rose-600 text-white shadow-sm"
                      : isAnswered
                        ? "bg-slate-200 text-slate-500"
                        : "bg-slate-200 text-slate-700 group-hover:bg-slate-900 group-hover:text-white"
                }`}
              >
                {letter}
              </span>

              <span className="flex-1 text-sm sm:text-base font-normal">{option.text}</span>

              {showCorrect && (
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
                    Correct
                  </span>
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                </div>
              )}
              {showIncorrect && (
                <div className="flex items-center gap-1.5 text-rose-700">
                  <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
                    Incorrect
                  </span>
                  <XCircle className="h-5 w-5 shrink-0 text-rose-600" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Post-Answer Feedback & Explanation */}
      {isAnswered && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
          <div
            className={`rounded-2xl border p-5 sm:p-6 transition-all ${
              isUserCorrect
                ? "border-emerald-200 bg-emerald-50/60"
                : "border-amber-200 bg-amber-50/60"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {isUserCorrect ? (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-600 text-white">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                )}
                <h3 className="font-heading text-base font-bold text-slate-900">
                  {isUserCorrect
                    ? "Great job! That's correct."
                    : `Correct Answer: Option ${correctOptionId.toUpperCase()}`}
                </h3>
              </div>

              <Link
                href={`/chat?prompt=${aiChatPrompt}`}
                className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-colors shadow-sm"
              >
                <Bot className="h-3.5 w-3.5 text-indigo-600" />
                <span>Ask AI Tutor</span>
              </Link>
            </div>

            <div className="mt-3 text-sm leading-relaxed text-slate-700">
              <p className="font-medium text-slate-900 mb-1">
                Official Answer: Option {correctOptionId.toUpperCase()} &mdash;{" "}
                <span className="font-semibold text-slate-800">
                  {correctText || "Correct Option"}
                </span>
              </p>
              <p className="text-slate-600">
                {correctOption?.text
                  ? `According to the WAEC marking scheme, Option ${correctOptionId.toUpperCase()} is the accurate answer for this problem.`
                  : "Verified according to the WAEC examination key."}
              </p>
            </div>
          </div>

          {/* Proceed Button */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              onClick={handleProceed}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-heading text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isLastQuestion ? "Finish Session" : "Next Question"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

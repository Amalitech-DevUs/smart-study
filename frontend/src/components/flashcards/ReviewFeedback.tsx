import React, { useState } from "react";
import { CheckCircle2, HelpCircle, XCircle, Bot } from "lucide-react";
import { InlineAiTutor } from "@/components/chat/inline-ai-tutor";
import type { OptionItem } from "./AnswerOption";

type Props = {
  isUserCorrect: boolean;
  selectedOptionId: string | null;
  correctOptionId: string;
  correctText: string;
  explanation?: string;
  // Tutor props
  subject: string;
  topic?: string;
  year?: number;
  question: string;
  options: OptionItem[];
};

export function ReviewFeedback({
  isUserCorrect,
  selectedOptionId,
  correctOptionId,
  correctText,
  explanation,
  subject,
  topic,
  year,
  question,
  options,
}: Props) {
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);

  return (
    <div className="mt-8 space-y-4">
      <div
        className={`rounded-xl border p-5 sm:p-6 transition-all ${
          isUserCorrect
            ? "border-emerald-200 bg-emerald-50/60"
            : selectedOptionId === null
              ? "border-slate-200 bg-slate-50"
              : "border-rose-200 bg-rose-50/60"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {isUserCorrect ? (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            ) : selectedOptionId === null ? (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-400 text-white">
                <HelpCircle className="h-4 w-4" />
              </div>
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white">
                <XCircle className="h-4 w-4" />
              </div>
            )}
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                {isUserCorrect
                  ? "You got this right!"
                  : selectedOptionId === null
                    ? "You skipped this question"
                    : `You selected Option ${selectedOptionId.toUpperCase()}`}
              </h3>
              <p className="text-xs text-slate-500">
                Official Answer: Option {correctOptionId.toUpperCase()} &mdash; {correctText}
              </p>
            </div>
          </div>

          {/* Contextual SmartStudy AI button */}
          <button
            type="button"
            onClick={() => setIsAiTutorOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 shadow-xs"
          >
            <Bot className="h-3.5 w-3.5 text-slate-600" />
            <span>
              {isAiTutorOpen
                ? "Hide AI Tutor"
                : isUserCorrect
                  ? "Review concept"
                  : "Why did I miss this?"}
            </span>
          </button>
        </div>

        <div className="mt-3 text-sm leading-relaxed text-slate-700">
          <p className="text-slate-600">
            {explanation ||
              `According to the WAEC marking scheme, Option ${correctOptionId.toUpperCase()} is the accurate answer for this problem.`}
          </p>
        </div>
      </div>

      {/* Embedded Contextual AI Tutor for Review */}
      <InlineAiTutor
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        subject={subject}
        topic={topic}
        year={year}
        question={question}
        options={options}
        selectedOptionId={selectedOptionId}
        correctOptionId={correctOptionId}
        explanation={explanation}
        mode="review"
      />
    </div>
  );
}

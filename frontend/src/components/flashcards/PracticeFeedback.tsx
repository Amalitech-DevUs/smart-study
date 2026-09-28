import React, { useState } from "react";
import { CheckCircle2, Lightbulb, Bot, ArrowRight } from "lucide-react";
import { InlineAiTutor } from "@/components/chat/inline-ai-tutor";
import type { OptionItem } from "./AnswerOption";

type Props = {
  isUserCorrect: boolean;
  correctOptionId: string;
  correctText: string;
  explanation?: string;
  isLastQuestion?: boolean;
  onProceed: () => void;
  // Tutor props
  subject: string;
  topic?: string;
  year?: number;
  question: string;
  options: OptionItem[];
  selectedOptionId: string | null;
};

export function PracticeFeedback({
  isUserCorrect,
  correctOptionId,
  correctText,
  explanation,
  isLastQuestion,
  onProceed,
  subject,
  topic,
  year,
  question,
  options,
  selectedOptionId,
}: Props) {
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
      <div
        className={`rounded-xl border p-5 sm:p-6 transition-all ${
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

          {/* AI Tutor Button */}
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
                  ? "Ask AI Tutor"
                  : "Explain My Mistake"}
            </span>
          </button>
        </div>

        <div className="mt-3 text-sm leading-relaxed text-slate-700">
          <p className="font-medium text-slate-900 mb-1">
            Official Answer: Option {correctOptionId.toUpperCase()} &mdash;{" "}
            <span className="font-semibold text-slate-800">
              {correctText || "Correct Option"}
            </span>
          </p>
          <p className="text-slate-600">
            {explanation ||
              (correctText
                ? `According to the WAEC marking scheme, Option ${correctOptionId.toUpperCase()} is the accurate answer for this problem.`
                : "Verified according to the WAEC examination key.")}
          </p>
        </div>
      </div>

      {/* Embedded Contextual AI Tutor */}
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
        mode="practice"
      />

      {/* Next / Finish Button */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="button"
          onClick={onProceed}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0e1726] px-6 py-3 font-heading text-sm font-bold text-white shadow-xs transition-all hover:bg-slate-800"
        >
          <span>{isLastQuestion ? "Finish Session" : "Next Question"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

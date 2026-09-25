"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import {
  parseQuestionPrompt,
  formatDialogue,
  type ParsedQuestion,
} from "@/lib/session-utils";
import { FormattedExamText } from "./FormattedExamText";
import { FormattedAiContent } from "./FormattedAiContent";
import { AnswerOption, type OptionItem } from "./AnswerOption";
import { QuestionHeader } from "./QuestionHeader";
import { PassageViewer } from "./PassageViewer";
import { PracticeFeedback } from "./PracticeFeedback";
import { ReviewFeedback } from "./ReviewFeedback";

export type SubjectColor =
  | "math"
  | "english"
  | "science"
  | "social-studies"
  | "french"
  | "computing"
  | "rme"
  | "creative-arts";

export type McqOption = OptionItem;

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

export type McqCardProps = McqQuestion & {
  currentIndex?: number;
  totalCount?: number;
  isLastQuestion?: boolean;
  mode?: "practice" | "test" | "review";
  hasPrevious?: boolean;
  /** Restores previously selected answer (e.g. after navigating to AI chat and back) */
  initialSelectedOptionId?: string | null;
  onAnswer?: (optionId: string, isCorrect: boolean) => void;
  onNext?: (optionId: string, isCorrect: boolean) => void;
  onPrevious?: () => void;
};

// Re-export helpers for backward compatibility
export { parseQuestionPrompt, FormattedExamText, FormattedAiContent };
export type { ParsedQuestion };

export function McqCard({
  subject = "BECE Exam",
  subjectColor = "math",
  question = "",
  options = [],
  correctOptionId = "",
  year,
  paper,
  topic,
  explanation,
  questionNumber,
  currentIndex,
  totalCount,
  isLastQuestion = false,
  mode = "practice",
  hasPrevious = false,
  initialSelectedOptionId,
  onAnswer,
  onNext,
  onPrevious,
}: McqCardProps) {
  const [selection, setSelection] = useState<{
    question: string;
    optionId: string | null;
  }>({
    question,
    optionId: initialSelectedOptionId ?? null,
  });

  const selectedOptionId =
    selection.question === question
      ? selection.optionId
      : (initialSelectedOptionId ?? null);

  // Safe normalized values
  const safeOptions = Array.isArray(options) ? options : [];
  const safeCorrectId = String(correctOptionId || "").trim();
  const normalizedCorrectId = safeCorrectId.toLowerCase();

  const parsed = parseQuestionPrompt(question || "");
  const formattedPassage = parsed.passageBody ? formatDialogue(parsed.passageBody) : "";

  const handleSelectOption = (optionId: string) => {
    if (mode === "review") return;
    if (mode === "practice" && selectedOptionId !== null) return;

    const optKey = String(optionId || "").trim().toLowerCase();
    const isCorrect = Boolean(normalizedCorrectId && optKey === normalizedCorrectId);
    setSelection({ question, optionId });
    onAnswer?.(optionId, isCorrect);
  };

  const handleProceed = () => {
    if (mode === "practice" && selectedOptionId === null) return;
    const currentSel = selectedOptionId || "";
    const isCorrect = Boolean(
      normalizedCorrectId &&
        currentSel.trim().toLowerCase() === normalizedCorrectId,
    );
    if (onNext) {
      onNext(currentSel, isCorrect);
    } else if (onAnswer) {
      onAnswer(currentSel, isCorrect);
    }
  };

  const isAnswered = selectedOptionId !== null;
  const isUserCorrect = Boolean(
    isAnswered &&
      normalizedCorrectId &&
      String(selectedOptionId || "").trim().toLowerCase() === normalizedCorrectId,
  );

  const correctOption = safeOptions.find(
    (o) => String(o.id || "").trim().toLowerCase() === normalizedCorrectId,
  );
  const correctText = correctOption ? correctOption.text : safeCorrectId.toUpperCase();

  const displayQuestionNum = questionNumber || currentIndex || 1;
  const displayTotal = totalCount || (safeOptions.length > 0 ? safeOptions.length : 40);

  return (
    <article className="w-full max-w-3xl overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 transition-all duration-300">
      {/* 1. Top Metadata Row */}
      <QuestionHeader
        subject={subject}
        subjectColor={subjectColor}
        year={year}
        paper={paper}
        topic={topic}
        mode={mode}
        displayQuestionNum={displayQuestionNum}
        displayTotal={displayTotal}
      />

      {/* 2. Question Prompt & Optional Reading/Cloze Passage */}
      <div className="mt-6 space-y-4">
        <PassageViewer
          parsed={parsed}
          formattedPassage={formattedPassage}
          subject={subject}
          displayQuestionNum={displayQuestionNum}
        />

        {/* The Actual Question Headline */}
        <div className="flex items-start gap-3 pt-1">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-400 font-heading text-xs font-extrabold text-slate-950 shadow-xs">
            {displayQuestionNum}
          </span>
          <h2 className="font-heading text-lg sm:text-xl font-bold leading-relaxed text-slate-900">
            <FormattedExamText
              text={parsed.questionText}
              activeGap={displayQuestionNum}
            />
          </h2>
        </div>
      </div>

      {/* 3. Answer Options List */}
      <div className="mt-8 space-y-3" role="group" aria-label="Answer options">
        {safeOptions.map((option, index) => {
          const optKey = String(option.id || "").trim().toLowerCase();
          const selKey = String(selectedOptionId || "").trim().toLowerCase();
          const isSelected = Boolean(selectedOptionId !== null && selKey === optKey);
          const isCorrect = Boolean(normalizedCorrectId && optKey === normalizedCorrectId);

          return (
            <AnswerOption
              key={option.id || index}
              option={option}
              index={index}
              isSelected={isSelected}
              isCorrect={isCorrect}
              isAnswered={isAnswered}
              mode={mode}
              onSelect={handleSelectOption}
            />
          );
        })}
      </div>

      {/* 4. Test Mode Navigation Bar */}
      {mode === "test" && (
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
          {hasPrevious ? (
            <button
              type="button"
              onClick={onPrevious}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              {selectedOptionId ? "Answer selected" : "Not answered"}
            </span>
            <button
              type="button"
              onClick={handleProceed}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0e1726] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
            >
              <span>{isLastQuestion ? "Review / Submit" : "Next"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Practice Mode Feedback & Explanation */}
      {mode === "practice" && isAnswered && (
        <PracticeFeedback
          isUserCorrect={isUserCorrect}
          correctOptionId={safeCorrectId}
          correctText={correctText}
          explanation={explanation}
          isLastQuestion={isLastQuestion}
          onProceed={handleProceed}
          subject={subject}
          topic={topic}
          year={year}
          question={question}
          options={safeOptions}
          selectedOptionId={selectedOptionId}
        />
      )}

      {/* 6. Review Mode Feedback & Explanation */}
      {mode === "review" && (
        <ReviewFeedback
          isUserCorrect={isUserCorrect}
          selectedOptionId={selectedOptionId}
          correctOptionId={safeCorrectId}
          correctText={correctText}
          explanation={explanation}
          subject={subject}
          topic={topic}
          year={year}
          question={question}
          options={safeOptions}
        />
      )}
    </article>
  );
}

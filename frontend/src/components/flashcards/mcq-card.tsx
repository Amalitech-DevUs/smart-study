"use client";

import { useState } from "react";

export type SubjectColor = "math" | "english" | "science";

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

const subjectStyles: Record<SubjectColor, string> = {
  math: "bg-subject-math-light text-subject-math",
  english: "bg-subject-english-light text-subject-english",
  science: "bg-subject-science-light text-subject-science",
};

function AnswerIcon({ isCorrect }: { isCorrect: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {isCorrect ? (
        <path d="M5 12l5 5L20 7" />
      ) : (
        <path d="M6 6l12 12M6 18L18 6" />
      )}
    </svg>
  );
}

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
    <article className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-5 shadow-[0_2px_8px_rgba(31,36,48,0.08)] sm:p-6">
      <span
        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${subjectStyles[subjectColor]}`}
      >
        {subject}
      </span>

      <h2 className="mt-5 font-heading text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
        {question}
      </h2>

      <div className="mt-6 space-y-3" role="group" aria-label="Answer options">
        {options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === correctOptionId;
          const showCorrect = selectedOptionId !== null && isCorrect;
          const showIncorrect = isSelected && !isCorrect;
          const optionState = showCorrect
            ? "border-success bg-success-light text-success"
            : showIncorrect
              ? "border-danger bg-danger-light text-danger"
              : "border-gray-200 bg-white text-text-primary hover:border-brand-gold hover:bg-brand-gold/5";

          return (
            <button
              key={option.id}
              type="button"
              disabled={selectedOptionId !== null}
              onClick={() => handleAnswer(option.id)}
              className={`flex min-h-11 w-full items-center gap-3 rounded-md border px-4 py-3 text-left transition-colors disabled:cursor-default ${optionState}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-sm font-medium">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1 text-base leading-6">{option.text}</span>
              {(showCorrect || showIncorrect) && (
                <AnswerIcon isCorrect={showCorrect} />
              )}
            </button>
          );
        })}
      </div>
    </article>
  );
}

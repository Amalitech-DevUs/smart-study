import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { FormattedExamText } from "./FormattedExamText";

export type OptionItem = {
  id: string;
  text: string;
};

type Props = {
  option: OptionItem;
  index: number;
  isSelected: boolean;
  isCorrect: boolean;
  isAnswered: boolean;
  mode: "practice" | "test" | "review";
  onSelect: (id: string) => void;
};

export function AnswerOption({
  option,
  index,
  isSelected,
  isCorrect,
  isAnswered,
  mode,
  onSelect,
}: Props) {
  const showCorrectPractice = mode === "practice" && isAnswered && isCorrect;
  const showIncorrectPractice = mode === "practice" && isSelected && !isCorrect;

  let optionStyle =
    "border-slate-200 bg-slate-50/70 text-slate-800 hover:border-slate-400 hover:bg-slate-100/80 hover:shadow-sm";

  if (mode === "test") {
    if (isSelected) {
      optionStyle =
        "border-slate-900 bg-slate-900 text-white font-semibold shadow-md ring-1 ring-slate-900";
    } else {
      optionStyle =
        "border-slate-200 bg-slate-50/70 text-slate-800 hover:border-slate-300 hover:bg-white";
    }
  } else if (mode === "practice") {
    if (showCorrectPractice) {
      optionStyle =
        "border-emerald-500 bg-emerald-50/90 text-emerald-950 font-semibold shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500";
    } else if (showIncorrectPractice) {
      optionStyle =
        "border-rose-400 bg-rose-50/90 text-rose-950 font-medium shadow-md shadow-rose-500/10";
    } else if (isAnswered) {
      optionStyle = "border-slate-200 bg-slate-50/40 text-slate-400 opacity-60";
    }
  } else if (mode === "review") {
    if (isCorrect) {
      optionStyle =
        "border-emerald-500 bg-emerald-50/90 text-emerald-950 font-semibold shadow-md ring-1 ring-emerald-500";
    } else if (isSelected && !isCorrect) {
      optionStyle = "border-rose-400 bg-rose-50/90 text-rose-950 font-medium shadow-md";
    } else {
      optionStyle = "border-slate-200 bg-slate-50/40 text-slate-400 opacity-60";
    }
  }

  const letter = String.fromCharCode(65 + index);
  const optionId = String(option?.id || letter.toLowerCase());

  return (
    <button
      type="button"
      disabled={mode === "review" || (mode === "practice" && isAnswered)}
      onClick={() => onSelect(optionId)}
      className={`group flex min-h-12 w-full items-center gap-3.5 rounded-xl border px-4 py-3 text-left transition-all duration-200 disabled:cursor-default ${optionStyle}`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-heading text-sm font-bold transition-all ${
          mode === "test"
            ? isSelected
              ? "bg-amber-400 text-slate-950 shadow-sm"
              : "bg-slate-200 text-slate-700 group-hover:bg-slate-300"
            : mode === "practice"
              ? showCorrectPractice
                ? "bg-emerald-600 text-white shadow-sm"
                : showIncorrectPractice
                  ? "bg-rose-600 text-white shadow-sm"
                  : isAnswered
                    ? "bg-slate-200 text-slate-500"
                    : "bg-slate-200 text-slate-700 group-hover:bg-slate-900 group-hover:text-white"
              : isCorrect
                ? "bg-emerald-600 text-white shadow-sm"
                : isSelected && !isCorrect
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-slate-200 text-slate-500"
        }`}
      >
        {letter}
      </span>

      <span className="flex-1 text-sm sm:text-base font-normal">
        <FormattedExamText text={option?.text || ""} />
      </span>

      {mode === "practice" && showCorrectPractice && (
        <div className="flex items-center gap-1.5 text-emerald-700">
          <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
            Correct
          </span>
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
        </div>
      )}
      {mode === "practice" && showIncorrectPractice && (
        <div className="flex items-center gap-1.5 text-rose-700">
          <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
            Incorrect
          </span>
          <XCircle className="h-5 w-5 shrink-0 text-rose-600" />
        </div>
      )}
      {mode === "review" && isCorrect && (
        <div className="flex items-center gap-1.5 text-emerald-700">
          <span className="text-xs font-bold uppercase tracking-wider">Correct</span>
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
        </div>
      )}
      {mode === "review" && isSelected && !isCorrect && (
        <div className="flex items-center gap-1.5 text-rose-700">
          <span className="text-xs font-bold uppercase tracking-wider">Your Answer</span>
          <XCircle className="h-5 w-5 shrink-0 text-rose-600" />
        </div>
      )}
    </button>
  );
}

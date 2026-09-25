import React, { useState } from "react";
import { BookOpen, ChevronUp, ChevronDown } from "lucide-react";
import { FormattedExamText } from "./FormattedExamText";
import type { ParsedQuestion } from "@/lib/session-utils";

type Props = {
  parsed: ParsedQuestion;
  formattedPassage: string;
  subject: string;
  displayQuestionNum: number;
};

export function PassageViewer({
  parsed,
  formattedPassage,
  subject,
  displayQuestionNum,
}: Props) {
  const [isPassageExpanded, setIsPassageExpanded] = useState<boolean>(true);

  if (!parsed.hasPassage) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 shadow-xs transition-all">
      {/* Passage Header Strip */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100/70 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-amber-600 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {subject.toLowerCase() === "french"
              ? parsed.passageType === "cloze"
                ? "Texte lacunaire (Cloze Test)"
                : "Texte de lecture (Reading Passage)"
              : parsed.passageType === "cloze"
                ? "Cloze Passage"
                : "Reference Passage"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsPassageExpanded((prev) => !prev)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 transition-colors"
          aria-expanded={isPassageExpanded}
        >
          <span>{isPassageExpanded ? "Hide Passage" : "Show Passage"}</span>
          {isPassageExpanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Context Scene Introduction */}
      {parsed.contextIntro && (
        <div className="border-b border-slate-200/60 bg-amber-50/40 px-4 py-2 text-xs italic font-medium text-amber-950">
          {parsed.contextIntro}
        </div>
      )}

      {/* Passage Text Body */}
      {isPassageExpanded && (
        <div className="max-h-72 overflow-y-auto p-4 sm:p-5 text-sm sm:text-base leading-relaxed text-slate-800 font-sans">
          <FormattedExamText
            text={formattedPassage}
            activeGap={displayQuestionNum}
          />
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Lightbulb,
  Bot,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export type SubjectColor =
  | "math"
  | "english"
  | "science"
  | "social-studies"
  | "french"
  | "computing"
  | "rme"
  | "creative-arts";

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
  /** Restores previously selected answer (e.g. after navigating to AI chat and back) */
  initialSelectedOptionId?: string | null;
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

export interface ParsedQuestion {
  hasPassage: boolean;
  passageType?: "reading" | "cloze" | "context";
  contextIntro?: string;
  passageBody?: string;
  questionText: string;
}

/**
 * Intelligent prompt parser that separates reading passages and cloze stories
 * from the actual target question being answered.
 */
export function parseQuestionPrompt(raw: string): ParsedQuestion {
  if (!raw) return { hasPassage: false, questionText: "" };
  const trimmed = raw.trim();

  // Pattern 1: Question separator (e.g. "Question: ...", "Question : ...")
  const qSepMatch = trimmed.match(/^([\s\S]*?)(?:\s*(?:Question|QUESTION)\s*:\s*)([\s\S]*)$/);
  if (qSepMatch) {
    const rawPassage = qSepMatch[1].trim();
    const questionText = qSepMatch[2].trim();

    let contextIntro: string | undefined = undefined;
    let passageBody = rawPassage;

    // Check if the passage opens with an intro scene/premise
    const introMatch = rawPassage.match(
      /^([^.!?\n]+(?:\s+(?:sur|avec|à|le|pour|au|dans)\s+[^.!?\n]+)?\.)\s+([A-ZÀ-ÖØ-Ý«][\s\S]*)$/
    );
    if (introMatch && introMatch[1].length < 130 && introMatch[2].length > 30) {
      contextIntro = introMatch[1].trim();
      passageBody = introMatch[2].trim();
    }

    return {
      hasPassage: true,
      passageType: "reading",
      contextIntro,
      passageBody,
      questionText: questionText.length > 0 ? questionText : raw,
    };
  }

  // Pattern 2: Cloze Test with trailing question (e.g. "Which word fills gap (31)?")
  const clozeMatch = trimmed.match(
    /^([\s\S]*?)\s*((?:Which word fills gap|In the passage below, choose the best word for gap|Which word best completes the gap)\s*\(?\d+\)?\??)$/i
  );
  if (clozeMatch) {
    const rawPassage = clozeMatch[1].trim();
    const questionText = clozeMatch[2].trim();

    let contextIntro: string | undefined = undefined;
    let passageBody = rawPassage;
    const titleMatch = rawPassage.match(/^([^.!?\n]{3,60}\.)\s+([\s\S]+)$/);
    if (titleMatch) {
      contextIntro = titleMatch[1].trim();
      passageBody = titleMatch[2].trim();
    }

    return {
      hasPassage: true,
      passageType: "cloze",
      contextIntro,
      passageBody,
      questionText,
    };
  }

  // Pattern 3: Explicit double newline separating context from question
  if (trimmed.includes("\n\n")) {
    const segments = trimmed.split(/\n\n+/);
    if (segments.length >= 2) {
      const questionText = segments.pop()!.trim();
      const passageBody = segments.join("\n\n").trim();
      return {
        hasPassage: true,
        passageType: "context",
        passageBody,
        questionText,
      };
    }
  }

  return {
    hasPassage: false,
    questionText: trimmed,
  };
}

/**
 * Format dialogue speaker turns (e.g. "Pierre :", "Rebecca :") onto clean separate lines.
 */
function formatDialogue(text: string): string {
  if (!text) return "";
  return text.replace(
    /\s+((?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+|M\.\s*[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+|Mme\s*[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+)\s*:)/g,
    "\n$1"
  );
}

/**
 * Advanced text formatter for MCQ prompts, passages, options, and explanations.
 * - Handles blanks (_____) with distinct visual fill-in pill styling
 * - Handles cloze gap markers (e.g. (31)) with active/inactive highlights
 * - Handles bold (**), italics (*), code (`), links, and French guillemets (« »)
 */
function FormattedExamText({
  text,
  activeGap,
  className = "",
}: {
  text: string;
  activeGap?: number;
  className?: string;
}) {
  if (!text) return null;

  const lines = text.split("\n");

  return (
    <span className={className}>
      {lines.map((line, lineIdx) => {
        const tokenRegex =
          /(_{2,}|(?:\(([0-9]{1,2})\))|\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)|https?:\/\/[^\s]+|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|«[^»]+»)/g;

        const elements: React.ReactNode[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = tokenRegex.exec(line)) !== null) {
          if (match.index > lastIndex) {
            elements.push(line.substring(lastIndex, match.index));
          }

          const token = match[0];

          if (/^_{2,}$/.test(token)) {
            // Fill-in-the-blank slot
            elements.push(
              <span
                key={`blank-${lineIdx}-${match.index}`}
                className="inline-flex items-center justify-center min-w-[3.5rem] px-2.5 py-0.5 mx-1 font-mono font-bold text-amber-900 bg-amber-100/80 border-b-2 border-amber-500 rounded-sm shadow-xs select-none align-baseline text-xs sm:text-sm"
                title="Fill in the blank"
              >
                ______
              </span>
            );
          } else if (match[2]) {
            // Gap marker like (31)
            const gapNum = parseInt(match[2], 10);
            const isActive = activeGap !== undefined && gapNum === activeGap;
            elements.push(
              <span
                key={`gap-${lineIdx}-${match.index}`}
                className={`inline-flex items-center justify-center px-2 py-0.5 mx-1 rounded-md text-xs font-bold transition-all ${
                  isActive
                    ? "bg-amber-400 text-slate-950 ring-2 ring-amber-500 shadow-sm scale-105"
                    : "bg-slate-200/90 text-slate-700 font-mono"
                }`}
              >
                ({gapNum})
              </span>
            );
          } else if (token.startsWith("«") && token.endsWith("»")) {
            elements.push(
              <span
                key={`quote-${lineIdx}-${match.index}`}
                className="font-serif italic text-slate-900"
              >
                «&nbsp;{token.slice(1, -1).trim()}&nbsp;»
              </span>
            );
          } else if (token.startsWith("[") && token.includes("](")) {
            const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
            if (linkMatch) {
              elements.push(
                <a
                  key={`link-${lineIdx}-${match.index}`}
                  href={linkMatch[2]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors"
                >
                  <span>{linkMatch[1]}</span>
                  <ExternalLink className="h-3 w-3 inline shrink-0" />
                </a>
              );
            }
          } else if (token.startsWith("http://") || token.startsWith("https://")) {
            elements.push(
              <a
                key={`url-${lineIdx}-${match.index}`}
                href={token}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors"
              >
                <span>{token}</span>
                <ExternalLink className="h-3 w-3 inline shrink-0" />
              </a>
            );
          } else if (token.startsWith("**") && token.endsWith("**")) {
            elements.push(
              <strong key={`bold-${lineIdx}-${match.index}`} className="font-bold text-slate-900">
                {token.slice(2, -2)}
              </strong>
            );
          } else if (token.startsWith("*") && token.endsWith("*")) {
            elements.push(
              <em key={`italic-${lineIdx}-${match.index}`} className="italic text-slate-700">
                {token.slice(1, -1)}
              </em>
            );
          } else if (token.startsWith("`") && token.endsWith("`")) {
            elements.push(
              <code
                key={`code-${lineIdx}-${match.index}`}
                className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono font-medium text-slate-800 border border-slate-200"
              >
                {token.slice(1, -1)}
              </code>
            );
          }

          lastIndex = tokenRegex.lastIndex;
        }

        if (lastIndex < line.length) {
          elements.push(line.substring(lastIndex));
        }

        const isSpeakerLine =
          /^(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+|M\.\s*[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+|Mme\s*[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+)\s*:/.test(
            line
          );

        return (
          <React.Fragment key={`line-${lineIdx}`}>
            {lineIdx > 0 && <br />}
            <span className={isSpeakerLine ? "block py-0.5" : undefined}>
              {elements.length > 0 ? elements : line}
            </span>
          </React.Fragment>
        );
      })}
    </span>
  );
}

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
  initialSelectedOptionId,
  onAnswer,
  onNext,
}: McqCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    initialSelectedOptionId ?? null
  );
  const [isPassageExpanded, setIsPassageExpanded] = useState<boolean>(true);

  const parsed = parseQuestionPrompt(question);
  const formattedPassage = parsed.passageBody ? formatDialogue(parsed.passageBody) : "";

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

  // Build a pre-filled prompt for the /chat page so the user sees it before sending
  const aiPrompt = `Please explain step-by-step why Option ${correctOptionId.toUpperCase()} ("${correctText}") is the correct answer to this ${subject} question${year ? ` (${year} BECE)` : ""}.\n\nQuestion: "${question}"\n\nExplain clearly for a Ghanaian JHS student preparing for the BECE.`;
  const chatUrl = `/chat?q=${encodeURIComponent(aiPrompt)}`;

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

      {/* Question Prompt / Reference Passage Area */}
      <div className="mt-6 space-y-4">
        {parsed.hasPassage && (
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/70 shadow-sm transition-all">
            {/* Passage Header Strip */}
            <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-100/70 px-4 py-2.5">
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
        )}

        {/* The Actual Question Headline */}
        <div className="flex items-start gap-3 pt-1">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-amber-400 font-heading text-xs font-extrabold text-slate-950 shadow-sm shadow-amber-400/20">
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

              <span className="flex-1 text-sm sm:text-base font-normal">
                <FormattedExamText text={option.text} />
              </span>

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

              {/* AI Tutor Link — opens chat page with question pre-filled */}
              <Link
                href={chatUrl}
                className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 transition-all hover:bg-indigo-100 hover:border-indigo-300 hover:shadow-sm"
              >
                <Bot className="h-3.5 w-3.5" />
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

          {/* Next / Finish Button */}
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

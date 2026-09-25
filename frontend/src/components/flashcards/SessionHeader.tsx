import React from "react";
import { RotateCcw, Clock, Check } from "lucide-react";
import { formatTime } from "@/lib/session-utils";
import type { LearningMode } from "@/lib/learning-tracker";
import type { McqQuestion } from "./mcq-card";

export type TimerOption = {
  value: string;
  label: string;
  seconds: number;
};

type Props = {
  sessionMode: LearningMode;
  setSessionMode: (mode: LearningMode) => void;
  isPracticeFinished: boolean;
  isTestSubmitted: boolean;
  attempts: number;
  testAnsweredCount: number;
  completedUniqueCount: number;
  totalQuestions: number;
  testScorePercent: number;
  timerMode: string;
  setTimerMode: (mode: string) => void;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  setTimedOut: (val: boolean) => void;
  timerOptions: readonly TimerOption[];
  onOpenSubmitModal: () => void;
  onRestart: () => void;
  practiceProgressPercent: number;
  initialQuestions: McqQuestion[];
  testAnswers: Record<string, string>;
  testCurrentIndex: number;
  setTestCurrentIndex: (idx: number) => void;
};

export function SessionHeader({
  sessionMode,
  setSessionMode,
  isPracticeFinished,
  isTestSubmitted,
  attempts,
  testAnsweredCount,
  completedUniqueCount,
  totalQuestions,
  testScorePercent,
  timerMode,
  setTimerMode,
  timeRemaining,
  setTimeRemaining,
  setTimedOut,
  timerOptions,
  onOpenSubmitModal,
  onRestart,
  practiceProgressPercent,
  initialQuestions,
  testAnswers,
  testCurrentIndex,
  setTestCurrentIndex,
}: Props) {
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Title & Mode Switcher */}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-lg font-bold text-slate-900">
              {sessionMode === "practice"
                ? isPracticeFinished
                  ? "Practice Session Summary"
                  : "Practice & Revision"
                : isTestSubmitted
                  ? "Test Results & Review"
                  : "BECE Exam Simulation"}
            </span>

            {/* Learning Mode Badges / Switcher (only switchable before starting) */}
            {!isPracticeFinished && !isTestSubmitted && attempts === 0 && testAnsweredCount === 0 ? (
              <div className="flex rounded-full border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSessionMode("practice")}
                  className={`rounded-full px-3 py-1 transition-all ${
                    sessionMode === "practice"
                      ? "bg-[#0e1726] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Practice
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSessionMode("test");
                    if (timerMode === "practice") {
                      setTimerMode("45");
                      setTimeRemaining(45 * 60);
                    }
                  }}
                  className={`rounded-full px-3 py-1 transition-all ${
                    sessionMode === "test"
                      ? "bg-blue-700 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ⏱️ Test
                </button>
              </div>
            ) : (
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  sessionMode === "practice"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                {sessionMode === "practice" ? "Practice Mode" : "Test Mode"}
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-slate-500">
            {sessionMode === "practice"
              ? isPracticeFinished
                ? "Review your practice results and mastered concepts below."
                : `${completedUniqueCount} of ${totalQuestions} unique questions completed • Missed questions requeue later`
              : isTestSubmitted
                ? `Completed with ${testScorePercent}% score • Review all questions and AI explanations below`
                : "Answer all questions without instant hints, then submit for official grading."}
          </p>
        </div>

        {/* Timer & Controls */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          {timerMode !== "practice" && !isPracticeFinished && !isTestSubmitted && (
            <span
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold tabular-nums ${
                timeRemaining < 300
                  ? "border-rose-300 bg-rose-50 text-rose-700 animate-pulse"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              {formatTime(timeRemaining)}
            </span>
          )}

          {/* Timer Options (Available only before first answer) */}
          {attempts === 0 && testAnsweredCount === 0 && !isTestSubmitted && (
            <div className="flex rounded-full border border-slate-200 bg-slate-50 p-1 text-xs">
              {timerOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setTimerMode(opt.value);
                    setTimeRemaining(opt.seconds);
                    setTimedOut(false);
                  }}
                  className={`rounded-full px-2.5 py-1 font-semibold transition-all ${
                    timerMode === opt.value
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Test Submit Button */}
          {sessionMode === "test" && !isTestSubmitted && (
            <button
              type="button"
              onClick={onOpenSubmitModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-800 transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Submit Test</span>
            </button>
          )}

          {/* Restart Button */}
          {(isPracticeFinished || isTestSubmitted) && (
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
              title="Restart question session"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restart</span>
            </button>
          )}
        </div>
      </div>

      {/* Practice Progress Bar */}
      {sessionMode === "practice" && !isPracticeFinished && (
        <div className="mt-4">
          <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
            <span>
              Progress: {completedUniqueCount} / {totalQuestions} unique questions
            </span>
            <span>{practiceProgressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-[#f5a623] transition-all duration-300 ease-out"
              style={{ width: `${practiceProgressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Test Mode Question Palette Navigator */}
      {sessionMode === "test" && !isTestSubmitted && (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Question Palette</span>
            <span>
              {testAnsweredCount} of {totalQuestions} Answered
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-0.5">
            {initialQuestions.map((q, idx) => {
              const isAnswered = Boolean(testAnswers[q.id]);
              const isCurrent = idx === testCurrentIndex;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setTestCurrentIndex(idx)}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? "border-2 border-blue-600 bg-blue-50 text-blue-900 shadow-sm"
                      : isAnswered
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

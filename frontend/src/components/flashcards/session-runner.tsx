"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { McqCard, type McqQuestion } from "./mcq-card";
import { SaveProgressBanner } from "@/components/shared/save-progress-banner";
import { useAuth } from "@/lib/use-auth";
import { CheckCircle2, RotateCcw, ArrowLeft, Bot, Award, Clock } from "lucide-react";

const timerOptions = [
  { value: "practice", label: "Practice", seconds: 0 },
  { value: "30", label: "30 min", seconds: 30 * 60 },
  { value: "45", label: "45 min", seconds: 45 * 60 },
  { value: "60", label: "1 hr", seconds: 60 * 60 },
] as const;

type TimerMode = (typeof timerOptions)[number]["value"];

type SessionRunnerProps = {
  initialQuestions: McqQuestion[];
  sessionKey?: string;
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

export function SessionRunner({ initialQuestions, sessionKey }: SessionRunnerProps) {
  const storageKey = sessionKey ? `smartstudy_session_${sessionKey}` : null;

  const [queue, setQueue] = useState<McqQuestion[]>(initialQuestions);
  const [attempts, setAttempts] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [timerMode, setTimerMode] = useState<TimerMode>("practice");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  // Persisted: tracks the option the user selected for the CURRENT question so that
  // navigating away to the AI chat page and coming back restores the answer reveal.
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const { loggedIn, isLoading } = useAuth();

  // Guard: only load from localStorage ONCE on mount.
  // Using a ref prevents initialQuestions reference changes (server re-renders)
  // from overwriting already-restored session state.
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Only run once
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    if (!storageKey || typeof window === "undefined") {
      setIsLoaded(true);
      return;
    }

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.queueIds) && typeof parsed.completed === "number") {
          const idMap = new Map(initialQuestions.map((q) => [String(q.id), q]));
          const restoredQueue: McqQuestion[] = [];
          for (const id of parsed.queueIds) {
            const q = idMap.get(String(id));
            if (q) restoredQueue.push(q);
          }

          if (restoredQueue.length > 0 || parsed.completed > 0) {
            setQueue(restoredQueue);
            setCompletedQuestions(parsed.completed || 0);
            setAttempts(parsed.attempts || 0);
            if (parsed.timerMode) setTimerMode(parsed.timerMode);
            if (typeof parsed.timeRemaining === "number") setTimeRemaining(parsed.timeRemaining);
            if (parsed.timedOut) setTimedOut(true);
            if (typeof parsed.currentAnswer === "string") setCurrentAnswer(parsed.currentAnswer);
          }
        }
      }
    } catch {
      // Ignore parse errors and use initial state
    } finally {
      setIsLoaded(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist state to localStorage on changes
  useEffect(() => {
    if (!isLoaded || !storageKey || typeof window === "undefined") return;

    try {
      const payload = {
        queueIds: queue.map((q) => q.id),
        completed: completedQuestions,
        attempts: attempts,
        timerMode: timerMode,
        timeRemaining: timeRemaining,
        timedOut: timedOut,
        currentAnswer: currentAnswer,
        timestamp: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // Storage quota or disabled
    }
  }, [queue, completedQuestions, attempts, timerMode, timeRemaining, timedOut, currentAnswer, isLoaded, storageKey]);

  // Timer countdown
  useEffect(() => {
    if (timerMode === "practice" || queue.length === 0 || timedOut || !isLoaded) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((currentTime) => {
        if (currentTime <= 1) {
          setTimedOut(true);
          setQueue([]);
          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [queue.length, timerMode, timedOut, isLoaded]);

  const handleAnswer = (optionId: string) => {
    setAttempts((currentAttempts) => currentAttempts + 1);
    setCurrentAnswer(optionId);
  };

  const handleNext = (_optionId: string, isCorrect: boolean) => {
    // Clear the saved answer before moving to the next question
    setCurrentAnswer(null);
    if (isCorrect) {
      setCompletedQuestions((currentCompleted) => currentCompleted + 1);
      setQueue((currentQueue) => currentQueue.slice(1));
      return;
    }

    // Repetition: send missed question to end of queue so student masters it
    setQueue((currentQueue) => [...currentQueue.slice(1), currentQueue[0]]);
  };

  const handleRestart = () => {
    if (storageKey && typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
    setQueue(initialQuestions);
    setCompletedQuestions(0);
    setAttempts(0);
    setTimedOut(false);
    setTimeRemaining(0);
    setTimerMode("practice");
    setCurrentAnswer(null);
  };

  const totalQuestions = initialQuestions.length;
  const isFinished = timedOut || queue.length === 0;
  const currentQuestion = queue[0];
  const progressPercent = totalQuestions > 0
    ? Math.min(100, Math.round((completedQuestions / totalQuestions) * 100))
    : 0;

  const accuracy = attempts > 0 ? Math.round((completedQuestions / attempts) * 100) : 100;

  return (
    <section className="w-full max-w-3xl">
      {/* Session Controls & Progress Bar */}
      <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold text-slate-900">
                {isFinished ? "Session Summary" : "Official Past Question Practice"}
              </span>
              {!isFinished && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                  {progressPercent}% Complete
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              {isFinished
                ? "Review your performance below"
                : `${queue.length} question${queue.length === 1 ? "" : "s"} remaining • ${completedQuestions} of ${totalQuestions} mastered`}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            {timerMode !== "practice" && !isFinished && (
              <span className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold tabular-nums text-slate-700">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                {formatTime(timeRemaining)}
              </span>
            )}
            <div className="flex rounded-full border border-slate-200 bg-slate-50 p-1 text-xs">
              {timerOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={isFinished}
                  onClick={() => {
                    setTimerMode(option.value);
                    setTimeRemaining(option.seconds);
                    setTimedOut(false);
                  }}
                  className={`rounded-full px-3 py-1.5 font-semibold transition-all duration-150 disabled:cursor-default ${
                    timerMode === option.value
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Reset / Start Over Button */}
            {!isFinished && completedQuestions > 0 && (
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition-colors"
                title="Restart question session"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-[#f5a623] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Session Content */}
      {isFinished ? (
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-sm">
            <Award className="h-8 w-8" />
          </div>

          <h2 className="mt-4 font-heading text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {timedOut ? "Time's Up!" : "Practice Session Completed!"}
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 max-w-md mx-auto">
            {timedOut
              ? "Your timed examination interval ended. Review your score and retry to improve speed."
              : "Excellent work! You have completed and reviewed every question in this paper."}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <div>
              <p className="font-heading text-xl font-extrabold text-slate-900 sm:text-2xl">
                {completedQuestions}
              </p>
              <p className="text-xs font-medium text-slate-500">Mastered</p>
            </div>
            <div>
              <p className="font-heading text-xl font-extrabold text-slate-900 sm:text-2xl">
                {accuracy}%
              </p>
              <p className="text-xs font-medium text-slate-500">Accuracy</p>
            </div>
            <div>
              <p className="font-heading text-xl font-extrabold text-slate-900 sm:text-2xl">
                {attempts}
              </p>
              <p className="text-xs font-medium text-slate-500">Total Attempts</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Practice Again</span>
            </button>

            <Link
              href="/flashcards"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>All Exam Papers</span>
            </Link>

            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-all"
            >
              <Bot className="h-4 w-4" />
              <span>Ask AI Tutor</span>
            </Link>
          </div>

          {!isLoading && !loggedIn && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <SaveProgressBanner />
            </div>
          )}
        </div>
      ) : (
        <McqCard
          key={currentQuestion.id}
          {...currentQuestion}
          currentIndex={completedQuestions + 1}
          totalCount={totalQuestions}
          isLastQuestion={queue.length === 1}
          initialSelectedOptionId={currentAnswer}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      )}
    </section>
  );
}

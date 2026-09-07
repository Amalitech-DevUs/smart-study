"use client";

import { useEffect, useState } from "react";
import { McqCard, type McqQuestion } from "./mcq-card";
import { SaveProgressBanner } from "@/components/shared/save-progress-banner";
import { useAuth } from "@/lib/use-auth";

const timerOptions = [
  { value: "practice", label: "Practice", seconds: 0 },
  { value: "30", label: "30 min", seconds: 30 * 60 },
  { value: "45", label: "45 min", seconds: 45 * 60 },
  { value: "60", label: "1 hr", seconds: 60 * 60 },
] as const;

type TimerMode = (typeof timerOptions)[number]["value"];

type SessionRunnerProps = {
  initialQuestions: McqQuestion[];
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

export function SessionRunner({ initialQuestions }: SessionRunnerProps) {
  const [queue, setQueue] = useState<McqQuestion[]>(initialQuestions);
  const [attempts, setAttempts] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [timerMode, setTimerMode] = useState<TimerMode>("practice");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const { loggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (timerMode === "practice" || queue.length === 0 || timedOut) {
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
  }, [queue.length, timerMode, timedOut]);

  const handleAnswer = (optionId: string, isCorrect: boolean) => {
    setAttempts((currentAttempts) => currentAttempts + 1);

    if (isCorrect) {
      setCompletedQuestions((currentCompleted) => currentCompleted + 1);
      setQueue((currentQueue) => currentQueue.slice(1));
      return;
    }

    setQueue((currentQueue) => [...currentQueue.slice(1), currentQueue[0]]);
  };

  const isFinished = timedOut || queue.length === 0;

  return (
    <section className="w-full max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-heading text-2xl font-bold text-text-primary">
            Practice session
          </p>
          <p className="text-sm text-text-secondary">
            {queue.length} question{queue.length === 1 ? "" : "s"} remaining
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {timerMode !== "practice" && !isFinished && (
            <span className="font-medium tabular-nums text-text-secondary">
              {formatTime(timeRemaining)}
            </span>
          )}
          <div className="flex rounded-full border border-brand-indigo/15 bg-white p-1 text-sm">
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
                className={`rounded-full px-3 py-2 transition-colors duration-150 disabled:cursor-default ${timerMode === option.value ? "bg-brand-gold text-brand-indigo" : "bg-transparent text-text-secondary hover:text-brand-indigo"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isFinished ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="font-heading text-3xl font-bold text-text-primary">
            {timedOut ? "Time is up" : "Session complete!"}
          </h1>
          <p className="mt-3 text-text-secondary">
            {completedQuestions} question{completedQuestions === 1 ? "" : "s"}{" "}
            completed, {attempts} attempt{attempts === 1 ? "" : "s"}
          </p>
          {!isLoading && !loggedIn && <SaveProgressBanner />}
        </div>
      ) : (
        <McqCard
          key={queue[0].id}
          subject={queue[0].subject}
          subjectColor={queue[0].subjectColor}
          question={queue[0].question}
          options={queue[0].options}
          correctOptionId={queue[0].correctOptionId}
          onAnswer={handleAnswer}
        />
      )}
    </section>
  );
}

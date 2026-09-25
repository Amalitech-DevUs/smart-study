"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { McqCard, type McqQuestion } from "./mcq-card";
import { useAuth } from "@/lib/use-auth";
import {
  recordQuestionAttempt,
  saveActiveSession,
  completeStudySession,
  clearActiveSession,
  type LearningMode,
} from "@/lib/learning-tracker";
import { shuffleOptionsSafely } from "@/lib/session-utils";
import { SessionHeader, type TimerOption } from "./SessionHeader";
import { PracticeSummary } from "./PracticeSummary";
import { TestReviewScreen } from "./TestReviewScreen";
import { SubmitConfirmModal } from "./SubmitConfirmModal";

const timerOptions: readonly TimerOption[] = [
  { value: "practice", label: "Untimed", seconds: 0 },
  { value: "30", label: "30 min", seconds: 30 * 60 },
  { value: "45", label: "45 min", seconds: 45 * 60 },
  { value: "60", label: "1 hr", seconds: 60 * 60 },
] as const;

type SessionRunnerProps = {
  initialQuestions: McqQuestion[];
  sessionKey?: string;
};

export function SessionRunner({
  initialQuestions,
  sessionKey,
}: SessionRunnerProps) {
  const { loggedIn, isLoading, username } = useAuth();
  const userPrefix = username ? `${username.toLowerCase()}_` : "guest_";
  const storageKey =
    sessionKey && !isLoading
      ? `smartstudy_session_${userPrefix}${sessionKey}`
      : null;

  // Mode: "practice" or "test"
  const [sessionMode, setSessionMode] = useState<LearningMode>("practice");

  // Practice State
  const [queue, setQueue] = useState<McqQuestion[]>(initialQuestions);
  const [completedUniqueIds, setCompletedUniqueIds] = useState<string[]>([]);
  const [requeueCounts, setRequeueCounts] = useState<Record<string, number>>({});
  const [attempts, setAttempts] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);

  // Test State
  const [testCurrentIndex, setTestCurrentIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Timer State
  const [timerMode, setTimerMode] = useState<string>("practice");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Unique session ID
  const sessionIdRef = useRef<string>(`session-${Date.now()}`);
  const loadedUserRef = useRef<string | null>(null);

  const totalQuestions = initialQuestions.length;
  const subjectName = initialQuestions[0]?.subject || "BECE Exam";
  const subjectSlug = initialQuestions[0]?.subjectColor || "mathematics";
  const yearNumber = initialQuestions[0]?.year || 2024;

  // Restore session from localStorage
  useEffect(() => {
    if (isLoading || typeof window === "undefined") return;
    if (loadedUserRef.current === userPrefix) return;
    loadedUserRef.current = userPrefix;

    if (!storageKey) {
      setIsLoaded(true);
      return;
    }

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sessionMode) setSessionMode(parsed.sessionMode);
        if (parsed.sessionId) sessionIdRef.current = parsed.sessionId;
        if (Array.isArray(parsed.completedUniqueIds)) {
          setCompletedUniqueIds(parsed.completedUniqueIds);
        }
        if (parsed.requeueCounts) setRequeueCounts(parsed.requeueCounts);
        if (typeof parsed.attempts === "number") setAttempts(parsed.attempts);
        if (parsed.timerMode) setTimerMode(parsed.timerMode);
        if (typeof parsed.timeRemaining === "number") {
          setTimeRemaining(parsed.timeRemaining);
        }
        if (parsed.timedOut) setTimedOut(true);
        if (parsed.currentAnswer) setCurrentAnswer(parsed.currentAnswer);
        if (parsed.testAnswers) setTestAnswers(parsed.testAnswers);
        if (typeof parsed.testCurrentIndex === "number") {
          setTestCurrentIndex(parsed.testCurrentIndex);
        }
        if (parsed.isTestSubmitted) setIsTestSubmitted(true);

        // Restore practice queue
        if (Array.isArray(parsed.queueIds)) {
          const idMap = new Map(initialQuestions.map((q) => [String(q.id), q]));
          const restoredQueue: McqQuestion[] = [];
          for (const id of parsed.queueIds) {
            const q = idMap.get(String(id));
            if (q) restoredQueue.push(q);
          }
          if (restoredQueue.length > 0 || parsed.completedUniqueIds?.length > 0) {
            setQueue(restoredQueue);
          }
        }
      }

      // Support direct launching in test mode (e.g. from Dashboard "Mock Exam" button)
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const urlMode = params.get("mode");
        if (urlMode === "test") {
          setSessionMode("test");
          setTimerMode("45");
          setTimeRemaining(45 * 60);
        } else if (urlMode === "practice") {
          setSessionMode("practice");
        }
      }
    } catch {
      // Ignore parse errors and use initial state
    } finally {
      setIsLoaded(true);
    }
  }, [isLoading, storageKey, userPrefix, initialQuestions]);

  // Persist state to localStorage and update Active Session
  useEffect(() => {
    if (!isLoaded || !storageKey || typeof window === "undefined") return;

    try {
      const payload = {
        sessionId: sessionIdRef.current,
        sessionMode,
        queueIds: queue.map((q) => q.id),
        completedUniqueIds,
        requeueCounts,
        attempts,
        currentAnswer,
        testCurrentIndex,
        testAnswers,
        isTestSubmitted,
        timerMode,
        timeRemaining,
        timedOut,
        timestamp: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));

      // Update active session metadata for dashboard resume card
      const isFinished =
        sessionMode === "practice"
          ? queue.length === 0 || completedUniqueIds.length >= totalQuestions
          : isTestSubmitted;

      if (!isFinished && sessionKey) {
        saveActiveSession(username, {
          sessionId: sessionIdRef.current,
          sessionKey,
          subject: subjectName,
          subjectSlug,
          year: yearNumber,
          mode: sessionMode,
          uniqueQuestionsTotal: totalQuestions,
          uniqueQuestionsCompleted:
            sessionMode === "practice"
              ? completedUniqueIds.length
              : Object.keys(testAnswers).length,
          lastUpdated: Date.now(),
          isFinished: false,
        });
      }
    } catch {
      // Storage quota or disabled
    }
  }, [
    isLoaded,
    storageKey,
    sessionMode,
    queue,
    completedUniqueIds,
    requeueCounts,
    attempts,
    currentAnswer,
    testCurrentIndex,
    testAnswers,
    isTestSubmitted,
    timerMode,
    timeRemaining,
    timedOut,
    sessionKey,
    username,
    subjectName,
    subjectSlug,
    yearNumber,
    totalQuestions,
  ]);

  // Timer countdown
  useEffect(() => {
    if (timerMode === "practice" || timedOut || !isLoaded) return;
    if (sessionMode === "practice" && queue.length === 0) return;
    if (sessionMode === "test" && isTestSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((curr) => {
        if (curr <= 1) {
          setTimedOut(true);
          if (sessionMode === "test") {
            setIsTestSubmitted(true);
          } else {
            setQueue([]);
          }
          return 0;
        }
        return curr - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerMode, timedOut, isLoaded, sessionMode, queue.length, isTestSubmitted]);

  /* ── Practice Handlers ── */
  const handlePracticeAnswer = (optionId: string, isCorrect: boolean) => {
    setAttempts((prev) => prev + 1);
    setCurrentAnswer(optionId);

    const currentQ = queue[0];
    if (!currentQ) return;

    const currentRequeueCount = requeueCounts[currentQ.id] || 0;

    recordQuestionAttempt(username, {
      id: `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      questionId: String(currentQ.id),
      subject: currentQ.subject || subjectName,
      subjectSlug,
      topic: currentQ.topic || "Objective Test",
      year: currentQ.year || yearNumber,
      paper: currentQ.paper || 1,
      mode: "practice",
      isCorrect,
      selectedOptionId: optionId,
      correctOptionId: currentQ.correctOptionId,
      isRequeued: currentRequeueCount > 0,
      attemptNumber: currentRequeueCount + 1,
      timestamp: Date.now(),
      sessionId: sessionIdRef.current,
    });
  };

  const completeSessionRecord = (mode: LearningMode) => {
    const accuracy =
      attempts > 0 ? Math.round((completedUniqueIds.length / attempts) * 100) : 100;

    completeStudySession(username, {
      sessionId: sessionIdRef.current,
      sessionKey: sessionKey || `${subjectSlug}-${yearNumber}`,
      subject: subjectName,
      subjectSlug,
      year: yearNumber,
      mode,
      startedAt: Date.now() - 600000,
      completedAt: Date.now(),
      isCompleted: true,
      uniqueQuestionsTotal: totalQuestions,
      uniqueQuestionsCompleted: totalQuestions,
      totalAttempts: attempts,
      correctCount: completedUniqueIds.length,
      incorrectCount: Math.max(0, attempts - completedUniqueIds.length),
      unansweredCount: 0,
      scorePercent: accuracy,
    });
  };

  const handlePracticeNext = (_optionId: string, isCorrect: boolean) => {
    setCurrentAnswer(null);
    const currentQ = queue[0];
    if (!currentQ) return;

    if (isCorrect) {
      setCompletedUniqueIds((prev) =>
        prev.includes(String(currentQ.id)) ? prev : [...prev, String(currentQ.id)],
      );
      setQueue((prev) => prev.slice(1));

      if (queue.length <= 1) {
        completeSessionRecord("practice");
      }
      return;
    }

    // Question Missed: Requeue System
    const misses = (requeueCounts[currentQ.id] || 0) + 1;
    setRequeueCounts((prev) => ({ ...prev, [currentQ.id]: misses }));

    if (misses > 2) {
      setCompletedUniqueIds((prev) =>
        prev.includes(String(currentQ.id)) ? prev : [...prev, String(currentQ.id)],
      );
      setQueue((prev) => prev.slice(1));
      if (queue.length <= 1) {
        completeSessionRecord("practice");
      }
      return;
    }

    const remaining = queue.slice(1);
    const offset = Math.min(
      remaining.length,
      Math.max(1, Math.min(3 + Math.floor(Math.random() * 3), remaining.length)),
    );

    const resurfacedQuestion = shuffleOptionsSafely(currentQ);
    const nextQueue = [...remaining];
    nextQueue.splice(offset, 0, resurfacedQuestion);
    setQueue(nextQueue);
  };

  /* ── Test Handlers ── */
  const handleTestAnswer = (optionId: string) => {
    const q = initialQuestions[testCurrentIndex];
    if (!q) return;
    setTestAnswers((prev) => ({
      ...prev,
      [q.id]: optionId,
    }));
  };

  const handleTestSubmit = () => {
    setShowSubmitModal(false);
    setIsTestSubmitted(true);

    const correctCount = initialQuestions.filter(
      (q) => testAnswers[q.id]?.toLowerCase() === q.correctOptionId.toLowerCase(),
    ).length;
    const unansweredCount = initialQuestions.filter((q) => !testAnswers[q.id]).length;
    const incorrectCount = totalQuestions - correctCount - unansweredCount;

    initialQuestions.forEach((q) => {
      const selected = testAnswers[q.id] || null;
      const isCorrect = selected
        ? selected.toLowerCase() === q.correctOptionId.toLowerCase()
        : false;

      recordQuestionAttempt(username, {
        id: `test-att-${Date.now()}-${q.id}`,
        questionId: String(q.id),
        subject: q.subject || subjectName,
        subjectSlug,
        topic: q.topic || "Objective Test",
        year: q.year || yearNumber,
        paper: q.paper || 1,
        mode: "test",
        isCorrect,
        selectedOptionId: selected,
        correctOptionId: q.correctOptionId,
        isRequeued: false,
        attemptNumber: 1,
        timestamp: Date.now(),
        sessionId: sessionIdRef.current,
      });
    });

    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    completeStudySession(username, {
      sessionId: sessionIdRef.current,
      sessionKey: sessionKey || `${subjectSlug}-${yearNumber}`,
      subject: subjectName,
      subjectSlug,
      year: yearNumber,
      mode: "test",
      startedAt:
        Date.now() -
        (timerMode === "practice"
          ? 600000
          : (timerOptions.find((t) => t.value === timerMode)?.seconds || 2700) * 1000 -
            timeRemaining * 1000),
      completedAt: Date.now(),
      isCompleted: true,
      uniqueQuestionsTotal: totalQuestions,
      uniqueQuestionsCompleted: totalQuestions - unansweredCount,
      totalAttempts: totalQuestions,
      correctCount,
      incorrectCount,
      unansweredCount,
      scorePercent,
    });
  };

  const handleRestart = () => {
    if (storageKey && typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
    clearActiveSession(username);
    sessionIdRef.current = `session-${Date.now()}`;
    setQueue(initialQuestions);
    setCompletedUniqueIds([]);
    setRequeueCounts({});
    setAttempts(0);
    setTimedOut(false);
    setTimeRemaining(0);
    setTimerMode("practice");
    setCurrentAnswer(null);
    setTestCurrentIndex(0);
    setTestAnswers({});
    setIsTestSubmitted(false);
  };

  /* ── Calculations ── */
  const isPracticeFinished =
    timedOut || queue.length === 0 || completedUniqueIds.length >= totalQuestions;

  const practiceProgressPercent =
    totalQuestions > 0
      ? Math.min(100, Math.round((completedUniqueIds.length / totalQuestions) * 100))
      : 0;

  const practiceAccuracy =
    attempts > 0 ? Math.round((completedUniqueIds.length / attempts) * 100) : 100;

  const testAnsweredCount = Object.keys(testAnswers).length;
  const testUnansweredCount = totalQuestions - testAnsweredCount;
  const testCorrectCount = useMemo(
    () =>
      initialQuestions.filter(
        (q) => testAnswers[q.id]?.toLowerCase() === q.correctOptionId.toLowerCase(),
      ).length,
    [initialQuestions, testAnswers],
  );
  const testIncorrectCount = totalQuestions - testCorrectCount - testUnansweredCount;
  const testScorePercent =
    totalQuestions > 0 ? Math.round((testCorrectCount / totalQuestions) * 100) : 0;

  return (
    <section className="w-full max-w-3xl">
      {/* Top Header Controls & Mode Switcher */}
      <SessionHeader
        sessionMode={sessionMode}
        setSessionMode={setSessionMode}
        isPracticeFinished={isPracticeFinished}
        isTestSubmitted={isTestSubmitted}
        attempts={attempts}
        testAnsweredCount={testAnsweredCount}
        completedUniqueCount={completedUniqueIds.length}
        totalQuestions={totalQuestions}
        testScorePercent={testScorePercent}
        timerMode={timerMode}
        setTimerMode={setTimerMode}
        timeRemaining={timeRemaining}
        setTimeRemaining={setTimeRemaining}
        setTimedOut={setTimedOut}
        timerOptions={timerOptions}
        onOpenSubmitModal={() => setShowSubmitModal(true)}
        onRestart={handleRestart}
        practiceProgressPercent={practiceProgressPercent}
        initialQuestions={initialQuestions}
        testAnswers={testAnswers}
        testCurrentIndex={testCurrentIndex}
        setTestCurrentIndex={setTestCurrentIndex}
      />

      {/* Practice Mode Content */}
      {sessionMode === "practice" && (
        <>
          {isPracticeFinished ? (
            <PracticeSummary
              timedOut={timedOut}
              completedUniqueCount={completedUniqueIds.length}
              practiceAccuracy={practiceAccuracy}
              attempts={attempts}
              requeueCounts={requeueCounts}
              onRestart={handleRestart}
              isLoading={isLoading}
              loggedIn={loggedIn}
            />
          ) : (
            queue[0] && (
              <McqCard
                key={queue[0].id}
                {...queue[0]}
                currentIndex={completedUniqueIds.length + 1}
                totalCount={totalQuestions}
                isLastQuestion={queue.length === 1}
                initialSelectedOptionId={currentAnswer}
                mode="practice"
                onAnswer={handlePracticeAnswer}
                onNext={handlePracticeNext}
              />
            )
          )}
        </>
      )}

      {/* Test Mode Content */}
      {sessionMode === "test" && (
        <>
          {!isTestSubmitted ? (
            initialQuestions[testCurrentIndex] && (
              <McqCard
                key={initialQuestions[testCurrentIndex].id}
                {...initialQuestions[testCurrentIndex]}
                currentIndex={testCurrentIndex + 1}
                totalCount={totalQuestions}
                isLastQuestion={testCurrentIndex === totalQuestions - 1}
                hasPrevious={testCurrentIndex > 0}
                initialSelectedOptionId={
                  testAnswers[initialQuestions[testCurrentIndex].id] || null
                }
                mode="test"
                onAnswer={(optId) => handleTestAnswer(optId)}
                onPrevious={() => setTestCurrentIndex((prev) => Math.max(0, prev - 1))}
                onNext={() => {
                  if (testCurrentIndex < totalQuestions - 1) {
                    setTestCurrentIndex((prev) => prev + 1);
                  } else {
                    setShowSubmitModal(true);
                  }
                }}
              />
            )
          ) : (
            <TestReviewScreen
              totalQuestions={totalQuestions}
              testScorePercent={testScorePercent}
              testCorrectCount={testCorrectCount}
              testIncorrectCount={testIncorrectCount}
              testUnansweredCount={testUnansweredCount}
              initialQuestions={initialQuestions}
              testAnswers={testAnswers}
              onRestart={handleRestart}
            />
          )}
        </>
      )}

      {/* Submit Confirmation Modal */}
      <SubmitConfirmModal
        isOpen={showSubmitModal}
        testAnsweredCount={testAnsweredCount}
        totalQuestions={totalQuestions}
        testUnansweredCount={testUnansweredCount}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleTestSubmit}
      />
    </section>
  );
}

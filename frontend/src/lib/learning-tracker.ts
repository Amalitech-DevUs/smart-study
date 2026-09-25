"use client";

export type LearningMode = "practice" | "test";

export type QuestionAttempt = {
  id: string;
  questionId: string;
  subject: string;
  subjectSlug: string;
  topic: string;
  year?: number;
  paper?: number;
  mode: LearningMode;
  isCorrect: boolean;
  selectedOptionId: string | null;
  correctOptionId: string;
  isRequeued: boolean;
  attemptNumber: number; // 1 for initial, 2+ for requeued
  timestamp: number;
  sessionId: string;
};

export type StudySessionRecord = {
  sessionId: string;
  sessionKey: string; // e.g. "mathematics-2024"
  subject: string;
  subjectSlug: string;
  year: number;
  mode: LearningMode;
  startedAt: number;
  completedAt: number;
  isCompleted: boolean;
  uniqueQuestionsTotal: number;
  uniqueQuestionsCompleted: number;
  totalAttempts: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number; // for test mode
  scorePercent: number; // for test: correct / total; for practice: unique correct / unique completed
  timeSpentSeconds?: number;
};

export type ActiveSession = {
  sessionId: string;
  sessionKey: string;
  subject: string;
  subjectSlug: string;
  year: number;
  mode: LearningMode;
  uniqueQuestionsTotal: number;
  uniqueQuestionsCompleted: number;
  lastUpdated: number;
  isFinished: boolean;
};

export type FocusAreaTopic = {
  topic: string;
  subject: string;
  subjectSlug: string;
  totalAttempts: number;
  uniqueQuestions: number;
  correctAttempts: number;
  accuracy: number; // percent 0-100
};

export type SubjectProgressData = {
  name: string;
  slug: string;
  totalAvailable: number;
  uniquePracticed: number;
  accuracy: number;
  hasData: boolean;
  accentBorder: string;
  accentBadge: string;
  accentText: string;
};

export type LearningOverviewData = {
  questionsPracticed: number; // unique questions in practice
  practiceAccuracy: number; // % on practice
  testAverage: number | null; // % on tests (null if no tests completed)
  studySessions: number;
  testsCompleted: number;
  practiceCompleted: number;
};

export type DailyGoalData = {
  completed: number;
  target: number;
  remaining: number;
  percent: number;
};

// Storage keys isolated by user
function getAttemptsKey(username?: string): string {
  const user = username ? username.toLowerCase() : "guest";
  return `smartstudy_attempts_${user}`;
}

function getSessionsKey(username?: string): string {
  const user = username ? username.toLowerCase() : "guest";
  return `smartstudy_sessions_${user}`;
}

function getActiveSessionKey(username?: string): string {
  const user = username ? username.toLowerCase() : "guest";
  return `smartstudy_active_${user}`;
}

function getSafeStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setSafeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota or disabled
  }
}

/**
 * Records an individual question attempt.
 */
export function recordQuestionAttempt(
  username: string | undefined,
  attempt: QuestionAttempt,
): void {
  const key = getAttemptsKey(username);
  const attempts = getSafeStorage<QuestionAttempt[]>(key, []);
  attempts.push(attempt);
  // Keep last 1000 attempts to avoid quota overflow
  const trimmed = attempts.length > 1000 ? attempts.slice(-1000) : attempts;
  setSafeStorage(key, trimmed);
}

/**
 * Saves current active session metadata for dashboard "Continue Learning" card.
 */
export function saveActiveSession(
  username: string | undefined,
  active: ActiveSession,
): void {
  const key = getActiveSessionKey(username);
  setSafeStorage(key, active);
}

/**
 * Clears active session once completed or restarted.
 */
export function clearActiveSession(username: string | undefined): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(getActiveSessionKey(username));
  } catch {
    // ignore
  }
}

/**
 * Retrieves the current active session if not finished.
 */
export function getActiveSession(
  username: string | undefined,
): ActiveSession | null {
  const key = getActiveSessionKey(username);
  const active = getSafeStorage<ActiveSession | null>(key, null);
  if (!active || active.isFinished) return null;
  // Expire after 30 days of inactivity
  if (Date.now() - active.lastUpdated > 30 * 24 * 60 * 60 * 1000) {
    clearActiveSession(username);
    return null;
  }
  return active;
}

/**
 * Saves a completed session record and updates active session.
 */
export function completeStudySession(
  username: string | undefined,
  record: StudySessionRecord,
): void {
  const key = getSessionsKey(username);
  const sessions = getSafeStorage<StudySessionRecord[]>(key, []);
  // Avoid duplicate session save
  const existingIdx = sessions.findIndex((s) => s.sessionId === record.sessionId);
  if (existingIdx >= 0) {
    sessions[existingIdx] = record;
  } else {
    sessions.unshift(record);
  }
  setSafeStorage(key, sessions.slice(0, 100)); // keep last 100 sessions
  clearActiveSession(username);
}

/**
 * Gets the learning overview metrics:
 * - Questions Practiced (unique)
 * - Practice Accuracy (%)
 * - Test Average (%)
 * - Study Sessions count
 */
export function getLearningOverview(
  username: string | undefined,
): LearningOverviewData {
  const attemptsKey = getAttemptsKey(username);
  const sessionsKey = getSessionsKey(username);

  const attempts = getSafeStorage<QuestionAttempt[]>(attemptsKey, []);
  const sessions = getSafeStorage<StudySessionRecord[]>(sessionsKey, []);

  // Filter practice attempts
  const practiceAttempts = attempts.filter((a) => a.mode === "practice");
  const uniquePracticeQuestions = new Set(practiceAttempts.map((a) => a.questionId));

  // Practice accuracy: correct practice attempts / total practice attempts
  const practiceCorrect = practiceAttempts.filter((a) => a.isCorrect).length;
  const practiceAccuracy =
    practiceAttempts.length > 0
      ? Math.round((practiceCorrect / practiceAttempts.length) * 100)
      : 0;

  // Completed tests average
  const testSessions = sessions.filter((s) => s.mode === "test" && s.isCompleted);
  let testAverage: number | null = null;
  if (testSessions.length > 0) {
    const totalScore = testSessions.reduce((acc, curr) => acc + curr.scorePercent, 0);
    testAverage = Math.round(totalScore / testSessions.length);
  }

  return {
    questionsPracticed: uniquePracticeQuestions.size,
    practiceAccuracy,
    testAverage,
    studySessions: sessions.length,
    testsCompleted: testSessions.length,
    practiceCompleted: sessions.filter((s) => s.mode === "practice" && s.isCompleted).length,
  };
}

/**
 * Calculates subject-level progress from real user attempts.
 */
export function getSubjectProgress(
  username: string | undefined,
): SubjectProgressData[] {
  const attemptsKey = getAttemptsKey(username);
  const attempts = getSafeStorage<QuestionAttempt[]>(attemptsKey, []);

  const subjectsConfig = [
    {
      name: "Mathematics",
      slug: "mathematics",
      totalAvailable: 280,
      accentBorder: "border-l-[#1e7e4e]",
      accentBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accentText: "text-emerald-700",
    },
    {
      name: "English Language",
      slug: "english",
      totalAvailable: 280,
      accentBorder: "border-l-[#c0392b]",
      accentBadge: "bg-rose-50 text-rose-700 border-rose-200",
      accentText: "text-rose-700",
    },
    {
      name: "Integrated Science",
      slug: "science",
      totalAvailable: 60,
      accentBorder: "border-l-[#f5a623]",
      accentBadge: "bg-amber-50 text-amber-700 border-amber-200",
      accentText: "text-amber-700",
    },
    {
      name: "Social Studies",
      slug: "social-studies",
      totalAvailable: 196,
      accentBorder: "border-l-[#0e1726]",
      accentBadge: "bg-slate-100 text-slate-700 border-slate-200",
      accentText: "text-slate-700",
    },
    {
      name: "French",
      slug: "french",
      totalAvailable: 40,
      accentBorder: "border-l-[#2563eb]",
      accentBadge: "bg-blue-50 text-blue-700 border-blue-200",
      accentText: "text-blue-700",
    },
  ];

  return subjectsConfig.map((subj) => {
    const subjAttempts = attempts.filter(
      (a) =>
        a.subjectSlug.toLowerCase() === subj.slug.toLowerCase() ||
        a.subject.toLowerCase().includes(subj.slug.toLowerCase()),
    );
    const uniqueIds = new Set(subjAttempts.map((a) => a.questionId));
    const correctCount = subjAttempts.filter((a) => a.isCorrect).length;
    const accuracy =
      subjAttempts.length > 0
        ? Math.round((correctCount / subjAttempts.length) * 100)
        : 0;

    return {
      name: subj.name,
      slug: subj.slug,
      totalAvailable: subj.totalAvailable,
      uniquePracticed: uniqueIds.size,
      accuracy,
      hasData: subjAttempts.length > 0,
      accentBorder: subj.accentBorder,
      accentBadge: subj.accentBadge,
      accentText: subj.accentText,
    };
  });
}

/**
 * Calculates focus areas (weak topics) based on actual mistakes.
 * Evidence threshold: at least 10 scored attempts across at least 3 unique questions.
 * Only returns topics with accuracy below 75%, sorted by lowest accuracy first.
 */
export function getFocusAreas(username: string | undefined): FocusAreaTopic[] {
  const attemptsKey = getAttemptsKey(username);
  const attempts = getSafeStorage<QuestionAttempt[]>(attemptsKey, []);

  // Group attempts by topic
  const topicMap = new Map<
    string,
    {
      subject: string;
      subjectSlug: string;
      attempts: QuestionAttempt[];
    }
  >();

  for (const a of attempts) {
    if (!a.topic || a.topic === "Objective Test") continue;
    const key = `${a.subjectSlug}:::${a.topic}`;
    if (!topicMap.has(key)) {
      topicMap.set(key, {
        subject: a.subject,
        subjectSlug: a.subjectSlug,
        attempts: [],
      });
    }
    topicMap.get(key)!.attempts.push(a);
  }

  const focusAreas: FocusAreaTopic[] = [];

  topicMap.forEach((data, key) => {
    const topic = key.split(":::")[1];
    const totalAttempts = data.attempts.length;
    const uniqueQuestions = new Set(data.attempts.map((x) => x.questionId)).size;

    // Minimum evidence threshold: >= 10 attempts AND >= 3 unique questions
    if (totalAttempts >= 10 && uniqueQuestions >= 3) {
      const correctCount = data.attempts.filter((x) => x.isCorrect).length;
      const accuracy = Math.round((correctCount / totalAttempts) * 100);

      // Only flag topics with accuracy below 75%
      if (accuracy < 75) {
        focusAreas.push({
          topic,
          subject: data.subject,
          subjectSlug: data.subjectSlug,
          totalAttempts,
          uniqueQuestions,
          correctAttempts: correctCount,
          accuracy,
        });
      }
    }
  });

  // Sort by lowest accuracy first
  focusAreas.sort((a, b) => a.accuracy - b.accuracy);
  return focusAreas.slice(0, 5);
}

/**
 * Gets real chronological recent activity list.
 */
export function getRecentActivity(
  username: string | undefined,
): StudySessionRecord[] {
  const sessionsKey = getSessionsKey(username);
  const sessions = getSafeStorage<StudySessionRecord[]>(sessionsKey, []);
  return sessions.sort((a, b) => b.completedAt - a.completedAt).slice(0, 5);
}

function getGoalTargetKey(username?: string): string {
  const user = username ? username.toLowerCase() : "guest";
  return `smartstudy_goal_target_${user}`;
}

export function setDailyGoalTarget(username: string | undefined, target: number): void {
  if (typeof window === "undefined") return;
  const key = getGoalTargetKey(username);
  localStorage.setItem(key, JSON.stringify(target));
  window.dispatchEvent(new Event("storage"));
}

/**
 * Gets today's goal metrics based on unique questions completed today.
 */
export function getDailyGoal(username: string | undefined): DailyGoalData {
  const attemptsKey = getAttemptsKey(username);
  const attempts = getSafeStorage<QuestionAttempt[]>(attemptsKey, []);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayTimestamp = todayStart.getTime();

  const todayUniqueQuestions = new Set<string>();
  for (const a of attempts) {
    if (a.timestamp >= todayTimestamp) {
      todayUniqueQuestions.add(a.questionId);
    }
  }

  const completed = todayUniqueQuestions.size;
  const target = getSafeStorage<number>(getGoalTargetKey(username), 20);
  const remaining = Math.max(0, target - completed);
  const percent = Math.min(100, Math.round((completed / Math.max(1, target)) * 100));

  return { completed, target, remaining, percent };
}

/**
 * Calculates consecutive active study days.
 */
export function getStudyStreak(username: string | undefined): number {
  const attemptsKey = getAttemptsKey(username);
  const attempts = getSafeStorage<QuestionAttempt[]>(attemptsKey, []);

  if (attempts.length === 0) return 0;

  // Set of dates in YYYY-MM-DD format
  const activeDates = new Set<string>();
  for (const a of attempts) {
    const d = new Date(a.timestamp);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    activeDates.add(dateStr);
  }

  let streak = 0;
  const checkDate = new Date();

  // Check today or yesterday as current streak head
  const todayStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;
  if (!activeDates.has(todayStr)) {
    // If not studied today yet, check yesterday
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const str = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;
    if (activeDates.has(str)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

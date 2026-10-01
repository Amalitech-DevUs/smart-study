"use client";

import { useState, useEffect } from "react";
import {
  getActiveSession,
  getLearningOverview,
  getSubjectProgress,
  getFocusAreas,
  getRecentActivity,
  getDailyGoal,
  getStudyStreak,
  getStudiedDates,
  setDailyGoalTarget,
  getPerformanceTiers,
  fetchUserProgress,
  type ActiveSession,
  type LearningOverviewData,
  type SubjectProgressData,
  type FocusAreaTopic,
  type StudySessionRecord,
  type DailyGoalData,
  type PerformanceDistributionData,
} from "@/lib/learning-tracker";

export type DashboardData = {
  activeSession: ActiveSession | null;
  overview: LearningOverviewData;
  subjectProgress: SubjectProgressData[];
  focusAreas: FocusAreaTopic[];
  recentActivity: StudySessionRecord[];
  dailyGoal: DailyGoalData;
  streak: number;
  studiedDates: Set<string>;
  performanceDistribution: PerformanceDistributionData;
};

const INITIAL_OVERVIEW: LearningOverviewData = {
  questionsPracticed: 0,
  practiceAccuracy: 0,
  testAverage: null,
  studySessions: 0,
  testsCompleted: 0,
  practiceCompleted: 0,
};

const INITIAL_DAILY_GOAL: DailyGoalData = {
  completed: 0,
  target: 20,
  remaining: 20,
  percent: 0,
};

const INITIAL_PERFORMANCE: PerformanceDistributionData = {
  overallPercent: 0,
  hasData: false,
  totalEvaluated: 0,
  tiers: [
    { label: "Excellent (75%+)", count: 0, percent: 0, color: "#10b981", dotBg: "bg-emerald-500" },
    { label: "Good (60-74%)", count: 0, percent: 0, color: "#3b82f6", dotBg: "bg-blue-500" },
    { label: "Average (50-59%)", count: 0, percent: 0, color: "#f59e0b", dotBg: "bg-amber-500" },
    { label: "Needs Improvement (<50%)", count: 0, percent: 0, color: "#f43f5e", dotBg: "bg-rose-500" },
  ],
};

/**
 * Loads and refreshes all dashboard data from localStorage (learning-tracker).
 * Automatically re-fetches when another tab writes to storage.
 */
export function useDashboardData(
  username: string | undefined,
  isAuthLoading: boolean,
): DashboardData & { handleTargetChange: (target: number) => void } {
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [overview, setOverview] = useState<LearningOverviewData>(INITIAL_OVERVIEW);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgressData[]>([]);
  const [focusAreas, setFocusAreas] = useState<FocusAreaTopic[]>([]);
  const [recentActivity, setRecentActivity] = useState<StudySessionRecord[]>([]);
  const [dailyGoal, setDailyGoal] = useState<DailyGoalData>(INITIAL_DAILY_GOAL);
  const [streak, setStreak] = useState<number>(0);
  const [studiedDates, setStudiedDates] = useState<Set<string>>(new Set());
  const [performanceDistribution, setPerformanceDistribution] =
    useState<PerformanceDistributionData>(INITIAL_PERFORMANCE);

  useEffect(() => {
    if (isAuthLoading || typeof window === "undefined") return;

    const loadData = () => {
      setActiveSession(getActiveSession(username));
      setOverview(getLearningOverview(username));
      setSubjectProgress(getSubjectProgress(username));
      setFocusAreas(getFocusAreas(username));
      setRecentActivity(getRecentActivity(username));
      setDailyGoal(getDailyGoal(username));
      setStreak(getStudyStreak(username));
      setStudiedDates(getStudiedDates(username));
      setPerformanceDistribution(getPerformanceTiers(username));
    };

    loadData();
    window.addEventListener("storage", loadData);

    if (username) {
      fetchUserProgress(username).catch(() => {});
    }

    return () => window.removeEventListener("storage", loadData);
  }, [username, isAuthLoading]);

  const handleTargetChange = (newTarget: number) => {
    setDailyGoalTarget(username, newTarget);
    setDailyGoal(getDailyGoal(username));
  };

  return {
    activeSession,
    overview,
    subjectProgress,
    focusAreas,
    recentActivity,
    dailyGoal,
    streak,
    studiedDates,
    performanceDistribution,
    handleTargetChange,
  };
}

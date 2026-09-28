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
  setDailyGoalTarget,
  type ActiveSession,
  type LearningOverviewData,
  type SubjectProgressData,
  type FocusAreaTopic,
  type StudySessionRecord,
  type DailyGoalData,
} from "@/lib/learning-tracker";

export type DashboardData = {
  activeSession: ActiveSession | null;
  overview: LearningOverviewData;
  subjectProgress: SubjectProgressData[];
  focusAreas: FocusAreaTopic[];
  recentActivity: StudySessionRecord[];
  dailyGoal: DailyGoalData;
  streak: number;
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
    };

    loadData();
    window.addEventListener("storage", loadData);
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
    handleTargetChange,
  };
}

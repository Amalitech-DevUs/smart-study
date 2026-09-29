"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RequireAuth } from "@/components/shared/require-auth";
import { useAuth } from "@/lib/use-auth";
import { ArrowLeft } from "lucide-react";
import {
  getLearningOverview,
  getStudyStreak,
  type LearningOverviewData,
} from "@/lib/learning-tracker";
import { ProfileIdentitySection } from "@/components/profile/ProfileIdentitySection";
import { AccountInfoSection } from "@/components/profile/AccountInfoSection";
import { ProfileLearningSection } from "@/components/profile/ProfileLearningSection";
import { ProfileResourcesSection } from "@/components/profile/ProfileResourcesSection";

export default function ProfilePage() {
  const { username, isLoading: isAuthLoading } = useAuth();
  const [overview, setOverview] = useState<LearningOverviewData>({
    questionsPracticed: 0,
    practiceAccuracy: 0,
    testAverage: null,
    studySessions: 0,
    testsCompleted: 0,
    practiceCompleted: 0,
  });
  const [streak, setStreak] = useState<number>(0);

  // Load real learning data for the authenticated user
  useEffect(() => {
    if (isAuthLoading || typeof window === "undefined") return;

    const loadData = () => {
      setOverview(getLearningOverview(username));
      setStreak(getStudyStreak(username));
    };

    loadData();

    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, [username, isAuthLoading]);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
        {/* Page header — matches dashboard strip style, no duplicate logout */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto max-w-2xl px-4 py-3.5 sm:px-6 flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>
            <h1 className="font-heading text-sm font-bold text-slate-900 flex-1 text-center sm:text-left">
              Account Profile
            </h1>
          </div>
        </header>

        {/* Main content — md:pb-20 prevents FAB from overlapping the last card */}
        <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 space-y-5 md:pb-20">
          {/* 1. Student Identity Section */}
          <ProfileIdentitySection username={username} streak={streak} />

          {/* 2. Account Information Section */}
          <AccountInfoSection username={username} />

          {/* 3. My Learning Metrics Section */}
          <ProfileLearningSection overview={overview} />

          {/* 4. Question Bank & Study Resources */}
          <ProfileResourcesSection />
        </main>
      </div>
    </RequireAuth>
  );
}

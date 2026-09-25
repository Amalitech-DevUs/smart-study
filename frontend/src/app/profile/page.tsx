"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RequireAuth } from "@/components/shared/require-auth";
import { useAuth } from "@/lib/use-auth";
import { ArrowLeft, LogOut } from "lucide-react";
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
  const { username, logout, isLoading: isAuthLoading } = useAuth();
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
      <div className="min-h-screen bg-[#f8f9fa] text-slate-900 pb-16">
        {/* Simple Utility Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>

            <h1 className="font-heading text-sm font-bold text-slate-800">
              Account Profile
            </h1>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 space-y-5">
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

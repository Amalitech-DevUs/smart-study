"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { RequireAuth } from "@/components/shared/require-auth";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { MetricKpiCards } from "@/components/dashboard/MetricKpiCards";
import { RecentResultsTable } from "@/components/dashboard/RecentResultsTable";
import { NoticeBoardCard } from "@/components/dashboard/NoticeBoardCard";
import { StudyCalendarCard } from "@/components/dashboard/StudyCalendarCard";
import { QuickAccessGrid } from "@/components/dashboard/QuickAccessGrid";
import { PerformanceOverviewCard } from "@/components/dashboard/PerformanceOverviewCard";
import { ContinueLearning } from "@/components/dashboard/ContinueLearning";
import { SubjectsSection } from "@/components/dashboard/SubjectsSection";
import { FocusAreas } from "@/components/dashboard/FocusAreas";

export default function DashboardPage() {
  const { username, isLoading: isAuthLoading } = useAuth();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Load real user data and handle target changes
  const {
    activeSession,
    overview,
    subjectProgress,
    focusAreas,
    recentActivity,
    dailyGoal,
    streak,
  } = useDashboardData(username, isAuthLoading);

  // Scroll to top button visibility listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#f4f6fa] text-slate-900 pb-16">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Top Bar: Search + Notification Bell + User Avatar Greeting */}
          <DashboardHeader
            username={username}
            streak={streak}
            dailyGoal={dailyGoal}
          />

          {/* Hero Welcome Banner */}
          <WelcomeBanner username={username} />

          {/* 5 KPI Metric Cards */}
          <MetricKpiCards
            overview={overview}
            dailyGoal={dailyGoal}
            streak={streak}
            subjectCount={subjectProgress.length || 4}
          />

          {/* Continue Learning Banner if active exam is in progress */}
          {activeSession && (
            <div className="mb-6">
              <ContinueLearning session={activeSession} />
            </div>
          )}

          {/* Middle Row: Recent Results Table (65%) + Notice Board (35%) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch mb-6">
            <div className="lg:col-span-8">
              <RecentResultsTable recentActivity={recentActivity} />
            </div>
            <div id="notices" className="lg:col-span-4 scroll-mt-24">
              <NoticeBoardCard />
            </div>
          </div>

          {/* Bottom Row: Academic Calendar (33%) + Quick Access (33%) + Performance Donut (33%) */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch mb-8">
            <div id="calendar" className="flex flex-col scroll-mt-24">
              <StudyCalendarCard streak={streak} />
            </div>
            <div className="flex flex-col">
              <QuickAccessGrid />
            </div>
            <div id="performance" className="flex flex-col scroll-mt-24">
              <PerformanceOverviewCard overview={overview} />
            </div>
          </div>

          {/* Core Examination Subjects Practice Cards */}
          <div className="mt-8 pt-6 border-t border-slate-200/80">
            <SubjectsSection subjects={subjectProgress} />
          </div>

          {/* Focus Areas (Weak Topics) */}
          {focusAreas && focusAreas.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200/80">
              <FocusAreas focusAreas={focusAreas} />
            </div>
          )}
        </main>

        {/* Back to top button */}
        {showBackToTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-all hover:bg-slate-50 hover:scale-105 active:scale-95"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </div>
    </RequireAuth>
  );
}

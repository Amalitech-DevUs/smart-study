"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/shared/require-auth";
import { AppLogoBadge } from "@/components/shared/app-logo";
import { useAuth } from "@/lib/use-auth";
import { LogOut, User, Sparkles, BookOpen, MessageSquare, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { username } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  return (
    <RequireAuth>
      <main className="min-h-screen bg-white text-slate-900 flex flex-col">
        {/* Top Header Bar */}
        <header className="w-full border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          {/* Top Left: Log Out Action */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-xs"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </button>

          {/* Top Right: Profile link */}
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-xs"
          >
            <User className="h-4 w-4 text-slate-500" />
            <span>{username || "Profile"}</span>
          </Link>
        </header>

        {/* Clean Center Content: White Screen with AI Icon and Quick Access */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto">
          {/* Official AI / Cap Badge */}
          <div className="relative">
            <AppLogoBadge size="lg" />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
              <span className="h-2 w-2 rounded-full bg-white" />
            </span>
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>SmartStudy AI Tutor</span>
          </div>

          <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
            Welcome back, {username || "Student"}!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md">
            Your personalized BECE revision workspace. Choose where you would like to continue your revision:
          </p>

          {/* Quick Access Tiles */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
            <Link
              href="/chat"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-900 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white group-hover:bg-[#0e1726]">
                  <MessageSquare className="h-5 w-5 text-amber-400" />
                </div>
                <h2 className="mt-3 font-heading text-sm font-bold text-slate-900">
                  AI Study Companion
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Ask any BECE question or get step-by-step guidance.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                <span>Start Chat</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            <Link
              href="/flashcards"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-900 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-200">
                  <BookOpen className="h-5 w-5 text-slate-800" />
                </div>
                <h2 className="mt-3 font-heading text-sm font-bold text-slate-900">
                  Past Question Papers
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Solve 800+ official WAEC questions with instant grading.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                <span>Practice Papers</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}

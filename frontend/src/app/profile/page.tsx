"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/shared/require-auth";
import { useAuth } from "@/lib/use-auth";
import { LogOut, ArrowLeft, User as UserIcon, Shield, CheckCircle2, Calendar, BookOpen } from "lucide-react";

export default function ProfilePage() {
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
      <main className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header Navigation */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </button>
          </div>

          {/* Profile Card */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white font-heading text-xl font-bold">
                {username ? username.slice(0, 2).toUpperCase() : "ST"}
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-slate-900">
                  {username || "Student"}
                </h1>
                <p className="text-xs text-slate-500">BECE Candidate • Ghana</p>
                <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Active Student Account</span>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-6 text-left">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  <span>Username</span>
                </div>
                <p className="mt-1.5 font-heading text-sm font-bold text-slate-900">
                  {username || "Not set"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <Shield className="h-4 w-4 text-slate-400" />
                  <span>Security PIN</span>
                </div>
                <p className="mt-1.5 font-heading text-sm font-bold text-slate-900">
                  ••••••
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Exam Target</span>
                </div>
                <p className="mt-1.5 font-heading text-sm font-bold text-slate-900">
                  BECE 2026
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  <span>Syllabus Covered</span>
                </div>
                <p className="mt-1.5 font-heading text-sm font-bold text-slate-900">
                  Core Subjects (JHS 1 - 3)
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t border-slate-100">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <span>Go to AI Tutor</span>
              </Link>
              <Link
                href="/flashcards"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>Practice Questions</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}

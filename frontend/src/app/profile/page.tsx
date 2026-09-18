"use client";

import Link from "next/link";
import { RequireAuth } from "@/components/shared/require-auth";
import { useAuth } from "@/lib/use-auth";
import {
  LogOut,
  ArrowLeft,
  Shield,
  Calendar,
  BookOpen,
  MessageSquare,
  ChevronRight,
  GraduationCap,
  Award,
} from "lucide-react";

export default function ProfilePage() {
  const { username, logout } = useAuth();

  const initials = username ? username.slice(0, 2).toUpperCase() : "ST";

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#f8f9fc]">
        {/* Top nav bar */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3.5 sm:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </Link>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-1.5 text-xs font-semibold text-slate-500 transition-all hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </button>
        </header>

        <main className="mx-auto max-w-2xl px-5 py-8 sm:px-8 sm:py-10">
          {/* Profile hero card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Navy header strip */}
            <div className="h-20 bg-gradient-to-r from-[#0e1726] to-slate-700" />

            {/* Avatar + info (overlaps strip) */}
            <div className="px-6 pb-6 sm:px-8 sm:pb-8">
              <div className="-mt-10 flex items-end justify-between">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-[#0e1726] font-heading text-xl font-extrabold text-white shadow-md">
                  {initials}
                </div>
                <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active Account
                </div>
              </div>

              <div className="mt-3">
                <h1 className="font-heading text-xl font-extrabold text-slate-900">
                  {username || "Student"}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  BECE Candidate · Ghana
                </p>
              </div>

              {/* Detail grid */}
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-6">
                {[
                  {
                    icon: GraduationCap,
                    label: "Username",
                    value: username || "Not set",
                  },
                  {
                    icon: Shield,
                    label: "Security PIN",
                    value: "••••••",
                  },
                  {
                    icon: Calendar,
                    label: "Exam Target",
                    value: "BECE 2026",
                  },
                  {
                    icon: BookOpen,
                    label: "Syllabus",
                    value: "JHS 1 – 3",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <Icon className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-400">{label}</p>
                      <p className="mt-0.5 text-sm font-bold text-slate-900">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Achievement strip */}
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3">
                <Award className="h-5 w-5 text-amber-500 shrink-0" />
                <p className="text-xs text-amber-800">
                  <strong>853+ questions</strong> available across 5 subjects and 7 years of WAEC papers.
                </p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2">
            <Link
              href="/chat"
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="h-4 w-4 text-amber-500" />
                <span>AI Tutor</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/flashcards"
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-4 w-4 text-slate-600" />
                <span>Practice</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}

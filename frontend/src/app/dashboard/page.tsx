"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RequireAuth } from "@/components/shared/require-auth";
import { useAuth } from "@/lib/use-auth";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  BookOpen,
  FileText,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ArrowUp,
  Flame,
  Target,
} from "lucide-react";

export default function DashboardPage() {
  const { username } = useAuth();
  const [showBackToTop, setShowBackToTop] = useState(false);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  // Monitor scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 240) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <RequireAuth>
      <div className="flex min-h-screen flex-col bg-[#f8f9fc]">
        {/* ── Main Dashboard Content ── */}
        <main className="flex-1 px-5 py-8 sm:px-8 sm:py-10">
          <div className="mx-auto max-w-3xl">

            {/* Welcome Section */}
            <ScrollReveal delay={0.04} direction="down">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {greeting}
                </p>
                <h1 className="mt-1.5 font-heading text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  {username || "Student"} 👋
                </h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  Your BECE revision workspace. Pick up where you left off.
                </p>
              </div>
            </ScrollReveal>

            {/* Stats Strip */}
            <ScrollReveal delay={0.08} direction="scale">
              <div className="mb-8 grid grid-cols-3 divide-x divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                {[
                  { label: "Questions", value: "853+" },
                  { label: "Subjects", value: "5" },
                  { label: "Exam Years", value: "7" },
                ].map((stat) => (
                  <div key={stat.label} className="px-5 py-4 text-center">
                    <p className="font-heading text-xl font-extrabold text-slate-900">{stat.value}</p>
                    <p className="mt-0.5 text-[11px] font-medium text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Quick Action Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* AI Tutor Card */}
              <ScrollReveal delay={0.12} direction="left">
                <Link
                  href="/chat"
                  className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-[#0e1726] p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
                      <MessageSquare className="h-5 w-5 text-amber-400" />
                    </div>
                    <h2 className="mt-4 font-heading text-base font-bold text-white">
                      AI Study Companion
                    </h2>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                      Ask any BECE question. Get step-by-step explanations in plain English.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-amber-400 transition-colors group-hover:text-amber-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Open Tutor</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </ScrollReveal>

              {/* Past Papers Card */}
              <ScrollReveal delay={0.16} direction="right">
                <Link
                  href="/flashcards"
                  className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-slate-200">
                      <BookOpen className="h-5 w-5 text-slate-700" />
                    </div>
                    <h2 className="mt-4 font-heading text-base font-bold text-slate-900">
                      Past Question Papers
                    </h2>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                      Solve 853+ official WAEC questions with instant grading and explanations.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-1 text-xs font-bold text-slate-700 transition-colors group-hover:text-slate-900">
                    <span>Practice now</span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </ScrollReveal>

              {/* Study Guides Card — Full width */}
              <div className="sm:col-span-2">
                <ScrollReveal delay={0.2} direction="up">
                  <Link
                    href="/articles"
                    className="group flex flex-col justify-between rounded-2xl border border-amber-200 bg-amber-50/60 p-6 transition-all hover:border-amber-300 hover:bg-amber-50 hover:shadow-sm active:scale-[0.99]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 transition-colors group-hover:bg-amber-200">
                        <FileText className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <h2 className="font-heading text-base font-bold text-slate-900">
                          Revision Guides &amp; Study Notes
                        </h2>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">
                          Subject breakdowns, key formulas, and exam strategies for BECE candidates.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-800 transition-colors group-hover:text-amber-900">
                      <span>Read guides</span>
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </ScrollReveal>
              </div>
            </div>

            {/* Subject Quick-Links Section */}
            <div className="mt-8">
              <ScrollReveal delay={0.24} direction="down">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Jump to subject
                </p>
              </ScrollReveal>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { name: "Mathematics", slug: "mathematics", color: "border-l-[#1e7e4e] hover:bg-emerald-50" },
                  { name: "English", slug: "english", color: "border-l-[#c0392b] hover:bg-rose-50" },
                  { name: "Science", slug: "science", color: "border-l-[#f5a623] hover:bg-amber-50" },
                  { name: "Social Studies", slug: "social-studies", color: "border-l-[#0e1726] hover:bg-slate-100" },
                ].map((subj, idx) => (
                  <ScrollReveal key={subj.slug} delay={0.26 + idx * 0.04} direction="up">
                    <Link
                      href={`/flashcards/${subj.slug}`}
                      className={`flex items-center justify-between rounded-lg border border-l-4 border-slate-200 bg-white px-3.5 py-3 text-xs font-semibold text-slate-700 transition-all hover:shadow-sm ${subj.color}`}
                    >
                      <span className="truncate">{subj.name}</span>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Daily Target / Motivation Banner */}
            <ScrollReveal delay={0.36} direction="scale">
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-slate-900">
                      Daily Revision Goal: 20 Questions
                    </h3>
                    <p className="text-xs text-slate-500">
                      Consistent daily MCQ practice builds WAEC exam timing and speed.
                    </p>
                  </div>
                </div>

                <Link
                  href="/flashcards/mathematics"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0e1726] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
                >
                  <Target className="h-3.5 w-3.5 text-amber-400" />
                  <span>Start Practice</span>
                </Link>
              </div>
            </ScrollReveal>

          </div>
        </main>
      </div>

      {/* ── Floating Animated Back to Top Button ── */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-colors hover:bg-slate-100 hover:text-slate-950"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </RequireAuth>
  );
}

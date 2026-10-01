"use client";

import React from "react";
import Link from "next/link";
import { Zap, GraduationCap, Layers, BookOpenCheck, ArrowRight, PlayCircle, BookOpen } from "lucide-react";
import type { ActiveSession } from "@/lib/learning-tracker";

type Props = {
  activeSession?: ActiveSession | null;
};

export function QuickAccessGrid({ activeSession }: Props) {
  const resumeUrl = activeSession
    ? `/flashcards/${activeSession.subjectSlug}/${activeSession.year}?mode=${activeSession.mode}`
    : `/flashcards/mathematics/2024?mode=practice`;

  const resumeProgress = activeSession
    ? Math.min(100, Math.round((activeSession.uniqueQuestionsCompleted / Math.max(1, activeSession.uniqueQuestionsTotal)) * 100))
    : 0;

  const tools = [
    {
      title: "Ask AI Tutor",
      desc: "Step-by-step explanations and formula help",
      href: "/chat",
      icon: GraduationCap,
      badge: "24/7",
      cta: "Chat Now",
    },
    {
      title: "Revision Cards",
      desc: "Practice questions across all 9 BECE subjects",
      href: "/flashcards",
      icon: Layers,
      badge: "9 Subjects",
      cta: "Open Cards",
    },
    {
      title: activeSession ? "New Mock Exam" : "Start Mock Exam",
      desc: activeSession ? "Pick a new subject to test" : "Timed past paper with instant grading",
      href: "/flashcards",
      icon: activeSession ? BookOpen : Zap,
      badge: "Recommended",
      cta: activeSession ? "Browse" : "Start Test",
    },
    {
      title: "Revision Notes",
      desc: "WAEC curriculum guides and model answers",
      href: "/articles",
      icon: BookOpenCheck,
      badge: "Curated",
      cta: "Read Notes",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs h-full flex flex-col">
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">Quick Access</h3>
          <p className="text-[11px] text-slate-500">Actionable study tools for fast revision</p>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          High-Yield
        </span>
      </div>

      {/* ── Consolidated Resume Session hero card (replaces standalone ContinueLearning banner) ── */}
      {activeSession && (
        <div className="mt-3 mb-2 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-50/60 p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                <PlayCircle className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-heading text-xs font-bold text-slate-900 truncate">
                    {activeSession.subject} — {activeSession.year} BECE
                  </p>
                  <span className="shrink-0 rounded-md bg-amber-100 border border-amber-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700">
                    {activeSession.mode === "practice" ? "Practice" : "Test"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {activeSession.uniqueQuestionsCompleted} / {activeSession.uniqueQuestionsTotal} questions &bull; {resumeProgress}% done
                </p>
              </div>
            </div>
            <Link
              href={resumeUrl}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-slate-700 transition-colors"
            >
              Resume
              <ArrowRight className="h-3 w-3 text-amber-400" />
            </Link>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-amber-200/80">
            <div
              className="h-full rounded-full bg-slate-900 transition-all duration-500"
              style={{ width: `${resumeProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* ── 2×2 tool cards grid ── */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mt-3 flex-1 content-start">
        {tools.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              href={c.href}
              className="group flex flex-col justify-between p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-900 hover:bg-slate-50/50 transition-all duration-150 shadow-2xs hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
                  <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-slate-900 text-white shadow-2xs transition-transform group-hover:scale-105">
                    <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </div>
                  <span className="rounded-md border border-slate-200 bg-slate-100 px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-600">
                    {c.badge}
                  </span>
                </div>
                <h4 className="font-heading text-[10px] sm:text-[11px] font-bold text-slate-900 group-hover:text-slate-800 transition-colors leading-snug">
                  {c.title}
                </h4>
                <p className="text-[9px] sm:text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                  {c.desc}
                </p>
              </div>

              <div className="mt-2 pt-1.5 sm:pt-2 border-t border-slate-100/80 flex items-center justify-between text-[9px] sm:text-[10px] font-semibold text-slate-700 group-hover:text-slate-950">
                <span>{c.cta}</span>
                <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}


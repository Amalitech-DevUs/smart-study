"use client";

import React from "react";
import Link from "next/link";
import { Zap, Bot, Layers, BookOpenCheck, ArrowRight, PlayCircle } from "lucide-react";
import type { ActiveSession } from "@/lib/learning-tracker";

type Props = {
  activeSession?: ActiveSession | null;
};

export function QuickAccessGrid({ activeSession }: Props) {
  const resumeUrl = activeSession
    ? `/flashcards/${activeSession.subjectSlug}/${activeSession.year}?mode=${activeSession.mode}`
    : `/flashcards/mathematics/2024?mode=practice`;

  const cards = [
    {
      title: activeSession ? "Resume Session" : "Start Mock Exam",
      desc: activeSession
        ? `${activeSession.subject} • ${activeSession.uniqueQuestionsCompleted}/${activeSession.uniqueQuestionsTotal} completed`
        : "Timed past paper simulation with instant results",
      href: resumeUrl,
      icon: activeSession ? PlayCircle : Zap,
      badge: activeSession ? "In Progress" : "Recommended",
      badgeClass: activeSession
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-emerald-50 text-emerald-700 border-emerald-200",
      cta: activeSession ? "Continue" : "Start Test",
      accent: "border-slate-200 hover:border-slate-900 bg-white hover:bg-slate-50/60",
      iconBg: "bg-slate-900 text-white",
    },
    {
      title: "Ask AI Tutor",
      desc: "Get instant step-by-step explanations and math formulas",
      href: "/chat",
      icon: Bot,
      badge: "24/7 Companion",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
      cta: "Chat Tutor",
      accent: "border-slate-200 hover:border-blue-600 bg-white hover:bg-blue-50/30",
      iconBg: "bg-blue-600 text-white",
    },
    {
      title: "Revision Flashcards",
      desc: "Practice key concepts and questions across 8 subjects",
      href: "/flashcards",
      icon: Layers,
      badge: "8 Subjects",
      badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
      cta: "Open Cards",
      accent: "border-slate-200 hover:border-purple-600 bg-white hover:bg-purple-50/30",
      iconBg: "bg-purple-600 text-white",
    },
    {
      title: "Revision Notes",
      desc: "WAEC curriculum summaries, guides and model answers",
      href: "/articles",
      icon: BookOpenCheck,
      badge: "Curated",
      badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
      cta: "Read Notes",
      accent: "border-slate-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/30",
      iconBg: "bg-emerald-700 text-white",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs h-full flex flex-col justify-between">
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">Quick Access</h3>
          <p className="text-[11px] text-slate-500">Actionable study tools for fast revision</p>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          High-Yield
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 flex-1 content-start">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              href={c.href}
              className={`group flex flex-col justify-between p-3.5 rounded-xl border transition-all duration-150 ${c.accent} shadow-2xs hover:shadow-xs`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-2xs transition-transform group-hover:scale-105 ${c.iconBg}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className={`rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${c.badgeClass}`}
                  >
                    {c.badge}
                  </span>
                </div>
                <h4 className="font-heading text-xs font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                  {c.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                  {c.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px] font-semibold text-slate-700 group-hover:text-slate-950">
                <span>{c.cta}</span>
                <ArrowRight className="h-3 w-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

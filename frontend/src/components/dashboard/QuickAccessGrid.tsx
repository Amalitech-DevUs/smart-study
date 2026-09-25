"use client";

import React from "react";
import Link from "next/link";
import { FileText, BookOpen, Bot, Award, Newspaper, MessageSquare } from "lucide-react";

export function QuickAccessGrid() {
  const actions = [
    { label: "My Results",     href: "/flashcards",            icon: FileText,      dark: true  },
    { label: "My Courses",     href: "/flashcards",            icon: BookOpen,      dark: false },
    { label: "AI Tutor",       href: "/chat",                  icon: Bot,           dark: true  },
    { label: "Practice Test",  href: "/flashcards/mathematics",icon: Award,         dark: false },
    { label: "Revision Notes", href: "/articles",              icon: Newspaper,     dark: true  },
    { label: "Ask Question",   href: "/chat",                  icon: MessageSquare, dark: false },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs h-full flex flex-col">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="font-heading text-base font-bold text-slate-900">Quick Access</h3>
        <p className="text-[11px] text-slate-500">Jump directly to your revision tools</p>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mt-3 flex-1 content-start">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.label}
              href={act.href}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition-all hover:scale-[1.02] text-center group"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-2xs ${
                act.dark
                  ? "bg-[#0e1726] text-white"
                  : "bg-slate-200 text-slate-700"
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors leading-tight">
                {act.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { BookOpen, Bot, Clock, FileText, ChevronRight } from "lucide-react";

export function ProfileResourcesSection() {
  return (
    <section
      aria-labelledby="study-resources-heading"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
    >
      <h3
        id="study-resources-heading"
        className="font-heading text-sm font-bold text-slate-900 mb-1"
      >
        Study Resources
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        853+ official WAEC past questions available across 5 core subjects and 7 examination years.
      </p>

      <div className="space-y-2">
        <Link
          href="/flashcards"
          className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-3 text-xs font-medium text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-4 w-4 text-slate-600" />
            <span>Practice Questions &amp; Flashcards</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </Link>

        <Link
          href="/chat"
          className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-3 text-xs font-medium text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Bot className="h-4 w-4 text-slate-600" />
            <span>Ask AI Tutor for Syllabus Help</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </Link>

        <Link
          href="/flashcards/mathematics/2026?mode=test"
          className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-3 text-xs font-medium text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-slate-600" />
            <span>Simulate 45-Minute Timed Exam</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </Link>

        <Link
          href="/articles"
          className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-3 text-xs font-medium text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <FileText className="h-4 w-4 text-slate-600" />
            <span>Revision Guides &amp; Study Notes</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </Link>
      </div>
    </section>
  );
}

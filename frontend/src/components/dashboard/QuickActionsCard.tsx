import Link from "next/link";
import { BookOpen, Clock, FileText, ChevronRight } from "lucide-react";

export function QuickActionsCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
        Quick Actions
      </h3>

      <nav className="space-y-1">
        <Link
          href="/flashcards"
          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-slate-500" />
            <span>Past Exam Papers</span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        </Link>

        <Link
          href="/flashcards/mathematics/2026?mode=test"
          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <span>45-Min Math Mock Test</span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        </Link>

        <Link
          href="/articles"
          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-500" />
            <span>Revision Guides &amp; Notes</span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        </Link>
      </nav>
    </div>
  );
}

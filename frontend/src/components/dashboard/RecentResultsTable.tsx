"use client";

import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { StudySessionRecord } from "@/lib/learning-tracker";

type Props = {
  recentActivity: StudySessionRecord[];
};

export function RecentResultsTable({ recentActivity }: Props) {
  const formatGrade = (pct: number) => {
    if (pct >= 90) return "A+";
    if (pct >= 80) return "A";
    if (pct >= 70) return "B+";
    if (pct >= 60) return "B";
    return "C";
  };

  const getGradeBadge = (grade: string) => {
    if (grade === "A+" || grade === "A") return "bg-[#0e1726] text-white";
    if (grade.startsWith("B"))
      return "bg-slate-100 text-slate-800 border border-slate-200";
    return "bg-slate-50 text-slate-600 border border-slate-100";
  };

  const items = recentActivity.slice(0, 5).map((session) => ({
    id: session.sessionId,
    subject:
      session.subject.charAt(0).toUpperCase() +
      session.subject.slice(1).replace(/-/g, " "),
    slug: session.subjectSlug,
    examType: `BECE ${session.year} Paper ${session.paper || 1}`,
    grade: formatGrade(session.scorePercent),
    score: `${session.correctCount}/${session.uniqueQuestionsTotal}`,
    date: new Date(session.completedAt).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">
            Recent Results
          </h3>
          <p className="text-xs text-slate-500">
            Latest past paper scores and grades
          </p>
        </div>
        <Link
          href="/flashcards"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto -mx-5 px-5 mt-3">
        <table className="w-full min-w-[480px] text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-2.5 px-3 min-w-[110px]">Subject</th>
              <th className="py-2.5 px-3 min-w-[130px]">Exam Type</th>
              <th className="py-2.5 px-3 text-center">Grade</th>
              <th className="py-2.5 px-3">Score</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {items.length > 0 ? (
              items.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="py-3 px-3">
                    <Link
                      href={`/flashcards/${row.slug}`}
                      className="flex items-center gap-2.5"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0e1726] text-white shadow-2xs">
                        <BookOpen className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-semibold text-slate-900 group-hover:text-slate-600 transition-colors">
                        {row.subject}
                      </span>
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {row.examType}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center min-w-[32px] h-6 px-2.5 rounded-full text-[11px] font-bold ${getGradeBadge(row.grade)}`}
                    >
                      {row.grade}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {row.score}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-500 font-medium">
                    {row.date}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-500">
                  No completed sessions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

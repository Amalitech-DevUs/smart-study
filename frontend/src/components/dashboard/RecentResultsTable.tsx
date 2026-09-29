"use client";

import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { StudySessionRecord } from "@/lib/learning-tracker";

type Props = {
  recentActivity: StudySessionRecord[];
};

export function RecentResultsTable({ recentActivity }: Props) {
  const fallbackResults = [
    { id: "r1", subject: "Mathematics", slug: "mathematics", examType: "BECE 2024 Paper 1", grade: "A+", score: "92/100", date: "12 May 2024" },
    { id: "r2", subject: "Integrated Science", slug: "integrated-science", examType: "BECE 2023 Paper 1", grade: "A", score: "86/100", date: "10 May 2024" },
    { id: "r3", subject: "English Language", slug: "english", examType: "BECE 2023 Paper 1", grade: "B+", score: "78/100", date: "08 May 2024" },
    { id: "r4", subject: "Social Studies", slug: "social-studies", examType: "BECE 2022 Paper 1", grade: "A", score: "88/100", date: "06 May 2024" },
    { id: "r5", subject: "Mathematics", slug: "mathematics", examType: "BECE 2022 Paper 1", grade: "A+", score: "94/100", date: "04 May 2024" },
  ];

  const formatGrade = (pct: number) => {
    if (pct >= 90) return "A+";
    if (pct >= 80) return "A";
    if (pct >= 70) return "B+";
    if (pct >= 60) return "B";
    return "C";
  };

  const getGradeBadge = (grade: string) => {
    if (grade === "A+" || grade === "A") return "bg-[#0e1726] text-white";
    if (grade.startsWith("B")) return "bg-slate-100 text-slate-800 border border-slate-200";
    return "bg-slate-50 text-slate-600 border border-slate-100";
  };

  const items = recentActivity.length > 0
    ? recentActivity.slice(0, 5).map((session, idx) => ({
        id: session.sessionId || `s${idx}`,
        subject: session.subject.charAt(0).toUpperCase() + session.subject.slice(1).replace(/-/g, " "),
        slug: session.subject,
        examType: `BECE ${session.year} Paper 1`,
        grade: formatGrade(session.scorePercent),
        score: `${session.scorePercent}/100`,
        date: new Date(session.completedAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
      }))
    : fallbackResults;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">Recent Results</h3>
          <p className="text-xs text-slate-500">Latest past paper scores and grades</p>
        </div>
        <Link href="/flashcards" className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline">
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
            {items.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                <td className="py-3 px-3">
                  <Link href={`/flashcards/${row.slug}`} className="flex items-center gap-2">
                    <div className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-md sm:rounded-lg bg-[#0e1726] text-white shadow-2xs">
                      <BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </div>
                    <span className="font-semibold text-slate-900 group-hover:text-slate-600 transition-colors max-w-[90px] sm:max-w-none truncate">
                      {row.subject}
                    </span>
                  </Link>
                </td>
                <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">{row.examType}</td>
                <td className="py-3 px-3 text-center">
                  <span className={`inline-flex items-center justify-center min-w-[32px] h-6 px-2.5 rounded-full text-[11px] font-bold ${getGradeBadge(row.grade)}`}>
                    {row.grade}
                  </span>
                </td>
                <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">{row.score}</td>
                <td className="py-3 px-3 text-right text-slate-500 font-medium whitespace-nowrap">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

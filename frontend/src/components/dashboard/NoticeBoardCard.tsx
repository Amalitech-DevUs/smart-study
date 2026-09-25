"use client";

import React from "react";
import Link from "next/link";
import { Megaphone } from "lucide-react";

export function NoticeBoardCard() {
  const notices = [
    {
      id: "n1",
      title: "BECE 2024 Examination Schedule",
      description: "The official WAEC examination timetable will commence from 25th May 2024.",
      date: "15 May 2024",
      href: "/articles",
    },
    {
      id: "n2",
      title: "New Integrated Science Papers Added",
      description: "Verified WAEC 2023 and 2024 multiple-choice papers are now available.",
      date: "12 May 2024",
      href: "/flashcards",
    },
    {
      id: "n3",
      title: "Mathematics Formula Mastery Updated",
      description: "Step-by-step AI guidance updated for geometry, algebra, and statistics.",
      date: "10 May 2024",
      href: "/chat",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs h-full flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">Notice Board</h3>
          <p className="text-xs text-slate-500">Academic updates and WAEC alerts</p>
        </div>
        <Link href="/articles" className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline">
          View All
        </Link>
      </div>

      <div className="divide-y divide-slate-100 mt-2 flex-1">
        {notices.map((n) => (
          <Link
            key={n.id}
            href={n.href}
            className="flex items-start gap-3.5 py-3.5 px-1 group hover:bg-slate-50 rounded-xl transition-colors block"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0e1726] text-white border border-slate-800/10 group-hover:bg-slate-800 transition-colors shadow-2xs">
              <Megaphone className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-700 transition-colors leading-tight">
                {n.title}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1 line-clamp-2">
                {n.description}
              </p>
              <p className="text-[10px] font-semibold text-slate-400 mt-1.5">{n.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

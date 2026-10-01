"use client";

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import type { SubjectProgressData } from "@/lib/learning-tracker";
import { SubjectCard } from "./SubjectCard";

type FilterValue = "all" | "in_progress" | "not_started" | "mastered";

type Props = {
  subjects: SubjectProgressData[];
};

export function SubjectsSection({ subjects }: Props) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [unstartedOpen, setUnstartedOpen] = useState(false);

  const inProgress = useMemo(() => subjects.filter((s) => s.uniquePracticed > 0 && s.accuracy < 80), [subjects]);
  const examReady = useMemo(() => subjects.filter((s) => s.hasData && s.accuracy >= 80), [subjects]);
  const notStarted = useMemo(() => subjects.filter((s) => s.uniquePracticed === 0), [subjects]);
  const started = useMemo(() => subjects.filter((s) => s.uniquePracticed > 0), [subjects]);

  const FILTERS: { value: FilterValue; label: string }[] = [
    { value: "all", label: `All (${subjects.length})` },
    { value: "in_progress", label: `In Progress (${inProgress.length})` },
    { value: "not_started", label: `Not Started (${notStarted.length})` },
    { value: "mastered", label: `Exam Ready (${examReady.length})` },
  ];

  const filteredForTab = useMemo(() => {
    if (filter === "in_progress") return inProgress;
    if (filter === "mastered") return examReady;
    if (filter === "not_started") return notStarted;
    return started; // "all" — active subjects only (unstarted shown in collapsible)
  }, [filter, inProgress, examReady, notStarted, started]);

  const showCollapsible = filter === "all" && notStarted.length > 0;

  return (
    <section aria-labelledby="my-subjects-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 id="my-subjects-heading" className="font-heading text-lg sm:text-xl font-bold text-slate-900">
            My Subjects
          </h2>
          <p className="text-xs text-slate-500">
            Select a subject to practice past questions or simulate timed exams.
          </p>
        </div>

        {/* Filter tabs — horizontally scrollable on mobile */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 text-xs self-start sm:self-auto overflow-x-auto scrollbar-hide flex-nowrap">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`shrink-0 rounded px-2.5 py-1 font-medium transition-colors whitespace-nowrap ${
                filter === value
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Cards List */}
      <div className="space-y-3">
        {filteredForTab.length > 0 ? (
          filteredForTab.map((subj) => (
            <SubjectCard key={subj.slug} subject={subj} />
          ))
        ) : (
          <p className="py-6 text-center text-sm text-slate-400">
            No subjects in this category yet.
          </p>
        )}
      </div>

      {/* Collapsible "Unstarted Subjects" accordion — only visible in All view */}
      {showCollapsible && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setUnstartedOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            aria-expanded={unstartedOpen}
          >
            <span>
              Unstarted Subjects
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                {notStarted.length}
              </span>
            </span>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${unstartedOpen ? "rotate-180" : ""}`}
            />
          </button>
          {unstartedOpen && (
            <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-3">
              {notStarted.map((subj) => (
                <SubjectCard key={subj.slug} subject={subj} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}


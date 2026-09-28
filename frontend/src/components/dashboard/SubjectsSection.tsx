"use client";

import { useState, useMemo } from "react";
import type { SubjectProgressData } from "@/lib/learning-tracker";
import { SubjectCard } from "./SubjectCard";

type FilterValue = "all" | "in_progress" | "mastered";

type Props = {
  subjects: SubjectProgressData[];
};

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All (5)" },
  { value: "in_progress", label: "In Progress" },
  { value: "mastered", label: "Exam Ready" },
];

export function SubjectsSection({ subjects }: Props) {
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(() => {
    if (filter === "in_progress") {
      return subjects.filter((s) => s.hasData && s.accuracy < 80);
    }
    if (filter === "mastered") {
      return subjects.filter((s) => s.hasData && s.accuracy >= 80);
    }
    return subjects;
  }, [subjects, filter]);

  return (
    <section aria-labelledby="my-subjects-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 id="my-subjects-heading" className="font-heading text-xl font-bold text-slate-900">
            My Subjects
          </h2>
          <p className="text-xs text-slate-500">
            Select a subject to practice past questions or simulate timed exams.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 text-xs self-start sm:self-auto">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded px-2.5 py-1 font-medium transition-colors ${
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
        {filtered.map((subj) => (
          <SubjectCard key={subj.slug} subject={subj} />
        ))}
      </div>
    </section>
  );
}

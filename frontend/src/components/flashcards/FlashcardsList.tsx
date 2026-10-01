"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Search, X, BookOpen, GraduationCap } from "lucide-react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SUBJECTS, type SubjectConfig } from "@/lib/constants/subjects";

type Props = {
  initialQuery?: string;
};

type CategoryFilter = "all" | "core" | "electives";

const CORE_SLUGS = new Set(["mathematics", "english", "science", "social-studies"]);

export function FlashcardsList({ initialQuery = "" }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filteredSubjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return SUBJECTS.filter((subj) => {
      // Category filter
      if (category === "core" && !CORE_SLUGS.has(subj.slug)) return false;
      if (category === "electives" && CORE_SLUGS.has(subj.slug)) return false;

      // Query filter
      if (!q) return true;

      const nameMatch =
        subj.name.toLowerCase().includes(q) ||
        subj.displayName.toLowerCase().includes(q) ||
        subj.slug.toLowerCase().includes(q);

      const descMatch = subj.description.toLowerCase().includes(q);

      const topicMatch = subj.topics.some((t) => t.toLowerCase().includes(q));

      const yearMatch = subj.years.toLowerCase().includes(q);

      return nameMatch || descMatch || topicMatch || yearMatch;
    });
  }, [searchQuery, category]);

  const handleClear = () => {
    setSearchQuery("");
    setCategory("all");
    router.replace("/flashcards");
  };

  const handleSuggestionClick = (term: string) => {
    setSearchQuery(term);
  };

  return (
    <main className="flex-1 min-h-screen bg-[#f8f9fa] px-3 py-6 sm:px-4 sm:py-8 lg:px-8 pb-24 md:pb-16">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <div className="mb-5 sm:mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <ScrollReveal>
          <header className="mb-6 sm:mb-8 border-b border-slate-200 pb-5 sm:pb-6">
            <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
              Past Examination Papers
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-600">
              Select a WAEC core or elective subject below to browse past exam papers, practice untimed by topic, or simulate official timed examinations.
            </p>
          </header>
        </ScrollReveal>

        {/* Search & Category Filter Bar */}
        <div className="mb-6 space-y-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects, topics (Algebra, Biology, Grammar), or exam years..."
              className="w-full rounded-3xl border border-slate-200 bg-white py-2.5 pl-9 pr-10 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills & Result Count */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setCategory("all")}
                className={`rounded-lg px-3 py-1 font-semibold transition-colors ${
                  category === "all"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All ({SUBJECTS.length})
              </button>
              <button
                type="button"
                onClick={() => setCategory("core")}
                className={`rounded-lg px-3 py-1 font-semibold transition-colors ${
                  category === "core"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Core Subjects (4)
              </button>
              <button
                type="button"
                onClick={() => setCategory("electives")}
                className={`rounded-lg px-3 py-1 font-semibold transition-colors ${
                  category === "electives"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Electives (5)
              </button>
            </div>

            {searchQuery.trim() && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium text-xs">
                  Found <strong className="text-slate-900">{filteredSubjects.length}</strong> subject{filteredSubjects.length === 1 ? "" : "s"}
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Subject cards */}
        {filteredSubjects.length > 0 ? (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSubjects.map((subj: SubjectConfig, index: number) => {
              const q = searchQuery.trim().toLowerCase();
              const matchingTopics = q
                ? subj.topics.filter((t) => t.toLowerCase().includes(q))
                : [];

              return (
                <ScrollReveal key={subj.slug} delay={index * 0.04}>
                  <Link
                    href={`/flashcards/${subj.slug}`}
                    className={`group flex flex-col justify-between rounded-xl border border-slate-200 border-l-4 ${subj.accentBorder} bg-white p-5 shadow-xs transition-all duration-150 hover:border-slate-300 hover:shadow-sm`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="font-heading text-base font-bold text-slate-900">
                          {subj.name}
                        </h2>
                        <span
                          className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${subj.badgeBg} ${subj.badgeText}`}
                        >
                          {subj.years}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                        {subj.description}
                      </p>

                      {/* Matching topics indicator if search query matched topic */}
                      {matchingTopics.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap items-center gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Matching topics:
                          </span>
                          {matchingTopics.map((topic) => (
                            <span
                              key={topic}
                              className="rounded-md bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>
                          {subj.paperCount} paper{subj.paperCount > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-1 text-xs font-semibold ${subj.badgeText} transition-all group-hover:gap-1.5`}
                      >
                        <span>Browse papers</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        ) : (
          /* Empty Search Results State */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-base font-bold text-slate-900">
              No subjects or past papers found
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              We couldn&apos;t find any subjects matching &ldquo;{searchQuery}&rdquo;. Try searching for a core subject, topic, or exam year.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {["Mathematics", "Integrated Science", "English Language", "Algebra", "Biology", "2026"].map(
                (term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSuggestionClick(term)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
              >
                <span>Reset search</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom hint */}
        <p className="mt-8 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <GraduationCap className="h-4 w-4 text-slate-400" />
          <span>All past papers include official WAEC marking guidelines and instant AI curriculum explanations.</span>
        </p>
      </div>
    </main>
  );
}

"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, FileText, Search, User as UserIcon } from "lucide-react";
import { NotificationCenter } from "@/components/shared/notification-center";
import type { DailyGoalData } from "@/lib/learning-tracker";
import { fetchArticlesApi } from "@/lib/api-client";
import type { Article } from "@/lib/articles-data";
import { SUBJECTS } from "@/lib/constants/subjects";
import { placeholderSubjects } from "@/lib/placeholder-subjects";

type Props = {
  username: string | undefined;
  streak: number;
  dailyGoal: DailyGoalData;
};

type SearchSuggestion = {
  id: string;
  title: string;
  detail: string;
  href: string;
  kind: "paper" | "article";
};

export function DashboardHeader({ username }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const articleRequest = useRef<Promise<void> | null>(null);

  const loadArticles = () => {
    if (articleRequest.current) return;

    articleRequest.current = fetchArticlesApi()
      .then((response) => {
        if (response.success && Array.isArray(response.data)) {
          setArticles(response.data as Article[]);
        }
      })
      .catch(() => undefined);
  };

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const yearMatch = normalizedQuery.match(/\b(?:19|20)\d{2}\b/);
  const selectedYear = yearMatch ? Number(yearMatch[0]) : undefined;
  const queryTerms = normalizedQuery
    .replace(yearMatch?.[0] ?? "", " ")
    .split(/\s+/)
    .filter(Boolean);

  const paperSuggestions: SearchSuggestion[] = placeholderSubjects.flatMap(
    (subject) => {
      const subjectConfig = SUBJECTS.find((item) => item.slug === subject.slug);
      const searchable = [
        subject.name,
        subject.slug,
        ...(subjectConfig?.topics ?? []),
      ]
        .join(" ")
        .toLocaleLowerCase();

      if (!queryTerms.every((term) => searchable.includes(term))) return [];

      const papers = subject.papers.filter(
        (paper) => selectedYear === undefined || paper.year === selectedYear,
      );

      if (papers.length === 0) return [];

      if (selectedYear !== undefined) {
        return papers.map((paper) => ({
          id: `paper-${subject.slug}-${paper.year}`,
          title: subject.name,
          detail: `${paper.year} BECE · Paper 1 · ${paper.questionCount} questions`,
          href: `/flashcards/${subject.slug}/${paper.year}?mode=practice`,
          kind: "paper" as const,
        }));
      }

      return [
        {
          id: `subject-${subject.slug}`,
          title: subject.name,
          detail: `${papers.length} past paper${papers.length === 1 ? "" : "s"} · Choose a year`,
          href: `/flashcards/${subject.slug}`,
          kind: "paper" as const,
        },
      ];
    },
  );

  const articleSuggestions: SearchSuggestion[] =
    queryTerms.length > 0
      ? articles
          .filter((article) => {
            const searchable =
              `${article.title} ${article.category} ${article.body}`.toLocaleLowerCase();
            return queryTerms.every((term) => searchable.includes(term));
          })
          .slice(0, 5)
          .map((article) => ({
            id: `article-${article.slug}`,
            title: article.title,
            detail: article.category,
            href: `/articles/${article.slug}`,
            kind: "article" as const,
          }))
      : [];

  const suggestions = [...paperSuggestions.slice(0, 5), ...articleSuggestions];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSuggestion = suggestions[selectedIndex] ?? suggestions[0];
    if (selectedSuggestion) {
      router.push(selectedSuggestion.href);
      setIsSearchOpen(false);
    }
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Escape") {
      setIsSearchOpen(false);
      return;
    }

    if (suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex(
        (index) => (index - 1 + suggestions.length) % suggestions.length,
      );
    }
  };

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white px-5 py-3.5 border border-slate-200 shadow-2xs">
      <h1 className="font-heading text-xl font-bold tracking-tight text-slate-900">
        Dashboard
      </h1>

      <form
        onSubmit={handleSearchSubmit}
        onBlur={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget as Node | null)
          ) {
            setIsSearchOpen(false);
          }
        }}
        className="relative mx-auto flex w-full max-w-xl flex-1 sm:mx-4"
      >
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            role="combobox"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setSelectedIndex(0);
              setIsSearchOpen(true);
              loadArticles();
            }}
            onFocus={() => {
              setIsSearchOpen(true);
              loadArticles();
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search a subject, topic, or year..."
            aria-label="Search past papers and articles"
            aria-autocomplete="list"
            aria-expanded={isSearchOpen && normalizedQuery.length > 0}
            aria-controls="dashboard-search-suggestions"
            aria-activedescendant={
              suggestions[selectedIndex]
                ? `search-option-${suggestions[selectedIndex].id}`
                : undefined
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-slate-400 focus:bg-white focus:outline-none"
          />
        </div>

        {isSearchOpen && normalizedQuery && (
          <div
            id="dashboard-search-suggestions"
            role="listbox"
            aria-label="Search suggestions"
            className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
          >
            {paperSuggestions.length > 0 && (
              <div className="border-b border-slate-100 last:border-b-0">
                <p className="px-3.5 pb-1 pt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Past papers
                </p>
                {paperSuggestions.slice(0, 5).map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    id={`search-option-${suggestion.id}`}
                    role="option"
                    aria-selected={selectedIndex === index}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      router.push(suggestion.href);
                      setIsSearchOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${selectedIndex === index ? "bg-slate-50" : "hover:bg-slate-50"}`}
                  >
                    <BookOpen className="h-4 w-4 shrink-0 text-slate-500" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold text-slate-900">
                        {suggestion.title}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                        {suggestion.detail}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {articleSuggestions.length > 0 && (
              <div>
                <p className="px-3.5 pb-1 pt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Articles
                </p>
                {articleSuggestions.map((suggestion, index) => {
                  const optionIndex =
                    Math.min(paperSuggestions.length, 5) + index;
                  return (
                    <button
                      key={suggestion.id}
                      type="button"
                      id={`search-option-${suggestion.id}`}
                      role="option"
                      aria-selected={selectedIndex === optionIndex}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        router.push(suggestion.href);
                        setIsSearchOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${selectedIndex === optionIndex ? "bg-slate-50" : "hover:bg-slate-50"}`}
                    >
                      <FileText className="h-4 w-4 shrink-0 text-slate-500" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold text-slate-900">
                          {suggestion.title}
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                          {suggestion.detail}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {suggestions.length === 0 && (
              <p className="px-3.5 py-3 text-xs text-slate-500">
                No matching subjects, papers, or articles.
              </p>
            )}
          </div>
        )}
      </form>

      <div className="flex items-center justify-between sm:justify-end gap-3.5">
        <NotificationCenter />

        <Link
          href="/profile"
          className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pr-3 transition-colors hover:bg-slate-100"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-700 font-bold text-xs text-amber-400 shadow-xs">
            {username ? (
              username.charAt(0).toUpperCase()
            ) : (
              <UserIcon className="h-4 w-4" />
            )}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              Hello, {username || "Student"}
            </p>
            <p className="text-[10px] font-medium text-slate-500 leading-tight">
              BECE Candidate
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}

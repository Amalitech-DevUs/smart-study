import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { masterArticles, type Article } from "@/lib/articles-data";
import { SUBJECTS } from "@/lib/constants/subjects";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

type SearchParams = Promise<{
  q?: string | string[];
  year?: string | string[];
}>;

type Question = {
  id?: number | string;
  subject?: string;
  year?: number | string;
  paper?: number | string;
  section?: string;
  topic?: string;
  prompt?: string;
};

type SearchPageProps = {
  searchParams: SearchParams;
};

function firstValue(value?: string | string[]): string {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

async function fetchCollection<T>(path: string): Promise<T[] | null> {
  const baseUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000";

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;

    const payload = await response.json();
    const collection = Array.isArray(payload) ? payload : payload?.data;
    return Array.isArray(collection) ? (collection as T[]) : null;
  } catch {
    return null;
  }
}

function matchesQuery(
  values: Array<string | number | undefined>,
  terms: string[],
): boolean {
  const text = values
    .filter((value) => value !== undefined)
    .join(" ")
    .toLocaleLowerCase();
  return terms.every((term) => text.includes(term));
}

export default async function SearchResultsPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;
  const query = firstValue(params.q).trim();
  const rawYear = firstValue(params.year).trim();
  const yearIsInvalid =
    rawYear !== "" &&
    (!/^\d{4}$/.test(rawYear) ||
      Number(rawYear) < 1900 ||
      Number(rawYear) > 2100);
  const year = yearIsInvalid ? "" : rawYear;

  const returnParams = new URLSearchParams();
  if (query) returnParams.set("q", query);
  if (rawYear) returnParams.set("year", rawYear);
  const returnPath = `/flashcards/search${returnParams.size ? `?${returnParams.toString()}` : ""}`;

  const user = await getCurrentUser();
  if (!user.loggedIn) {
    redirect(`/login?redirect=${encodeURIComponent(returnPath)}`);
  }

  let questionCollection: Question[] | null = [];
  let articleCollection: Article[] = masterArticles;

  if (query && !yearIsInvalid) {
    const questionPath = `/questions${year ? `?year=${encodeURIComponent(year)}` : ""}`;
    const [questions, articles] = await Promise.all([
      fetchCollection<Question>(questionPath),
      fetchCollection<Article>("/articles"),
    ]);
    questionCollection = questions;
    if (articles) articleCollection = articles;
  }

  const terms = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const questionResults = (questionCollection || []).filter((question) => {
    if (year && Number(question.year) !== Number(year)) return false;
    return matchesQuery(
      [
        question.prompt,
        question.subject,
        question.topic,
        question.section,
        question.year,
        question.paper,
      ],
      terms,
    );
  });
  const articleResults = articleCollection.filter((article) =>
    matchesQuery([article.title, article.category, article.body], terms),
  );
  const questionApiUnavailable =
    query !== "" && !yearIsInvalid && questionCollection === null;

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>

        <ScrollReveal>
          <header className="mb-8 border-b border-slate-200 pb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Search Results
            </p>
            <h1 className="mt-2 break-words font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
              {query ? (
                <>Results for &quot;{query}&quot;</>
              ) : (
                "Search past questions and articles"
              )}
            </h1>
            {year && (
              <p className="mt-2 text-sm text-slate-600">
                Question year: {year}
              </p>
            )}
          </header>
        </ScrollReveal>

        {yearIsInvalid && (
          <p
            role="alert"
            className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          >
            Enter a valid year between 1900 and 2100.
          </p>
        )}

        {questionApiUnavailable && (
          <p
            role="alert"
            className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          >
            Past-question search is temporarily unavailable. Article results are
            still shown when available.
          </p>
        )}

        {!query && !yearIsInvalid ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Enter a topic, subject, or phrase in the dashboard search box to
            find matching questions and articles.
          </div>
        ) : !yearIsInvalid &&
          questionResults.length === 0 &&
          articleResults.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">No results found.</p>
            <p className="mt-1">
              Try a different phrase{year ? " or year" : ""}.
            </p>
          </div>
        ) : null}

        {!yearIsInvalid && query && (
          <div className="space-y-10">
            <section aria-labelledby="question-results-heading">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2
                  id="question-results-heading"
                  className="font-heading text-lg font-bold text-slate-900"
                >
                  Past Questions{" "}
                  <span className="text-sm font-medium text-slate-500">
                    ({questionResults.length})
                  </span>
                </h2>
                {questionResults.length > 20 && (
                  <span className="text-xs text-slate-500">
                    Showing 20 of {questionResults.length}
                  </span>
                )}
              </div>
              {questionResults.length > 0 ? (
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                  {questionResults.slice(0, 20).map((question, index) => {
                    const subject = SUBJECTS.find(
                      (item) =>
                        item.name.toLowerCase() ===
                        (question.subject || "").toLowerCase(),
                    );
                    const questionYear = Number(question.year);
                    const paper = question.paper || 1;
                    return (
                      <article
                        key={
                          question.id ??
                          `${question.subject}-${questionYear}-${index}`
                        }
                        className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">
                            {question.prompt || "Question"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {[
                              question.subject,
                              questionYear || undefined,
                              paper ? `Paper ${paper}` : undefined,
                              question.topic,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        {subject && questionYear > 0 && (
                          <Link
                            href={`/flashcards/${subject.slug}/${questionYear}`}
                            className="shrink-0 text-xs font-semibold text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
                          >
                            Open paper
                          </Link>
                        )}
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                  No matching past questions.
                </p>
              )}
            </section>

            <section aria-labelledby="article-results-heading">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2
                  id="article-results-heading"
                  className="font-heading text-lg font-bold text-slate-900"
                >
                  Study Articles{" "}
                  <span className="text-sm font-medium text-slate-500">
                    ({articleResults.length})
                  </span>
                </h2>
                {articleResults.length > 20 && (
                  <span className="text-xs text-slate-500">
                    Showing 20 of {articleResults.length}
                  </span>
                )}
              </div>
              {articleResults.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {articleResults.slice(0, 20).map((article) => (
                    <Link
                      key={article.slug}
                      href={`/articles/${article.slug}`}
                      className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
                    >
                      <p className="text-xs font-semibold text-slate-500">
                        {article.category}
                      </p>
                      <h3 className="mt-1 font-heading text-sm font-bold text-slate-900">
                        {article.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {article.body}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                  No matching articles.
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

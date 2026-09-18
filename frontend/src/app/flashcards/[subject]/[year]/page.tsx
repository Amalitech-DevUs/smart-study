import Link from "next/link";
import { notFound } from "next/navigation";
import { SessionRunner } from "@/components/flashcards/session-runner";
import type { McqQuestion } from "@/components/flashcards/mcq-card";
import { placeholderSubjects } from "@/lib/placeholder-subjects";
import { AlertCircle, RefreshCw } from "lucide-react";

type PaperPageProps = {
  params: Promise<{ subject: string; year: string }>;
};

async function getQuestions(
  subjectSlug: string,
  subjectName: string,
  subjectColor: McqQuestion["subjectColor"],
  year: number,
): Promise<{ questions: McqQuestion[]; source: string }> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const endpoint = `${API_BASE_URL}/questions?subject=${encodeURIComponent(subjectName)}&year=${year}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(endpoint, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      const rawList = Array.isArray(json.data)
        ? json.data
        : Array.isArray(json)
          ? json
          : [];

      if (rawList.length > 0) {
        const mapped: McqQuestion[] = rawList.map(
          (
            q: {
              id?: string | number;
              prompt?: string;
              question?: string;
              options?: string[];
              correctAnswer?: string;
              correct_answer?: string;
              explanation?: string;
              year?: number;
              paper?: number;
              section?: string;
              topic?: string;
              questionNumber?: number;
              question_number?: number;
            },
            idx: number,
          ) => {
              const rawOpts: string[] = Array.isArray(q.options)
                ? q.options
                : ["Option A", "Option B", "Option C", "Option D"];
              const optionKeys: Array<"a" | "b" | "c" | "d"> = ["a", "b", "c", "d"];
              const correctKey = String(
                q.correctAnswer || q.correct_answer || "A",
              ).toLowerCase();
              const validCorrect = (
                ["a", "b", "c", "d"].includes(correctKey) ? correctKey : "a"
              ) as "a" | "b" | "c" | "d";
              const correctIndex = optionKeys.indexOf(validCorrect);
              const correctText = rawOpts[correctIndex] || "";

              return {
                id: String(q.id || `${subjectSlug}-${year}-${idx + 1}`),
                subject: subjectName,
                subjectColor,
                year: q.year || year,
                paper: q.paper || 1,
                section: q.section,
                topic: q.topic,
                questionNumber: q.questionNumber || q.question_number || idx + 1,
                totalQuestions: rawList.length,
                question: q.prompt || q.question || `Question ${idx + 1}`,
                options: optionKeys.map((key, i) => ({
                  id: key,
                  text: rawOpts[i] || `Option ${key.toUpperCase()}`,
                })),
                correctOptionId: validCorrect,
                explanation:
                  q.explanation ||
                  `Option ${validCorrect.toUpperCase()} ("${correctText}") is the accurate answer according to official WAEC examination scoring standards.`,
              };
          },
        );

        return { questions: mapped, source: "CONTENT_SERVICE" };
      }
    }
  } catch {
    // The routing layer or its downstream Content Database is unavailable.
  }

  return {
    questions: [],
    source: "CONTENT_SERVICE",
  };
}

export default async function PaperPage({ params }: PaperPageProps) {
  const { subject, year: yearParam } = await params;
  const subjectData = placeholderSubjects.find((item) => item.slug === subject);
  const year = Number(yearParam);

  if (!subjectData || !Number.isInteger(year)) {
    notFound();
  }

  const { questions } = await getQuestions(
    subjectData.slug,
    subjectData.name,
    subjectData.subjectColor,
    year,
  );

  return (
    <main className="flex-1 bg-white px-6 py-10 pb-28 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/flashcards/${subjectData.slug}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0e1726] transition-colors hover:text-[#c0392b]"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Back to {subjectData.name}</span>
        </Link>
        <header className="mt-6 border-b border-[#e2e8f0] pb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#c0392b]">
            Official Exam Practice
          </p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold text-[#0e1726] sm:text-4xl">
            {subjectData.name} ({year} BECE)
          </h1>
        </header>

        <div className="mt-10 flex justify-center">
          {questions.length > 0 ? (
            <SessionRunner initialQuestions={questions} />
          ) : (
            <div className="w-full max-w-2xl rounded-3xl border border-amber-200 bg-amber-50/70 p-8 text-center shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <AlertCircle className="h-7 w-7" />
              </div>
              <h2 className="mt-4 font-heading text-2xl font-bold text-slate-900">
                Unable to Reach Content Database
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Could not retrieve official questions from the Content Service for{" "}
                <span className="font-semibold">{subjectData.name} ({year})</span>.
                Please ensure the Content Database service is running on port 5002.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href={`/flashcards/${subjectData.slug}/${year}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Retry</span>
                </Link>
                <Link
                  href={`/flashcards/${subjectData.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span>All Papers</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

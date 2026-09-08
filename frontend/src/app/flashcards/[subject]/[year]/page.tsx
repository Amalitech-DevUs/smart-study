import Link from "next/link";
import { notFound } from "next/navigation";
import { SessionRunner } from "@/components/flashcards/session-runner";
import type { McqQuestion } from "@/components/flashcards/mcq-card";
import { placeholderSubjects } from "@/lib/placeholder-subjects";

type PaperPageProps = {
  params: Promise<{ subject: string; year: string }>;
};

function createPlaceholderQuestions(
  subjectName: string,
  subjectColor: McqQuestion["subjectColor"],
  year: number,
): McqQuestion[] {
  // TODO: replace with real data from /questions endpoint filtered by subject and year
  return [
    {
      id: `${subjectName}-${year}-1`,
      subject: subjectName,
      subjectColor,
      question: `Which statement best describes a key ${subjectName} idea?`,
      options: [
        { id: "a", text: "The first option" },
        { id: "b", text: "The correct answer" },
        { id: "c", text: "The third option" },
        { id: "d", text: "The final option" },
      ],
      correctOptionId: "b",
    },
    {
      id: `${subjectName}-${year}-2`,
      subject: subjectName,
      subjectColor,
      question: `What should you check first when solving a ${subjectName} question?`,
      options: [
        { id: "a", text: "The instructions" },
        { id: "b", text: "The page number" },
        { id: "c", text: "The clock only" },
        { id: "d", text: "Nothing" },
      ],
      correctOptionId: "a",
    },
    {
      id: `${subjectName}-${year}-3`,
      subject: subjectName,
      subjectColor,
      question: `Which approach is most useful for a ${subjectName} revision question?`,
      options: [
        { id: "a", text: "Guess immediately" },
        { id: "b", text: "Skip every question" },
        { id: "c", text: "Read carefully and apply what you know" },
        { id: "d", text: "Choose the longest answer" },
      ],
      correctOptionId: "c",
    },
    {
      id: `${subjectName}-${year}-4`,
      subject: subjectName,
      subjectColor,
      question: `Why is reviewing mistakes helpful in ${subjectName}?`,
      options: [
        { id: "a", text: "It removes the need to practice" },
        { id: "b", text: "It shows where to improve" },
        { id: "c", text: "It changes the question" },
        { id: "d", text: "It shortens every exam" },
      ],
      correctOptionId: "b",
    },
    {
      id: `${subjectName}-${year}-5`,
      subject: subjectName,
      subjectColor,
      question: `What is a good final step after answering a ${subjectName} question?`,
      options: [
        { id: "a", text: "Check your answer" },
        { id: "b", text: "Erase the question" },
        { id: "c", text: "Ignore the options" },
        { id: "d", text: "Stop reading" },
      ],
      correctOptionId: "a",
    },
  ];
}

async function getQuestions(
  subjectSlug: string,
  subjectName: string,
  subjectColor: McqQuestion["subjectColor"],
  year: number,
): Promise<{ questions: McqQuestion[]; source: string }> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${API_BASE_URL}/questions?subject=${encodeURIComponent(subjectName)}&year=${year}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      const rawList = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
      if (rawList.length > 0) {
        const mapped: McqQuestion[] = rawList.map((q: any, idx: number) => {
          const rawOpts: string[] = Array.isArray(q.options) ? q.options : ["Option A", "Option B", "Option C", "Option D"];
          const optionKeys: Array<'a' | 'b' | 'c' | 'd'> = ['a', 'b', 'c', 'd'];
          const correctKey = String(q.correctAnswer || q.correct_answer || 'A').toLowerCase();
          const validCorrect = (['a', 'b', 'c', 'd'].includes(correctKey) ? correctKey : 'a') as 'a' | 'b' | 'c' | 'd';

          return {
            id: String(q.id || `${subjectSlug}-${year}-${idx + 1}`),
            subject: subjectName,
            subjectColor,
            question: q.prompt || q.question || `Question ${idx + 1}`,
            options: optionKeys.map((key, i) => ({
              id: key,
              text: rawOpts[i] || `Option ${key.toUpperCase()}`
            })),
            correctOptionId: validCorrect,
            explanation: q.explanation
          };
        });

        return { questions: mapped, source: json.source || 'CONTENT_SERVICE' };
      }
    }
  } catch {
    // API server offline, fallback to seed dataset
  }

  return {
    questions: createPlaceholderQuestions(subjectName, subjectColor, year),
    source: 'LOCAL_FALLBACK'
  };
}

export default async function PaperPage({ params }: PaperPageProps) {
  const { subject, year: yearParam } = await params;
  const subjectData = placeholderSubjects.find((item) => item.slug === subject);
  const year = Number(yearParam);

  if (!subjectData || !Number.isInteger(year)) {
    notFound();
  }

  const { questions, source } = await getQuestions(
    subjectData.slug,
    subjectData.name,
    subjectData.subjectColor,
    year,
  );

  return (
    <main className="flex-1 bg-background px-6 py-10 pb-24 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <Link
            href={`/flashcards/${subjectData.slug}`}
            className="text-sm font-medium text-text-secondary transition-colors hover:text-brand-indigo"
          >
            ← Back to {subjectData.name}
          </Link>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Source: {source}
          </span>
        </div>
        <header className="mt-8">
          <p className="text-sm font-medium uppercase tracking-wide text-brand-gold">
            Past paper practice ({questions.length} Questions)
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-brand-indigo sm:text-5xl">
            {subjectData.name} · {year}
          </h1>
        </header>
        <div className="mt-10 flex justify-center">
          <SessionRunner initialQuestions={questions} />
        </div>
      </div>
    </main>
  );
}

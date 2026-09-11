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

export default async function PaperPage({ params }: PaperPageProps) {
  const { subject, year: yearParam } = await params;
  const subjectData = placeholderSubjects.find((item) => item.slug === subject);
  const year = Number(yearParam);

  if (!subjectData || !Number.isInteger(year)) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  let questions: McqQuestion[] = [];

  try {
    const res = await fetch(
      `${baseUrl.replace(/\/$/, "")}/questions?subject=${encodeURIComponent(subjectData.name)}&year=${year}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const json = await res.json();
      const rawList = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
      if (rawList.length > 0) {
        const optionKeys: Array<"a" | "b" | "c" | "d"> = ["a", "b", "c", "d"];
        questions = rawList.map((q: any, idx: number) => {
          const rawOpts: string[] = Array.isArray(q.options) ? q.options : [];
          const correctIdx = rawOpts.findIndex(
            (opt) => opt.toLowerCase() === String(q.correctAnswer || q.correct_answer || "").toLowerCase()
          );
          const correctOptionId = (correctIdx >= 0 ? optionKeys[correctIdx] : "a") as "a" | "b" | "c" | "d";

          return {
            id: String(q.id || `${subjectData.slug}-${year}-${idx + 1}`),
            subject: subjectData.name,
            subjectColor: subjectData.subjectColor,
            question: q.prompt || q.question || `Question ${idx + 1}`,
            options: optionKeys.map((key, i) => ({
              id: key,
              text: rawOpts[i] || `Option ${key.toUpperCase()}`,
            })),
            correctOptionId,
          };
        });
      }
    }
  } catch {
    // Graceful fallback if backend is offline
  }

  if (questions.length === 0) {
    questions = createPlaceholderQuestions(
      subjectData.name,
      subjectData.subjectColor,
      year,
    );
  }

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
          <SessionRunner initialQuestions={questions} />
        </div>
      </div>
    </main>
  );
}

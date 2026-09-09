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

  const questions = createPlaceholderQuestions(
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
          <SessionRunner initialQuestions={questions} />
        </div>
      </div>
    </main>
  );
}

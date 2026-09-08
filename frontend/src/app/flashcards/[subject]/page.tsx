import Link from "next/link";
import { notFound } from "next/navigation";
import { placeholderSubjects } from "@/lib/placeholder-subjects";
import { BookOpen } from "lucide-react";

type SubjectPageProps = {
  params: Promise<{ subject: string }>;
};

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subject } = await params;
  const subjectData = placeholderSubjects.find((item) => item.slug === subject);

  if (!subjectData) {
    notFound();
  }

  return (
    <main className="flex-1 bg-[#fbfbfa] px-6 py-10 pb-24 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/flashcards"
          className="text-xs font-bold text-[#0e1726] underline hover:text-[#f5a623]"
        >
          ← Back to all subjects
        </Link>

        <header className="mt-6 border-b border-[#e2e8f0] pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#c0392b]">
            Past Exam Papers
          </span>
          <h1 className="mt-1 font-heading text-4xl font-extrabold text-[#0e1726]">
            {subjectData.name} BECE Practice
          </h1>
          <p className="mt-2 text-sm text-[#525b68]">
            Select an exam year to begin your multiple choice practice session.
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjectData.papers.map((paper) => (
            <Link
              key={paper.year}
              href={`/flashcards/${subjectData.slug}/${paper.year}`}
              className="paper-card margin-accent-navy flex flex-col justify-between p-6 transition-all hover:border-[#0e1726]"
            >
              <div>
                <span className="font-heading text-3xl font-extrabold text-[#0e1726]">
                  {paper.year}
                </span>
                <p className="mt-2 text-xs font-medium text-[#525b68]">
                  {paper.questionCount} Official WAEC Questions
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#0e1726]">
                <BookOpen className="h-4 w-4 text-[#f5a623]" />
                <span>Start Session</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

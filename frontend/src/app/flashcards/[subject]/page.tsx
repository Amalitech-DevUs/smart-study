import Link from "next/link";
import { notFound } from "next/navigation";
import { placeholderSubjects } from "@/lib/placeholder-subjects";

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
    <main className="flex-1 bg-background px-6 py-10 pb-24 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/flashcards"
          className="text-sm font-medium text-text-secondary transition-colors hover:text-brand-indigo"
        >
          ← Back to subjects
        </Link>

        <header className="mt-8">
          <p className="text-sm font-medium uppercase tracking-wide text-brand-gold">
            Past papers
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-brand-indigo sm:text-5xl">
            {subjectData.name}
          </h1>
          <p className="mt-3 text-text-secondary">
            Choose a year to start practicing.
          </p>
        </header>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjectData.papers.map((paper) => (
            <Link
              key={paper.year}
              href={`/flashcards/${subjectData.slug}/${paper.year}`}
              className="rounded-lg border border-text-secondary/15 bg-white p-5 shadow-sm transition-colors hover:border-brand-gold"
            >
              <span className="font-heading text-3xl font-bold text-brand-indigo">
                {paper.year}
              </span>
              <p className="mt-3 text-sm text-text-secondary">
                {paper.questionCount} questions
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

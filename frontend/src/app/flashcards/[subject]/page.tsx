import Link from "next/link";
import { notFound } from "next/navigation";
import { placeholderSubjects } from "@/lib/placeholder-subjects";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

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
    <main className="flex-1 bg-white px-6 py-10 pb-28 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <Link
            href="/flashcards"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            &larr; All subjects
          </Link>

          <header className="mt-4 border-b border-slate-200 pb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Exam Papers
            </p>
            <h1 className="mt-2 font-heading text-3xl font-extrabold text-slate-900 sm:text-4xl">
              {subjectData.name} Papers
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Select an exam year to begin multiple-choice practice.
            </p>
          </header>
        </ScrollReveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjectData.papers.map((paper, index) => (
            <ScrollReveal key={paper.year} delay={index * 0.05}>
              <Link
                href={`/flashcards/${subjectData.slug}/${paper.year}`}
                className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
              >
                <div>
                  <span className="font-heading text-3xl font-extrabold text-slate-900">
                    {paper.year}
                  </span>
                  <p className="mt-2 text-xs text-slate-500">
                    {paper.questionCount} WAEC questions
                  </p>
                </div>
                <div className="mt-6 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-900 group-hover:text-slate-600 transition-colors">
                  Start practice &rarr;
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </main>
  );
}

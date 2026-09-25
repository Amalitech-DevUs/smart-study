import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { placeholderSubjects } from "@/lib/placeholder-subjects";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

type SubjectPageProps = {
  params: Promise<{ subject: string }>;
};

export default async function SubjectPage({ params }: SubjectPageProps) {
  const user = await getCurrentUser();
  const { subject } = await params;

  if (!user.loggedIn) {
    redirect(`/login?redirect=/flashcards/${subject}`);
  }

  const subjectData = placeholderSubjects.find((item) => item.slug === subject);

  if (!subjectData) {
    notFound();
  }

  return (
    <main className="flex-1 min-h-screen bg-[#f8f9fa] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="mb-6">
            <Link
              href="/flashcards"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              &larr; All subjects
            </Link>
          </div>

          <header className="border-b border-slate-200 pb-6">
            <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
              {subjectData.name} Past Papers
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              Select an exam year below. Practice untimed with instant feedback or take a timed WAEC mock exam.
            </p>
          </header>
        </ScrollReveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjectData.papers.map((paper, index) => (
            <ScrollReveal key={paper.year} delay={index * 0.04}>
              <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors hover:border-slate-300">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-2xl font-bold text-slate-900">
                      {paper.year}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {paper.questionCount} Qs
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Official WAEC BECE examination paper
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    href={`/flashcards/${subjectData.slug}/${paper.year}?mode=practice`}
                    className="flex-1 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                  >
                    Practice
                  </Link>

                  <Link
                    href={`/flashcards/${subjectData.slug}/${paper.year}?mode=test`}
                    className="flex-1 inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    Mock Exam
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </main>
  );
}

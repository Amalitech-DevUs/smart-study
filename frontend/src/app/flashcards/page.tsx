import Link from "next/link";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

type Subject = {
  slug: string;
  name: string;
  paperCount: number;
  years: string;
  description: string;
};

const subjects: Subject[] = [
  {
    slug: "mathematics",
    name: "Mathematics",
    paperCount: 7,
    years: "2020 to 2026",
    description: "Algebra, plane geometry, word problems, statistics, and number bases.",
  },
  {
    slug: "english",
    name: "English Language",
    paperCount: 7,
    years: "2020 to 2026",
    description: "Comprehension passages, grammar rules, vocabulary, antonyms, and composition.",
  },
  {
    slug: "science",
    name: "Integrated Science",
    paperCount: 1,
    years: "2026 Mock Exam",
    description: "Life processes, chemical compounds, electrical circuits, and soil science.",
  },
  {
    slug: "social-studies",
    name: "Social Studies",
    paperCount: 1,
    years: "2020 Past Paper",
    description: "Ghanaian governance, physical environment, colonization history, and citizenship.",
  },
];

export default function FlashcardsPage() {
  return (
    <main className="flex-1 bg-white px-6 py-12 pb-28 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <header className="border-b border-slate-200 pb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              WAEC Exam Preparation
            </p>
            <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Past Question Flashcards
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
              Choose a subject to practice official multiple-choice questions with step-by-step verification.
            </p>
          </header>
        </ScrollReveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {subjects.map((subj, index) => (
            <ScrollReveal key={subj.slug} delay={index * 0.05}>
              <Link
                href={`/flashcards/${subj.slug}`}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-1 hover:border-slate-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-500 cursor-pointer"
              >
                <div>
                  <div className="flex items-baseline justify-between">
                    <h2 className="font-heading text-xl font-bold text-slate-900">
                      {subj.name}
                    </h2>
                    <span className="text-xs font-medium text-slate-500">
                      {subj.years}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {subj.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {subj.paperCount} exam papers
                  </span>
                  <span className="inline-flex items-center text-xs font-semibold text-slate-900 transition-colors">
                    Select year
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Subject = {
  slug: string;
  name: string;
  paperCount: number;
  description: string;
};

const subjects: Subject[] = [
  {
    slug: "mathematics",
    name: "Mathematics",
    paperCount: 1,
    description: "Practice algebra, geometry, word problems, and data handling questions.",
  },
  {
    slug: "english",
    name: "English Language",
    paperCount: 1,
    description: "Master comprehension passages, grammar rules, synonyms, and essay structures.",
  },
  {
    slug: "science",
    name: "Integrated Science",
    paperCount: 1,
    description: "Explore biological processes, chemical reactions, energy, and ecosystems.",
  },
  {
    slug: "social-studies",
    name: "Social Studies",
    paperCount: 1,
    description: "Revise governance, environmental conservation, history, and civic topics.",
  },
];

export default function FlashcardsPage() {
  return (
    <main className="flex-1 bg-slate-50 px-6 py-12 pb-24 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-2xl">
          <h1 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
            Select a Subject
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Pick a subject to launch flashcard revision sessions with verified exam questions.
          </p>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {subjects.map((subj) => (
            <article
              key={subj.slug}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-brand-indigo hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold text-slate-900">
                    {subj.name}
                  </h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {subj.paperCount} Past Papers
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  {subj.description}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <Link
                  href={`/flashcards/${subj.slug}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b132b] py-2.5 px-4 text-xs font-bold text-white transition-all hover:bg-slate-800"
                >
                  <span>Start Practice Session</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { BookOpen } from "lucide-react";

type Subject = {
  slug: string;
  name: string;
  paperCount: number;
  years: string;
  accentClass: string;
  badgeColor: string;
  description: string;
};

const subjects: Subject[] = [
  {
    slug: "mathematics",
    name: "Mathematics",
    paperCount: 6,
    years: "2018 – 2023 BECE",
    accentClass: "margin-accent-green",
    badgeColor: "bg-[#edf7f2] text-[#1e7e4e]",
    description: "Algebra, plane geometry, word problems, statistics, and number bases.",
  },
  {
    slug: "english",
    name: "English Language",
    paperCount: 6,
    years: "2018 – 2023 BECE",
    accentClass: "margin-accent-red",
    badgeColor: "bg-[#fdf2f0] text-[#c0392b]",
    description: "Comprehension passages, grammar rules, vocabulary, antonyms, and composition.",
  },
  {
    slug: "science",
    name: "Integrated Science",
    paperCount: 6,
    years: "2018 – 2023 BECE",
    accentClass: "margin-accent-gold",
    badgeColor: "bg-[#fff8eb] text-[#b87609]",
    description: "Life processes, chemical compounds, electrical circuits, and soil science.",
  },
  {
    slug: "social-studies",
    name: "Social Studies",
    paperCount: 6,
    years: "2018 – 2023 BECE",
    accentClass: "margin-accent-navy",
    badgeColor: "bg-[#f0f4f9] text-[#0e1726]",
    description: "Ghanaian governance, physical environment, colonization history, and citizenship.",
  },
];

export default function FlashcardsPage() {
  return (
    <main className="flex-1 bg-[#fbfbfa] px-6 py-10 pb-24 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <header className="border-b border-[#e2e8f0] pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#c0392b]">
            WAEC Past Papers
          </span>
          <h1 className="mt-1 font-heading text-3xl font-extrabold text-[#0e1726] sm:text-4xl">
            BECE Subject Flashcards
          </h1>
          <p className="mt-2 text-sm text-[#525b68]">
            Select a subject to launch interactive multiple choice practice sessions.
          </p>
        </header>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {subjects.map((subj) => (
            <article
              key={subj.slug}
              className={`paper-card ${subj.accentClass} flex flex-col justify-between p-6 transition-all hover:border-[#0e1726]/30`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold text-[#0e1726]">
                    {subj.name}
                  </h2>
                  <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${subj.badgeColor}`}>
                    {subj.years}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#525b68]">
                  {subj.description}
                </p>
              </div>

              <div className="mt-6 border-t border-[#e2e8f0] pt-4">
                <Link
                  href={`/flashcards/${subj.slug}`}
                  className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#0e1726] py-2.5 px-4 text-xs font-bold text-white transition-colors hover:bg-slate-800"
                >
                  <BookOpen className="h-3.5 w-3.5 text-[#f5a623]" />
                  <span>Select Year / Paper</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

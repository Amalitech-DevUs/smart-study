import Link from "next/link";
import { HomeHero } from "@/components/shared/home-hero";
import { BookOpen, CheckCircle, Brain, FileText, ArrowRight } from "lucide-react";

export default function Home() {
  const subjects = [
    {
      name: "Mathematics",
      slug: "mathematics",
      accentClass: "margin-accent-green",
      badgeColor: "bg-[#edf7f2] text-[#1e7e4e]",
      description: "Algebra, Geometry, Statistics, Vectors & Business Math.",
      questionCount: "BECE 2018 - 2023",
    },
    {
      name: "Integrated Science",
      slug: "science",
      accentClass: "margin-accent-gold",
      badgeColor: "bg-[#fff8eb] text-[#b87609]",
      description: "Biological processes, Matter, Energy, Chemistry & Agriculture.",
      questionCount: "BECE 2018 - 2023",
    },
    {
      name: "English Language",
      slug: "english",
      accentClass: "margin-accent-red",
      badgeColor: "bg-[#fdf2f0] text-[#c0392b]",
      description: "Comprehension passages, Grammar, Idioms & Essay Writing.",
      questionCount: "BECE 2018 - 2023",
    },
    {
      name: "Social Studies",
      slug: "social-studies",
      accentClass: "margin-accent-navy",
      badgeColor: "bg-[#f0f4f9] text-[#0e1726]",
      description: "Governance, Geography, Ghanaian History & Environment.",
      questionCount: "BECE 2018 - 2023",
    },
  ];

  return (
    <div className="bg-[#fbfbfa] min-h-screen pb-20">
      <HomeHero />

      <main className="mx-auto max-w-5xl px-6 py-12">
        
        {/* Core Subject Revision Grid */}
        <section className="mb-14">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#c0392b]">
                Practice by Subject
              </span>
              <h2 className="font-heading text-2xl font-extrabold text-[#0e1726] sm:text-3xl">
                BECE Subject Practice Papers
              </h2>
            </div>
            <Link
              href="/flashcards"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0e1726] underline hover:text-[#f5a623]"
            >
              View all past papers <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {subjects.map((subj) => (
              <article
                key={subj.slug}
                className={`paper-card ${subj.accentClass} flex flex-col justify-between p-6 transition-all hover:border-[#0e1726]/30`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-xl font-bold text-[#0e1726]">
                      {subj.name}
                    </h3>
                    <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${subj.badgeColor}`}>
                      {subj.questionCount}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[#525b68]">
                    {subj.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#e2e8f0] pt-4">
                  <Link
                    href={`/flashcards?subject=${subj.slug}`}
                    className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#0e1726] py-2.5 px-4 text-xs font-bold text-white transition-colors hover:bg-slate-800"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-[#f5a623]" />
                    <span>Practice {subj.name} Questions</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* How to Revise Block */}
        <section className="paper-card margin-accent-gold p-8 bg-white">
          <h2 className="font-heading text-xl font-extrabold text-[#0e1726]">
            How to Revise for BECE Exams
          </h2>
          <p className="mt-1 text-xs text-[#525b68]">
            Simple habits to help Ghanaian JHS candidates prepare with confidence.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#edf7f2] text-[#1e7e4e]">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-[#0e1726]">
                  1. Solve One Year at a Time
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#525b68]">
                  Start with recent BECE past questions. Test yourself without looking at hints first.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#fff8eb] text-[#b87609]">
                <Brain className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-[#0e1726]">
                  2. Review Step-by-Step Solutions
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#525b68]">
                  Understand why an answer is right. Learn the underlying formulas and rules.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#fdf2f0] text-[#c0392b]">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-[#0e1726]">
                  3. Ask Your AI Tutor
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#525b68]">
                  Whenever a question is difficult, ask the BECE AI assistant for simple explanations.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

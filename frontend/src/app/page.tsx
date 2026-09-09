import Link from "next/link";
import { HomeHero } from "@/components/shared/home-hero";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

const subjects = [
  {
    name: "Mathematics",
    slug: "mathematics",
    year: "2018 to 2023",
    description: "Algebra, Geometry, Statistics, Vectors, and Business Math.",
    topics: ["Algebra", "Geometry", "Statistics", "Vectors"],
  },
  {
    name: "Integrated Science",
    slug: "science",
    year: "2018 to 2023",
    description: "Biology, Chemistry, Physics, and Agricultural science.",
    topics: ["Biology", "Chemistry", "Physics", "Agriculture"],
  },
  {
    name: "English Language",
    slug: "english",
    year: "2018 to 2023",
    description: "Comprehension passages, grammar rules, vocabulary, and composition.",
    topics: ["Comprehension", "Grammar", "Vocabulary", "Essay"],
  },
  {
    name: "Social Studies",
    slug: "social-studies",
    year: "2018 to 2023",
    description: "Governance, geography, Ghanaian history, and environmental management.",
    topics: ["Governance", "Geography", "History", "Environment"],
  },
];

export default function Home() {
  return (
    <div className="bg-white min-h-screen pb-28 overflow-x-hidden">
      <HomeHero />

      {/* Why SmartStudy */}
      <ScrollReveal>
        <section className="border-b border-slate-200 px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Overview
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Real exam practice, organized for clarity.
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 text-sm leading-relaxed text-slate-600">
              <p>
                Most students prepare by only reading summaries. Meaningful progress happens when you work through actual past questions, test your understanding, and review what went wrong.
              </p>
              <p>
                SmartStudy brings official WAEC papers together in one structured place, complete with explanations and an interactive tutor to guide you through difficult steps.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Subjects */}
      <section className="px-6 py-16 sm:py-20 border-b border-slate-200 bg-slate-50/50">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Curriculum
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
                  Core Subjects
                </h2>
              </div>
              <Link
                href="/flashcards"
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                View all papers
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {subjects.map((subj, i) => (
              <ScrollReveal key={subj.slug} delay={i * 0.05}>
                <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:border-slate-300 hover:shadow-sm">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-bold text-slate-900">
                        {subj.name}
                      </h3>
                      <span className="text-xs font-medium text-slate-500">
                        {subj.year}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {subj.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {subj.topics.map((t) => (
                        <span
                          key={t}
                          className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      href={`/flashcards?subject=${subj.slug}`}
                      className="inline-flex items-center text-xs font-semibold text-slate-900 hover:text-slate-600 transition-colors"
                    >
                      Practice questions
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tutor Section */}
      <section className="px-6 py-16 sm:py-20 border-b border-slate-200">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
            <ScrollReveal direction="left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Assistance
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
                  Get answers when you get stuck.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  Ask questions about formulas, concepts, or why an answer is correct. The assistant gives direct explanations in simple terms.
                </p>
                <div className="mt-6">
                  <Link
                    href="/chat"
                    className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Open AI Tutor
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 text-xs font-medium text-slate-600">
                  <span>Question walkthrough</span>
                  <span className="text-emerald-600 font-normal">Active</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="rounded-lg bg-white border border-slate-200 p-3 text-slate-800">
                    <p className="font-medium text-slate-500 text-[11px] mb-1">Student</p>
                    <p>Why is option B correct for question 4?</p>
                  </div>

                  <div className="rounded-lg bg-white border border-slate-200 p-3 text-slate-800">
                    <p className="font-medium text-slate-500 text-[11px] mb-1">Tutor</p>
                    <p className="leading-relaxed">
                      Option B is correct because the formula requires squaring the radius before multiplying by pi. Option C missed that step.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <ScrollReveal>
        <section className="px-6 py-20 text-center">
          <div className="mx-auto max-w-xl">
            <h2 className="font-heading text-3xl font-extrabold text-slate-900">
              Start with one subject today.
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Explore past papers, practice questions, and track your progress.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/flashcards"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-slate-900 px-7 py-3 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Browse Flashcards
              </Link>
              <Link
                href="/articles"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Revision Guides
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}

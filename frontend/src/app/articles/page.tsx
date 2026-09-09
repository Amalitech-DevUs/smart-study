import Link from "next/link";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

const subjectArticles = [
  {
    subject: "Mathematics",
    articles: [
      { title: "Understanding Number Bases for BECE", slug: "number-bases-bece", readTime: "5 min read" },
      { title: "How to Tackle Algebra Word Problems", slug: "algebra-word-problems", readTime: "7 min read" },
      { title: "Geometry Shortcuts Every Student Should Know", slug: "geometry-shortcuts", readTime: "6 min read" },
    ],
  },
  {
    subject: "English Language",
    articles: [
      { title: "Comprehension Passage Strategies", slug: "comprehension-strategies", readTime: "4 min read" },
      { title: "Essay Writing: The Blueprint to an A", slug: "essay-blueprint", readTime: "8 min read" },
      { title: "Common Grammar Mistakes in WAEC", slug: "waec-grammar-mistakes", readTime: "5 min read" },
    ],
  },
  {
    subject: "Integrated Science",
    articles: [
      { title: "How to Memorize the Periodic Table Fast", slug: "periodic-table-tips", readTime: "6 min read" },
      { title: "Life Processes: Simplified", slug: "life-processes", readTime: "5 min read" },
      { title: "Common Science Diagrams You Must Draw", slug: "science-diagrams", readTime: "7 min read" },
    ],
  },
  {
    subject: "Social Studies",
    articles: [
      { title: "Ghana Government Structure Explained", slug: "ghana-government", readTime: "6 min read" },
      { title: "Key Historical Events for BECE", slug: "bece-history-events", readTime: "8 min read" },
      { title: "Human Rights and the Ghanaian Student", slug: "human-rights", readTime: "4 min read" },
    ],
  },
];

const featuredArticle = {
  title: "10 Study Habits That Top BECE Candidates Use",
  summary:
    "Practical revision techniques and daily time-management habits compiled from top-performing junior high students across Ghana.",
  readTime: "10 min read",
  slug: "top-study-habits",
};

export default function ArticlesPage() {
  return (
    <main className="flex-1 bg-white pb-28 pt-10 sm:pt-14">
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal>
          <header className="mb-10 border-b border-slate-200 pb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Revision Notes
            </p>
            <h1 className="mt-2 font-heading text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Study Guides & Summaries
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
              Concise summaries, key formulas, and exam strategy for JHS candidates.
            </p>
          </header>
        </ScrollReveal>

        {/* Featured Guide Banner */}
        <ScrollReveal>
          <div className="mb-12 rounded-xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Featured guide</span>
              <span>{featuredArticle.readTime}</span>
            </div>

            <h2 className="mt-3 font-heading text-xl font-bold text-slate-900 sm:text-2xl">
              {featuredArticle.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              {featuredArticle.summary}
            </p>
            <div className="mt-6">
              <Link
                href={`/articles/${featuredArticle.slug}`}
                className="inline-flex min-h-[38px] items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Read full guide
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Subject Article Sections */}
        <div className="space-y-10">
          {subjectArticles.map((section, sIdx) => (
            <section key={section.subject}>
              <ScrollReveal delay={sIdx * 0.04}>
                <h2 className="mb-4 font-heading text-lg font-bold text-slate-900">
                  {section.subject}
                </h2>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {section.articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/articles/${article.slug}`}
                      className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
                    >
                      <h3 className="font-heading text-sm font-semibold text-slate-900 group-hover:text-slate-600 transition-colors leading-snug">
                        {article.title}
                      </h3>
                      <div className="mt-4 border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                        {article.readTime}
                      </div>
                    </Link>
                  ))}
                </div>
              </ScrollReveal>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

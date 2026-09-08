import Link from "next/link";
import { BookOpen } from "lucide-react";

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
      { title: "Ghana's Government Structure Explained", slug: "ghana-government", readTime: "6 min read" },
      { title: "Key Historical Events for BECE", slug: "bece-history-events", readTime: "8 min read" },
      { title: "Human Rights and the Ghanaian Student", slug: "human-rights", readTime: "4 min read" },
    ],
  },
];

const featuredArticle = {
  title: "10 Study Habits That Top BECE & WAEC Candidates Use",
  summary:
    "Practical revision techniques and daily time-management habits compiled from top-performing JHS students across Ghana.",
  readTime: "10 min read",
  slug: "top-study-habits",
};

export default function ArticlesPage() {
  return (
    <main className="flex-1 bg-[#fbfbfa] pb-24 pt-8 sm:pt-12">
      <div className="mx-auto max-w-5xl px-6">

        {/* Header */}
        <header className="mb-8 border-b border-[#e2e8f0] pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#c0392b]">
            BECE Revision Resource
          </span>
          <h1 className="mt-1 font-heading text-3xl font-extrabold text-[#0e1726] sm:text-4xl">
            BECE Study Guides & Revision Notes
          </h1>
          <p className="mt-2 text-sm text-[#525b68]">
            Subject guides, formula breakdowns, and exam preparation tips.
          </p>
        </header>

        {/* Featured Guide Banner */}
        <div className="paper-card margin-accent-gold mb-10 bg-white p-8 border border-[#e2e8f0]">
          <span className="rounded bg-[#fff8eb] border border-[#f5a623]/30 px-2.5 py-1 text-xs font-bold text-[#b87609]">
            Featured Revision Guide
          </span>
          <h2 className="mt-4 font-heading text-2xl font-extrabold text-[#0e1726] sm:text-3xl">
            {featuredArticle.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black font-medium">
            {featuredArticle.summary}
          </p>
          <div className="mt-6">
            <Link
              href={`/articles/${featuredArticle.slug}`}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#0e1726] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-slate-800"
            >
              <BookOpen className="h-4 w-4 text-[#f5a623]" />
              <span>Read Full Revision Guide ({featuredArticle.readTime})</span>
            </Link>
          </div>
        </div>

        {/* Subject Article Sections */}
        <div className="space-y-10">
          {subjectArticles.map((section) => (
            <section key={section.subject}>
              <h2 className="mb-4 font-heading text-xl font-bold text-[#0e1726]">
                {section.subject}
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/articles/${article.slug}`}
                    className="paper-card margin-accent-navy flex flex-col justify-between p-5 transition-all hover:border-[#0e1726]"
                  >
                    <div>
                      <h3 className="font-heading text-base font-bold text-[#0e1726]">
                        {article.title}
                      </h3>
                    </div>
                    <div className="mt-4 border-t border-[#e2e8f0] pt-3 text-xs font-semibold text-[#525b68]">
                      {article.readTime}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

      </div>
    </main>
  );
}

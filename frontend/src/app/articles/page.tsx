import Link from "next/link";
import { ArrowRight } from "lucide-react";

const subjectArticles = [
  {
    subject: "Mathematics",
    articles: [
      { title: "Understanding Number Bases for BECE", slug: "number-bases-bece", readTime: "5 min" },
      { title: "How to Tackle Algebra Word Problems", slug: "algebra-word-problems", readTime: "7 min" },
      { title: "Geometry Shortcuts Every Student Should Know", slug: "geometry-shortcuts", readTime: "6 min" },
    ],
  },
  {
    subject: "English Language",
    articles: [
      { title: "Comprehension Passage Strategies", slug: "comprehension-strategies", readTime: "4 min" },
      { title: "Essay Writing: The Blueprint to an A", slug: "essay-blueprint", readTime: "8 min" },
      { title: "Common Grammar Mistakes in WAEC", slug: "waec-grammar-mistakes", readTime: "5 min" },
    ],
  },
  {
    subject: "Integrated Science",
    articles: [
      { title: "How to Memorize the Periodic Table Fast", slug: "periodic-table-tips", readTime: "6 min" },
      { title: "Life Processes: Simplified", slug: "life-processes", readTime: "5 min" },
      { title: "Common Science Diagrams You Must Draw", slug: "science-diagrams", readTime: "7 min" },
    ],
  },
  {
    subject: "Social Studies",
    articles: [
      { title: "Ghana's Government Structure Explained", slug: "ghana-government", readTime: "6 min" },
      { title: "Key Historical Events for BECE", slug: "bece-history-events", readTime: "8 min" },
      { title: "Human Rights and the Ghanaian Student", slug: "human-rights", readTime: "4 min" },
    ],
  },
];

const featuredArticle = {
  title: "10 Study Habits That Top BECE & WAEC Students Use",
  summary:
    "A breakdown of what separates high scorers from the rest — backed by exam data and student interviews from across Ghana.",
  readTime: "10 min read",
  slug: "top-study-habits",
};

export default function ArticlesPage() {
  return (
    <main className="flex-1 bg-slate-50 pb-24 pt-8 sm:pt-12">
      <div className="mx-auto max-w-5xl px-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
            Study Articles
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Exam guides, revision techniques, and subject strategies for BECE & WAEC.
          </p>
        </div>

        {/* Featured Article */}
        <div className="mb-10 rounded-2xl bg-[#0b132b] p-8 text-white shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
            Featured Guide
          </span>
          <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">
            {featuredArticle.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
            {featuredArticle.summary}
          </p>
          <Link
            href={`/articles/${featuredArticle.slug}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-gold px-5 py-2.5 text-sm font-bold text-brand-indigo transition-all hover:bg-[#f3b250]"
          >
            Read Guide <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Subject Article Sections */}
        <div className="space-y-10">
          {subjectArticles.map((section) => (
            <section key={section.subject}>
              <h2 className="mb-4 font-heading text-xl font-bold text-slate-900">
                {section.subject}
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/articles/${article.slug}`}
                    className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-brand-indigo hover:shadow-md"
                  >
                    <div>
                      <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-brand-indigo">
                        {article.title}
                      </h3>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                      <span>{article.readTime}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-brand-indigo transition-transform group-hover:translate-x-1" />
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

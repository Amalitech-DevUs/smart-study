import Link from "next/link";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

type Article = {
  id: number | string;
  slug: string;
  title: string;
  category: string;
  subject?: string | null;
  body: string;
  publishedAt?: string;
  readTime?: string;
};

// Fallback articles in case backend / content service is not yet reachable
const fallbackArticles: Article[] = [
  {
    id: 1,
    slug: "number-bases-bece",
    title: "Understanding Number Bases for BECE",
    subject: "Mathematics",
    category: "Mathematics",
    readTime: "5 min read",
    body: "Mastering binary, octal, and base 10 conversions for JHS candidates."
  },
  {
    id: 2,
    slug: "algebra-word-problems",
    title: "How to Tackle Algebra Word Problems",
    subject: "Mathematics",
    category: "Mathematics",
    readTime: "7 min read",
    body: "Step-by-step strategies for translating words into algebraic equations."
  },
  {
    id: 3,
    slug: "geometry-shortcuts",
    title: "Geometry Shortcuts Every Student Should Know",
    subject: "Mathematics",
    category: "Mathematics",
    readTime: "6 min read",
    body: "Angle properties of parallel lines and triangles explained simply."
  },
  {
    id: 4,
    slug: "comprehension-strategies",
    title: "Comprehension Passage Strategies",
    subject: "English Language",
    category: "English Language",
    readTime: "4 min read",
    body: "How to read actively, spot main ideas, and answer context clues."
  },
  {
    id: 5,
    slug: "essay-blueprint",
    title: "Essay Writing: The Blueprint to an A",
    subject: "English Language",
    category: "English Language",
    readTime: "8 min read",
    body: "Structuring formal letters, narrative essays, and articles for maximum marks."
  },
  {
    id: 6,
    slug: "waec-grammar-mistakes",
    title: "Common Grammar Mistakes in WAEC",
    subject: "English Language",
    category: "English Language",
    readTime: "5 min read",
    body: "Subject-verb agreement, tenses, and idioms commonly tested in BECE."
  },
  {
    id: 7,
    slug: "periodic-table-tips",
    title: "How to Memorize the Periodic Table Fast",
    subject: "Integrated Science",
    category: "Integrated Science",
    readTime: "6 min read",
    body: "Mnemonics and patterns to master the first 20 elements effortlessly."
  },
  {
    id: 8,
    slug: "life-processes",
    title: "Life Processes: Simplified",
    subject: "Integrated Science",
    category: "Integrated Science",
    readTime: "5 min read",
    body: "Photosynthesis, respiration, excretion, and circulation broken down."
  },
  {
    id: 9,
    slug: "science-diagrams",
    title: "Common Science Diagrams You Must Draw",
    subject: "Integrated Science",
    category: "Integrated Science",
    readTime: "7 min read",
    body: "Accurate labelling guides for the plant cell, flower, and respiratory system."
  },
  {
    id: 10,
    slug: "ghana-government",
    title: "Ghana Government Structure Explained",
    subject: "Social Studies",
    category: "Social Studies",
    readTime: "6 min read",
    body: "The roles of the Executive, Legislature, and Judiciary in Ghana's democracy."
  },
  {
    id: 11,
    slug: "bece-history-events",
    title: "Key Historical Events for BECE",
    subject: "Social Studies",
    category: "Social Studies",
    readTime: "8 min read",
    body: "From the Bond of 1844 to independence in 1957: milestones you must know."
  },
  {
    id: 12,
    slug: "human-rights",
    title: "Human Rights and the Ghanaian Student",
    subject: "Social Studies",
    category: "Social Studies",
    readTime: "4 min read",
    body: "Fundamental human rights, responsibilities, and civic duties."
  },
  {
    id: 13,
    slug: "top-study-habits",
    title: "10 Study Habits That Top BECE Candidates Use",
    subject: null,
    category: "Study Skills",
    readTime: "10 min read",
    body: "Practical revision techniques and daily time-management habits compiled from top-performing junior high students across Ghana."
  }
];

async function getArticles(): Promise<Article[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/articles`, {
      cache: "no-store",
    });
    if (!res.ok) return fallbackArticles;
    const json = await res.json();
    const data = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
    return data.length > 0 ? data : fallbackArticles;
  } catch {
    return fallbackArticles;
  }
}

function calculateReadTime(text?: string): string {
  if (!text) return "5 min read";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  // Pick top study habits or first general article as featured
  const featured =
    articles.find((a) => a.slug === "top-study-habits") ||
    articles.find((a) => a.category === "Study Skills") ||
    articles[0];

  // Group remainder by subject or category
  const subjectGroups: { name: string; articles: Article[] }[] = [];
  const standardSubjects = [
    "Mathematics",
    "English Language",
    "Integrated Science",
    "Social Studies",
  ];

  for (const subj of standardSubjects) {
    const matches = articles.filter(
      (a) =>
        a.slug !== featured?.slug &&
        ((a.subject && a.subject.toLowerCase() === subj.toLowerCase()) ||
          (a.category && a.category.toLowerCase() === subj.toLowerCase()))
    );
    if (matches.length > 0) {
      subjectGroups.push({ name: subj, articles: matches });
    }
  }

  // Any other category (like Study Skills or ICT)
  const otherArticles = articles.filter(
    (a) =>
      a.slug !== featured?.slug &&
      !standardSubjects.some(
        (s) =>
          (a.subject && a.subject.toLowerCase() === s.toLowerCase()) ||
          (a.category && a.category.toLowerCase() === s.toLowerCase())
      )
  );

  if (otherArticles.length > 0) {
    subjectGroups.push({ name: "Study Skills & Revision", articles: otherArticles });
  }

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
        {featured && (
          <ScrollReveal>
            <div className="mb-12 rounded-xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  {featured.category || "Featured guide"}
                </span>
                <span>{calculateReadTime(featured.body)}</span>
              </div>

              <h2 className="mt-3 font-heading text-xl font-bold text-slate-900 sm:text-2xl">
                {featured.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 line-clamp-3">
                {featured.body ? featured.body.split("\n")[0] : ""}
              </p>
              <div className="mt-6">
                <Link
                  href={`/articles/${featured.slug || featured.id || "top-study-habits"}`}
                  className="inline-flex min-h-[38px] items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Read full guide
                </Link>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Subject Article Sections */}
        <div className="space-y-10">
          {subjectGroups.map((section, sIdx) => (
            <section key={section.name}>
              <ScrollReveal delay={sIdx * 0.04}>
                <h2 className="mb-4 font-heading text-lg font-bold text-slate-900">
                  {section.name}
                </h2>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {section.articles.map((article) => (
                    <Link
                      key={article.slug || String(article.id)}
                      href={`/articles/${article.slug || article.id}`}
                      className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
                    >
                      <div>
                        <h3 className="font-heading text-sm font-semibold text-slate-900 group-hover:text-slate-600 transition-colors leading-snug">
                          {article.title}
                        </h3>
                        {article.body && (
                          <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
                            {article.body.split("\n")[0]}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                        {calculateReadTime(article.body)}
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

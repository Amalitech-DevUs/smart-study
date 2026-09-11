import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, Calendar } from "lucide-react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

type Article = {
  id?: number | string;
  slug: string;
  title: string;
  body: string;
  category: string;
  subject?: string | null;
  published_at?: string;
  publishedAt?: string;
};

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const subjectThemes: Record<string, { bg: string; text: string; border: string; slug: string }> = {
  Mathematics: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    slug: "mathematics",
  },
  "English Language": {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    slug: "english",
  },
  "Integrated Science": {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    slug: "science",
  },
  "Social Studies": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    slug: "social-studies",
  },
};

async function getArticle(slug: string): Promise<Article | null> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  const CONTENT_DB_URL = process.env.CONTENT_SERVICE_URL || "http://localhost:5002";

  const endpoints = [
    `${API_BASE_URL}/articles/${slug}`,
    `${CONTENT_DB_URL}/articles/${slug}`,
  ];

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const article = json.data || json;
        if (article && article.title) {
          return article;
        }
      }
    } catch {
      // Try next endpoint
    }
  }

  return null;
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const theme = article.subject && subjectThemes[article.subject]
    ? subjectThemes[article.subject]
    : {
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        border: "border-indigo-200",
        slug: "mathematics",
      };

  const wordCount = article.body.split(/\s+/).length;
  const readMinutes = Math.max(3, Math.ceil(wordCount / 180));
  const pubDate = article.published_at || article.publishedAt;
  const formattedDate = pubDate
    ? new Date(pubDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Latest Edition";

  // Process paragraphs and subheadings
  const sections = article.body.split("\n\n").map((block) => block.trim()).filter(Boolean);

  return (
    <main className="flex-1 bg-white px-6 py-10 pb-28 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <div className="flex items-center justify-between border-b border-slate-200 pb-5">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>All Revision Guides</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${theme.bg} ${theme.text}`}>
                {article.category}
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Header */}
        <ScrollReveal delay={0.05}>
          <header className="mt-8">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              {article.subject && (
                <span className={`font-semibold ${theme.text}`}>
                  {article.subject}
                </span>
              )}
              <span>&bull;</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {readMinutes} min read
              </span>
              <span>&bull;</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </span>
            </div>

            <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl sm:leading-tight">
              {article.title}
            </h1>
          </header>
        </ScrollReveal>

        {/* Content Body */}
        <article className="mt-8 space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base border-t border-slate-100 pt-8">
          {sections.map((block, idx) => {
            // Check if block is a section header (short line without ending period)
            const isHeading =
              block.length < 75 &&
              !block.includes(".") &&
              !block.startsWith("1.") &&
              !block.startsWith("2.") &&
              !block.startsWith("3.") &&
              !block.startsWith("4.") &&
              !block.includes("=");

            // Check if block looks like arithmetic or code block
            const isMathBlock =
              block.includes("------") ||
              block.includes("base 2 =") ||
              block.includes("base 4") ||
              block.includes("base 5 =") ||
              (block.includes("remainder") && block.includes("/ 2 ="));

            if (isHeading) {
              return (
                <h2
                  key={idx}
                  className="mt-8 pt-2 font-heading text-xl font-bold text-slate-900 border-l-2 border-slate-900 pl-3"
                >
                  {block}
                </h2>
              );
            }

            if (isMathBlock) {
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs sm:text-sm text-slate-800 whitespace-pre-wrap overflow-x-auto shadow-inner"
                >
                  {block}
                </div>
              );
            }

            return (
              <p key={idx} className="leading-relaxed">
                {block}
              </p>
            );
          })}
        </article>

        {/* Footer Actions */}
        <ScrollReveal delay={0.1}>
          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  Ready to test your knowledge?
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Practice authentic BECE past questions with immediate feedback.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {article.subject && (
                  <Link
                    href={`/flashcards/${theme.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <BookOpen className="h-4 w-4 text-amber-400" />
                    <span>{article.subject} Practice</span>
                  </Link>
                )}
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span>More Guides</span>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}

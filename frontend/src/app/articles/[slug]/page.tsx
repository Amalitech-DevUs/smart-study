import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, Tag } from "lucide-react";

type Article = {
  id: number | string;
  slug: string;
  title: string;
  category: string;
  subject?: string | null;
  body: string;
  publishedAt?: string;
};

async function getArticle(slug: string): Promise<Article | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  try {
    const res = await fetch(
      `${baseUrl.replace(/\/$/, "")}/articles/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? json) as Article;
  } catch {
    return null;
  }
}

function calculateReadTime(text?: string): string {
  if (!text) return "5 min read";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

type ArticleDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  // Split text paragraphs gracefully
  const paragraphs = article.body ? article.body.split(/\n\s*\n/) : [];

  return (
    <main className="flex-1 bg-white px-6 py-12 pb-28 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0e1726] transition-colors hover:text-[#c0392b]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>All Revision Articles</span>
        </Link>

        <article className="mt-8 rounded-2xl border border-[#e2e8f0] bg-white p-8 sm:p-12 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            {article.subject && (
              <span className="rounded-full bg-[#edf7f2] px-3 py-1 text-xs font-bold text-[#1e7e4e]">
                {article.subject}
              </span>
            )}
            {article.category && article.category !== article.subject && (
              <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                <Tag className="h-3 w-3 text-slate-400" />
                {article.category}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-[#64748b]">
              <Clock className="h-3.5 w-3.5" />
              {calculateReadTime(article.body)}
            </span>
            {article.publishedAt && (
              <span className="text-xs text-[#94a3b8]">
                &bull; {formatDate(article.publishedAt)}
              </span>
            )}
          </div>

          <h1 className="mt-6 font-heading text-3xl font-extrabold text-[#0e1726] sm:text-4xl leading-tight">
            {article.title}
          </h1>

          <div className="mt-8 space-y-5 text-sm sm:text-base leading-relaxed text-[#334155]">
            {paragraphs.map((p, idx) => {
              const trimmed = p.trim();
              if (!trimmed) return null;

              // Check if line looks like a subheader (e.g. numbered point or heading)
              const isHeader = /^((\d+[\.\)])|[A-Z][\w\s\-]+:)/.test(trimmed) && trimmed.length < 90 && !trimmed.includes("\n");

              if (isHeader) {
                return (
                  <h3 key={idx} className="font-heading text-base sm:text-lg font-bold text-slate-900 pt-2">
                    {trimmed}
                  </h3>
                );
              }

              return (
                <p key={idx} className="leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap gap-3 border-t border-[#e2e8f0] pt-6">
            <Link
              href="/flashcards"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0e1726] px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-[#1a2d4a]"
            >
              <BookOpen className="h-4 w-4 text-[#f5a623]" />
              <span>Practice Past Questions</span>
            </Link>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] px-5 py-3 text-xs font-bold text-[#0e1726] transition-colors hover:bg-[#f8fafc]"
            >
              <span>Back to All Guides</span>
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}

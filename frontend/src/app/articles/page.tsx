import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { masterArticles, type Article } from "@/lib/articles-data";

async function getArticles(): Promise<Article[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/articles`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) return masterArticles;
    const json = await res.json();
    const data = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
    return data.length > 0 ? data : masterArticles;
  } catch {
    return masterArticles;
  }
}

function calculateReadTime(text?: string): string {
  if (!text) return "5 min read";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

export default async function ArticlesPage() {
  const user = await getCurrentUser();
  if (!user.loggedIn) {
    redirect("/login?redirect=/articles");
  }

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
    <main className="flex-1 bg-white pb-28 pt-8 sm:pt-12">
      <div className="mx-auto max-w-4xl px-6">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <ScrollReveal>
          <header className="mb-10 border-b border-slate-200 pb-8">
            <div className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200/60 px-3 py-0.5 text-xs font-semibold text-amber-800 mb-3">
              <span>BECE Revision Notes</span>
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-slate-900 sm:text-4xl">
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

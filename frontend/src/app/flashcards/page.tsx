import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SUBJECTS } from "@/lib/constants/subjects";

export default async function FlashcardsPage() {
  const user = await getCurrentUser();
  if (!user.loggedIn) {
    redirect("/login?redirect=/flashcards");
  }

  return (
    <main className="flex-1 min-h-screen bg-[#f8f9fa] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
        </div>

        <ScrollReveal>
          <div className="mb-8 border-b border-slate-200 pb-6">
            <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
              Past Examination Papers
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600">
              Select a WAEC core subject below to browse past exam papers, practice untimed by topic, or simulate official 45-minute timed examinations.
            </p>
          </div>
        </ScrollReveal>

        {/* Subject cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {SUBJECTS.map((subj, index) => (
            <ScrollReveal key={subj.slug} delay={index * 0.05}>
              <Link
                href={`/flashcards/${subj.slug}`}
                className={`group flex flex-col justify-between rounded-xl border border-slate-200 border-l-4 ${subj.accentBorder} bg-white p-5 shadow-xs transition-all duration-150 hover:border-slate-300 hover:shadow-sm`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-heading text-base font-bold text-slate-900">
                      {subj.name}
                    </h2>
                    <span
                      className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${subj.badgeBg} ${subj.badgeText}`}
                    >
                      {subj.years}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                    {subj.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>
                      {subj.paperCount} paper{subj.paperCount > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold ${subj.badgeText} transition-all group-hover:gap-1.5`}
                  >
                    Browse papers
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom hint */}
        <p className="mt-8 text-center text-xs text-slate-400">
          All past papers include official WAEC marking guidelines and instant AI curriculum explanations.
        </p>
      </div>
    </main>
  );
}

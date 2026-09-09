import Link from "next/link";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";

export default function ArticleDetailPage() {
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

        <div className="mt-8 rounded-2xl border border-[#e2e8f0] bg-white p-8 sm:p-12 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#edf7f2] px-3 py-1 text-xs font-bold text-[#1e7e4e]">
              Revision Guide
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#64748b]">
              <Clock className="h-3.5 w-3.5" />
              Comprehensive breakdown
            </span>
          </div>

          <h1 className="mt-6 font-heading text-3xl font-extrabold text-[#0e1726] sm:text-4xl">
            Study Guide in Progress
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-[#525b68]">
            This revision guide is being updated with the latest WAEC syllabus references, worked examples, and sample answers. Please check back shortly or explore our past exam questions.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
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
              <span>Back to Guides</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

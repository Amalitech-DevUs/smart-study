import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

type Subject = {
  slug: string;
  name: string;
  paperCount: number;
  questionCount: number;
  years: string;
  description: string;
  accentBorder: string;
  accentBg: string;
  accentText: string;
  accentBadge: string;
};

const subjects: Subject[] = [
  {
    slug: "mathematics",
    name: "Mathematics",
    paperCount: 7,
    questionCount: 280,
    years: "2020–2026",
    description: "Algebra, plane geometry, word problems, statistics, and number bases.",
    accentBorder: "border-l-[#1e7e4e]",
    accentBg: "bg-emerald-50",
    accentText: "text-emerald-700",
    accentBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    slug: "english",
    name: "English Language",
    paperCount: 7,
    questionCount: 280,
    years: "2020–2026",
    description: "Comprehension passages, grammar rules, vocabulary, antonyms, and composition.",
    accentBorder: "border-l-[#c0392b]",
    accentBg: "bg-rose-50",
    accentText: "text-rose-700",
    accentBadge: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    slug: "science",
    name: "Integrated Science",
    paperCount: 1,
    questionCount: 60,
    years: "2026 Mock",
    description: "Life processes, chemical compounds, electrical circuits, and soil science.",
    accentBorder: "border-l-[#f5a623]",
    accentBg: "bg-amber-50",
    accentText: "text-amber-700",
    accentBadge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    slug: "social-studies",
    name: "Social Studies",
    paperCount: 7,
    questionCount: 196,
    years: "2020–2026",
    description: "Ghanaian governance, physical environment, colonization history, and citizenship.",
    accentBorder: "border-l-[#0e1726]",
    accentBg: "bg-slate-100",
    accentText: "text-slate-700",
    accentBadge: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    slug: "french",
    name: "French",
    paperCount: 1,
    questionCount: 40,
    years: "2026",
    description: "Grammaire, vocabulaire, compréhension de texte, et conjugaison pour le BECE.",
    accentBorder: "border-l-[#2563eb]",
    accentBg: "bg-blue-50",
    accentText: "text-blue-700",
    accentBadge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    slug: "computing",
    name: "Computing",
    paperCount: 3,
    questionCount: 120,
    years: "2024–2026",
    description: "Computer systems, algorithms, hardware, networking, programming logic, and cybersecurity.",
    accentBorder: "border-l-[#0891b2]",
    accentBg: "bg-cyan-50",
    accentText: "text-cyan-700",
    accentBadge: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    slug: "rme",
    name: "Religious and Moral Education",
    paperCount: 1,
    questionCount: 40,
    years: "2026",
    description: "Creation stories, moral teachings, traditional beliefs, festivals, and ethical living.",
    accentBorder: "border-l-[#ea580c]",
    accentBg: "bg-orange-50",
    accentText: "text-orange-700",
    accentBadge: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    slug: "creative-arts",
    name: "Creative Arts and Design",
    paperCount: 3,
    questionCount: 120,
    years: "2024–2026",
    description: "Visual arts, performing arts, design principles, Ghanaian cultural crafts, and aesthetics.",
    accentBorder: "border-l-[#9333ea]",
    accentBg: "bg-purple-50",
    accentText: "text-purple-700",
    accentBadge: "bg-purple-50 text-purple-700 border-purple-200",
  },
];

export default async function FlashcardsPage() {
  const user = await getCurrentUser();
  if (!user.loggedIn) {
    redirect("/login?redirect=/flashcards");
  }

  return (
    <main className="flex-1 min-h-screen bg-[#f8f9fc] px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-3xl">
        {/* Back */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
        </div>

        <ScrollReveal>
          <div className="mb-8 border-b border-slate-200 pb-7">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 mb-3 shadow-sm">
              <BookOpen className="h-3.5 w-3.5 text-slate-500" />
              WAEC Exam Preparation
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Past Question Flashcards
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
              Choose a subject below to start practicing official multiple-choice questions with instant grading.
            </p>
          </div>
        </ScrollReveal>

        {/* Subject cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {subjects.map((subj, index) => (
            <ScrollReveal key={subj.slug} delay={index * 0.06}>
              <Link
                href={`/flashcards/${subj.slug}`}
                className={`group flex flex-col justify-between rounded-2xl border border-slate-200 border-l-4 ${subj.accentBorder} bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-heading text-lg font-bold text-slate-900">
                      {subj.name}
                    </h2>
                    <span
                      className={`shrink-0 rounded-lg border px-2.5 py-1 text-[11px] font-bold ${subj.accentBadge}`}
                    >
                      {subj.years}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    {subj.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{subj.paperCount} paper{subj.paperCount > 1 ? "s" : ""}</span>
                    <span>·</span>
                    <span>~{subj.questionCount} questions</span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${subj.accentText} transition-all group-hover:gap-2`}>
                    Select year
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom hint */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Sessions are saved automatically — pause and resume any time.
        </p>
      </div>
    </main>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { HomeHero } from "@/components/shared/home-hero";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { BookOpen, Bot, Zap, Award } from "lucide-react";

const subjects = [
  {
    name: "Mathematics",
    slug: "mathematics",
    year: "2020-2026",
    description: "Algebra, plane geometry, word problems, statistics, and number bases.",
    topics: ["Algebra", "Geometry", "Statistics", "Vectors"],
  },
  {
    name: "English Language",
    slug: "english",
    year: "2020-2026",
    description: "Comprehension passages, grammar rules, vocabulary, and composition.",
    topics: ["Comprehension", "Grammar", "Vocabulary", "Lexis"],
  },
  {
    name: "Integrated Science",
    slug: "science",
    year: "2026 Mock",
    description: "Life processes, chemical compounds, electrical circuits, and soil science.",
    topics: ["Biology", "Chemistry", "Physics", "Agriculture"],
  },
  {
    name: "Social Studies",
    slug: "social-studies",
    year: "2020-2026",
    description: "Governance, geography, Ghanaian history, and environmental management.",
    topics: ["Governance", "Geography", "History", "Environment"],
  },
  {
    name: "French",
    slug: "french",
    year: "2026 Paper 1",
    description: "Grammaire, vocabulaire, compréhension écrite et expressions idiomatiques.",
    topics: ["Grammaire", "Vocabulaire", "Compréhension", "Conjugaison"],
  },
  {
    name: "Computing",
    slug: "computing",
    year: "2024-2026",
    description: "Computer hardware, algorithms, networking, logic, and online safety.",
    topics: ["Hardware", "Programming Logic", "Networking", "Cybersecurity"],
  },
  {
    name: "Religious & Moral Education",
    slug: "rme",
    year: "2026 Paper 1",
    description: "Creation stories, moral values, religious practices, and traditional teachings.",
    topics: ["Moral Teachings", "Festivals", "Religion", "Ethics"],
  },
  {
    name: "Creative Arts & Design",
    slug: "creative-arts",
    year: "2024-2026",
    description: "Visual arts, performing arts, Ghanaian crafts, and design fundamentals.",
    topics: ["Visual Arts", "Design Principles", "Performing Arts", "Crafts"],
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Official Past Papers",
    description: "1,130+ verified multiple-choice questions from real WAEC examinations across 8 subjects, 2020 to 2026.",
  },
  {
    icon: Bot,
    title: "AI Study Tutor",
    description: "Ask any BECE question and get a clear, step-by-step explanation in plain language.",
  },
  {
    icon: Zap,
    title: "Instant Grading",
    description: "Know immediately whether your answer is right, and see the correct reasoning.",
  },
  {
    icon: Award,
    title: "Progress Tracking",
    description: "Session state is saved so you can pause and pick up exactly where you left off.",
  },
];

export default async function Home() {
  const user = await getCurrentUser();
  if (user.loggedIn) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <HomeHero />

      {/* Features Showcase */}
      <ScrollReveal>
        <section className="border-b border-slate-200 bg-slate-50/60 px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Why SmartStudy</p>
            <h2 className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Everything you need for BECE success.
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div key={f.title}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0e1726] text-amber-400 shadow-sm">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-sm font-bold text-slate-900">{f.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Curriculum Showcase (Non-clickable informative cards) */}
      <section className="border-b border-slate-200 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Curriculum</p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">Core Subjects</h2>
              </div>
              <span className="text-xs font-medium text-slate-500">
                Official WAEC Syllabus
              </span>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {subjects.map((subj, i) => (
              <ScrollReveal key={subj.slug} delay={i * 0.05}>
                <div
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading text-base font-bold text-slate-900">{subj.name}</h3>
                      <span className="shrink-0 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        {subj.year}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">{subj.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {subj.topics.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-slate-100 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 border-t border-slate-100 pt-3 text-[11px] font-medium text-slate-400 flex items-center justify-between">
                    <span>BECE Examination Prep</span>
                    <span className="text-slate-700 font-semibold">Included</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tutor Showcase */}
      <section className="border-b border-slate-200 bg-slate-50/60 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
            <ScrollReveal direction="left">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                  AI Tutor Online
                </div>
                <h2 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
                  Get answers when you get stuck.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  Ask questions about formulas, concepts, or why an answer is correct.
                  The assistant gives direct, curriculum-aligned explanations in simple terms.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0e1726]">
                      <Bot className="h-3.5 w-3.5 text-amber-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">SmartStudy AI</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#0e1726] px-3.5 py-2.5 text-xs text-white">
                      Why is option B correct for question 4?
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-3 text-xs text-slate-700 leading-relaxed">
                    <p className="font-semibold text-slate-800 mb-1">SmartStudy AI</p>
                    Option B is correct because the formula requires squaring the radius before multiplying by pi. Option C skipped that step, giving the wrong area.
                  </div>
                </div>
                <div className="border-t border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="text-xs text-slate-400 flex-1">Ask anything about BECE...</span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0e1726]">
                      <span className="text-[10px] text-amber-400">&#8593;</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Landing Page CTA Section */}
      <ScrollReveal>
        <section className="px-6 py-20 text-center">
          <div className="mx-auto max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Get Started</p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-slate-900">
              Start with one subject today.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Explore past papers, practice questions, and get AI explanations all in one place.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-[#0e1726] px-8 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:scale-[0.98]"
              >
                Create Free Account
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98]"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
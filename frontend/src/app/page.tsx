import Link from "next/link";
import { HomeHero } from "@/components/shared/home-hero";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const steps = [
    {
      number: "01",
      title: "Pick a subject",
      description: "Select from Mathematics, English, Integrated Science, or Social Studies.",
    },
    {
      number: "02",
      title: "Practice past questions",
      description: "Work through exam-style multiple choice questions one flashcard at a time.",
    },
    {
      number: "03",
      title: "Track your progress",
      description: "Learn from instant step-by-step feedback and build your daily study habit.",
    },
  ];

  const subjects = [
    {
      name: "Mathematics",
      slug: "mathematics",
      description: "Algebra, Geometry, Statistics & Arithmetic",
    },
    {
      name: "English Language",
      slug: "english",
      description: "Grammar, Comprehension, Vocabulary & Idioms",
    },
    {
      name: "Integrated Science",
      slug: "science",
      description: "Biology, Chemistry, Physics & Agricultural Science",
    },
    {
      name: "Social Studies",
      slug: "social-studies",
      description: "Governance, Geography, History & Environment",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <HomeHero />
      <main id="next-section" className="relative pb-20">

        {/* How It Works Section */}
        <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="text-center sm:text-left">
            <h2 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
              How Smart Study Works
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Turn a few focused minutes each day into steady exam confidence.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map(({ number, title, description }) => (
              <article
                key={number}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
              >
                <span className="font-heading text-lg font-extrabold text-brand-gold">
                  {number}
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Subjects Section */}
        <section className="border-t border-slate-200 bg-white px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
                  Explore Subjects
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Choose a subject to start practicing BECE & WAEC past questions.
                </p>
              </div>
              <Link
                href="/flashcards"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-indigo hover:underline"
              >
                Browse all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {subjects.map((subj) => (
                <Link
                  key={subj.slug}
                  href={`/flashcards?subject=${subj.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition-all hover:border-brand-indigo hover:bg-white hover:shadow-md"
                >
                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-brand-indigo">
                      {subj.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      {subj.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-brand-indigo">
                    <span>Practice Now</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

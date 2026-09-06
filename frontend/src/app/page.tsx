import Link from "next/link";
import { HomeHero } from "@/components/shared/home-hero";

export default function Home() {
  return (
    <div className="bg-background">
      <HomeHero />
      <main id="next-section">
        <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wide text-brand-gold">
              A clearer way to revise
            </p>
            <h2 className="mt-3 font-heading text-4xl font-bold text-brand-indigo sm:text-5xl">
              How it works
            </h2>
            <p className="mt-4 text-lg leading-8 text-text-secondary">
              Turn a few focused minutes into steady progress you can feel.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [
                "01",
                "Pick a subject",
                "Choose the topic you want to strengthen today.",
              ],
              [
                "02",
                "Practice past questions",
                "Work through exam-style questions one card at a time.",
              ],
              [
                "03",
                "Track your progress",
                "Learn from every attempt and keep your momentum going.",
              ],
            ].map(([number, title, description]) => (
              <article
                key={number}
                className="rounded-lg border border-text-secondary/15 bg-white p-6 shadow-sm"
              >
                <span className="font-heading text-3xl font-bold text-brand-gold">
                  {number}
                </span>
                <h3 className="mt-5 font-heading text-2xl font-bold text-brand-indigo">
                  {title}
                </h3>
                <p className="mt-3 leading-7 text-text-secondary">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-subject-math-light/40 px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-brand-gold">
                  Start where you are
                </p>
                <h2 className="mt-3 font-heading text-4xl font-bold text-brand-indigo sm:text-5xl">
                  Explore subjects
                </h2>
              </div>
              <Link
                href="/flashcards"
                className="font-medium text-brand-indigo underline decoration-brand-gold underline-offset-4"
              >
                See all subjects
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                {
                  icon: "∑",
                  subject: "Mathematics",
                  color: "text-subject-math",
                },
                {
                  icon: "Aa",
                  subject: "English",
                  color: "text-subject-english",
                },
                {
                  icon: "⚗",
                  subject: "Science",
                  color: "text-subject-science",
                },
                {
                  icon: "✦",
                  subject: "Mixed practice",
                  color: "text-brand-indigo",
                },
              ].map(({ icon, subject, color }) => (
                <Link
                  key={subject}
                  href="/flashcards"
                  className="rounded-lg border border-text-secondary/15 bg-white p-5 shadow-sm transition-colors hover:border-brand-gold"
                >
                  <span className={`font-heading text-3xl font-bold ${color}`}>
                    {icon}
                  </span>
                  <h3 className="mt-5 font-heading text-xl font-bold text-text-primary">
                    {subject}
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    Practice now
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

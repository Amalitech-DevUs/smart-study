type SubjectColor = "math" | "english" | "science" | "social-studies";

type Subject = {
  slug: string;
  name: string;
  paperCount: number;
  color: SubjectColor;
};

// TODO: replace with real subject data from the Content Database service
const subjects: Subject[] = [
  { slug: "mathematics", name: "Mathematics", paperCount: 5, color: "math" },
  {
    slug: "english",
    name: "English Language",
    paperCount: 5,
    color: "english",
  },
  { slug: "science", name: "Science", paperCount: 5, color: "science" },
  {
    slug: "social-studies",
    name: "Social Studies",
    paperCount: 5,
    color: "social-studies",
  },
];

const subjectStyles: Record<SubjectColor, string> = {
  math: "bg-subject-math-light text-subject-math",
  english: "bg-subject-english-light text-subject-english",
  science: "bg-subject-science-light text-subject-science",
  "social-studies":
    "bg-subject-social-studies-light text-subject-social-studies",
};

export default function FlashcardsPage() {
  return (
    <main className="flex-1 bg-background px-6 py-10 pb-24 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="text-sm font-medium uppercase tracking-wide text-brand-gold">
            Past paper practice
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-brand-indigo sm:text-5xl">
            Choose a subject
          </h1>
          <p className="mt-3 max-w-xl text-text-secondary">
            Pick a subject to browse past papers and start practicing at your
            own pace.
          </p>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {subjects.map((subject) => (
            <article
              key={subject.slug}
              className="rounded-lg border border-text-secondary/15 bg-white p-6 shadow-[0_2px_8px_rgba(31,36,48,0.08)]"
            >
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${subjectStyles[subject.color]}`}
              >
                {subject.name}
              </span>
              <h2 className="mt-6 font-heading text-3xl font-bold text-text-primary">
                {subject.name}
              </h2>
              <p className="mt-2 text-text-secondary">
                {subject.paperCount} past papers
              </p>
              <a
                href={`/flashcards/${subject.slug}`}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-brand-indigo px-5 py-3 font-medium text-white transition-colors hover:bg-brand-indigo/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-indigo"
              >
                Start practicing
              </a>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

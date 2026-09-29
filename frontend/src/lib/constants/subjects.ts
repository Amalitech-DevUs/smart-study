// Canonical subject configuration for SmartStudy BECE revision platform.
// Single source of truth — used by dashboard, landing page, flashcards, and nav.

export type SubjectSlug =
  | "mathematics"
  | "english"
  | "science"
  | "social-studies"
  | "french"
  | "computing"
  | "rme"
  | "creative-arts"
  | "career-technology"
  | "ict";

export type SubjectColor =
  | "math"
  | "english"
  | "science"
  | "social-studies"
  | "french"
  | "computing"
  | "rme"
  | "creative-arts"
  | "career-tech"
  | "ict";

export type SubjectConfig = {
  slug: SubjectSlug;
  name: string;
  displayName: string;
  color: SubjectColor;
  paperCount: number;
  years: string;
  latestYear: number;
  // Dashboard subject card colors
  accentBarColor: string;
  badgeBg: string;
  badgeText: string;
  // Landing page subject card
  accentBorder: string;
  landingBadge: string;
  // MCQ card badge
  mcqBadge: { bg: string; text: string; border: string };
  // Landing page description & topics
  description: string;
  topics: string[];
};

export const SUBJECTS: SubjectConfig[] = [
  {
    slug: "mathematics",
    name: "Mathematics",
    displayName: "Mathematics",
    color: "math",
    paperCount: 7,
    years: "2020–2026",
    latestYear: 2026,
    accentBarColor: "bg-emerald-600",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    accentBorder: "border-l-[#1e7e4e]",
    landingBadge: "bg-emerald-50 text-emerald-700",
    mcqBadge: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
    description: "Algebra, plane geometry, word problems, statistics, and number bases.",
    topics: ["Algebra", "Geometry", "Statistics", "Vectors"],
  },
  {
    slug: "english",
    name: "English Language",
    displayName: "English",
    color: "english",
    paperCount: 7,
    years: "2020–2026",
    latestYear: 2026,
    accentBarColor: "bg-rose-600",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
    accentBorder: "border-l-[#c0392b]",
    landingBadge: "bg-rose-50 text-rose-700",
    mcqBadge: { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
    description: "Comprehension passages, grammar rules, vocabulary, and composition.",
    topics: ["Comprehension", "Grammar", "Vocabulary", "Lexis"],
  },
  {
    slug: "science",
    name: "Integrated Science",
    displayName: "Science",
    color: "science",
    paperCount: 1,
    years: "2026 Mock",
    latestYear: 2026,
    accentBarColor: "bg-amber-500",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    accentBorder: "border-l-[#f5a623]",
    landingBadge: "bg-amber-50 text-amber-700",
    mcqBadge: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
    description: "Life processes, chemical compounds, electrical circuits, and soil science.",
    topics: ["Biology", "Chemistry", "Physics", "Agriculture"],
  },
  {
    slug: "social-studies",
    name: "Social Studies",
    displayName: "Social Studies",
    color: "social-studies",
    paperCount: 7,
    years: "2020–2026",
    latestYear: 2026,
    accentBarColor: "bg-slate-600",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
    accentBorder: "border-l-[#0e1726]",
    landingBadge: "bg-slate-100 text-slate-700",
    mcqBadge: { bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-200" },
    description: "Governance, geography, Ghanaian history, and environmental management.",
    topics: ["Governance", "Geography", "History", "Environment"],
  },
  {
    slug: "french",
    name: "French",
    displayName: "French",
    color: "french",
    paperCount: 1,
    years: "2026",
    latestYear: 2026,
    accentBarColor: "bg-blue-600",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    accentBorder: "border-l-blue-600",
    landingBadge: "bg-blue-50 text-blue-800",
    mcqBadge: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
    description: "Grammaire, vocabulaire, compréhension écrite et expressions idiomatiques.",
    topics: ["Grammaire", "Vocabulaire", "Compréhension", "Conjugaison"],
  },
  {
    slug: "computing",
    name: "Computing",
    displayName: "Computing",
    color: "computing",
    paperCount: 3,
    years: "2024–2026",
    latestYear: 2026,
    accentBarColor: "bg-cyan-600",
    badgeBg: "bg-cyan-50",
    badgeText: "text-cyan-700",
    accentBorder: "border-l-cyan-600",
    landingBadge: "bg-cyan-50 text-cyan-700",
    mcqBadge: { bg: "bg-cyan-50", text: "text-cyan-800", border: "border-cyan-200" },
    description: "Fundamentals of hardware, software, networking, programming, and digital citizenship.",
    topics: ["Hardware", "Software", "Networking", "Programming"],
  },
  {
    slug: "rme",
    name: "Religious and Moral Education",
    displayName: "RME",
    color: "rme",
    paperCount: 1,
    years: "2026",
    latestYear: 2026,
    accentBarColor: "bg-purple-600",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    accentBorder: "border-l-purple-600",
    landingBadge: "bg-purple-50 text-purple-700",
    mcqBadge: { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200" },
    description: "Christian, Islamic, and African Traditional Religion values, morals, and community living.",
    topics: ["Christianity", "Islam", "Traditional Religion", "Morals"],
  },
  {
    slug: "creative-arts",
    name: "Creative Arts and Design",
    displayName: "Creative Arts",
    color: "creative-arts",
    paperCount: 3,
    years: "2024–2026",
    latestYear: 2026,
    accentBarColor: "bg-pink-600",
    badgeBg: "bg-pink-50",
    badgeText: "text-pink-700",
    accentBorder: "border-l-pink-600",
    landingBadge: "bg-pink-50 text-pink-700",
    mcqBadge: { bg: "bg-pink-50", text: "text-pink-800", border: "border-pink-200" },
    description: "Visual arts, graphic design, Ghanaian crafts, performing arts, and art appreciation.",
    topics: ["Visual Arts", "Graphic Design", "Crafts", "Performing Arts"],
  },
  {
    slug: "career-technology",
    name: "Career Technology",
    displayName: "Career Tech",
    color: "career-tech",
    paperCount: 3,
    years: "2024–2026",
    latestYear: 2026,
    accentBarColor: "bg-amber-600",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-800",
    accentBorder: "border-l-amber-600",
    landingBadge: "bg-amber-50 text-amber-800",
    mcqBadge: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
    description: "Technical drawing, workshop safety, tools and materials, food and nutrition, and garment making.",
    topics: ["Health & Safety", "Tools & Equipment", "Technical Drawing", "Food & Nutrition", "Materials"],
  },
];

/** Look up subject config by slug. Falls back to a safe default. */
export function getSubjectConfig(slug: string): SubjectConfig {
  const normalized = slug.toLowerCase() === "ict" ? "computing" : slug;
  return (
    SUBJECTS.find((s) => s.slug === normalized) ?? {
      slug: normalized as SubjectSlug,
      name: slug,
      displayName: slug,
      color: "math",
      paperCount: 1,
      years: "2026",
      latestYear: 2026,
      accentBarColor: "bg-slate-600",
      badgeBg: "bg-slate-100",
      badgeText: "text-slate-700",
      accentBorder: "border-l-slate-600",
      landingBadge: "bg-slate-100 text-slate-700",
      mcqBadge: { bg: "bg-slate-50", text: "text-slate-800", border: "border-slate-200" },
      description: "",
      topics: [],
    }
  );
}

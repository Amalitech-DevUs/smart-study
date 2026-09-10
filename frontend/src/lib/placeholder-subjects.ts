import type {
  McqQuestion,
  SubjectColor,
} from "@/components/flashcards/mcq-card";

export type PlaceholderPaper = {
  year: number;
  questionCount: number;
};

export type PlaceholderSubject = {
  slug: string;
  name: string;
  subjectColor: SubjectColor;
  papers: PlaceholderPaper[];
};

export const placeholderSubjects: PlaceholderSubject[] = [
  {
    slug: "mathematics",
    name: "Mathematics",
    subjectColor: "math",
    papers: [
      { year: 2020, questionCount: 34 },
      { year: 2021, questionCount: 36 },
      { year: 2022, questionCount: 37 },
      { year: 2023, questionCount: 39 },
      { year: 2024, questionCount: 36 },
      { year: 2025, questionCount: 35 },
      { year: 2026, questionCount: 38 },
    ],
  },
  {
    slug: "english",
    name: "English Language",
    subjectColor: "english",
    papers: [
      { year: 2020, questionCount: 30 },
      { year: 2021, questionCount: 30 },
      { year: 2022, questionCount: 30 },
      { year: 2023, questionCount: 30 },
      { year: 2024, questionCount: 40 },
      { year: 2025, questionCount: 40 },
      { year: 2026, questionCount: 40 },
    ],
  },
  {
    slug: "science",
    name: "Integrated Science",
    subjectColor: "science",
    papers: [
      { year: 2026, questionCount: 40 },
    ],
  },
  {
    slug: "social-studies",
    name: "Social Studies",
    subjectColor: "social-studies",
    papers: [
      { year: 2020, questionCount: 40 },
    ],
  },
];

export const sampleQuestions: McqQuestion[] = [
  {
    id: "math-percent",
    subject: "Mathematics",
    subjectColor: "math",
    question: "What is 15% of 200?",
    options: [
      { id: "a", text: "15" },
      { id: "b", text: "30" },
      { id: "c", text: "45" },
      { id: "d", text: "60" },
    ],
    correctOptionId: "b",
  },
  {
    id: "english-synonym",
    subject: "English",
    subjectColor: "english",
    question: "Which word is a synonym for happy?",
    options: [
      { id: "a", text: "Joyful" },
      { id: "b", text: "Angry" },
      { id: "c", text: "Tired" },
      { id: "d", text: "Quiet" },
    ],
    correctOptionId: "a",
  },
  {
    id: "science-heart",
    subject: "Science",
    subjectColor: "science",
    question: "Which organ pumps blood around the body?",
    options: [
      { id: "a", text: "Lung" },
      { id: "b", text: "Brain" },
      { id: "c", text: "Heart" },
      { id: "d", text: "Kidney" },
    ],
    correctOptionId: "c",
  },
  {
    id: "math-perimeter",
    subject: "Mathematics",
    subjectColor: "math",
    question: "What is the perimeter of a square with sides of 6 cm?",
    options: [
      { id: "a", text: "12 cm" },
      { id: "b", text: "18 cm" },
      { id: "c", text: "24 cm" },
      { id: "d", text: "36 cm" },
    ],
    correctOptionId: "c",
  },
  {
    id: "english-plural",
    subject: "English",
    subjectColor: "english",
    question: "What is the plural form of child?",
    options: [
      { id: "a", text: "Childs" },
      { id: "b", text: "Childes" },
      { id: "c", text: "Children" },
      { id: "d", text: "Childrens" },
    ],
    correctOptionId: "c",
  },
  {
    id: "science-photosynthesis",
    subject: "Science",
    subjectColor: "science",
    question: "What gas do plants take in during photosynthesis?",
    options: [
      { id: "a", text: "Oxygen" },
      { id: "b", text: "Nitrogen" },
      { id: "c", text: "Hydrogen" },
      { id: "d", text: "Carbon dioxide" },
    ],
    correctOptionId: "d",
  },
];

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GraduationCap, BookOpen, MessageSquare } from "lucide-react";

const phrases = [
  "Master Mathematics.",
  "Master Integrated Science.",
  "Master English Language.",
  "Master Social Studies.",
  "one card at a time.",
];

export function HomeHero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const currentPhrase = phrases[phraseIndex];
    const typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && displayedText === currentPhrase) {
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && displayedText === "") {
      timeoutId = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
      }, 500);
    } else {
      timeoutId = setTimeout(() => {
        const nextChar = isDeleting
          ? currentPhrase.slice(0, displayedText.length - 1)
          : currentPhrase.slice(0, displayedText.length + 1);
        setDisplayedText(nextChar);
      }, typeSpeed);
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, isDeleting, phraseIndex]);

  return (
    <section className="relative border-b border-[#0e1726]/10 bg-[#0e1726] px-6 py-14 text-white sm:py-20">
      <div className="mx-auto max-w-4xl">
        
        {/* BECE Exam Header Badge */}
        <div className="inline-flex items-center gap-2 rounded-md bg-[#f5a623]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#f5a623] border border-[#f5a623]/30">
          <GraduationCap className="h-4 w-4" />
          <span>Ghana JHS BECE & WAEC Exam Prep</span>
        </div>

        {/* Animated Main Headline */}
        <h1 className="mt-5 font-heading text-3xl font-extrabold leading-tight text-white sm:text-5xl min-h-[110px] sm:min-h-[135px]">
          Solve BECE Past Questions &{" "}
          <span className="inline-block text-[#f5a623]">
            {displayedText}
            <span className="inline-block w-1 bg-[#f5a623] animate-pulse ml-1 text-transparent">|</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Practice official WAEC multiple-choice questions by subject and year. Get step-by-step guidance from your BECE study tutor whenever you need help.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
          <Link
            href="/flashcards"
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#f5a623] px-6 py-3 font-heading text-sm font-bold text-[#0e1726] transition-colors hover:bg-[#e0951a] focus-visible:ring-2 focus-visible:ring-white"
          >
            <BookOpen className="h-4 w-4" />
            <span>Start Practice Questions</span>
          </Link>
          
          <Link
            href="/chat"
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-6 py-3 font-heading text-sm font-bold text-slate-100 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Ask BECE Tutor</span>
          </Link>
        </div>

        {/* Key Subjects Strip */}
        <div className="mt-10 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 border-t border-slate-800 pt-6">
          <span className="text-slate-300">Core BECE Subjects:</span>
          <span className="rounded bg-slate-800 px-2.5 py-1 text-slate-300">Mathematics</span>
          <span className="rounded bg-slate-800 px-2.5 py-1 text-slate-300">Integrated Science</span>
          <span className="rounded bg-slate-800 px-2.5 py-1 text-slate-300">English Language</span>
          <span className="rounded bg-slate-800 px-2.5 py-1 text-slate-300">Social Studies</span>
        </div>

      </div>
    </section>
  );
}

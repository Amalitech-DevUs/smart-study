"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const fullText = "one card at a time.";

export function HomeHero() {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const typeSpeed = isDeleting ? 50 : 90;

    if (!isDeleting && displayedText === fullText) {
      // Pause at the end before erasing
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
      }, 2500);
    } else if (isDeleting && displayedText === "") {
      // Pause before typing again
      timeoutId = setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    } else {
      timeoutId = setTimeout(() => {
        const nextChar = isDeleting
          ? fullText.slice(0, displayedText.length - 1)
          : fullText.slice(0, displayedText.length + 1);
        setDisplayedText(nextChar);
      }, typeSpeed);
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, isDeleting]);

  return (
    <section className="relative flex flex-col items-center justify-center border-b border-slate-800 bg-[#0b132b] px-6 py-20 text-center text-white sm:py-28">
      <div className="relative z-10 max-w-3xl">

        {/* Clean Pill Badge */}
        <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-slate-700 bg-slate-800/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-gold">
          BECE & WAEC Exam Revision
        </div>

        {/* Headline with Typewriter Animation */}
        <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl min-h-[120px] sm:min-h-[150px]">
          Ace your BECE & WAEC,{" "}
          <span className="inline-block text-brand-gold">
            {displayedText}
            <span className="inline-block w-1 bg-brand-gold animate-pulse ml-0.5 sm:ml-1 text-transparent">|</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Master real exam questions through bite-sized flashcard sessions, interactive step-by-step solutions, and instant AI study support.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/flashcards"
            className="flex min-h-11 w-full items-center justify-center rounded-xl bg-brand-gold px-7 py-3 font-heading text-sm font-bold text-brand-indigo transition-all hover:bg-[#f3b250] active:scale-95 sm:w-auto"
          >
            Start Practice Free
          </Link>
          <Link
            href="/chat"
            className="flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-800/60 px-7 py-3 font-heading text-sm font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white active:scale-95 sm:w-auto"
          >
            Ask AI Assistant
          </Link>
        </div>

        {/* Clean bullet features */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400">
          <span>• Past Exam Questions</span>
          <span>• Real-time Feedback</span>
          <span>• Detailed Explanations</span>
        </div>

      </div>
    </section>
  );
}

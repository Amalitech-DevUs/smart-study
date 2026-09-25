"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/use-auth";

const phrases = [
  "Mathematics",
  "Integrated Science",
  "English Language",
  "Social Studies",
];

export function HomeHero() {
  const router = useRouter();
  const { loggedIn, isLoading } = useAuth();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isLoading && loggedIn) {
      router.replace("/dashboard");
    }
  }, [loggedIn, isLoading, router]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const currentPhrase = phrases[phraseIndex];
    const typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && displayedText === currentPhrase) {
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
      }, 2200);
    } else if (isDeleting && displayedText === "") {
      timeoutId = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
      }, 400);
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
    <section className="border-b border-slate-800 bg-[#0e1726] px-6 py-16 text-white sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-4xl"
      >
        <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/60 px-3.5 py-1 text-xs font-medium text-slate-300">
          BECE and WAEC Exam Prep
        </div>

        <h1 className="mt-6 font-heading text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl min-h-[105px] sm:min-h-[135px]">
          Master past questions in{" "}
          <span className="text-[#f5a623]">
            {displayedText}
            <span className="inline-block w-0.5 h-7 sm:h-11 bg-[#f5a623] align-middle ml-1 animate-pulse" />
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          Practice official multiple-choice questions by subject and year. Get clear step-by-step guidance whenever you need help.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/signup"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-white px-7 py-3 text-sm font-bold text-[#0e1726] transition-all hover:bg-slate-100 shadow-sm active:scale-[0.99]"
          >
            Start Practice
          </Link>

          <Link
            href="/login"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-700 bg-slate-800/60 px-7 py-3 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-800 active:scale-[0.99]"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-2 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
          <span className="text-slate-500 mr-2">Core subjects:</span>
          {["Mathematics", "Integrated Science", "English Language", "Social Studies"].map((item) => (
            <span key={item} className="rounded-md border border-slate-800 bg-slate-900/50 px-2.5 py-1 text-slate-300">
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

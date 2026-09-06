"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const headlines = [
  "Ace your BECE, one card at a time.",
  "Turn every study session into exam-day confidence.",
  "Your smarter path to BECE success starts here.",
];

export function HomeHero() {
  const [visibleText, setVisibleText] = useState(headlines[0]);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    let phraseIndex = 0;
    let characterIndex = 0;
    let animationTimeout: ReturnType<typeof setTimeout> | undefined;

    const typeNextCharacter = () => {
      const phrase = headlines[phraseIndex];
      characterIndex += 1;
      setVisibleText(phrase.slice(0, characterIndex));
      setShowCursor(true);

      if (characterIndex < phrase.length) {
        animationTimeout = setTimeout(typeNextCharacter, 65);
      } else {
        animationTimeout = setTimeout(eraseNextCharacter, 3000);
      }
    };

    const eraseNextCharacter = () => {
      characterIndex -= 1;
      setVisibleText(headlines[phraseIndex].slice(0, characterIndex));

      if (characterIndex > 0) {
        animationTimeout = setTimeout(eraseNextCharacter, 35);
      } else {
        phraseIndex = (phraseIndex + 1) % headlines.length;
        animationTimeout = setTimeout(typeNextCharacter, 350);
      }
    };

    animationTimeout = setTimeout(() => {
      setVisibleText("");
      setShowCursor(true);
      characterIndex = 0;
      typeNextCharacter();
    }, 0);

    return () => {
      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }
    };
  }, []);

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-brand-indigo px-6 py-24 text-center text-white">
      <div className="max-w-4xl">
        <h1 className="font-heading text-5xl font-bold leading-tight text-white sm:text-6xl md:text-7xl">
          {visibleText}
          {showCursor && (
            <span
              aria-hidden="true"
              className="ml-1 animate-pulse text-brand-gold"
            >
              |
            </span>
          )}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/80 sm:text-xl">
          Build confidence with focused practice designed to help you learn,
          revise, and shine on exam day.
        </p>
        <Link
          href="/flashcards"
          className="mt-10 inline-flex items-center justify-center rounded-md bg-brand-gold px-6 py-3 font-medium text-brand-indigo transition-colors hover:bg-brand-gold/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
        >
          Start practicing
        </Link>
      </div>

      <a
        href="#next-section"
        aria-label="Scroll to the next section"
        className="absolute bottom-8 animate-bounce text-3xl text-brand-gold transition-opacity hover:opacity-80"
      >
        ↓
      </a>
    </section>
  );
}

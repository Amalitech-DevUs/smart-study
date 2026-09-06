"use client";

import Link from "next/link";
import { useState } from "react";

export function SaveProgressBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <aside className="mt-6 flex items-start justify-between gap-4 rounded-lg border border-brand-gold/30 bg-brand-gold/10 p-4 text-left">
      <div>
        <p className="font-medium text-brand-indigo">
          Sign in to save your progress
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          Keep your practice history available across sessions.
        </p>
        <Link
          href="/login?redirect=%2Fflashcards"
          className="mt-3 inline-flex min-h-11 items-center rounded-md bg-brand-gold px-4 py-2 text-sm font-medium text-brand-indigo transition-colors hover:bg-brand-gold/90"
        >
          Log in
        </Link>
      </div>
      <button
        type="button"
        aria-label="Dismiss save progress message"
        onClick={() => setIsDismissed(true)}
        className="text-xl leading-none text-text-secondary transition-colors hover:text-brand-indigo"
      >
        ×
      </button>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { useAuth } from "@/lib/use-auth";
import { ArrowLeft, Home, Compass } from "lucide-react";

export default function NotFound() {
  const { loggedIn } = useAuth();

  return (
    <main className="flex min-h-[70vh] flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0e1726]">
          <Compass className="h-8 w-8 text-amber-400 animate-spin-slow" />
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-amber-600">404 Error</p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          The revision page, subject, or resource you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={loggedIn ? "/dashboard" : "/"}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0e1726] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:scale-95"
          >
            {loggedIn ? (
              <>
                <ArrowLeft className="h-4 w-4" />
                Return to Dashboard
              </>
            ) : (
              <>
                <Home className="h-4 w-4" />
                Return to Home
              </>
            )}
          </Link>

          {loggedIn && (
            <Link
              href="/flashcards"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
            >
              Browse Flashcards
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

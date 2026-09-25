import React from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export function LandingCta() {
  return (
    <ScrollReveal>
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Get Started
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-slate-900">
            Start with one subject today.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Explore past papers, practice questions, and get AI explanations all in one place.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-[#0e1726] px-8 py-3 text-sm font-bold text-white shadow-xs transition-all hover:bg-slate-800 active:scale-[0.98]"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

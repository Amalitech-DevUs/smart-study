import React from "react";
import Link from "next/link";
import { BookOpen, Bot, TrendingUp } from "lucide-react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

const valuePoints = [
  {
    icon: BookOpen,
    title: "853+ verified WAEC questions",
    description: "Practice real exam questions from 2020 to 2026.",
  },
  {
    icon: Bot,
    title: "A curriculum-aligned AI tutor",
    description:
      "Get clear explanations when a question or concept gets difficult.",
  },
  {
    icon: TrendingUp,
    title: "Progress you can follow",
    description: "Completed practice sessions stay in your history over time.",
  },
];

export function LandingCta() {
  return (
    <ScrollReveal>
      <section className="border-t border-slate-200 px-6 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Get Started
          </p>
          <h2 className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Everything you need to walk into the BECE ready.
          </h2>
          <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
            {valuePoints.map((point, index) => (
              <ScrollReveal key={point.title} delay={index * 0.08}>
                <div className="h-full rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0e1726] text-amber-400 shadow-xs">
                    <point.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-sm font-bold text-slate-900">
                    {point.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                    {point.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/flashcards"
              className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-[#0e1726] px-8 py-3 text-sm font-bold text-white shadow-xs transition-all hover:bg-slate-800 active:scale-[0.98]"
            >
              Start practicing
            </Link>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

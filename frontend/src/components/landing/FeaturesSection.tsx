import React from "react";
import { BookOpen, Bot, Zap, Award } from "lucide-react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

const features = [
  {
    icon: BookOpen,
    title: "Official Past Papers",
    description:
      "853+ verified multiple-choice questions from real WAEC examinations, 2020 to 2026.",
  },
  {
    icon: Bot,
    title: "AI Study Tutor",
    description:
      "Ask any BECE question and get a clear, step-by-step explanation in plain language.",
  },
  {
    icon: Zap,
    title: "Instant Grading",
    description:
      "Know immediately whether your answer is right, and see the correct reasoning.",
  },
  {
    icon: Award,
    title: "Progress Tracking",
    description:
      "Session state is saved so you can pause and pick up exactly where you left off.",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-b border-slate-200 bg-slate-50/60 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Why SmartStudy
          </p>
          <h2 className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Everything you need for BECE success.
          </h2>
        </ScrollReveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.08}>
              <div className="h-full rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0e1726] text-amber-400 shadow-xs">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-sm font-bold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{f.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

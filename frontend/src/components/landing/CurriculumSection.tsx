import React from "react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SUBJECTS } from "@/lib/constants/subjects";

export function CurriculumSection() {
  return (
    <section className="border-b border-slate-200 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Curriculum
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
                Core Subjects
              </h2>
            </div>
            <span className="text-xs font-medium text-slate-500">Official WAEC Syllabus</span>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {SUBJECTS.map((subj, i) => (
            <ScrollReveal key={subj.slug} delay={i * 0.05}>
              <div
                className={`flex flex-col justify-between rounded-xl border border-slate-200 border-l-4 ${subj.accentBorder} bg-white p-6 shadow-xs`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading text-base font-bold text-slate-900">
                      {subj.name}
                    </h3>
                    <span
                      className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${subj.landingBadge}`}
                    >
                      {subj.years}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    {subj.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {subj.topics.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-slate-100 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 border-t border-slate-100 pt-3 text-[11px] font-medium text-slate-400 flex items-center justify-between">
                  <span>BECE Examination Prep</span>
                  <span className="text-emerald-600 font-semibold">Included</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

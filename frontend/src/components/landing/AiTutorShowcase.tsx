import React from "react";
import { Bot } from "lucide-react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export function AiTutorShowcase() {
  return (
    <section className="border-b border-slate-200 bg-slate-50/60 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
          <ScrollReveal direction="left">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-xs font-semibold text-emerald-700 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                AI Tutor Online
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
                Get answers when you get stuck.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Ask questions about formulas, concepts, or why an answer is correct. The
                assistant gives direct, curriculum-aligned explanations in simple terms.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0e1726]">
                    <Bot className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">SmartStudy AI</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </div>
              </div>
              <div className="space-y-3 p-4">
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-xl rounded-tr-xs bg-[#0e1726] px-3.5 py-2.5 text-xs text-white">
                    Why is option B correct for question 4?
                  </div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-3 text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-slate-800 mb-1">SmartStudy AI</p>
                  Option B is correct because the formula requires squaring the radius before
                  multiplying by pi. Option C skipped that step, giving the wrong area.
                </div>
              </div>
              <div className="border-t border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-xs text-slate-400 flex-1">
                    Ask anything about BECE...
                  </span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0e1726]">
                    <span className="text-[10px] text-amber-400">&#8593;</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

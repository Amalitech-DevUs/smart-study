import React from "react";
import { AppLogoBadge } from "@/components/shared/app-logo";
import { QUICK_CHAT_PROMPTS } from "@/lib/constants/chat-prompts";

type Props = {
  onSelectPrompt?: (prompt: string) => void;
};

export function EmptyChatState({ onSelectPrompt }: Props) {
  return (
    <div className="my-auto flex flex-col items-center justify-center text-center w-full max-w-md mx-auto py-4 sm:py-6 px-1">
      <AppLogoBadge size="lg" />

      <div className="mt-2.5 inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-3 py-0.5 text-[10px] sm:text-[11px] font-semibold text-slate-700">
        <span>AI Study Companion</span>
      </div>

      <h3 className="mt-2 font-heading text-base sm:text-xl font-bold text-slate-900 leading-tight">
        SmartStudy Revision Tutor
      </h3>
      <p className="mt-1 text-[11px] sm:text-xs text-slate-500 leading-relaxed max-w-[260px] sm:max-w-xs">
        Ask any BECE question or pick a topic below.
      </p>

      <div className="mt-4 sm:mt-6 w-full space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-left px-1">
          Sample questions
        </p>
        <div className="grid gap-2 text-left">
          {QUICK_CHAT_PROMPTS.map((item) => (
            <button
              key={item.prompt}
              type="button"
              onClick={() => onSelectPrompt?.(item.prompt)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 sm:p-3 text-[11px] sm:text-xs text-slate-800 transition-all hover:border-slate-400 hover:bg-slate-50 hover:shadow-xs flex items-center justify-between gap-2 group w-full"
            >
              <span className="font-medium group-hover:text-slate-950 text-left line-clamp-2 sm:truncate leading-snug">
                {item.prompt}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 whitespace-nowrap">
                {item.subject}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

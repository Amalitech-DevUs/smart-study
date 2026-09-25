import React from "react";
import { GraduationCap } from "lucide-react";

type LoaderProps = {
  size?: "sm" | "md" | "lg" | "fullscreen";
  text?: string;
  subtext?: string;
};

export function Loader({
  size = "md",
  text = "Loading...",
  subtext,
}: LoaderProps) {
  if (size === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-300">
        <div className="relative flex items-center justify-center">
          {/* Pulsing ring */}
          <div className="absolute h-20 w-20 rounded-full border-2 border-amber-400/40 animate-ping opacity-75" />
          <div className="absolute h-16 w-16 rounded-full border-2 border-indigo-500/30 animate-pulse" />
          
          {/* Logo badge */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0e1726] text-amber-400 shadow-xl">
            <GraduationCap className="h-7 w-7 animate-bounce" />
          </div>
        </div>

        <div className="mt-5 text-center">
          <p className="font-heading text-base font-bold text-slate-900 animate-pulse">
            {text}
          </p>
          {subtext && (
            <p className="mt-1 text-xs text-slate-500 max-w-xs">{subtext}</p>
          )}
        </div>
      </div>
    );
  }

  if (size === "sm") {
    return (
      <div className="inline-flex items-center gap-2 text-xs text-slate-500">
        <div className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-indigo-600 animate-spin" />
        {text && <span>{text}</span>}
      </div>
    );
  }

  if (size === "lg") {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="relative flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-3 border-slate-200 border-t-indigo-600 animate-spin" />
          <div className="absolute flex h-7 w-7 items-center justify-center rounded-lg bg-[#0e1726] text-amber-400 shadow-xs">
            <GraduationCap className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-3 font-heading text-sm font-bold text-slate-900">{text}</p>
        {subtext && <p className="mt-0.5 text-xs text-slate-500">{subtext}</p>}
      </div>
    );
  }

  // size === "md"
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
      <div className="h-5 w-5 rounded-full border-2 border-slate-200 border-t-indigo-600 animate-spin shrink-0" />
      <div>
        <p className="text-xs font-semibold text-slate-800">{text}</p>
        {subtext && <p className="text-[11px] text-slate-400">{subtext}</p>}
      </div>
    </div>
  );
}

import React from "react";
import { Sparkles, BookOpenCheck, Target } from "lucide-react";

type Props = {
  username: string | undefined;
};

export function WelcomeBanner({ username }: Props) {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  })();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-4 sm:p-6 lg:p-7 shadow-sm mb-6 text-white">
      {/* Decorative ambient background glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 relative z-10">
        {/* Left greeting text */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 mb-2 sm:mb-2.5">
           
            <span>BECE Revision Portal</span>
          </div>

          <h2 className="font-heading text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span>{greeting},</span>
            <span className="text-amber-400">{username || "Student"}</span>
          </h2>

          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-300 max-w-lg">
            Stay updated with your academic journey and prepare effectively for your upcoming BECE examinations.
          </p>
        </div>

        
      </div>
    </div>
  );
}

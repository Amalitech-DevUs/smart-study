import React from "react";

type Props = {
  username: string | undefined;
  streak: number;
};

export function ProfileIdentitySection({ username, streak }: Props) {
  const initials = username ? username.slice(0, 2).toUpperCase() : "ST";

  return (
    <section
      aria-label="Student Identity"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Clean avatar initials */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0e1726] font-heading text-base font-bold text-white shadow-xs">
            {initials}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-lg font-bold text-slate-900">
                {username || "Student"}
              </h2>
              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              BECE Candidate &bull; SmartStudy student
            </p>
          </div>
        </div>

        {streak > 0 && (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 self-start sm:self-center">
            <span>{streak} day study streak</span>
          </div>
        )}
      </div>
    </section>
  );
}

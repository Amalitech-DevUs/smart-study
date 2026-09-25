import React from "react";

type Props = {
  username: string | undefined;
};

export function AccountInfoSection({ username }: Props) {
  return (
    <section
      aria-labelledby="account-info-heading"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
    >
      <h3
        id="account-info-heading"
        className="font-heading text-sm font-bold text-slate-900 mb-3"
      >
        Account Information
      </h3>

      <div className="divide-y divide-slate-100 text-xs">
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-slate-500 font-medium">Username</span>
          <span className="font-semibold text-slate-900">{username || "Student"}</span>
        </div>

        <div className="py-2.5 flex items-center justify-between">
          <span className="text-slate-500 font-medium">Account Status</span>
          <span className="font-semibold text-emerald-700">Active</span>
        </div>

        <div className="py-2.5 flex items-center justify-between">
          <span className="text-slate-500 font-medium">Exam Target</span>
          <span className="font-semibold text-slate-900">BECE 2026</span>
        </div>

        <div className="py-2.5 flex items-center justify-between">
          <span className="text-slate-500 font-medium">Syllabus Scope</span>
          <span className="font-semibold text-slate-900">WAEC Ghana (JHS 1 – 3)</span>
        </div>

        <div className="py-2.5 flex items-center justify-between">
          <span className="text-slate-500 font-medium">Security PIN</span>
          <span className="font-mono text-slate-700 tracking-wider">••••••</span>
        </div>
      </div>
    </section>
  );
}

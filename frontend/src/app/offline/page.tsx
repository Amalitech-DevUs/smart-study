"use client";

import Link from "next/link";
import { WifiOff, RotateCcw, BookOpen, Layers } from "lucide-react";

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-xs border border-amber-200/60 mb-6">
        <WifiOff className="h-8 w-8" />
      </div>

      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        You are currently offline
      </h1>

      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
        It looks like your internet connection is lost. Don&apos;t worry! Any study
        materials and flashcards you previously visited are saved locally.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleReload}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#0e1726] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-slate-800 active:scale-[0.98]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Try Reconnecting</span>
        </button>

        <Link
          href="/flashcards"
          className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 active:scale-[0.98]"
        >
          <Layers className="h-3.5 w-3.5 text-amber-500" />
          <span>Cached Flashcards</span>
        </Link>
      </div>

      <div className="mt-12 rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 max-w-sm text-left">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <BookOpen className="h-4 w-4 text-emerald-600" />
          <span>Offline Study Tip</span>
        </div>
        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
          Open your practice subjects while connected so SmartStudy can cache
          them for your commute or offline study sessions.
        </p>
      </div>
    </div>
  );
}

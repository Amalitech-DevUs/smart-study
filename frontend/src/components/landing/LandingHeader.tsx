"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { useAuth } from "@/lib/use-auth";

export function LandingHeader() {
  const { loggedIn, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0e1726]/95 backdrop-blur-md px-6 py-3.5 text-white transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 font-heading text-lg font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5a623] text-slate-950 shadow-sm">
            <GraduationCap className="h-4.5 w-4.5" />
          </div>
          <span>SmartStudy</span>
        </Link>

      

        {/* Auth action buttons */}
        <div className="flex items-center gap-3">
          {!isLoading && loggedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors shadow-xs"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#0e1726] hover:bg-slate-100 transition-all shadow-xs active:scale-[0.98]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useAuth } from "@/lib/use-auth";
import { GraduationCap, User as UserIcon } from "lucide-react";

export function MobileTopBar() {
  const { loggedIn, username, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-800 bg-[#0b132b] px-4 py-3 text-white md:hidden">

      {/* Brand */}
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold text-brand-indigo">
          <GraduationCap className="h-4 w-4" />
        </div>
        <span className="font-heading text-lg font-bold tracking-tight text-white">
          Smart<span className="text-brand-gold">Study</span>
        </span>
      </Link>

      {/* Auth Buttons */}
      <div className="flex items-center gap-2">
        {!isLoading && loggedIn ? (
          <Link
            href="/profile"
            className="flex items-center gap-1.5 rounded-lg border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-xs font-bold text-brand-gold"
          >
            <UserIcon className="h-3.5 w-3.5" />
            <span>{username ?? "Profile"}</span>
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-brand-gold px-3 py-1 text-xs font-bold text-brand-indigo"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

    </header>
  );
}

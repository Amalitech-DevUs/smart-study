"use client";

import Link from "next/link";
import { useAuth } from "@/lib/use-auth";
import { User as UserIcon } from "lucide-react";

export function MobileTopBar() {
  const { loggedIn, username, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-800 bg-[#0e1726] px-4 py-3 text-white md:hidden">
      {/* Brand */}
      <Link href="/" className="font-heading text-base font-bold tracking-tight text-white">
        SmartStudy
      </Link>

      {/* Auth */}
      <div className="flex items-center gap-2">
        {!isLoading && loggedIn ? (
          <Link
            href="/profile"
            className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200"
          >
            <UserIcon className="h-3 w-3" />
            <span>{username ?? "Profile"}</span>
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="px-2 py-1 text-xs font-medium text-slate-300 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-slate-950 hover:bg-slate-100"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/use-auth";
import { User as UserIcon, GraduationCap, LogOut } from "lucide-react";
import { NotificationCenter } from "@/components/shared/notification-center";

export function TopNav() {
  const pathname = usePathname();
  const { loggedIn, username, isLoading, logout } = useAuth();

  const navLinks = loggedIn
    ? [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Flashcards", href: "/flashcards" },
        { label: "AI Tutor", href: "/chat" },
        { label: "Articles", href: "/articles" },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Flashcards", href: "/flashcards" },
        { label: "AI Tutor", href: "/chat" },
        { label: "Articles", href: "/articles" },
      ];

  // Hide on auth pages and active exam runner session
  const isExamRunner = pathname.startsWith("/flashcards/") && pathname.split("/").filter(Boolean).length >= 3;
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/register" ||
    isExamRunner
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 hidden w-full border-b border-slate-800 bg-[#0e1726] px-6 py-3.5 text-white md:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Brand */}
        <Link
          href={loggedIn ? "/dashboard" : "/"}
          className="inline-flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400 text-slate-950">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span>SmartStudy</span>
        </Link>

        {/* Navigation Links - Hidden on root landing page for a clean landing experience */}
        {pathname !== "/" && (
          <nav className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/60 p-1">
            {navLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-slate-800 text-white font-semibold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {pathname !== "/" && <NotificationCenter />}
          {!isLoading && loggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <UserIcon className="h-3.5 w-3.5" />
                <span>{username ?? "Profile"}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/60 px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:border-rose-900/50 hover:bg-rose-950/30 hover:text-rose-400"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Log out</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-slate-100"
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

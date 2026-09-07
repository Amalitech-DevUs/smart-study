"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/use-auth";
import { GraduationCap, User as UserIcon } from "lucide-react";

export function TopNav() {
  const pathname = usePathname();
  const { loggedIn, username, isLoading } = useAuth();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Flashcards", href: "/flashcards" },
    { label: "AI Assistant", href: "/chat" },
    { label: "Articles", href: "/articles" },
  ];

  return (
    <header className="sticky top-0 z-40 hidden w-full border-b border-slate-800 bg-[#0b132b] px-6 py-3.5 text-white md:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gold text-brand-indigo">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-white">
            Smart<span className="text-brand-gold">Study</span>
          </span>
        </Link>

        {/* Center Nav Links - Simple & Clean */}
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
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-gold text-brand-indigo font-bold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {!isLoading && loggedIn ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-xl border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1.5 text-sm font-semibold text-brand-gold transition-colors hover:bg-brand-gold/20"
            >
              <UserIcon className="h-4 w-4" />
              <span>{username ?? "Profile"}</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-brand-gold px-4 py-1.5 text-sm font-bold text-brand-indigo transition-all hover:bg-[#f3b250]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

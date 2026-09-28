"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/use-auth";
import { LogOut, GraduationCap, User as UserIcon } from "lucide-react";
import {
  NAV_LINKS_LOGGED_IN,
  NAV_LINKS_PUBLIC,
} from "@/lib/constants/navigation";

export function SideNav() {
  const pathname = usePathname();
  const { loggedIn, username, isLoading, logout } = useAuth();

  const isExamRunner =
    pathname.startsWith("/flashcards/") &&
    pathname.split("/").filter(Boolean).length >= 3;

  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/register" ||
    isExamRunner
  ) {
    return null;
  }

  const navLinks = loggedIn ? NAV_LINKS_LOGGED_IN : NAV_LINKS_PUBLIC;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes("#")) {
      const [, hash] = href.split("#");
      if (pathname === "/dashboard") {
        e.preventDefault();
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `#${hash}`);
        }
      }
    }
  };

  // Filter out profile — it's in the nav links list, not pinned separately at bottom
  const mainLinks = navLinks.filter((l) => l.href !== "/profile");

  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-[240px] flex-col border-r border-slate-200 bg-white text-slate-800 shadow-[1px_0_10px_rgba(0,0,0,0.04)]">
      {/* Brand Header — clean black and white */}
      <div className="bg-[#0e1726] p-5 text-white border-b border-slate-800/60">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5a623] text-slate-950 shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <Link
            href={loggedIn ? "/dashboard" : "/"}
            className="mt-3 font-heading text-lg font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
          >
            SmartStudy
          </Link>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
            BECE Exam Prep
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-4">
        <ul className="space-y-0.5">
          {mainLinks.map((item) => {
            const Icon = item.icon;
            const isHash = item.href.includes("#");
            const isActive =
              !isHash &&
              (item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href)));

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#0e1726] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: User info + Logout only */}
      <div className="mt-auto border-t border-slate-100 p-3.5 space-y-1 bg-slate-50/50">
        {!isLoading && loggedIn ? (
          <>
            <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0e1726] text-white font-bold text-[11px]">
                {username ? username.charAt(0).toUpperCase() : <UserIcon className="h-3.5 w-3.5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900 leading-tight text-[11px]">
                  {username ?? "Student"}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight">
                  BECE Candidate
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4 shrink-0 text-rose-500" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          !isLoading && (
            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="block w-full rounded-xl bg-[#0e1726] px-3 py-2 text-center text-xs font-bold text-white hover:bg-slate-900 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )
        )}
      </div>
    </aside>
  );
}

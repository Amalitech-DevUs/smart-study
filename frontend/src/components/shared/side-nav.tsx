"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/use-auth";
import { useNotifications } from "@/lib/notification-context";
import { LogOut, GraduationCap, User as UserIcon, PanelLeftClose } from "lucide-react";
import {
  NAV_LINKS_LOGGED_IN,
  NAV_LINKS_PUBLIC,
} from "@/lib/constants/navigation";

type SideNavProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function SideNav({ isOpen = true, onClose }: SideNavProps) {
  const pathname = usePathname();
  const { loggedIn, username, isLoading, logout } = useAuth();
  const { unreadCount } = useNotifications();

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
    <aside
      className={`hidden md:flex fixed left-0 top-0 z-50 isolate h-screen w-[240px] flex-col border-r border-slate-800 bg-slate-900 text-slate-300 shadow-[1px_0_10px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
      }`}
    >
      {/* Brand Header — sleek dark navy */}
      <div className="relative bg-slate-950 p-5 text-white border-b border-slate-800/80 shrink-0">
        {/* Close sidebar button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}

        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-md">
            <GraduationCap className="h-6 w-6" />
          </div>
          <Link
            href={loggedIn ? "/dashboard" : "/"}
            className="mt-3 font-heading text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors"
          >
            SmartStudy
          </Link>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
            BECE Exam Prep
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-3.5 py-4">
        <ul className="space-y-1">
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
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-slate-800 text-white shadow-xs border-l-2 border-emerald-400"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? "text-emerald-400" : "text-slate-400"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.href === "/notifications" && unreadCount > 0 && (
                    <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-bold text-slate-950">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: Structured User Info & Logout Container */}
      <div className="shrink-0 border-t border-slate-800 bg-slate-950/70 p-3.5 flex flex-col gap-3">
        {!isLoading && loggedIn ? (
          <>
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-amber-400 font-bold text-xs shadow-inner">
                {username ? username.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-100 leading-tight text-xs">
                  {username ?? "Student"}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight truncate mt-0.5">
                  BECE Candidate
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 py-2 px-3 text-xs font-semibold text-rose-400 transition-colors hover:border-rose-900/60 hover:bg-rose-950/40 hover:text-rose-300 active:scale-[0.99]"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          !isLoading && (
            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                className="block w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-center text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="block w-full rounded-xl bg-amber-400 px-3 py-2 text-center text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors shadow-sm"
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

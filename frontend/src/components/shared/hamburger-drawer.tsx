"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/use-auth";
import { LogOut, GraduationCap } from "lucide-react";
import {
  NAV_LINKS_DRAWER_LOGGED_IN,
  NAV_LINKS_PUBLIC,
} from "@/lib/constants/navigation";

export function HamburgerDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { loggedIn, logout } = useAuth();

  // Close drawer on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the menu after navigation so the drawer stays in sync with the current route.
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const navLinks = loggedIn ? NAV_LINKS_DRAWER_LOGGED_IN : NAV_LINKS_PUBLIC;

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/80 text-white transition-all hover:bg-slate-700 hover:border-slate-600 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
        <div className="flex h-3.5 w-4 flex-col justify-between">
          <span className={`block h-[1.75px] w-full rounded-full bg-white transition-all duration-200 ease-out origin-center ${isOpen ? "translate-y-[6px] rotate-45" : ""}`} />
          <span className={`block h-[1.75px] w-full rounded-full bg-white transition-all duration-200 ease-out origin-center ${isOpen ? "opacity-0" : ""}`} />
          <span className={`block h-[1.75px] w-full rounded-full bg-white transition-all duration-200 ease-out origin-center ${isOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
        </div>
      </button>

      {/* Slide-in Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Drawer Panel */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 340, mass: 0.8 }}
              className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col border-l border-slate-800 bg-[#0e1726] text-white shadow-xl"
              aria-label="Menu"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                <Link
                  href={loggedIn ? "/dashboard" : "/"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 font-heading text-sm font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f5a623] text-slate-950">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <span>SmartStudy</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                  aria-label="Close menu"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Nav Links — no "Navigation" heading */}
              <div className="flex-1 overflow-y-auto px-3.5 py-4">
                <nav className="space-y-0.5">
                  {navLinks.map((item) => {
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors ${
                          isActive
                            ? "bg-white/10 text-white font-semibold"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-800 bg-slate-900/40 p-4">
                {loggedIn ? (
                  <button
                    type="button"
                    onClick={async () => {
                      setIsOpen(false);
                      await logout();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-rose-900/60 hover:bg-rose-950/30 hover:text-rose-300"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log out</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800/70 py-2 text-center text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center rounded-xl bg-white py-2 text-center text-xs font-bold text-[#0e1726] transition-colors hover:bg-slate-100 shadow-xs"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

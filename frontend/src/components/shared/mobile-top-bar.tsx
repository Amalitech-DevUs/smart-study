"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/use-auth";
import { HamburgerDrawer } from "@/components/shared/hamburger-drawer";
import { NotificationCenter } from "@/components/shared/notification-center";

export function MobileTopBar() {
  const pathname = usePathname();
  const { loggedIn } = useAuth();

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
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-800 bg-[#0e1726] px-4 py-3 text-white md:hidden">
      {/* Brand */}
      <Link
        href={loggedIn ? "/dashboard" : "/"}
        className="font-heading text-base font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
      >
        SmartStudy
      </Link>

      {/* Action Controls: Notifications + Hamburger Menu */}
      <div className="flex items-center gap-2">
        {pathname !== "/" && <NotificationCenter />}
        <HamburgerDrawer />
      </div>
    </header>
  );
}

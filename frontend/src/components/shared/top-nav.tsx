"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/use-auth";
import { navItems } from "./nav-items";

export function TopNav() {
  const pathname = usePathname();
  const { loggedIn, username, isLoading } = useAuth();

  return (
    <nav className="hidden md:flex items-center justify-between bg-brand-indigo px-6 py-4 text-white">
      <Link
        href="/"
        className="font-heading text-2xl font-bold text-brand-gold"
      >
        Smart Study
      </Link>
      <div className="flex items-center gap-6">
        {navItems.filter((item) => item.label !== "Profile").map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? "text-brand-gold" : "text-gray-200"}
            >
              {item.label}
            </Link>
          );
        })}
        {!isLoading && (loggedIn ? (
          <Link href="/profile" className="text-brand-gold">
            {username ?? "Profile"}
          </Link>
        ) : (
          <Link href="/login" className="text-gray-200">
            Log in
          </Link>
        ))}
      </div>
    </nav>
  );
}

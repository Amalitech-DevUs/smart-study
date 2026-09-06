"use client";

import Link from "next/link";
import { useAuth } from "@/lib/use-auth";

export function MobileTopBar() {
  const { loggedIn, username, isLoading } = useAuth();

  return (
    <header className="flex md:hidden items-center justify-between bg-brand-indigo px-4 py-3">
      <Link href="/" className="font-heading text-xl font-bold text-brand-gold">
        Smart Study
      </Link>
      {!isLoading &&
        (loggedIn ? (
          <Link href="/profile" className="text-sm font-medium text-brand-gold">
            {username ?? "Profile"}
          </Link>
        ) : (
          <Link href="/login" className="text-sm font-medium text-gray-200">
            Log in
          </Link>
        ))}
    </header>
  );
}

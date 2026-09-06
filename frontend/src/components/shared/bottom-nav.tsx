"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex md:hidden fixed bottom-0 inset-x-0 z-10 items-center justify-around border-t border-gray-200 bg-white px-2 py-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex min-w-16 flex-col items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors duration-150 ${isActive ? "text-brand-gold" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
          >
            <span
              aria-hidden="true"
              className={`rounded-full px-3 py-1 text-base leading-none transition-colors duration-150 ${isActive ? "bg-brand-gold/15 text-brand-gold" : "text-gray-500 group-hover:text-gray-600"}`}
              data-icon={item.icon}
            >
              {item.icon}
            </span>
            <span className={isActive ? "text-brand-gold" : "text-gray-400"}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

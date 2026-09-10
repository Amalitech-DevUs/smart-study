"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layers,
  MessageSquare,
  BookOpen,
  User as UserIcon,
} from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  // Hide on login and signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Practice", href: "/flashcards", icon: Layers },
    { label: "AI Tutor", href: "/chat", icon: MessageSquare },
    { label: "Articles", href: "/articles", icon: BookOpen },
    { label: "Profile", href: "/profile", icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-around border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur-md md:hidden">
      {items.map((item) => {
        const IconComponent = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 transition-colors ${
              isActive
                ? "text-slate-900 font-semibold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <IconComponent className="h-4 w-4" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

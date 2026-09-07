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

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Practice", href: "/flashcards", icon: Layers },
    { label: "AI Chat", href: "/chat", icon: MessageSquare },
    { label: "Articles", href: "/articles", icon: BookOpen },
    { label: "Profile", href: "/profile", icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-around border-t border-white/60 bg-white/90 px-3 py-2.5 backdrop-blur-xl shadow-lg md:hidden">
      {items.map((item) => {
        const IconComponent = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-1.5 transition-all ${
              isActive
                ? "text-brand-indigo font-bold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                isActive
                  ? "bg-brand-indigo text-brand-gold shadow-md shadow-brand-indigo/20 scale-105"
                  : "bg-transparent text-slate-400"
              }`}
            >
              <IconComponent className="h-4 w-4" />
            </div>
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

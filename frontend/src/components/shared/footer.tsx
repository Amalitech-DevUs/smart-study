import Link from "next/link";
import { GraduationCap, ArrowUpRight } from "lucide-react";

const footerGroups = [
  {
    title: "Study",
    links: [
      { label: "Flashcards", href: "/flashcards" },
      { label: "AI Study Chat", href: "/chat" },
      { label: "Articles & Guides", href: "/articles" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log In", href: "/login" },
      { label: "Sign Up", href: "/signup" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Approach", href: "#" },
      { label: "Contact Support", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    /* pb-24 on mobile ensures the fixed BottomNav bar does not cover any footer content */
    <footer className="border-t border-slate-200/80 bg-white px-6 pt-12 pb-24 md:pb-12 text-slate-800">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-5">
        
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-indigo text-brand-gold shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-heading text-2xl font-bold tracking-tight text-brand-indigo">
              Smart<span className="text-brand-gold">Study</span>
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
            Empowering students with exam-aligned past questions, bite-sized practice, and 24/7 AI study assistance.
          </p>
          <p className="mt-4 text-xs font-semibold text-slate-400">
            © {new Date().getFullYear()} Smart Study. All rights reserved.
          </p>
        </div>

        {/* Link Columns */}
        {footerGroups.map((group) => (
          <div key={group.title}>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-brand-indigo">
              {group.title}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 transition-colors hover:text-brand-indigo hover:underline"
                  >
                    <span>{link.label}</span>
                    {link.href.startsWith("#") && <ArrowUpRight className="h-3 w-3 text-slate-400" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}

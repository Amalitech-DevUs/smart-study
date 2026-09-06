import Link from "next/link";

const footerGroups = [
  {
    title: "Study",
    links: [
      { label: "Flashcards", href: "/flashcards" },
      { label: "Chat", href: "/chat" },
      { label: "Articles", href: "/articles" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our approach", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-background px-6 py-12 text-text-primary">
      <div className="mx-auto grid max-w-6xl gap-10 border-t border-text-secondary/20 pt-8 sm:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link
            href="/"
            className="font-heading text-2xl font-bold text-brand-indigo"
          >
            Smart Study
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-text-secondary">
            Focused practice for confident learners and brighter exam days.
          </p>
        </div>
        {footerGroups.map((group) => (
          <div key={group.title}>
            <h2 className="font-heading text-lg font-bold text-brand-indigo">
              {group.title}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-brand-indigo"
                  >
                    {link.label}
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

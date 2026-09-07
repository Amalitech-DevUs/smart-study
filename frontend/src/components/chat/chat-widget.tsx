"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChatEngine } from "./chat-engine";
import { useAuth } from "@/lib/use-auth";

function ChatIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 11a7 7 0 0 1-7 7H6l-3 3V11a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7Z" />
      <path d="M8 11h.01M12 11h.01M16 11h.01" />
    </svg>
  );
}

export function ChatWidget() {
  const pathname = usePathname();
  const { loggedIn, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === "/chat") {
    return null;
  }

  const loginHref = `/login?redirect=${encodeURIComponent(pathname)}`;

  return (
    <>
      {isOpen && (
        <aside className="fixed inset-x-4 bottom-24 z-30 h-[min(70vh,38rem)] overflow-hidden rounded-lg border border-text-secondary/15 bg-background shadow-[0_8px_30px_rgba(31,36,48,0.16)] md:inset-y-0 md:bottom-0 md:left-auto md:right-0 md:h-full md:w-[min(25rem,100vw)] md:rounded-none md:rounded-l-lg">
          <div className="flex items-center justify-between border-b border-text-secondary/15 bg-brand-indigo px-4 py-3 text-white">
            <h2 className="font-heading text-xl font-bold">Study assistant</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close study assistant"
              className="rounded-full px-2 py-1 text-xl leading-none text-white transition-colors hover:bg-white/10"
            >
              ×
            </button>
          </div>
          <div className="h-[calc(100%-4rem)] p-3">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                Checking your session...
              </div>
            ) : loggedIn ? (
              <ChatEngine />
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-brand-indigo">
                    Log in to ask a question
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-text-secondary">
                    Your current page will still be here when you return.
                  </p>
                  <Link
                    href={loginHref}
                    className="mt-6 inline-flex min-h-11 items-center rounded-md bg-brand-gold px-5 py-3 font-medium text-brand-indigo transition-colors hover:bg-brand-gold/90"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close study assistant" : "Open study assistant"}
        aria-expanded={isOpen}
        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold text-brand-indigo shadow-[0_4px_14px_rgba(31,36,48,0.18)] transition-transform hover:scale-105 md:bottom-6 md:right-6"
      >
        <ChatIcon />
      </button>
    </>
  );
}

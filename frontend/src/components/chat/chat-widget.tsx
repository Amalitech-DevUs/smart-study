"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChatEngine } from "./chat-engine";
import { Maximize2, Minimize2, X } from "lucide-react";
import { AppLogoIcon, AppLogoBadge } from "@/components/shared/app-logo";

export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (pathname === "/chat" || pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <>
      {isOpen && (
        <aside
          className={`fixed z-50 overflow-hidden border border-slate-200 bg-white shadow-2xl transition-all duration-200 ease-in-out ${
            isExpanded
              ? "inset-4 md:inset-auto md:bottom-6 md:right-6 md:w-[720px] md:h-[780px] md:max-h-[85vh] rounded-2xl"
              : "inset-x-4 bottom-20 h-[520px] max-h-[75vh] md:inset-x-auto md:bottom-6 md:right-6 md:w-[400px] md:h-[580px] rounded-2xl"
          }`}
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-[#0e1726] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <AppLogoBadge size="sm" />
              <div>
                <h2 className="font-heading text-sm font-bold leading-tight">SmartStudy Tutor</h2>
                <p className="text-[10px] text-slate-400">AI Study Companion &bull; Online</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              {/* Expand / Minimize Toggle */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? "Collapse window" : "Expand window"}
                className="hidden md:flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-800 hover:text-white transition-colors"
              >
                {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant"
                className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="h-[calc(100%-54px)] bg-slate-50/40">
            <ChatEngine />
          </div>
        </aside>
      )}

      {/* Trigger floating button */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close study assistant" : "Open study assistant"}
        aria-expanded={isOpen}
        className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#0e1726] text-white shadow-lg transition-transform hover:scale-105 hover:bg-slate-800 md:bottom-6 md:right-6 border border-slate-700"
      >
        {isOpen ? <X className="h-5 w-5" /> : <AppLogoIcon className="h-5 w-5 text-amber-400" />}
      </button>
    </>
  );
}

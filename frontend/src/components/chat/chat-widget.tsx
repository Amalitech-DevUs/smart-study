"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/lib/use-auth";
import { ChatEngine } from "./chat-engine";
import { Maximize2, Minimize2, X, BrainCircuit } from "lucide-react";

const FAB_SIZE = 48; // h-12 w-12 = 48px
const EDGE_GAP = 8;  // minimum px from any viewport edge

type FabPos = { right: number; bottom: number };

/** Clamp a desired {right, bottom} so the button stays fully inside the viewport. */
function clamp(right: number, bottom: number): FabPos {
  const maxRight = window.innerWidth - FAB_SIZE - EDGE_GAP;
  const maxBottom = window.innerHeight - FAB_SIZE - EDGE_GAP;
  return {
    right: Math.max(EDGE_GAP, Math.min(maxRight, right)),
    bottom: Math.max(EDGE_GAP, Math.min(maxBottom, bottom)),
  };
}

export function ChatWidget() {
  const pathname = usePathname();
  const { loggedIn, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // null = use Tailwind defaults; non-null = user has dragged, use inline style
  const [fabPos, setFabPos] = useState<FabPos | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Drag tracking ref — no state so no re-render on every pointermove
  const drag = useRef<{
    startClientX: number;
    startClientY: number;
    startRight: number;
    startBottom: number;
    moved: boolean;
  } | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      // Capture pointer so we keep events if cursor leaves the button
      e.currentTarget.setPointerCapture(e.pointerId);
      // Read current position from state or compute from Tailwind defaults
      const currentRight = fabPos?.right ?? 32;  // md:right-8
      const currentBottom = fabPos?.bottom ?? 32; // md:bottom-8
      drag.current = {
        startClientX: e.clientX,
        startClientY: e.clientY,
        startRight: currentRight,
        startBottom: currentBottom,
        moved: false,
      };
      setIsDragging(false);
    },
    [fabPos],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!drag.current) return;
      const dx = e.clientX - drag.current.startClientX;
      const dy = e.clientY - drag.current.startClientY;
      // Only start treating as a drag after 4px movement threshold
      if (!drag.current.moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      drag.current.moved = true;
      setIsDragging(true);
      // Moving right → right decreases; moving down → bottom decreases
      setFabPos(clamp(drag.current.startRight - dx, drag.current.startBottom - dy));
    },
    [],
  );

  const handlePointerUp = useCallback(
    () => {
      if (!drag.current) return;
      const wasDrag = drag.current.moved;
      drag.current = null;
      setIsDragging(false);
      // Only toggle open/close when it was a genuine tap, not a drag
      if (!wasDrag) {
        setIsOpen((open) => !open);
      }
    },
    [],
  );

  if (
    isLoading ||
    !loggedIn ||
    pathname === "/chat" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/register" ||
    pathname.startsWith("/flashcards")
  ) {
    return null;
  }

  // Derive chat-panel anchor from FAB position (or defaults).
  // When fabPos is null the FAB sits at Tailwind classes: bottom-20/right-4 (mobile) or bottom-8/right-8 (desktop).
  // We compute panel position based on whether the user has dragged the FAB.
  const panelRight = fabPos?.right ?? 32;
  const panelBottom = fabPos
    ? fabPos.bottom + FAB_SIZE + 8   // directly above dragged FAB
    : undefined;                      // let Tailwind classes handle default placement
  const panelStyle = fabPos
    ? { right: panelRight, bottom: panelBottom }
    : undefined;

  return (
    <>
      {isOpen && (
        <aside
          className={`fixed z-50 overflow-hidden border border-slate-200 bg-white shadow-2xl transition-all duration-200 ease-in-out ${
            isExpanded
              ? "inset-4 rounded-xl md:inset-auto md:w-[720px] md:h-[780px] md:max-h-[85vh] md:rounded-xl"
              : fabPos
              ? "h-[520px] max-h-[75vh] w-[calc(100vw-2rem)] max-w-[400px] rounded-xl md:w-[400px] md:h-[580px]"
              : "inset-x-4 bottom-20 h-[520px] max-h-[75vh] rounded-xl md:inset-x-auto md:right-8 md:bottom-[92px] md:w-[400px] md:h-[580px]"
          }`}
          style={!isExpanded && panelStyle ? panelStyle : undefined}
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-[#0e1726] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-amber-400 shadow-sm">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-heading text-sm font-bold leading-tight">SmartStudy Tutor</h2>
                <p className="text-[10px] text-slate-400">AI Study Companion &bull; Online</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? "Collapse window" : "Expand window"}
                className="hidden md:flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-800 hover:text-white transition-colors"
              >
                {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>

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

      {/* Draggable trigger FAB */}
      <button
        type="button"
        aria-label={isOpen ? "Close study assistant" : "Open study assistant"}
        aria-expanded={isOpen}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        // Prevent context menu and text selection during drag
        onContextMenu={(e) => drag.current?.moved && e.preventDefault()}
        className={`fixed z-40 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white border border-slate-700 shadow-xl shadow-slate-950/20 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 select-none transition-[background-color,box-shadow] ${
          isDragging
            ? "cursor-grabbing scale-110 shadow-2xl"
            : "cursor-grab hover:scale-105 hover:bg-slate-800 active:scale-95"
        } ${
          // Only apply Tailwind positioning when user hasn't dragged yet
          fabPos ? "" : "bottom-20 right-4 md:bottom-8 md:right-8"
        }`}
        style={
          fabPos
            ? { right: fabPos.right, bottom: fabPos.bottom, transition: isDragging ? "none" : undefined }
            : undefined
        }
      >
        <span className="flex items-center justify-center shrink-0 pointer-events-none">
          {isOpen ? (
            <X className="h-5 w-5 shrink-0" />
          ) : (
            <BrainCircuit className="h-5 w-5 shrink-0 text-amber-400" />
          )}
        </span>
      </button>
    </>
  );
}

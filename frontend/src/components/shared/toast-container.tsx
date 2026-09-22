"use client";

import { useNotifications, ToastType } from "@/lib/notification-context";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const toastConfig: Record<
  ToastType,
  { border: string; bg: string; text: string }
> = {
  success: {
    border: "border-emerald-500/30",
    bg: "bg-slate-900/95",
    text: "text-slate-100",
  },
  error: {
    border: "border-rose-500/30",
    bg: "bg-slate-900/95",
    text: "text-slate-100",
  },
  warning: {
    border: "border-amber-500/30",
    bg: "bg-slate-900/95",
    text: "text-slate-100",
  },
  info: {
    border: "border-blue-500/30",
    bg: "bg-slate-900/95",
    text: "text-slate-100",
  },
};

export function ToastContainer() {
  const { toasts, dismissToast } = useNotifications();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-5 right-5 z-50 flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const cfg = toastConfig[toast.type];

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border ${cfg.border} ${cfg.bg} p-4 shadow-xl backdrop-blur-md`}
            >
              <div className="flex-1 text-xs">
                {toast.title && (
                  <p className="font-heading font-semibold text-white mb-0.5">
                    {toast.title}
                  </p>
                )}
                <p className={`leading-relaxed ${cfg.text}`}>{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="shrink-0 text-slate-400 transition-colors hover:text-white p-0.5 rounded-lg hover:bg-slate-800"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

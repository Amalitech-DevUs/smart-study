"use client";

import { useNotifications, ToastType } from "@/lib/notification-context";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info as InfoIcon,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const toastConfig: Record<
  ToastType,
  {
    border: string;
    bg: string;
    text: string;
    icon: typeof CheckCircle2;
    iconColor: string;
  }
> = {
  success: {
    border: "border-emerald-500/30",
    bg: "bg-slate-900/95",
    text: "text-slate-100",
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
  },
  error: {
    border: "border-rose-500/30",
    bg: "bg-slate-900/95",
    text: "text-slate-100",
    icon: AlertCircle,
    iconColor: "text-rose-400",
  },
  warning: {
    border: "border-amber-500/30",
    bg: "bg-slate-900/95",
    text: "text-slate-100",
    icon: AlertTriangle,
    iconColor: "text-amber-400",
  },
  info: {
    border: "border-blue-500/30",
    bg: "bg-slate-900/95",
    text: "text-slate-100",
    icon: InfoIcon,
    iconColor: "text-blue-400",
  },
};

export function ToastContainer() {
  const { toasts, dismissToast } = useNotifications();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed top-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:top-6 sm:w-full sm:max-w-sm z-50 flex flex-col gap-2.5"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const cfg = toastConfig[toast.type];
          const Icon = cfg.icon;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95, transition: { duration: 0.18 } }}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border ${cfg.border} ${cfg.bg} p-3.5 shadow-2xl backdrop-blur-xl ring-1 ring-white/10`}
            >
              <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${cfg.iconColor}`} />
              <div className="flex-1 min-w-0 text-xs">
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
                className="shrink-0 text-slate-400 transition-colors hover:text-white p-1 rounded-lg hover:bg-slate-800"
                aria-label="Dismiss notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

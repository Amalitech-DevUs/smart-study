"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  GraduationCap,
  Sparkles,
  Flame,
  Bot,
} from "lucide-react";
import {
  useNotifications,
  AppNotification,
  NotificationType,
} from "@/lib/notification-context";
import { AnimatePresence, motion } from "framer-motion";

const typeIcons: Record<
  NotificationType,
  { icon: typeof GraduationCap; color: string; bg: string }
> = {
  exam: {
    icon: GraduationCap,
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  update: {
    icon: Sparkles,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  streak: {
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
  },
  tip: {
    icon: Bot,
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
};

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  } = useNotifications();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const filteredNotifications = notifications.filter((item) =>
    filter === "unread" ? !item.read : true
  );

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center border border-slate-700 bg-slate-800/80 text-slate-300 transition-all hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 active:scale-95"
        aria-label="View notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-4 w-4" />

        {/* Unread badge indicator */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-slate-950 shadow-sm ring-2 ring-[#0e1726]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96, transition: { duration: 0.15 } }}
            className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-[#0e1726] shadow-2xl z-50 overflow-hidden text-white backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3.5 bg-slate-900/40">
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm font-bold text-white">Notifications</span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-400 transition-colors hover:text-amber-400"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-slate-800/60 bg-slate-950/20 px-3 py-2 text-xs">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`rounded-lg px-3 py-1 font-medium transition-colors ${
                  filter === "all"
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("unread")}
                className={`rounded-lg px-3 py-1 font-medium transition-colors ${
                  filter === "unread"
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-800/50">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-10 text-center text-slate-400">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/60 mb-2.5">
                    <Bell className="h-5 w-5 text-slate-500" />
                  </div>
                  <p className="text-xs font-semibold text-slate-300">All caught up</p>
                  <p className="mt-1 text-[11px] text-slate-500 max-w-[200px]">
                    {filter === "unread"
                      ? "You have read all your notifications."
                      : "No study alerts or notices right now."}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const typeCfg = typeIcons[notif.type];
                  const Icon = typeCfg.icon;

                  return (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`group relative flex items-start gap-3 p-3.5 transition-colors hover:bg-slate-850/60 cursor-pointer ${
                        !notif.read ? "bg-slate-900/50" : "bg-transparent"
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${typeCfg.bg} ${typeCfg.color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-baseline justify-between gap-1 mb-0.5">
                          <p
                            className={`text-xs font-semibold truncate ${
                              !notif.read ? "text-white" : "text-slate-300"
                            }`}
                          >
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-500 shrink-0">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-400 line-clamp-2">
                          {notif.description}
                        </p>

                        {notif.link && (
                          <div className="mt-1.5">
                            <Link
                              href={notif.link}
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notif.id);
                                setIsOpen(false);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                            >
                              View details &rarr;
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Unread indicator / Dismiss */}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        {!notif.read && (
                          <span className="h-2 w-2 rounded-full bg-amber-400 ring-2 ring-amber-400/20" />
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notif.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all p-1 rounded-md"
                          aria-label="Remove notification"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-900/30 px-4 py-2.5 text-[11px]">
                <span className="text-slate-500">
                  {notifications.length} total notifications
                </span>
                <button
                  type="button"
                  onClick={clearAllNotifications}
                  className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear all
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

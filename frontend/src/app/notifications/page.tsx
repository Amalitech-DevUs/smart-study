"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { RequireAuth } from "@/components/shared/require-auth";
import { useNotifications } from "@/lib/notification-context";

type FilterType = "all" | "unread";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  } = useNotifications();

  const filteredNotifications = notifications.filter((item) =>
    filter === "unread" ? !item.read : true
  );

  return (
    <RequireAuth>
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-16">
        <main className="mx-auto max-w-4xl px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
          {/* Top Breadcrumb & Header */}
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
                  <Bell className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Notifications
                  </h1>
                  <p className="text-xs text-slate-500">
                    Stay up-to-date with study milestones, mock alerts, and daily reminders
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}

                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllNotifications}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors shadow-2xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clear all</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 text-xs shadow-2xs">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                  filter === "all"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("unread")}
                className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                  filter === "unread"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            <span className="text-xs text-slate-500">
              {filteredNotifications.length} notification{filteredNotifications.length === 1 ? "" : "s"}
            </span>
          </div>

          {/* Notification List */}
          <div className="space-y-3">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`group rounded-2xl border p-4 transition-all duration-150 shadow-2xs cursor-pointer ${
                    !notif.read
                      ? "border-amber-200/90 bg-white ring-1 ring-amber-400/20"
                      : "border-slate-200 bg-white/80 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl mt-0.5 ${
                          !notif.read
                            ? "bg-slate-900 text-amber-400 shadow-xs"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        <Bell className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3
                            className={`font-heading text-sm font-bold leading-snug ${
                              !notif.read ? "text-slate-900" : "text-slate-700"
                            }`}
                          >
                            {notif.title}
                          </h3>
                          {!notif.read && (
                            <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-800">
                              New
                            </span>
                          )}
                          <span className="text-[11px] font-medium text-slate-400">
                            &bull; {notif.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {notif.description}
                        </p>

                        {notif.link && (
                          <div className="mt-3">
                            <Link
                              href={notif.link}
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notif.id);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
                            >
                              <span>View details</span>
                              <ArrowRight className="h-3 w-3 text-amber-400" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notif.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        aria-label="Delete notification"
                        title="Dismiss notification"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {filter === "unread"
                    ? "You have reviewed all your study updates and alerts."
                    : "When new exam circulars or study reminders arrive, they will appear here."}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}

"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type NotificationType = "exam" | "update" | "streak" | "tip";

export type AppNotification = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
  link?: string;
};

export type ToastType = "success" | "error" | "info" | "warning";

export type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
};

type NotificationContextType = {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notif: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
  toasts: ToastItem[];
  showToast: (type: ToastType, message: string, title?: string, duration?: number) => void;
  dismissToast: (id: string) => void;
};

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "2026 BECE Exam Readiness",
    description: "New official-format mock papers are available for revision.",
    timestamp: "15m ago",
    read: false,
    type: "exam",
    link: "/flashcards",
  },
  {
    id: "notif-2",
    title: "Science & Maths Questions Updated",
    description: "Added 120 verified multiple-choice questions with full explanations.",
    timestamp: "2h ago",
    read: false,
    type: "update",
    link: "/flashcards/science",
  },
  {
    id: "notif-3",
    title: "Daily Study Habit",
    description: "Revise at least 10 questions today to strengthen recall.",
    timestamp: "5h ago",
    read: false,
    type: "streak",
    link: "/flashcards",
  },
  {
    id: "notif-4",
    title: "AI Study Tutor Tip",
    description: "Ask the AI tutor for step-by-step breakdown when solving quadratic equations.",
    timestamp: "Yesterday",
    read: true,
    type: "tip",
    link: "/chat",
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = "smartstudy_notifications_v1";

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(DEFAULT_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
        }
      }
    } catch {
      // Fallback to default
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // Ignore storage errors
    }
  }, [notifications, isInitialized]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback(
    (notif: Omit<AppNotification, "id" | "timestamp" | "read">) => {
      const newNotif: AppNotification = {
        ...notif,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: "Just now",
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string, title?: string, duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const newToast: ToastItem = { id, type, message, title, duration };

      setToasts((prev) => [...prev.slice(-3), newToast]); // keep max 4 visible

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        addNotification,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

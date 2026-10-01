"use client";

import { useEffect } from "react";

/**
 * Pings the backend /health endpoint every 4 minutes to prevent
 * Render's free-tier spin-down (which happens after ~15 min of inactivity).
 * Renders nothing — purely a background task.
 */
export function BackendKeepAlive() {
  useEffect(() => {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    const ping = () => {
      fetch(`${backendUrl.replace(/\/$/, "")}/health`, {
        method: "GET",
        cache: "no-store",
      }).catch(() => {
        // Silently ignore — offline or server temporarily down
      });
    };

    // Ping immediately on mount, then every 4 minutes
    ping();
    const interval = setInterval(ping, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}

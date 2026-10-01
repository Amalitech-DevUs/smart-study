"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            // Check for service worker updates
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (
                    installingWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                    // New content is available; it will be used on next page reload.
                    console.log("SmartStudy updated: New content available.");
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.warn("SmartStudy PWA registration failed:", error);
          });
      });
    }
  }, []);

  return null;
}

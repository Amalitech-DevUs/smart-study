"use client";

import { MotionConfig } from "framer-motion";

/**
 * Global framer-motion config.
 * reducedMotion: "never" → always plays animations regardless of OS setting.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="never"
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </MotionConfig>
  );
}

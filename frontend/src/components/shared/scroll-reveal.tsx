"use client";

import { motion, Variants, useScroll, useSpring } from "framer-motion";

type Direction = "up" | "left" | "right" | "down" | "scale" | "fade";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  amount?: number; // 0–1, how much of element must be visible to trigger
  once?: boolean;
}

const variants: Record<Direction, Variants> = {
  up: {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -32 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.94, y: 16 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.5,
  amount = 0.15,
  once = true,
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // spring-like smooth ease
      }}
      variants={variants[direction]}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated progress bar that fills up as the student scrolls down the page.
 */
export function ScrollProgressBar({ className = "" }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className={`fixed top-0 left-0 right-0 h-1 origin-left z-50 bg-white shadow-[0_1px_6px_rgba(255,255,255,0.5)] pointer-events-none ${className}`}
    />
  );
}

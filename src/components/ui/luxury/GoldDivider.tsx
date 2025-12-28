"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TIMING, EASE } from "@/lib/animations";

interface GoldDividerProps {
  /** Width variant */
  variant?: "default" | "wide" | "full";
  /** Animate the line width */
  animated?: boolean;
  /** Delay before animation starts (in seconds) */
  delay?: number;
  /** Additional class names */
  className?: string;
  /** Whether the element is in view (for animation trigger) */
  isInView?: boolean;
}

export function GoldDivider({
  variant = "default",
  animated = true,
  delay = 0,
  className,
  isInView = true,
}: GoldDividerProps) {
  const widthClass = {
    default: "w-16",
    wide: "w-24",
    full: "w-full max-w-xs",
  }[variant];

  if (!animated) {
    return (
      <div
        className={cn(
          "h-[1px] bg-[#B8860B]",
          widthClass,
          className
        )}
      />
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { width: 0, opacity: 0 },
        visible: {
          width: variant === "default" ? "4rem" : variant === "wide" ? "6rem" : "100%",
          opacity: 1,
          transition: {
            duration: TIMING.slow,
            ease: EASE.luxury,
            delay,
          },
        },
      }}
      className={cn(
        "h-[1px] bg-[#B8860B]",
        variant === "full" && "max-w-xs",
        className
      )}
    />
  );
}

export default GoldDivider;

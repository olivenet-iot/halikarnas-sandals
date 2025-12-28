"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TIMING } from "@/lib/animations";

interface ScrollIndicatorProps {
  /** Text label (e.g., "Scroll to explore") */
  label?: string;
  /** Visual style */
  variant?: "arrow" | "mouse" | "line";
  /** Color theme */
  theme?: "light" | "dark";
  /** Additional class names */
  className?: string;
  /** Whether the indicator is visible */
  isVisible?: boolean;
  /** Click handler to scroll to next section */
  onClick?: () => void;
}

export function ScrollIndicator({
  label,
  variant = "arrow",
  theme = "light",
  className,
  isVisible = true,
  onClick,
}: ScrollIndicatorProps) {
  const textColor = theme === "light" ? "text-white/60" : "text-stone-600";
  const iconColor = theme === "light" ? "text-white/40" : "text-stone-400";

  const content = (() => {
    switch (variant) {
      case "mouse":
        return <MouseIcon className={iconColor} />;
      case "line":
        return <LineIndicator className={iconColor} />;
      case "arrow":
      default:
        return <ArrowDownIcon className={iconColor} />;
    }
  })();

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: TIMING.medium, delay: 1 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-3 cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg p-2",
        className
      )}
      aria-label="Scroll down"
    >
      {label && (
        <span className={cn("text-xs uppercase tracking-[0.2em]", textColor)}>
          {label}
        </span>
      )}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {content}
      </motion.div>
    </motion.button>
  );
}

// Arrow down icon
function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-5 h-5", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 14l-7 7m0 0l-7-7m7 7V3"
      />
    </svg>
  );
}

// Mouse scroll icon
function MouseIcon({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-6 h-10", className)}>
      <div className="absolute inset-0 border-2 border-current rounded-full" />
      <motion.div
        className="absolute left-1/2 top-2 w-1 h-2 bg-current rounded-full -translate-x-1/2"
        animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// Line indicator
function LineIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-16 w-[1px]", className)}>
      <div className="absolute inset-0 bg-current opacity-20" />
      <motion.div
        className="absolute top-0 left-0 w-full h-1/3 bg-current"
        animate={{ y: ["0%", "200%", "0%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/**
 * Chevron down with bounce animation
 */
export function ChevronBounce({
  className,
  theme = "light",
}: {
  className?: string;
  theme?: "light" | "dark";
}) {
  const color = theme === "light" ? "text-white/60" : "text-stone-600";

  return (
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      <svg
        className={cn("w-6 h-6", color)}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 14l-7 7m0 0l-7-7"
        />
      </svg>
    </motion.div>
  );
}

export default ScrollIndicator;

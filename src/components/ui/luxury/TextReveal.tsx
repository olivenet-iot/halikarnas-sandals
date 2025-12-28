"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TIMING, EASE } from "@/lib/animations";

interface TextRevealProps {
  /** The text to reveal */
  text: string;
  /** Animation type */
  type?: "word" | "line" | "character";
  /** Font style */
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** Additional class names */
  className?: string;
  /** Whether the element is in view */
  isInView?: boolean;
  /** Delay before animation starts (in seconds) */
  delay?: number;
  /** Stagger delay between elements (in seconds) */
  staggerDelay?: number;
}

export function TextReveal({
  text,
  type = "word",
  as: Component = "p",
  className,
  isInView = true,
  delay = 0,
  staggerDelay = 0.05,
}: TextRevealProps) {
  // Split text based on type
  const elements = (() => {
    switch (type) {
      case "character":
        return text.split("");
      case "line":
        return text.split("\n");
      case "word":
      default:
        return text.split(" ");
    }
  })();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: type === "line" ? 40 : 20,
      rotateX: type === "character" ? -90 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: type === "line" ? TIMING.slow : TIMING.medium,
        ease: EASE.luxury,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={cn("overflow-hidden", className)}
      aria-label={text}
    >
      <Component className="inline">
        {elements.map((element, index) => (
          <motion.span
            key={`${element}-${index}`}
            variants={itemVariants}
            className="inline-block"
            style={{ willChange: "transform, opacity" }}
          >
            {element}
            {type === "word" && index < elements.length - 1 && "\u00A0"}
            {type === "line" && index < elements.length - 1 && <br />}
          </motion.span>
        ))}
      </Component>
    </motion.div>
  );
}

/**
 * Simple text reveal with opacity and translateY
 */
export function TextFadeIn({
  children,
  className,
  isInView = true,
  delay = 0,
  duration = TIMING.slow,
}: {
  children: React.ReactNode;
  className?: string;
  isInView?: boolean;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration, ease: EASE.luxury, delay }}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Letter spacing reveal (wide to normal)
 */
export function LetterSpacingReveal({
  text,
  as: Component = "h1",
  className,
  isInView = true,
  delay = 0,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  isInView?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, letterSpacing: "0.5em" }}
      animate={
        isInView
          ? { opacity: 1, letterSpacing: "0.15em" }
          : { opacity: 0, letterSpacing: "0.5em" }
      }
      transition={{ duration: TIMING.cinematic, ease: EASE.luxury, delay }}
      className={className}
    >
      <Component>{text}</Component>
    </motion.div>
  );
}

export default TextReveal;

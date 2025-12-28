"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TIMING, EASE, textRevealLine } from "@/lib/animations";

interface EditorialQuoteProps {
  /** The quote text (can include \n for line breaks) */
  quote: string;
  /** Attribution (e.g., "— Halikarnas") */
  attribution?: string;
  /** Additional class names for container */
  className?: string;
  /** Class names for quote text */
  quoteClassName?: string;
  /** Class names for attribution */
  attributionClassName?: string;
  /** Whether the element is in view */
  isInView?: boolean;
  /** Delay before animation starts */
  delay?: number;
  /** Show decorative quotation mark */
  showQuoteMark?: boolean;
}

export function EditorialQuote({
  quote,
  attribution,
  className,
  quoteClassName,
  attributionClassName,
  isInView = true,
  delay = 0,
  showQuoteMark = false,
}: EditorialQuoteProps) {
  // Split quote into lines
  const lines = quote.split("\n").filter((line) => line.trim());

  return (
    <motion.blockquote
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }}
      className={cn("relative", className)}
    >
      {/* Decorative quote mark */}
      {showQuoteMark && (
        <motion.span
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
              opacity: 0.1,
              scale: 1,
              transition: { duration: TIMING.slow, ease: EASE.luxury },
            },
          }}
          className="absolute -top-8 -left-4 text-8xl font-serif text-[#B8860B] select-none"
          aria-hidden="true"
        >
          &ldquo;
        </motion.span>
      )}

      {/* Quote text */}
      <div className={cn("relative", quoteClassName)}>
        {lines.map((line, index) => (
          <motion.p
            key={index}
            variants={textRevealLine}
            className="font-serif italic leading-relaxed"
          >
            {index === 0 && !showQuoteMark && <span>&ldquo;</span>}
            {line}
            {index === lines.length - 1 && <span>&rdquo;</span>}
          </motion.p>
        ))}
      </div>

      {/* Attribution */}
      {attribution && (
        <motion.footer
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: TIMING.medium,
                ease: EASE.luxury,
                delay: 0.2,
              },
            },
          }}
          className={cn(
            "mt-6 text-sm uppercase tracking-[0.2em] font-medium",
            attributionClassName
          )}
        >
          {attribution}
        </motion.footer>
      )}
    </motion.blockquote>
  );
}

/**
 * Large editorial text block with animated line reveal
 */
export function EditorialText({
  children,
  className,
  isInView = true,
  delay = 0,
}: {
  children: string;
  className?: string;
  isInView?: boolean;
  delay?: number;
}) {
  const lines = children.split("\n").filter((line) => line.trim());

  return (
    <motion.div
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {lines.map((line, index) => (
        <motion.p
          key={index}
          variants={textRevealLine}
          className="overflow-hidden"
        >
          <span className="inline-block">{line}</span>
        </motion.p>
      ))}
    </motion.div>
  );
}

export default EditorialQuote;

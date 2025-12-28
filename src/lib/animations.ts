import { Variants } from "framer-motion";

/**
 * Luxury Animation System
 * Timing constants, easing curves, and reusable variants
 */

// ============================================
// TIMING CONSTANTS (in seconds)
// ============================================
export const TIMING = {
  instant: 0.15,
  fast: 0.3,
  medium: 0.5,
  slow: 0.7,
  slower: 1.0,
  cinematic: 1.5,
} as const;

// ============================================
// EASING CURVES
// ============================================
export const EASE = {
  luxury: [0.4, 0, 0.2, 1] as const,
  smooth: [0.25, 0.1, 0.25, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  out: [0, 0, 0.2, 1] as const,
  inOut: [0.4, 0, 0.6, 1] as const,
  spring: { type: "spring", stiffness: 100, damping: 15 },
} as const;

// ============================================
// LUXURY COLLECTION PAGE ANIMATIONS
// ============================================

// Gold decorative line animation
export const goldLine: Variants = {
  hidden: { width: 0, opacity: 0 },
  visible: {
    width: "4rem",
    opacity: 1,
    transition: { duration: TIMING.slow, ease: EASE.luxury },
  },
};

export const goldLineWide: Variants = {
  hidden: { width: 0, opacity: 0 },
  visible: {
    width: "6rem",
    opacity: 1,
    transition: { duration: TIMING.slow, ease: EASE.luxury },
  },
};

// Letter spacing animation (wide to normal - for titles)
export const letterSpacingReveal: Variants = {
  hidden: { opacity: 0, letterSpacing: "0.5em" },
  visible: {
    opacity: 1,
    letterSpacing: "0.15em",
    transition: { duration: TIMING.cinematic, ease: EASE.luxury },
  },
};

// Text reveal - line by line
export const textRevealLine: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: TIMING.slow, ease: EASE.smooth },
  },
};

// Split screen reveal - Left side (with clip path)
export const splitRevealLeft: Variants = {
  hidden: { opacity: 0, x: -50, clipPath: "inset(0 100% 0 0)" },
  visible: {
    opacity: 1,
    x: 0,
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: TIMING.slower, ease: EASE.luxury },
  },
};

// Split screen reveal - Right side
export const splitRevealRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: TIMING.slow, ease: EASE.luxury, delay: 0.2 },
  },
};

// Masonry grid item
export const masonryItem: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: TIMING.slow, ease: EASE.luxury },
  },
};

// Ken Burns effect (slow zoom)
export const kenBurns: Variants = {
  initial: { scale: 1.15 },
  animate: {
    scale: 1,
    transition: { duration: 20, ease: "linear" },
  },
};

// Scroll indicator pulse
export const scrollIndicatorPulse: Variants = {
  initial: { opacity: 0.4, y: 0 },
  animate: {
    opacity: [0.4, 1, 0.4],
    y: [0, 10, 0],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

// Counter animation helper
export const counterReveal: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: TIMING.medium, ease: EASE.bounce },
  },
};

// Image zoom on hover
export const imageHoverZoom: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: TIMING.slow, ease: EASE.smooth } },
};

// Quick view overlay
export const quickViewOverlay: Variants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: TIMING.fast, ease: EASE.smooth } },
};

// Magnetic button effect base
export const magneticButton: Variants = {
  rest: { scale: 1, x: 0, y: 0 },
  hover: { scale: 1.02, transition: { duration: TIMING.fast, ease: EASE.smooth } },
  tap: { scale: 0.98 },
};

// Shine effect (for buttons)
export const shineEffect: Variants = {
  rest: { x: "-100%", opacity: 0 },
  hover: {
    x: "100%",
    opacity: 0.3,
    transition: { duration: TIMING.medium, ease: EASE.smooth },
  },
};

// Stagger container - cinematic (slower)
export const staggerContainerCinematic: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

// Frame reveal (for scroll-snap frames)
export const frameReveal: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: TIMING.medium, ease: EASE.smooth },
  },
  exit: {
    opacity: 0,
    transition: { duration: TIMING.fast },
  },
};

// Viewport settings
export const viewportSettings = {
  once: true,
  amount: 0.3,
  margin: "-100px",
};

export const viewportSettingsEager = {
  once: true,
  amount: 0.1,
  margin: "-50px",
};

// Helper: Create delayed variant
export function withDelay<T extends Variants>(variant: T, delay: number): T {
  const result = { ...variant } as Record<string, unknown>;
  if (result.visible && typeof result.visible === "object") {
    const visible = result.visible as Record<string, unknown>;
    result.visible = {
      ...visible,
      transition: {
        ...((visible.transition as Record<string, unknown>) || {}),
        delay,
      },
    };
  }
  return result as T;
}

// ============================================
// ORIGINAL ANIMATIONS (preserved)
// ============================================

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Scale animations
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

// Stagger children
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Slide animations
export const slideInFromLeft: Variants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

export const slideInFromRight: Variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

export const slideInFromBottom: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

// Card hover effect
export const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  hover: {
    scale: 1.02,
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// 3D Card tilt effect
export const card3D: Variants = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    transition: { duration: 0.3 },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.3 },
  },
};

// Button animations
export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

// Image reveal
export const imageReveal: Variants = {
  hidden: {
    clipPath: "inset(0 100% 0 0)",
    opacity: 0,
  },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

// Text reveal (character by character)
export const textRevealContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

export const textRevealCharacter: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Parallax effect values
export const parallaxValues = {
  slow: [0, 50],
  medium: [0, 100],
  fast: [0, 150],
};

// Infinite animations
export const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [1, 0.8, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const bounceAnimation = {
  y: [0, -20, 0],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// Page transition
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

// Drawer/Modal animations
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 }
  },
};

// Viewport settings for scroll-triggered animations
export const viewportOnce = { once: true, margin: "-100px" };
export const viewportAlways = { once: false, margin: "-50px" };

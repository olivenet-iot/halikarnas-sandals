"use client";

import { useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, RefObject } from "react";

interface UseParallaxOptions {
  /** The rate of parallax movement. Negative values move opposite to scroll. Default: 0.5 */
  rate?: number;
  /** The direction of parallax movement. Default: 'y' */
  direction?: "x" | "y";
  /** Custom offset range [start, end]. Default: ["start end", "end start"] */
  offset?: [string, string];
  /** Reference to the target element. If not provided, uses window scroll. */
  target?: RefObject<HTMLElement>;
}

interface UseParallaxReturn {
  /** Ref to attach to the container element */
  ref: RefObject<HTMLDivElement>;
  /** The transformed motion value for the parallax effect */
  value: MotionValue<number>;
  /** The raw scroll progress (0 to 1) */
  progress: MotionValue<number>;
}

/**
 * Custom hook for creating parallax scroll effects
 *
 * @example
 * ```tsx
 * const { ref, value } = useParallax({ rate: 0.3 });
 *
 * return (
 *   <div ref={ref}>
 *     <motion.div style={{ y: value }}>
 *       Parallax content
 *     </motion.div>
 *   </div>
 * );
 * ```
 */
export function useParallax({
  rate = 0.5,
  direction = "y",
  offset = ["start end", "end start"],
  target,
}: UseParallaxOptions = {}): UseParallaxReturn {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: target || ref,
    offset: offset as ["start end" | "end start", "start end" | "end start"],
  });

  // Calculate the distance based on rate
  // rate of 0.5 means element moves at half the scroll speed
  // rate of -0.5 means element moves opposite direction at half speed
  const distance = 100 * rate;

  const value = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "y" ? [distance, -distance] : [-distance, distance]
  );

  return {
    ref,
    value,
    progress: scrollYProgress,
  };
}

/**
 * Simple parallax hook that returns just the transformed value
 * Use when you already have a scroll progress value
 */
export function useParallaxTransform(
  scrollProgress: MotionValue<number>,
  rate: number = 0.5,
  direction: "x" | "y" = "y"
): MotionValue<number> {
  const distance = 100 * rate;

  return useTransform(
    scrollProgress,
    [0, 1],
    direction === "y" ? [distance, -distance] : [-distance, distance]
  );
}

/**
 * Hook for creating a parallax effect with custom input/output ranges
 */
export function useParallaxCustom(
  scrollProgress: MotionValue<number>,
  inputRange: [number, number] = [0, 1],
  outputRange: [number, number] = [0, -100]
): MotionValue<number> {
  return useTransform(scrollProgress, inputRange, outputRange);
}

/**
 * Hook for creating 3 parallax layers with different rates
 * Fixed number of layers to comply with React hooks rules
 *
 * @example
 * ```tsx
 * const layers = useParallaxLayers3(0.2, 0.5, 0.8);
 *
 * return (
 *   <div ref={layers.ref}>
 *     <motion.div style={{ y: layers.layer1 }}>Background</motion.div>
 *     <motion.div style={{ y: layers.layer2 }}>Middle</motion.div>
 *     <motion.div style={{ y: layers.layer3 }}>Foreground</motion.div>
 *   </div>
 * );
 * ```
 */
export function useParallaxLayers3(
  rate1: number = 0.2,
  rate2: number = 0.5,
  rate3: number = 0.8
): {
  ref: RefObject<HTMLDivElement>;
  layer1: MotionValue<number>;
  layer2: MotionValue<number>;
  layer3: MotionValue<number>;
  progress: MotionValue<number>;
} {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const distance1 = 100 * rate1;
  const distance2 = 100 * rate2;
  const distance3 = 100 * rate3;

  const layer1 = useTransform(scrollYProgress, [0, 1], [distance1, -distance1]);
  const layer2 = useTransform(scrollYProgress, [0, 1], [distance2, -distance2]);
  const layer3 = useTransform(scrollYProgress, [0, 1], [distance3, -distance3]);

  return {
    ref,
    layer1,
    layer2,
    layer3,
    progress: scrollYProgress,
  };
}

export default useParallax;

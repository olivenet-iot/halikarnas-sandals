"use client";

import { useInView } from "framer-motion";
import { useRef, RefObject, useEffect, useState } from "react";

interface UseInViewAnimationOptions {
  /** Trigger animation only once. Default: true */
  once?: boolean;
  /** Percentage of element visible to trigger (0-1). Default: 0.3 */
  threshold?: number;
  /** Root margin for intersection observer. Default: "-100px" */
  margin?: string;
  /** Delay before animation starts (in ms). Default: 0 */
  delay?: number;
}

interface UseInViewAnimationReturn {
  /** Ref to attach to the element */
  ref: RefObject<HTMLDivElement>;
  /** Whether the element is in view (and animation should play) */
  isInView: boolean;
  /** Whether the animation has been triggered at least once */
  hasAnimated: boolean;
}

/**
 * Custom hook for triggering animations when elements enter viewport
 *
 * @example
 * ```tsx
 * const { ref, isInView } = useInViewAnimation({ threshold: 0.5 });
 *
 * return (
 *   <motion.div
 *     ref={ref}
 *     initial="hidden"
 *     animate={isInView ? "visible" : "hidden"}
 *     variants={fadeInUp}
 *   >
 *     Content
 *   </motion.div>
 * );
 * ```
 */
export function useInViewAnimation({
  once = true,
  threshold = 0.3,
  margin = "-100px",
  delay = 0,
}: UseInViewAnimationOptions = {}): UseInViewAnimationReturn {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const isInView = useInView(ref, {
    once,
    amount: threshold,
    margin: margin as `${number}px ${number}px ${number}px ${number}px` | `${number}px`,
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      if (delay > 0) {
        const timer = setTimeout(() => {
          setShouldAnimate(true);
          setHasAnimated(true);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        setShouldAnimate(true);
        setHasAnimated(true);
      }
    } else if (isInView && !once) {
      setShouldAnimate(true);
    } else if (!isInView && !once) {
      setShouldAnimate(false);
    }
  }, [isInView, hasAnimated, delay, once]);

  return {
    ref,
    isInView: shouldAnimate,
    hasAnimated,
  };
}

/**
 * Hook for staggered animations of multiple elements
 *
 * @example
 * ```tsx
 * const { containerRef, getItemProps } = useStaggeredAnimation(5, { staggerDelay: 100 });
 *
 * return (
 *   <div ref={containerRef}>
 *     {items.map((item, index) => (
 *       <motion.div key={item.id} {...getItemProps(index)}>
 *         {item.content}
 *       </motion.div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useStaggeredAnimation(
  itemCount: number,
  {
    once = true,
    threshold = 0.2,
    margin = "-50px",
    staggerDelay = 100,
  }: UseInViewAnimationOptions & { staggerDelay?: number } = {}
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );

  const isContainerInView = useInView(containerRef, {
    once,
    amount: threshold,
    margin: margin as `${number}px ${number}px ${number}px ${number}px` | `${number}px`,
  });

  useEffect(() => {
    if (isContainerInView) {
      // Stagger the visibility of each item
      const timers: NodeJS.Timeout[] = [];

      for (let i = 0; i < itemCount; i++) {
        const timer = setTimeout(() => {
          setVisibleItems((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * staggerDelay);
        timers.push(timer);
      }

      return () => {
        timers.forEach(clearTimeout);
      };
    }
  }, [isContainerInView, itemCount, staggerDelay]);

  const getItemProps = (index: number) => ({
    initial: "hidden",
    animate: visibleItems[index] ? "visible" : "hidden",
    style: { willChange: "transform, opacity" },
  });

  return {
    containerRef,
    isInView: isContainerInView,
    visibleItems,
    getItemProps,
  };
}

/**
 * Hook for counting animation (0 to target number)
 */
export function useCountAnimation(
  targetValue: number,
  {
    duration = 2000,
    once = true,
    threshold = 0.5,
  }: { duration?: number; once?: boolean; threshold?: number } = {}
) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const isInView = useInView(ref, {
    once,
    amount: threshold,
  });

  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);

      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(eased * targetValue);

        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, targetValue, duration, hasStarted]);

  return {
    ref,
    count,
    isInView,
  };
}

export default useInViewAnimation;

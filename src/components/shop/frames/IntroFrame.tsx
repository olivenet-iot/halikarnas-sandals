"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TIMING, EASE } from "@/lib/animations";
import {
  VideoBackground,
  AnimatedGradientBackground,
  GoldDivider,
  TextFadeIn,
  ChevronBounce,
} from "@/components/ui/luxury";

interface IntroFrameProps {
  isActive: boolean;
}

// Video URL - update when available
const INTRO_VIDEO = "";
const INTRO_POSTER = "";

export function IntroFrame({ isActive }: IntroFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasVideo = Boolean(INTRO_VIDEO);

  // Parallax for background
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={containerRef}
      className="collection-frame snap-start snap-always flex items-center justify-center overflow-hidden bg-stone-900"
      style={{ height: '100dvh', minHeight: '100dvh', maxHeight: '100dvh', flexShrink: 0, margin: 0 }}
    >
      {/* Background with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        {hasVideo ? (
          <VideoBackground
            src={INTRO_VIDEO}
            poster={INTRO_POSTER}
            overlay="gradient"
            className="absolute inset-0"
            fallback={<AnimatedGradientBackground className="absolute inset-0" />}
          />
        ) : (
          <AnimatedGradientBackground className="absolute inset-0" />
        )}
      </motion.div>

      {/* Content with Parallax */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        style={{ y: contentY }}
      >
        {/* Logo - Letter Spacing Animation */}
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={
            isActive
              ? { opacity: 1, letterSpacing: "0.3em" }
              : { opacity: 0, letterSpacing: "0.5em" }
          }
          transition={{ duration: TIMING.cinematic, ease: EASE.luxury, delay: 0.2 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-8"
          style={{
            textShadow: "0 0 60px rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.5)",
          }}
        >
          HALIKARNAS
        </motion.h1>

        {/* Gold Divider */}
        <div className="flex justify-center mb-8">
          <GoldDivider variant="wide" isInView={isActive} delay={0.4} />
        </div>

        {/* Subtitle */}
        <TextFadeIn
          isInView={isActive}
          delay={0.6}
          className="mb-6"
        >
          <p
            className="text-2xl md:text-3xl lg:text-4xl font-serif text-white/90"
            style={{
              textShadow: "0 0 40px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            Koleksiyonlar
          </p>
        </TextFadeIn>

        {/* Tagline - Word by Word */}
        <TextFadeIn
          isInView={isActive}
          delay={0.8}
        >
          <p
            className="text-lg md:text-xl lg:text-2xl text-white/70 max-w-xl mx-auto font-light"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
          >
            Usta ellerden, Ege&apos;nin kalbinden
          </p>
        </TextFadeIn>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: TIMING.medium, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-white/40">
          Kesfet
        </span>
        <ChevronBounce theme="light" />
      </motion.div>
    </section>
  );
}

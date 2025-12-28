"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { IntroFrame } from "./frames/IntroFrame";
import { CollectionFrame } from "./frames/CollectionFrame";
import { OutroFrame } from "./frames/OutroFrame";
import { ScrollProgress, ScrollProgressMobile } from "./ScrollProgress";
import { useScrollStore } from "@/stores/scroll-store";

interface CollectionData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  bannerImage?: string | null;
  isFeatured?: boolean;
  position: number;
}

interface CinematicScrollProps {
  collections: CollectionData[];
}

export function CinematicScroll({ collections }: CinematicScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const setGlobalScrollY = useScrollStore((state) => state.setScrollY);

  // Frame sayisi: intro + koleksiyonlar + outro
  const totalFrames = collections.length + 2;

  // Scroll event ile aktif frame'i track et + global scroll sync
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const frameHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / frameHeight);
      setActiveIndex(newIndex);

      // Global scroll state'i guncelle (Navbar icin)
      setGlobalScrollY(scrollTop);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [setGlobalScrollY]);

  // Navigate to specific frame
  const navigateToFrame = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container) return;

      const clampedIndex = Math.max(0, Math.min(index, totalFrames - 1));
      const targetScroll = clampedIndex * container.clientHeight;

      container.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    },
    [totalFrames]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        navigateToFrame(activeIndex + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        navigateToFrame(activeIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, navigateToFrame]);

  return (
    <div className="relative h-screen">
      {/* Scroll Container */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Intro Frame */}
        <IntroFrame isActive={activeIndex === 0} />

        {/* Collection Frames */}
        {collections.map((collection, index) => (
          <CollectionFrame
            key={collection.id}
            collection={collection}
            isActive={activeIndex === index + 1}
            index={index + 1}
          />
        ))}

        {/* Outro Frame */}
        <OutroFrame isActive={activeIndex === totalFrames - 1} />
      </div>

      {/* Progress Indicator - Desktop */}
      <ScrollProgress
        total={totalFrames}
        current={activeIndex}
        collections={collections}
        onNavigate={navigateToFrame}
      />

      {/* Progress Indicator - Mobile */}
      <ScrollProgressMobile
        total={totalFrames}
        current={activeIndex}
        onNavigate={navigateToFrame}
      />
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";

interface ScrollProgressProps {
  total: number;
  current: number;
  collections: { name: string }[];
  onNavigate: (index: number) => void;
}

export function ScrollProgress({
  total,
  current,
  collections,
  onNavigate,
}: ScrollProgressProps) {
  // Labels: Intro, koleksiyon adlari, Outro
  const getLabel = (index: number) => {
    if (index === 0) return "Baslangic";
    if (index === total - 1) return "Son";
    return collections[index - 1]?.name || "";
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-3">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onNavigate(index)}
          className="group flex items-center gap-3"
          aria-label={`Go to ${getLabel(index)}`}
        >
          {/* Label - Hover'da gorunur */}
          <span
            className={cn(
              "text-xs uppercase tracking-wider transition-all duration-300",
              "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
              current === index ? "text-white" : "text-white/50"
            )}
          >
            {getLabel(index)}
          </span>

          {/* Dot */}
          <div
            className={cn(
              "transition-all duration-300",
              current === index
                ? "w-3 h-3 bg-[#B8860B] rounded-full"
                : "w-2 h-2 bg-white/40 rounded-full hover:bg-white/70"
            )}
          />
        </button>
      ))}
    </div>
  );
}

// Mobile version - Sol ustte dikey
export function ScrollProgressMobile({
  total,
  current,
  onNavigate,
}: Omit<ScrollProgressProps, "collections">) {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 md:hidden flex flex-col gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onNavigate(index)}
          className={cn(
            "transition-all duration-300 rounded-full",
            current === index
              ? "w-2.5 h-2.5 bg-[#B8860B]"
              : "w-1.5 h-1.5 bg-white/40"
          )}
          aria-label={`Go to frame ${index + 1}`}
        />
      ))}
    </div>
  );
}

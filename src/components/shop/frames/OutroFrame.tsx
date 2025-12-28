"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface OutroFrameProps {
  isActive: boolean;
}

export function OutroFrame({ isActive }: OutroFrameProps) {
  return (
    <section className="h-screen w-full snap-start snap-always relative flex items-center justify-center overflow-hidden bg-stone-900">
      {/* Subtle Pattern/Texture Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-950" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* Decorative Line */}
        <div
          className={cn(
            "h-[1px] bg-[#B8860B] mx-auto mb-10",
            "transition-all duration-700 ease-out",
            isActive ? "w-16" : "w-0"
          )}
          style={{ transitionDelay: "200ms" }}
        />

        {/* Heading */}
        <h2
          className={cn(
            "font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6",
            "transition-all duration-700 ease-out",
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
          style={{ transitionDelay: "400ms" }}
        >
          Tum koleksiyonlari kesfettiniz
        </h2>

        {/* Subtext */}
        <p
          className={cn(
            "text-white/60 text-lg mb-10",
            "transition-all duration-700 ease-out",
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: "600ms" }}
        >
          El yapimi sandalet koleksiyonlarimizi incelediniz
        </p>

        {/* Primary CTA */}
        <div
          className={cn(
            "mb-8",
            "transition-all duration-700 ease-out",
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: "800ms" }}
        >
          <Link
            href="/kadin"
            className={cn(
              "inline-flex items-center gap-3 px-10 py-4",
              "bg-[#B8860B] hover:bg-[#9A7209]",
              "text-white text-sm uppercase tracking-[0.2em]",
              "transition-all duration-300",
              "group"
            )}
          >
            <span>Alisverise Basla</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {/* Secondary Links */}
        <div
          className={cn(
            "flex items-center justify-center gap-6 text-sm",
            "transition-all duration-700 ease-out",
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: "1000ms" }}
        >
          <Link
            href="/hakkimizda"
            className="text-white/50 hover:text-white transition-colors"
          >
            Hakkimizda
          </Link>
          <span className="text-white/30">·</span>
          <Link
            href="/iletisim"
            className="text-white/50 hover:text-white transition-colors"
          >
            Iletisim
          </Link>
          <span className="text-white/30">·</span>
          <Link
            href="/sss"
            className="text-white/50 hover:text-white transition-colors"
          >
            SSS
          </Link>
        </div>
      </div>
    </section>
  );
}

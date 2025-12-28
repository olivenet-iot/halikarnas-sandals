"use client";

import { cn } from "@/lib/utils";

interface IntroFrameProps {
  isActive: boolean;
}

// Cloudinary video URL'leri - sonra degistirilecek
const INTRO_VIDEO = ""; // Bos birak simdilik
const INTRO_POSTER = ""; // Bos birak simdilik

export function IntroFrame({ isActive }: IntroFrameProps) {
  const hasVideo = Boolean(INTRO_VIDEO);

  return (
    <section className="h-screen w-full snap-start snap-always relative flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {hasVideo ? (
          /* Video Background */
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={INTRO_POSTER || undefined}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={INTRO_VIDEO} type="video/mp4" />
          </video>
        ) : (
          /* Fallback: Animated Gradient */
          <>
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br from-stone-800 via-amber-900/20 to-stone-900",
                "animate-gradient-shift bg-[length:200%_200%]",
                "transition-transform duration-[1.5s] ease-out",
                isActive ? "scale-100" : "scale-110"
              )}
            />
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </>
        )}

        {/* Dark Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/40",
            "transition-opacity duration-1000",
            isActive ? "opacity-100" : "opacity-60"
          )}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Logo */}
        <h1
          className={cn(
            "font-serif text-4xl md:text-5xl lg:text-6xl tracking-[0.3em] text-white mb-8",
            "transition-all duration-700 ease-out",
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{
            transitionDelay: "200ms",
            textShadow:
              "0 0 40px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          HALIKARNAS
        </h1>

        {/* Decorative Line */}
        <div
          className={cn(
            "h-[1px] bg-[#B8860B] mx-auto mb-8",
            "transition-all duration-700 ease-out",
            isActive ? "w-24" : "w-0"
          )}
          style={{ transitionDelay: "400ms" }}
        />

        {/* Subtitle */}
        <p
          className={cn(
            "text-2xl md:text-3xl lg:text-4xl font-serif text-white/90 mb-6",
            "transition-all duration-700 ease-out",
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
          style={{
            transitionDelay: "600ms",
            textShadow:
              "0 0 30px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Koleksiyonlar
        </p>

        {/* Tagline */}
        <p
          className={cn(
            "text-lg md:text-xl text-white/70 max-w-xl mx-auto",
            "transition-all duration-700 ease-out",
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{
            transitionDelay: "800ms",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Usta ellerden, Ege&apos;nin kalbinden
        </p>
      </div>

      {/* Scroll Hint - Sadece ok */}
      <div
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2",
          "transition-all duration-700 ease-out",
          isActive ? "opacity-100" : "opacity-0"
        )}
        style={{ transitionDelay: "1200ms" }}
      >
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-white/40"
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
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getCollectionHeroUrl } from "@/lib/cloudinary";

interface CollectionFrameProps {
  collection: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    bannerImage?: string | null;
  };
  isActive: boolean;
  index: number;
}

export function CollectionFrame({
  collection,
  isActive,
  index,
}: CollectionFrameProps) {
  const heroImage = collection.bannerImage || collection.image;

  // Description'dan kisa tagline cikar (ilk cumle veya 100 karakter)
  const tagline = collection.description
    ? collection.description.split(".")[0].slice(0, 100) +
      (collection.description.length > 100 ? "..." : "")
    : null;

  return (
    <section className="h-screen w-full snap-start snap-always relative flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {heroImage ? (
          <Image
            src={getCollectionHeroUrl(heroImage)}
            alt={collection.name}
            fill
            className={cn(
              "object-cover",
              "transition-transform duration-[1.5s] ease-out",
              isActive ? "scale-100" : "scale-110"
            )}
            priority={index <= 2}
          />
        ) : (
          /* Premium fallback - dark gradient with pattern */
          <div className="absolute inset-0 bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900">
            {/* Subtle pattern overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10",
            "transition-opacity duration-700",
            isActive ? "opacity-100" : "opacity-70"
          )}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Decorative Line */}
        <div
          className={cn(
            "h-[1px] bg-[#B8860B] mx-auto mb-8",
            "transition-all duration-700 ease-out",
            isActive ? "w-16" : "w-0"
          )}
          style={{ transitionDelay: "200ms" }}
        />

        {/* Collection Name */}
        <h2
          className={cn(
            "font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white tracking-wide mb-6",
            "transition-all duration-700 ease-out",
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "400ms" }}
        >
          {collection.name}
        </h2>

        {/* Tagline */}
        {tagline && (
          <p
            className={cn(
              "text-lg md:text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto mb-10 font-light",
              "transition-all duration-700 ease-out",
              isActive
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            )}
            style={{ transitionDelay: "600ms" }}
          >
            &ldquo;{tagline}&rdquo;
          </p>
        )}

        {/* CTA Button */}
        <div
          className={cn(
            "transition-all duration-700 ease-out",
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: "800ms" }}
        >
          <Link
            href={`/koleksiyonlar/${collection.slug}`}
            className={cn(
              "inline-flex items-center gap-3 px-8 py-4",
              "border border-white/30 hover:border-white/60",
              "text-white text-sm uppercase tracking-[0.2em]",
              "transition-all duration-300",
              "hover:bg-white/10 hover:gap-4",
              "group"
            )}
          >
            <span>Koleksiyonu Kesfet</span>
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
      </div>

      {/* Scroll Down Indicator */}
      <div
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2",
          "transition-opacity duration-500",
          isActive ? "opacity-60" : "opacity-0"
        )}
        style={{ transitionDelay: "1200ms" }}
      >
        <div className="animate-bounce">
          <svg
            className="w-5 h-5 text-white/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

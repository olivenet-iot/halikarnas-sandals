"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getProductImageUrl } from "@/lib/cloudinary";

interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
}

interface ImageGalleryV2Props {
  images: ProductImage[];
  productName: string;
}

export function ImageGalleryV2({ images, productName }: ImageGalleryV2Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Reset to first slide when image set changes (e.g. color switch)
  useEffect(() => {
    setActiveIndex(0);
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [images]);

  // Track active slide on mobile/tablet (<lg). Disabled on desktop where stack is vertical.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(max-width: 1023px)");
    let observer: IntersectionObserver | null = null;

    const attach = () => {
      if (!mq.matches || !scrollerRef.current) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const idx = Number(
                (entry.target as HTMLElement).dataset.index ?? "0"
              );
              setActiveIndex(idx);
            }
          });
        },
        { root: scrollerRef.current, threshold: 0.6 }
      );
      slideRefs.current.forEach((el) => el && observer?.observe(el));
    };

    const detach = () => {
      observer?.disconnect();
      observer = null;
    };

    attach();
    const handleChange = () => {
      detach();
      attach();
    };
    mq.addEventListener("change", handleChange);

    return () => {
      mq.removeEventListener("change", handleChange);
      detach();
    };
  }, [images]);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/5] bg-v2-bg-primary">
        <Image
          src="/images/product-placeholder.jpg"
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 58vw"
          priority
        />
      </div>
    );
  }

  return (
    <div>
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:snap-none lg:gap-2"
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            ref={(el) => {
              slideRefs.current[index] = el;
            }}
            data-index={index}
            className="relative w-full shrink-0 snap-center aspect-[4/5] bg-v2-bg-primary lg:w-auto lg:shrink"
          >
            <Image
              src={getProductImageUrl(image.url)}
              alt={image.alt || `${productName} - ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 pt-4 lg:hidden">
          {images.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                activeIndex === i
                  ? "w-6 bg-v2-text-primary"
                  : "w-1 bg-v2-border-subtle"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

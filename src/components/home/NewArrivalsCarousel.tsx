"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/shop/ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  gender: "ERKEK" | "KADIN" | "UNISEX" | null;
  price: number;
  compareAtPrice?: number | null;
  images: { url: string; alt?: string }[];
  colors?: { name: string; hex: string }[];
  categorySlug?: string | null;
  isNew?: boolean;
  isSale?: boolean;
  isBestseller?: boolean;
}

interface NewArrivalsCarouselProps {
  products: Product[];
}

export function NewArrivalsCarousel({ products }: NewArrivalsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 280; // Match card width + gap
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Arrows - Desktop */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white/90 backdrop-blur-sm border border-luxury-stone rounded-full shadow-lg hover:bg-luxury-primary hover:text-white hover:border-luxury-primary transition-all duration-300"
          aria-label="Önceki"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white/90 backdrop-blur-sm border border-luxury-stone rounded-full shadow-lg hover:bg-luxury-primary hover:text-white hover:border-luxury-primary transition-all duration-300"
          aria-label="Sonraki"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4 md:-mx-0 md:px-0 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="snap-start shrink-0 w-[220px] md:w-[260px] lg:w-[280px]"
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>

        {/* Scroll Indicator - Mobile */}
        <div className="flex md:hidden justify-center mt-4 gap-1">
          <span className="text-xs text-luxury-charcoal/50 tracking-wide">
            Kaydırarak keşfedin
          </span>
          <ArrowRight className="w-3 h-3 text-luxury-charcoal/50 animate-pulse" />
        </div>
      </div>

      {/* View All Link */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 md:mt-16 text-center"
      >
        <Link
          href="/yeni-gelenler"
          className="group inline-flex items-center gap-3 text-luxury-primary text-sm tracking-[0.15em] uppercase font-medium hover:text-luxury-gold transition-colors duration-300"
        >
          Tüm Yeni Ürünler
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </motion.div>
    </>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getProductImageUrl, getThumbnailUrl } from "@/lib/cloudinary";

interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  color?: string | null;
}

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
  badges?: {
    isNew?: boolean;
    discount?: number;
    isBestseller?: boolean;
  };
}

export function ImageGallery({ images, productName, badges }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const currentImage = images[activeIndex] || images[0];
  const hasMultipleImages = images.length > 1;

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4 overflow-hidden">
      {/* Main Image */}
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-sand-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={getProductImageUrl(currentImage?.url || "/images/product-placeholder.jpg")}
              alt={currentImage?.alt || productName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
              aria-label="Onceki gorsel"
            >
              <ChevronLeft className="h-5 w-5 text-leather-700" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
              aria-label="Sonraki gorsel"
            >
              <ChevronRight className="h-5 w-5 text-leather-700" />
            </button>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {badges?.isNew && (
            <Badge className="bg-aegean-600 text-white hover:bg-aegean-600">
              Yeni
            </Badge>
          )}
          {badges?.discount && badges.discount > 0 && (
            <Badge className="bg-terracotta-500 text-white hover:bg-terracotta-500">
              %{badges.discount} Indirim
            </Badge>
          )}
          {badges?.isBestseller && (
            <Badge className="bg-leather-700 text-white hover:bg-leather-700">
              Cok Satan
            </Badge>
          )}
        </div>

        {/* Image Counter (Mobile) */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full md:hidden">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Grid - Below main image */}
      {hasMultipleImages && (
        <div className="grid grid-cols-4 gap-3 overflow-hidden">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                activeIndex === index
                  ? "border-aegean-600 ring-2 ring-aegean-200"
                  : "border-transparent hover:border-sand-300"
              )}
            >
              <Image
                src={getThumbnailUrl(image.url)}
                alt={image.alt || `${productName} - ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageGallery;

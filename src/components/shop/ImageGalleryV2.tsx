"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getProductImageUrl, getThumbnailUrl } from "@/lib/cloudinary";

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

  const currentImage = images[activeIndex] || images[0];
  const hasMultipleImages = images.length > 1;

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[3/4] max-h-[85vh] overflow-hidden bg-v2-bg-primary">
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
              src={getProductImageUrl(
                currentImage?.url || "/images/product-placeholder.jpg"
              )}
              alt={currentImage?.alt || productName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail Row */}
      {hasMultipleImages && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative w-16 h-20 flex-shrink-0 overflow-hidden border transition-colors duration-300",
                activeIndex === index
                  ? "border-v2-text-primary"
                  : "border-transparent hover:border-v2-border-subtle"
              )}
            >
              <Image
                src={getThumbnailUrl(image.url)}
                alt={image.alt || `${productName} - ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

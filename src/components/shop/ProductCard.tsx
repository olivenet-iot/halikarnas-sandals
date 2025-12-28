"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn, formatPrice, getProductUrl } from "@/lib/utils";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useToast } from "@/hooks/use-toast";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  sku: string;
  gender: "ERKEK" | "KADIN" | "UNISEX" | null;
  price: number;
  compareAtPrice?: number | null;
  images: { url: string; alt?: string }[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  categorySlug?: string | null;
  createdAt?: string;
  isNew?: boolean;
  isSale?: boolean;
  isBestseller?: boolean;
  className?: string;
  onQuickView?: (id: string) => void;
  onAddToWishlist?: (id: string) => void;
}

export function ProductCard({
  id,
  name,
  sku,
  gender,
  price,
  compareAtPrice,
  images,
  colors = [],
  categorySlug,
  isNew,
  isSale,
  className,
}: ProductCardProps) {
  // Generate product URL
  const productUrl = getProductUrl({
    sku,
    gender,
    category: categorySlug ? { slug: categorySlug } : null,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0]?.hex || "");
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { addItem, removeItem, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(id);

  const mainImage = images[0]?.url || "/images/product-placeholder.jpg";
  const hoverImage = images[1]?.url || mainImage;
  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      router.push(`/giris?callbackUrl=${productUrl}`);
      return;
    }

    setIsWishlistLoading(true);
    try {
      if (isWishlisted) {
        const success = await removeItem(id);
        if (success) {
          toast({
            title: "Favorilerden kaldırıldı",
            description: `${name} favorilerinizden kaldırıldı.`,
          });
        }
      } else {
        const success = await addItem(id);
        if (success) {
          toast({
            title: "Favorilere eklendi",
            description: `${name} favorilerinize eklendi.`,
          });
        }
      }
    } catch {
      toast({
        title: "Hata",
        description: "Bir hata oluştu, lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <motion.div
      className={cn("group relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Image Container - Luxury minimal */}
      <Link href={productUrl} className="block relative aspect-[3/4] overflow-hidden bg-luxury-stone/30">
        {/* Main Image */}
        <Image
          src={mainImage}
          alt={name}
          fill
          className={cn(
            "object-cover transition-all duration-700 ease-out",
            isHovered && images.length > 1 ? "opacity-0 scale-100" : "opacity-100 scale-100"
          )}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Hover Image */}
        {images.length > 1 && (
          <Image
            src={hoverImage}
            alt={`${name} - 2`}
            fill
            className={cn(
              "object-cover transition-all duration-700 ease-out",
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Minimal Badges - Luxury style */}
        <span className="absolute top-4 left-4 flex flex-col gap-2">
          {isNew && (
            <span className="px-3 py-1 bg-luxury-primary text-luxury-cream text-[10px] tracking-[0.2em] uppercase font-medium">
              Yeni
            </span>
          )}
          {isSale && discount > 0 && (
            <span className="px-3 py-1 bg-luxury-terracotta text-white text-[10px] tracking-[0.2em] uppercase font-medium">
              -{discount}%
            </span>
          )}
        </span>

        {/* Wishlist Button - Minimal */}
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "absolute top-4 right-4 h-10 w-10 rounded-none bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300",
            isHovered ? "opacity-100" : "opacity-0",
            isWishlisted
              ? "text-luxury-terracotta hover:text-luxury-terracotta-dark"
              : "text-luxury-charcoal hover:text-luxury-terracotta"
          )}
          onClick={handleWishlistClick}
          disabled={isWishlistLoading}
        >
          {isWishlistLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart
              className={cn("h-4 w-4", isWishlisted && "fill-current")}
            />
          )}
        </Button>

        {/* Quick Shop - Minimal */}
        <span
          className={cn(
            "absolute bottom-0 left-0 right-0 block transition-all duration-500",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <span className="block w-full py-4 bg-luxury-primary text-luxury-cream text-center text-xs tracking-[0.2em] uppercase font-medium hover:bg-luxury-primary-light transition-colors duration-300">
            Ürünü İncele
          </span>
        </span>
      </Link>

      {/* Product Info - Minimal luxury */}
      <div className="mt-5 space-y-3">
        {/* Color Swatches - Subtle */}
        {colors.length > 1 && (
          <div className="flex items-center gap-2">
            {colors.slice(0, 4).map((color) => (
              <button
                key={color.hex}
                className={cn(
                  "w-4 h-4 rounded-full transition-all duration-300",
                  selectedColor === color.hex
                    ? "ring-1 ring-offset-2 ring-luxury-charcoal"
                    : "hover:scale-110"
                )}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(color.hex);
                }}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-[10px] text-luxury-charcoal/50 tracking-wider">
                +{colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Name - Serif */}
        <Link href={productUrl}>
          <h3 className="font-serif text-lg text-luxury-primary hover:text-luxury-gold transition-colors duration-300 line-clamp-1">
            {name}
          </h3>
        </Link>

        {/* Price - Clean */}
        <div className="flex items-baseline gap-3">
          <span className="text-luxury-primary font-medium">
            {formatPrice(price)}
          </span>
          {compareAtPrice && compareAtPrice > price && (
            <span className="text-sm text-luxury-charcoal/40 line-through">
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

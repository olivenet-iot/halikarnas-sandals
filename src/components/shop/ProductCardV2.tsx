"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn, formatPrice, getProductUrl } from "@/lib/utils";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useToast } from "@/hooks/use-toast";

export interface ProductCardV2Props {
  id: string;
  name: string;
  slug: string;
  sku: string;
  gender: "ERKEK" | "KADIN" | "UNISEX" | null;
  price: number;
  compareAtPrice?: number | null;
  images: { url: string; alt?: string }[];
  categorySlug?: string | null;
}

export function ProductCardV2({
  id,
  name,
  sku,
  gender,
  price,
  compareAtPrice,
  images,
  categorySlug,
}: ProductCardV2Props) {
  const productUrl = getProductUrl({
    sku,
    gender,
    category: categorySlug ? { slug: categorySlug } : null,
  });

  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(id);

  const mainImage = images[0]?.url || "/images/product-placeholder.jpg";
  const hoverImage = images[1]?.url;

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
          toast({ title: "Favorilerden kaldırıldı", description: `${name} favorilerinizden kaldırıldı.` });
        }
      } else {
        const success = await addItem(id);
        if (success) {
          toast({ title: "Favorilere eklendi", description: `${name} favorilerinize eklendi.` });
        }
      }
    } catch {
      toast({ title: "Hata", description: "Bir hata oluştu, lütfen tekrar deneyin.", variant: "destructive" });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <div className="group relative w-full">
      <Link href={productUrl} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-v2-bg-primary">
          <Image
            src={mainImage}
            alt={name}
            fill
            className={cn(
              "object-cover transition-all duration-[400ms] ease-out",
              "group-hover:opacity-90",
              hoverImage && "group-hover:opacity-0"
            )}
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {hoverImage && (
            <Image
              src={hoverImage}
              alt={`${name} - 2`}
              fill
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[800ms] ease-out"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>

        {/* Info */}
        <div className="mt-5 lg:mt-6">
          <h3 className="font-inter font-normal text-[15px] lg:text-[17px] tracking-[0.005em] text-v2-text-primary">
            {name}
          </h3>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="font-inter font-normal text-sm tracking-[0.01em] text-v2-text-muted">
              {formatPrice(price)}
            </span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="font-inter text-xs tracking-[0.01em] text-v2-text-muted/70 line-through">
                {formatPrice(compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist — mobile: always visible (opacity-60), desktop: hover only */}
      <button
        onClick={handleWishlistClick}
        disabled={isWishlistLoading}
        className={cn(
          "absolute top-3 right-3 p-2 transition-opacity duration-300",
          "opacity-60 md:opacity-0 md:group-hover:opacity-100",
          isWishlisted ? "text-v2-accent" : "text-v2-text-muted"
        )}
        aria-label={isWishlisted ? "Favorilerden kaldır" : "Favorilere ekle"}
      >
        {isWishlistLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
        )}
      </button>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { formatPrice, getProductUrl } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    gender: "ERKEK" | "KADIN" | "UNISEX" | null;
    categorySlug: string | null;
    basePrice: string;
    compareAtPrice: string | null;
    image: string | null;
    secondImage: string | null;
    inStock: boolean;
    isActive: boolean;
  };
}

export default function FavorilerimPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    try {
      const res = await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
        toast({ title: "Favorilerden kaldirildi" });
      }
    } catch {
      toast({ title: "Hata", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-v2-text-muted" />
      </div>
    );
  }

  return (
    <div>
      <div className="pb-8 border-b border-v2-border-subtle">
        <h1 className="font-serif font-light text-3xl md:text-4xl text-v2-text-primary">
          Favorilerim
        </h1>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mt-12">
          {items.map((item) => {
            const productUrl = getProductUrl({
              sku: item.product.sku,
              gender: item.product.gender,
              category: item.product.categorySlug
                ? { slug: item.product.categorySlug }
                : null,
            });

            return (
              <div key={item.id} className="group relative">
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(item.productId)}
                  disabled={removingId === item.productId}
                  className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center text-v2-text-muted hover:text-v2-accent transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>

                <Link href={productUrl}>
                  <div className="aspect-[3/4] relative overflow-hidden bg-v2-bg-primary mb-3">
                    <Image
                      src={item.product.image || "/images/product-placeholder.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover transition-all duration-[400ms] ease-out group-hover:opacity-90"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div>
                    <p className="font-inter font-normal text-[15px] lg:text-[17px] tracking-[0.005em] text-v2-text-primary line-clamp-1">
                      {item.product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-inter font-normal text-sm tracking-[0.01em] text-v2-text-muted">
                        {formatPrice(Number(item.product.basePrice))}
                      </span>
                      {item.product.compareAtPrice && Number(item.product.compareAtPrice) > Number(item.product.basePrice) && (
                        <span className="font-inter text-xs tracking-[0.01em] text-v2-text-muted/70 line-through">
                          {formatPrice(Number(item.product.compareAtPrice))}
                        </span>
                      )}
                    </div>
                    {!item.product.inStock && (
                      <p className="font-inter text-xs text-v2-text-muted mt-1">Tukendi</p>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12">
          <p className="font-inter text-sm text-v2-text-muted">
            Begendginiz urunler burada gorunecek.
          </p>
          <Link
            href="/kadin"
            className="font-inter text-sm text-v2-text-primary underline underline-offset-4 hover:text-v2-text-muted transition-colors mt-3 inline-block"
          >
            Urunleri kesfet &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}

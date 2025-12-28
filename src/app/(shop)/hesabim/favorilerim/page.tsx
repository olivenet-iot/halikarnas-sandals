"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistCard } from "@/components/account/WishlistCard";

interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
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
    inStock: boolean;
    isActive: boolean;
  };
}

export default function FavorilerimPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleRemove = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-aegean-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-accent font-semibold text-leather-800">
          Favorilerim
        </h1>
        <p className="text-leather-500 mt-1">{items.length} ürün</p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <WishlistCard
              key={item.id}
              id={item.id}
              productId={item.productId}
              product={{
                id: item.product.id,
                name: item.product.name,
                slug: item.product.slug,
                sku: item.product.sku,
                gender: item.product.gender,
                categorySlug: item.product.categorySlug,
                basePrice: item.product.basePrice,
                compareAtPrice: item.product.compareAtPrice,
                image: item.product.image,
                inStock: item.product.inStock,
                isActive: item.product.isActive,
              }}
              onRemove={handleRemove}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-sand-200 p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-sand-100 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-leather-400" />
          </div>
          <h2 className="text-lg font-semibold text-leather-800 mb-2">
            Henüz favoriniz yok
          </h2>
          <p className="text-leather-500 mb-6">
            Beğendiğiniz ürünleri kalp ikonuna tıklayarak favorilerinize
            ekleyebilirsiniz.
          </p>
          <Button asChild>
            <Link href="/kadin">Ürünleri Keşfet</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

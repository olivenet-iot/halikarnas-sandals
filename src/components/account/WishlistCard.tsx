"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatPrice, getProductUrl } from "@/lib/utils";

interface WishlistCardProps {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    gender: "ERKEK" | "KADIN" | "UNISEX" | null;
    categorySlug: string | null;
    basePrice: number | string;
    compareAtPrice?: number | string | null;
    image: string | null;
    inStock: boolean;
    isActive: boolean;
  };
  onRemove: (productId: string) => void;
}

export function WishlistCard({
  productId,
  product,
  onRemove,
}: WishlistCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Kaldırılamadı");
      }

      onRemove(productId);
      toast({
        title: "Kaldırıldı",
        description: "Ürün favorilerden kaldırıldı.",
      });
    } catch {
      toast({
        title: "Hata",
        description: "Ürün kaldırılırken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    // For now just show toast - full cart integration would require variant selection
    setTimeout(() => {
      toast({
        title: "Ürün Sayfasına Gidin",
        description: "Sepete eklemek için lütfen beden seçin.",
      });
      setIsAddingToCart(false);
    }, 500);
  };

  const price = Number(product.basePrice);
  const comparePrice = product.compareAtPrice
    ? Number(product.compareAtPrice)
    : null;
  const isOnSale = comparePrice && comparePrice > price;

  // Generate product URL
  const productUrl = getProductUrl({
    sku: product.sku,
    gender: product.gender,
    category: product.categorySlug ? { slug: product.categorySlug } : null,
  });

  return (
    <div className="bg-white rounded-xl border border-sand-200 overflow-hidden group">
      {/* Image */}
      <Link href={productUrl} className="block relative">
        <div className="aspect-square relative overflow-hidden bg-sand-100">
          <Image
            src={product.image || "/images/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="secondary" className="bg-white text-leather-800">
                Stokta Yok
              </Badge>
            </div>
          )}
          {!product.isActive && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="secondary" className="bg-white text-leather-800">
                <AlertCircle className="h-3 w-3 mr-1" />
                Satışta Değil
              </Badge>
            </div>
          )}
        </div>
        {isOnSale && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            İndirim
          </Badge>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link
          href={productUrl}
          className="font-medium text-leather-800 hover:text-aegean-600 line-clamp-2 min-h-[2.5rem]"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <span className="font-semibold text-aegean-600">
            {formatPrice(price)}
          </span>
          {isOnSale && comparePrice && (
            <span className="text-sm text-leather-400 line-through">
              {formatPrice(comparePrice)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          {product.inStock && product.isActive ? (
            <Button
              size="sm"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              asChild
            >
              <Link href={productUrl}>
                {isAddingToCart ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Sepete Ekle
                  </>
                )}
              </Link>
            </Button>
          ) : (
            <Button size="sm" className="flex-1" disabled>
              {!product.isActive ? "Satışta Değil" : "Stokta Yok"}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

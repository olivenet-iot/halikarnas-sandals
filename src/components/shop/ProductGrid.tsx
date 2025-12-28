"use client";

import { ProductCard, ProductCardProps } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: ProductCardProps[];
  columns?: 2 | 3 | 4;
  isLoading?: boolean;
  className?: string;
  onQuickView?: (id: string) => void;
  onAddToWishlist?: (id: string) => void;
}

export function ProductGrid({
  products,
  columns = 4,
  isLoading = false,
  className,
  onQuickView,
  onAddToWishlist,
}: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  if (isLoading) {
    return (
      <div className={cn("grid gap-4 md:gap-6", gridCols[columns], className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-sand-100 flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-sand-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-heading-5 text-leather-800 mb-2">
          Ürün Bulunamadı
        </h3>
        <p className="text-body-md text-leather-600 max-w-md">
          Aradığınız kriterlere uygun ürün bulunamadı. Lütfen filtrelerinizi
          değiştirin veya farklı bir arama yapın.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 md:gap-6", gridCols[columns], className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onQuickView={onQuickView}
          onAddToWishlist={onAddToWishlist}
        />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[3/4] rounded-lg" />
      <div className="space-y-2">
        <div className="flex gap-1">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="w-5 h-5 rounded-full" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    </div>
  );
}

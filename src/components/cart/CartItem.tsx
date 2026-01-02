"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCartStore, CartItem as CartItemType } from "@/stores/cart-store";
import { formatPrice, getProductUrl } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

export function CartItem({ item, compact = false }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const imageSize = compact ? 80 : 120;

  // Generate product URL
  const productUrl = getProductUrl({
    sku: item.sku,
    gender: item.gender,
    category: item.categorySlug ? { slug: item.categorySlug } : null,
  });

  return (
    <div className="bg-white border border-stone-200 p-5 md:p-6 group hover:border-[#B8860B]/30 transition-colors duration-300">
      <div className="flex gap-5 md:gap-6">
        {/* Product Image */}
        <Link href={productUrl} className="flex-shrink-0">
          <div
            className="relative overflow-hidden bg-stone-100"
            style={{ width: imageSize, height: compact ? imageSize : imageSize * 1.25 }}
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-stone-300" />
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <Link
            href={productUrl}
            className="font-serif text-lg text-stone-800 hover:text-[#B8860B] transition-colors line-clamp-2"
          >
            {item.name}
          </Link>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-stone-500">
            {item.color && (
              <>
                <span
                  className="w-4 h-4 rounded-full border border-stone-300"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.colorName}</span>
                <span className="text-stone-300">|</span>
              </>
            )}
            <span>Beden: {item.size}</span>
          </div>

          {/* Price */}
          <div className="mt-3">
            {item.compareAtPrice && item.compareAtPrice > item.price && (
              <span className="text-sm text-stone-400 line-through mr-2">
                {formatPrice(item.compareAtPrice)}
              </span>
            )}
            <span className="font-serif text-lg text-stone-800">
              {formatPrice(item.price)}
            </span>
          </div>

          {/* Quantity Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center border border-stone-200">
              <button
                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="p-2 hover:bg-stone-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Azalt"
              >
                <Minus className="h-4 w-4 text-stone-600" />
              </button>
              <span className="w-10 text-center font-medium text-stone-800">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                disabled={item.quantity >= item.maxQuantity}
                className="p-2 hover:bg-stone-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Artir"
              >
                <Plus className="h-4 w-4 text-stone-600" />
              </button>
            </div>

            {/* Subtotal */}
            <span className="font-serif text-xl text-[#B8860B]">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        </div>

        {/* Remove Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="self-start p-1 text-stone-400 hover:text-stone-600 transition-colors"
              aria-label="Urunu kaldir"
            >
              <X className="h-5 w-5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-serif text-xl text-stone-800">
                Urunu Kaldir
              </AlertDialogTitle>
              <AlertDialogDescription className="text-stone-600">
                {item.name} urununu sepetinizden kaldirmak istediginize emin misiniz?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-stone-200 text-stone-600 hover:bg-stone-100">
                Iptal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => removeItem(item.variantId)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Kaldir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex gap-4 py-4"
    >
      {/* Product Image */}
      <Link href={productUrl} className="flex-shrink-0">
        <div
          className="relative rounded-lg overflow-hidden bg-sand-100"
          style={{ width: imageSize, height: imageSize }}
        >
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-sand-300" />
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={productUrl}
          className={`font-medium text-leather-800 hover:text-aegean-600 transition-colors line-clamp-2 ${
            compact ? "text-body-sm" : "text-body-md"
          }`}
        >
          {item.name}
        </Link>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-body-sm text-leather-500">
          {item.color && (
            <>
              <span
                className="w-4 h-4 rounded-full border border-sand-300"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.colorName}</span>
              <span className="text-sand-300">|</span>
            </>
          )}
          <span>Beden: {item.size}</span>
        </div>

        {/* Price */}
        <div className="mt-2">
          {item.compareAtPrice && item.compareAtPrice > item.price && (
            <span className="text-body-xs text-leather-400 line-through mr-2">
              {formatPrice(item.compareAtPrice)}
            </span>
          )}
          <span
            className={`font-semibold text-leather-800 ${
              compact ? "text-body-sm" : "text-body-md"
            }`}
          >
            {formatPrice(item.price)}
          </span>
        </div>

        {/* Quantity Controls */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className={compact ? "h-7 w-7" : "h-8 w-8"}
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className={compact ? "h-3 w-3" : "h-4 w-4"} />
            </Button>
            <span
              className={`w-8 text-center font-medium ${
                compact ? "text-body-sm" : "text-body-md"
              }`}
            >
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className={compact ? "h-7 w-7" : "h-8 w-8"}
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              disabled={item.quantity >= item.maxQuantity}
            >
              <Plus className={compact ? "h-3 w-3" : "h-4 w-4"} />
            </Button>
          </div>

          {/* Subtotal */}
          <span
            className={`font-semibold text-leather-800 ${
              compact ? "text-body-md" : "text-body-lg"
            }`}
          >
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>

      {/* Remove Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-leather-400 hover:text-red-500 flex-shrink-0"
            aria-label="Ürünü kaldır"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ürünü Kaldır</AlertDialogTitle>
            <AlertDialogDescription>
              {item.name} ürününü sepetinizden kaldırmak istediğinize emin
              misiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => removeItem(item.variantId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Kaldır
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

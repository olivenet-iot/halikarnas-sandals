"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCartStore, CartItem } from "@/stores/cart-store";
import { useHydrated } from "@/hooks/useHydrated";
import { formatPrice } from "@/lib/utils";

function CartItemCard({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex gap-4 py-4"
    >
      {/* Product Image */}
      <Link href={`/urun/${item.slug}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-sand-100">
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
          href={`/urun/${item.slug}`}
          className="text-body-md font-medium text-leather-800 hover:text-aegean-600 transition-colors line-clamp-1"
        >
          {item.name}
        </Link>

        <div className="mt-1 flex items-center gap-2 text-body-sm text-leather-500">
          <span
            className="w-4 h-4 rounded-full border border-sand-300"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.colorName}</span>
          <span className="text-sand-300">|</span>
          <span>Beden: {item.size}</span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-body-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              disabled={item.quantity >= item.maxQuantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Price */}
          <div className="text-right">
            {item.compareAtPrice && item.compareAtPrice > item.price && (
              <span className="text-body-xs text-leather-400 line-through mr-2">
                {formatPrice(item.compareAtPrice * item.quantity)}
              </span>
            )}
            <span className="text-body-md font-semibold text-leather-800">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-leather-400 hover:text-red-500"
        onClick={() => removeItem(item.variantId)}
        aria-label="Ürünü kaldır"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}

export function CartDrawer() {
  const hydrated = useHydrated();
  const { items, isOpen, closeCart, getSubtotal, clearCart } = useCartStore();
  // Only calculate totals after hydration to prevent mismatch
  const totalPrice = hydrated ? getSubtotal() : 0;
  const displayItems = hydrated ? items : [];

  // Shipping calculation (free above 500 TL)
  const shippingThreshold = 500;
  const remainingForFreeShipping = Math.max(0, shippingThreshold - totalPrice);
  const hasItems = displayItems.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0" hideClose>
        <SheetHeader className="p-4 border-b border-sand-200">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 font-accent text-xl text-leather-800">
              <ShoppingBag className="h-5 w-5" />
              Sepetim
              {hasItems && (
                <span className="text-body-sm font-normal text-leather-500">
                  ({displayItems.length} ürün)
                </span>
              )}
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeCart}
              aria-label="Sepeti kapat"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Free Shipping Progress */}
          {hasItems && remainingForFreeShipping > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-body-xs mb-1">
                <span className="text-leather-600">
                  Ücretsiz kargoya{" "}
                  <span className="font-semibold text-aegean-600">
                    {formatPrice(remainingForFreeShipping)}
                  </span>{" "}
                  kaldı!
                </span>
              </div>
              <div className="h-2 bg-sand-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      100,
                      (totalPrice / shippingThreshold) * 100
                    )}%`,
                  }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-aegean-500 rounded-full"
                />
              </div>
            </div>
          )}

          {hasItems && remainingForFreeShipping <= 0 && (
            <div className="mt-3 flex items-center gap-2 text-body-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Ücretsiz kargo hakkı kazandınız!
            </div>
          )}
        </SheetHeader>

        {/* Cart Items */}
        {hasItems ? (
          <>
            <ScrollArea className="flex-1 px-4">
              <AnimatePresence mode="popLayout">
                {displayItems.map((item) => (
                  <div key={item.variantId}>
                    <CartItemCard item={item} />
                    <Separator />
                  </div>
                ))}
              </AnimatePresence>
            </ScrollArea>

            {/* Footer */}
            <div className="mt-auto p-4 border-t border-sand-200 flex flex-col gap-4">
              {/* Subtotal */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-body-md">
                  <span className="text-leather-600">Ara Toplam</span>
                  <span className="font-semibold text-leather-800">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-leather-500">Kargo</span>
                  <span className="text-leather-600">
                    {remainingForFreeShipping <= 0 ? (
                      <span className="text-green-600">Ücretsiz</span>
                    ) : (
                      "Ödeme sayfasında hesaplanacak"
                    )}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-body-lg font-semibold text-leather-800">
                  Toplam
                </span>
                <span className="text-heading-5 font-bold text-leather-900">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button asChild className="w-full btn-primary" size="lg">
                  <Link href="/odeme" onClick={closeCart}>
                    Ödemeye Geç
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full btn-secondary"
                  size="lg"
                >
                  <Link href="/sepet" onClick={closeCart}>
                    Sepeti Görüntüle
                  </Link>
                </Button>
              </div>

              {/* Clear Cart */}
              <Button
                variant="ghost"
                size="sm"
                className="text-leather-500 hover:text-red-500 self-center"
                onClick={clearCart}
              >
                Sepeti Temizle
              </Button>
            </div>
          </>
        ) : (
          /* Empty Cart State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-sand-100 flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-sand-400" />
            </div>
            <h3 className="text-heading-5 text-leather-800 mb-2">
              Sepetiniz Boş
            </h3>
            <p className="text-body-md text-leather-500 mb-6">
              Sepetinizde henüz ürün bulunmuyor. Hemen alışverişe başlayın!
            </p>
            <Button asChild className="btn-primary" size="lg">
              <Link href="/kadin" onClick={closeCart}>
                Alışverişe Başla
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

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
import { useShippingConfig } from "@/components/providers/ShippingConfigProvider";
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
        <div className="relative w-20 h-20 overflow-hidden bg-v2-bg-primary">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-v2-text-muted" />
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/urun/${item.slug}`}
          className="text-sm font-medium text-v2-text-primary hover:text-v2-accent transition-colors line-clamp-1"
        >
          {item.name}
        </Link>

        <div className="mt-1 flex items-center gap-2 text-xs text-v2-text-muted">
          <span
            className="w-4 h-4 rounded-none border border-v2-border-subtle"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.colorName}</span>
          <span className="text-v2-border-subtle">|</span>
          <span>Beden: {item.size}</span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-none border-v2-border-subtle"
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-xs font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-none border-v2-border-subtle"
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              disabled={item.quantity >= item.maxQuantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Price */}
          <div className="text-right">
            {item.compareAtPrice && item.compareAtPrice > item.price && (
              <span className="text-xs text-v2-text-muted line-through mr-2">
                {formatPrice(item.compareAtPrice * item.quantity)}
              </span>
            )}
            <span className="text-sm font-semibold text-v2-text-primary">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-v2-text-muted hover:text-v2-text-primary"
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
  const { freeShippingThreshold } = useShippingConfig();
  const totalPrice = hydrated ? getSubtotal() : 0;
  const displayItems = hydrated ? items : [];

  const isFreeShipping = totalPrice >= freeShippingThreshold;
  const hasItems = displayItems.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0" hideClose>
        <SheetHeader className="p-4 border-b border-v2-border-subtle">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 font-serif font-light text-xl text-v2-text-primary">
              <ShoppingBag className="h-5 w-5" />
              Sepetim
              {hasItems && (
                <span className="text-xs font-normal text-v2-text-muted font-inter">
                  ({displayItems.length} ürün)
                </span>
              )}
            </SheetTitle>
            <div className="flex items-center gap-3">
              {hasItems && (
                <button
                  onClick={clearCart}
                  className="font-inter text-xs text-v2-text-muted hover:text-v2-text-primary link-underline-v2"
                >
                  Temizle
                </button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeCart}
                aria-label="Sepeti kapat"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
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
            <div className="mt-auto p-4 border-t border-v2-border-subtle flex flex-col gap-4">
              {/* Subtotal */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-v2-text-muted">Ara Toplam</span>
                  <span className="font-semibold text-v2-text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-v2-text-muted">Kargo</span>
                  <span className="text-v2-text-muted">
                    {isFreeShipping ? (
                      <span className="text-v2-accent">Ücretsiz</span>
                    ) : (
                      "Ödeme adımında"
                    )}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-v2-text-primary">
                  Toplam
                </span>
                <span className="text-lg font-semibold text-v2-text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* Actions */}
              <Button
                asChild
                className="w-full bg-v2-text-primary text-white hover:opacity-90 rounded-none py-4 font-inter text-sm"
                size="lg"
              >
                <Link href="/odeme" onClick={closeCart}>
                  Ödemeye Geç
                </Link>
              </Button>
            </div>
          </>
        ) : (
          /* Empty Cart State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-v2-bg-primary flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-v2-text-muted" />
            </div>
            <h3 className="font-serif font-light text-lg text-v2-text-primary mb-2">
              Sepetiniz Boş
            </h3>
            <p className="text-sm text-v2-text-muted mb-6">
              Sepetinizde henüz ürün bulunmuyor.
            </p>
            <Button asChild className="bg-v2-text-primary text-white hover:opacity-90 rounded-none font-inter text-sm" size="lg">
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

"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, ChevronDown } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useShippingConfig } from "@/components/providers/ShippingConfigProvider";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function CheckoutSummary() {
  const { items, coupon, getSubtotal, getDiscount } = useCartStore();
  const { freeShippingThreshold, shippingCost } = useShippingConfig();
  const [isOpen, setIsOpen] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const afterDiscount = subtotal - discount;
  const shipping = items.length === 0 ? 0 : afterDiscount >= freeShippingThreshold ? 0 : shippingCost;
  const total = afterDiscount + shipping;

  const summaryContent = (
    <>
      {/* Items */}
      <div className="mb-6">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-4 py-4 border-b border-v2-border-subtle">
            <div className="relative w-[60px] h-[60px] overflow-hidden bg-v2-bg-primary flex-shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-v2-text-muted" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-v2-text-primary line-clamp-1">
                {item.name}
              </p>
              <p className="text-xs text-v2-text-muted mt-1">
                {item.size} / x{item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium text-v2-text-primary flex-shrink-0">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-v2-text-muted">Ara Toplam</span>
          <span className="font-medium text-v2-text-primary">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-v2-text-muted">Kargo</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-v2-accent">Ucretsiz</span>
            ) : (
              <span className="text-v2-text-primary">{formatPrice(shipping)}</span>
            )}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-v2-accent">
            <span>
              Indirim
              {coupon && (
                <span className="text-xs ml-1">({coupon.code})</span>
              )}
            </span>
            <span className="font-medium">
              -{formatPrice(discount)}
            </span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-v2-border-subtle mt-6 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-v2-text-primary">Toplam</span>
          <span className="font-serif text-xl text-v2-text-primary">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <div className="sticky lg:top-24">
      {/* Mobile: Accordion */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full py-4 border-b border-v2-border-subtle"
        >
          <span className="font-serif font-light text-lg text-v2-text-primary">
            Siparis Ozeti
          </span>
          <span className="flex items-center gap-2">
            <span className="font-medium text-v2-text-primary text-sm">
              {formatPrice(total)}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-v2-text-muted transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </span>
        </button>
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            isOpen ? "max-h-[2000px] opacity-100 pt-2" : "max-h-0 opacity-0"
          )}
        >
          {summaryContent}
        </div>
      </div>

      {/* Desktop: Always visible */}
      <div className="hidden lg:block">
        <h2 className="font-serif font-light text-2xl text-v2-text-primary mb-6">
          Siparis Ozeti
        </h2>
        <div className="border-b border-v2-border-subtle mb-2" />
        {summaryContent}
      </div>
    </div>
  );
}

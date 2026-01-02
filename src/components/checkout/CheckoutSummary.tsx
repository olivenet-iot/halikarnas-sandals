"use client";

import Image from "next/image";
import { ShoppingBag, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export function CheckoutSummary() {
  const { items, coupon, getSubtotal, getShippingCost, getDiscount, getTotal } =
    useCartStore();

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const discount = getDiscount();
  const total = getTotal();

  return (
    <div className="bg-white border border-stone-200 p-6 md:p-8 sticky top-24">
      <h2 className="font-serif text-xl text-stone-800 mb-6">
        Siparis Ozeti
      </h2>

      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-3">
            <div className="relative w-14 h-14 overflow-hidden bg-stone-100 flex-shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-stone-300" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-800 line-clamp-1">
                {item.name}
              </p>
              <p className="text-xs text-stone-500">
                {item.size} / x{item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium text-stone-800 flex-shrink-0">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="w-full h-px bg-stone-200 mb-6" />

      {/* Price breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-stone-500">Ara Toplam</span>
          <span className="font-medium text-stone-800">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-stone-500">Kargo</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">Ucretsiz</span>
            ) : (
              <span className="text-stone-800">{formatPrice(shipping)}</span>
            )}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
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

      <div className="w-full h-px bg-stone-200 my-6" />

      {/* Total */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-medium text-stone-800">Toplam</span>
        <span className="font-serif text-2xl text-stone-800">
          {formatPrice(total)}
        </span>
      </div>

      {/* Coupon Badge */}
      {coupon && (
        <div className="bg-green-50 border border-green-200 p-3 mb-6">
          <p className="text-sm text-green-700">
            <span className="font-semibold">{coupon.code}</span> kuponu
            uygulandi
          </p>
          <p className="text-xs text-green-600">
            {formatPrice(discount)} indirim
          </p>
        </div>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
        <ShieldCheck className="h-4 w-4 text-green-600" />
        <span>Guvenli Odeme</span>
      </div>
    </div>
  );
}

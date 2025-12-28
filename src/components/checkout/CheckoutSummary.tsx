"use client";

import Image from "next/image";
import { ShoppingBag, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
    <div className="bg-sand-50 rounded-xl p-6 sticky top-24">
      <h2 className="text-heading-5 font-accent text-leather-800 mb-4">
        Sipariş Özeti
      </h2>

      {/* Items */}
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-3">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white flex-shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-sand-300" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-medium text-leather-800 line-clamp-1">
                {item.name}
              </p>
              <p className="text-body-xs text-leather-500">
                {item.size} / x{item.quantity}
              </p>
            </div>
            <p className="text-body-sm font-medium text-leather-800 flex-shrink-0">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <Separator className="mb-4" />

      {/* Price breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-body-sm">
          <span className="text-leather-600">Ara Toplam</span>
          <span className="font-medium text-leather-800">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-body-sm">
          <span className="text-leather-600">Kargo</span>
          <span className="font-medium text-leather-800">
            {shipping === 0 ? (
              <span className="text-green-600">Ücretsiz</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-body-sm">
            <span className="text-green-600">
              İndirim
              {coupon && (
                <span className="text-body-xs ml-1">({coupon.code})</span>
              )}
            </span>
            <span className="font-medium text-green-600">
              -{formatPrice(discount)}
            </span>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Total */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-body-lg font-semibold text-leather-800">
          Toplam
        </span>
        <span className="text-heading-5 font-bold text-leather-900">
          {formatPrice(total)}
        </span>
      </div>

      {/* Coupon Badge */}
      {coupon && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-body-sm text-green-700">
            <span className="font-semibold">{coupon.code}</span> kuponu
            uygulandı
          </p>
          <p className="text-body-xs text-green-600">
            {formatPrice(discount)} indirim
          </p>
        </div>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-body-xs text-leather-500">
        <ShieldCheck className="h-4 w-4 text-green-600" />
        <span>Güvenli Ödeme</span>
      </div>
    </div>
  );
}

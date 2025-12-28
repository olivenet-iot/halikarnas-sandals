"use client";

import Link from "next/link";
import { ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CouponInput } from "./CouponInput";
import {
  useCartStore,
  FREE_SHIPPING_THRESHOLD,
} from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  showCouponInput?: boolean;
}

export function CartSummary({
  showCheckoutButton = true,
  showCouponInput = true,
}: CartSummaryProps) {
  const { items, coupon, getSubtotal, getShippingCost, getDiscount, getTotal } =
    useCartStore();

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const discount = getDiscount();
  const total = getTotal();
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal
  );

  const hasItems = items.length > 0;

  return (
    <div className="bg-sand-50 rounded-xl p-6 sticky top-24">
      <h2 className="text-heading-5 font-accent text-leather-800 mb-4">
        Sipariş Özeti
      </h2>

      {/* Item count */}
      <p className="text-body-sm text-leather-500 mb-4">
        {items.length} ürün, {items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
        adet
      </p>

      <Separator className="mb-4" />

      {/* Price breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-body-md">
          <span className="text-leather-600">Ara Toplam</span>
          <span className="font-medium text-leather-800">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-body-md">
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
          <div className="flex items-center justify-between text-body-md">
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
      <div className="flex items-center justify-between mb-6">
        <span className="text-body-lg font-semibold text-leather-800">
          Toplam
        </span>
        <span className="text-heading-5 font-bold text-leather-900">
          {formatPrice(total)}
        </span>
      </div>

      {/* Coupon Input */}
      {showCouponInput && hasItems && (
        <div className="mb-6">
          <CouponInput />
        </div>
      )}

      {/* Free Shipping Progress */}
      {hasItems && remainingForFreeShipping > 0 && (
        <div className="bg-white rounded-lg p-3 mb-6">
          <div className="flex items-center gap-2 text-body-sm text-leather-600 mb-2">
            <Truck className="h-4 w-4" />
            <span>
              Ücretsiz kargoya{" "}
              <span className="font-semibold text-aegean-600">
                {formatPrice(remainingForFreeShipping)}
              </span>{" "}
              kaldı!
            </span>
          </div>
          <div className="h-2 bg-sand-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-aegean-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {hasItems && remainingForFreeShipping <= 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-center gap-2 text-body-sm text-green-700">
          <Truck className="h-4 w-4 text-green-600" />
          Ücretsiz kargo hakkı kazandınız!
        </div>
      )}

      {/* Checkout Button */}
      {showCheckoutButton && (
        <>
          <Button
            asChild
            className="w-full btn-primary"
            size="lg"
            disabled={!hasItems}
          >
            <Link href="/odeme">Ödemeye Geç</Link>
          </Button>

          {/* Security Badge */}
          <div className="mt-4 flex items-center justify-center gap-2 text-body-xs text-leather-500">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <span>256-bit SSL ile güvenli ödeme</span>
          </div>
        </>
      )}
    </div>
  );
}

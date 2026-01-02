"use client";

import { ShieldCheck, Truck, ArrowRight, RotateCcw } from "lucide-react";
import { MagneticButton } from "@/components/ui/luxury/MagneticButton";
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
    <div className="bg-white border border-stone-200 p-6 md:p-8 sticky top-24">
      <h2 className="font-serif text-xl text-stone-800 mb-6">
        Siparis Ozeti
      </h2>

      {/* Price breakdown */}
      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-stone-500">Ara Toplam</span>
          <span className="font-medium text-stone-800">{formatPrice(subtotal)}</span>
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
            <span className="font-medium">-{formatPrice(discount)}</span>
          </div>
        )}
      </div>

      <div className="w-full h-px bg-stone-200 my-6" />

      {/* Total */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-medium text-stone-800">Toplam</span>
        <span className="font-serif text-2xl text-stone-800">{formatPrice(total)}</span>
      </div>

      {/* Coupon Input */}
      {showCouponInput && hasItems && (
        <div className="mb-6">
          <CouponInput />
        </div>
      )}

      {/* Free Shipping Progress */}
      {hasItems && remainingForFreeShipping > 0 && (
        <div className="bg-stone-50 p-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-stone-600 mb-2">
            <Truck className="h-4 w-4" />
            <span>
              Ucretsiz kargoya{" "}
              <span className="font-semibold text-[#B8860B]">
                {formatPrice(remainingForFreeShipping)}
              </span>{" "}
              kaldi!
            </span>
          </div>
          <div className="h-1.5 bg-stone-200 overflow-hidden">
            <div
              className="h-full bg-[#B8860B] transition-all duration-500"
              style={{
                width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {hasItems && remainingForFreeShipping <= 0 && (
        <div className="bg-green-50 border border-green-200 p-3 mb-6 flex items-center gap-2 text-sm text-green-700">
          <Truck className="h-4 w-4 text-green-600" />
          Ucretsiz kargo hakki kazandiniz!
        </div>
      )}

      {/* Checkout Button */}
      {showCheckoutButton && (
        <>
          <MagneticButton
            href="/odeme"
            variant="primary"
            size="lg"
            className="w-full"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Odemeye Gec
          </MagneticButton>

          {/* Trust Badges */}
          <div className="mt-6 pt-6 border-t border-stone-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <span className="text-xs text-stone-500">Guvenli Odeme</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="h-5 w-5 text-[#B8860B]" />
                <span className="text-xs text-stone-500">Hizli Kargo</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="h-5 w-5 text-stone-500" />
                <span className="text-xs text-stone-500">14 Gun Iade</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { formatPrice } from "@/lib/utils";

interface MobileAddToCartBarV2Props {
  price: number;
  onAddToCart: () => void;
  disabled: boolean;
  disabledReason?: string;
}

export function MobileAddToCartBarV2({
  price,
  onAddToCart,
  disabled,
  disabledReason,
}: MobileAddToCartBarV2Props) {
  const buttonText = disabledReason || `SEPETE EKLE \u2014 ${formatPrice(price)}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-v2-bg-dark shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50">
      <button
        onClick={onAddToCart}
        disabled={disabled}
        className="w-full py-4 px-6 font-inter text-sm tracking-[0.05em] uppercase text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {buttonText}
      </button>
    </div>
  );
}

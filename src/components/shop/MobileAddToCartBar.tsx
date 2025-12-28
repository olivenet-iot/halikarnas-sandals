"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface MobileAddToCartBarProps {
  price: number;
  onAddToCart: () => void;
  disabled: boolean;
  disabledReason?: string; // "Beden seciniz" or "Stokta yok"
}

export function MobileAddToCartBar({
  price,
  onAddToCart,
  disabled,
  disabledReason,
}: MobileAddToCartBarProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-sand-200 shadow-lg z-50">
      <Button
        onClick={onAddToCart}
        disabled={disabled}
        className="w-full h-12 text-base font-medium"
        size="lg"
      >
        <ShoppingBag className="h-5 w-5 mr-2" />
        Sepete Ekle - {formatPrice(price)}
      </Button>

      {disabled && disabledReason && (
        <p className="text-xs text-amber-600 mt-2 text-center">
          {disabledReason}
        </p>
      )}
    </div>
  );
}

export default MobileAddToCartBar;

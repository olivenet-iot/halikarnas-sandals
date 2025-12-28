"use client";

import { useState } from "react";
import { Tag, X, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore, AppliedCoupon } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function CouponInput() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { coupon, applyCoupon, removeCoupon, getSubtotal, getDiscount } =
    useCartStore();
  const { toast } = useToast();

  const handleApplyCoupon = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const subtotal = getSubtotal();
      const response = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), subtotal }),
      });

      const data = await response.json();

      if (data.valid) {
        const appliedCoupon: AppliedCoupon = {
          code: data.code,
          discountType: data.discountType,
          discountValue: data.discountValue,
          maxDiscount: data.maxDiscount,
        };
        applyCoupon(appliedCoupon);
        setCode("");
        toast({
          title: "Kupon Uygulandı",
          description: `${data.code} kuponu başarıyla uygulandı. ${formatPrice(data.discount)} indirim kazandınız!`,
        });
      } else {
        toast({
          title: "Kupon Geçersiz",
          description: data.error || "Bu kupon kodu geçerli değil.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Hata",
        description: "Kupon doğrulanırken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (coupon) {
    const discount = getDiscount();
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-body-sm font-medium text-green-800">
              {coupon.code}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-green-600 hover:text-red-500 hover:bg-transparent"
            onClick={removeCoupon}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-body-xs text-green-700 mt-1">
          {coupon.discountType === "percentage"
            ? `%${coupon.discountValue} indirim`
            : `${formatPrice(coupon.discountValue)} indirim`}
          {" - "}
          <span className="font-semibold">{formatPrice(discount)} tasarruf</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-body-sm font-medium text-leather-700 flex items-center gap-2">
        <Tag className="h-4 w-4" />
        Kupon Kodu
      </label>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Kupon kodunuzu girin"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          onClick={handleApplyCoupon}
          disabled={!code.trim() || isLoading}
          variant="outline"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Uygula"
          )}
        </Button>
      </div>
    </div>
  );
}

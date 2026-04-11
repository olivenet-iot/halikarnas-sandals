"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore, CheckoutStep } from "@/stores/checkout-store";
import { useShippingConfig } from "@/components/providers/ShippingConfigProvider";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface OrderReviewProps {
  onBack: () => void;
  setStep: (step: CheckoutStep) => void;
}

export function OrderReview({ onBack, setStep }: OrderReviewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    items,
    coupon,
    getSubtotal,
    getDiscount,
    clearCart,
  } = useCartStore();

  const { freeShippingThreshold, shippingCost: shippingRate } = useShippingConfig();

  const {
    shippingInfo,
    paymentMethod,
    acceptedTerms,
    acceptedKvkk,
    setAcceptedTerms,
    setAcceptedKvkk,
    setOrderCompleted,
    reset: resetCheckout,
  } = useCheckoutStore();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const afterDiscount = subtotal - discount;
  const shipping = items.length === 0 ? 0 : afterDiscount >= freeShippingThreshold ? 0 : shippingRate;
  const total = afterDiscount + shipping;

  const canPlaceOrder = acceptedTerms && acceptedKvkk;

  const handlePlaceOrder = async () => {
    if (!shippingInfo) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          shippingInfo,
          paymentMethod,
          couponCode: coupon?.code,
          subtotal,
          shippingCost: shipping,
          discount,
          total,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderCompleted(true);
        clearCart();
        resetCheckout();
        router.push(`/siparis-tamamlandi/${data.trackingToken}`);
      } else {
        toast({
          title: "Hata",
          description: data.error || "Siparis olusturulurken bir hata olustu.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Hata",
        description: "Siparis olusturulurken bir hata olustu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Section Heading */}
      <h2 className="font-serif font-light text-2xl md:text-3xl text-v2-text-primary">
        Siparis Onayi
      </h2>
      <div className="border-b border-v2-border-subtle mt-4 mb-8" />

      {/* Shipping Address */}
      <div className="border-b border-v2-border-subtle py-8">
        <div className="flex items-center justify-between mb-4">
          <span className="font-inter text-xs uppercase tracking-[0.15em] text-v2-text-muted">
            Teslimat Adresi
          </span>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-v2-text-muted hover:text-v2-text-primary underline underline-offset-4 text-xs transition-colors"
          >
            Duzenle
          </button>
        </div>
        {shippingInfo && (
          <div className="text-sm text-v2-text-muted space-y-1">
            <p className="font-medium text-v2-text-primary">
              {shippingInfo.firstName} {shippingInfo.lastName}
            </p>
            <p>
              {shippingInfo.neighborhood && `${shippingInfo.neighborhood}, `}
              {shippingInfo.address}
            </p>
            <p>
              {shippingInfo.districtName}/{shippingInfo.cityName}
              {shippingInfo.postalCode && ` - ${shippingInfo.postalCode}`}
            </p>
            <p>{shippingInfo.phone}</p>
            <p>{shippingInfo.email}</p>
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="border-b border-v2-border-subtle py-8">
        <div className="flex items-center justify-between mb-4">
          <span className="font-inter text-xs uppercase tracking-[0.15em] text-v2-text-muted">
            Odeme Yontemi
          </span>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="text-v2-text-muted hover:text-v2-text-primary underline underline-offset-4 text-xs transition-colors"
          >
            Duzenle
          </button>
        </div>
        <p className="text-sm text-v2-text-muted">
          {paymentMethod === "cash_on_delivery"
            ? "Kapida Odeme (Nakit veya Kredi Karti)"
            : "Kredi/Banka Karti"}
        </p>
      </div>

      {/* Order Items */}
      <div className="border-b border-v2-border-subtle py-8">
        <span className="font-inter text-xs uppercase tracking-[0.15em] text-v2-text-muted block mb-4">
          Siparis Urunleri
        </span>
        <div>
          {items.map((item, index) => (
            <div
              key={item.variantId}
              className={`flex gap-4 py-4 ${index < items.length - 1 ? "border-b border-v2-border-subtle" : ""}`}
            >
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
                  {item.colorName} / {item.size} / x{item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium text-v2-text-primary flex-shrink-0">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="space-y-4 py-8">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 accent-[#1C1917]"
          />
          <label htmlFor="terms" className="text-sm text-v2-text-muted cursor-pointer">
            <Link
              href="/mesafeli-satis-sozlesmesi"
              className="text-v2-text-primary underline underline-offset-2"
              target="_blank"
            >
              Mesafeli Satis Sozlesmesi
            </Link>
            &apos;ni okudum ve onayliyorum. *
          </label>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="kvkk"
            checked={acceptedKvkk}
            onChange={(e) => setAcceptedKvkk(e.target.checked)}
            className="w-4 h-4 mt-0.5 accent-[#1C1917]"
          />
          <label htmlFor="kvkk" className="text-sm text-v2-text-muted cursor-pointer">
            <Link
              href="/kvkk"
              className="text-v2-text-primary underline underline-offset-2"
              target="_blank"
            >
              KVKK Aydinlatma Metni
            </Link>
            &apos;ni okudum ve anladim. *
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="text-v2-text-muted hover:text-v2-text-primary underline underline-offset-4 text-sm transition-colors disabled:opacity-50"
        >
          ← Geri
        </button>
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={!canPlaceOrder || isSubmitting}
          className="bg-v2-text-primary text-white hover:opacity-90 px-8 py-3 text-sm tracking-wide uppercase transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Isleniyor...
            </span>
          ) : (
            "Siparisi Tamamla →"
          )}
        </button>
      </div>
    </div>
  );
}

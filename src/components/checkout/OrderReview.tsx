"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  CreditCard,
  ShoppingBag,
  Shield,
} from "lucide-react";
import { MagneticButton } from "@/components/ui/luxury/MagneticButton";
import { Checkbox } from "@/components/ui/checkbox";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface OrderReviewProps {
  onBack: () => void;
}

export function OrderReview({ onBack }: OrderReviewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    items,
    coupon,
    getSubtotal,
    getShippingCost,
    getDiscount,
    getTotal,
    clearCart,
  } = useCartStore();

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
  const shipping = getShippingCost();
  const discount = getDiscount();
  const total = getTotal();

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
        // Set order completed flag BEFORE clearing cart to prevent redirect race condition
        setOrderCompleted(true);

        // Clear cart and checkout state
        clearCart();
        resetCheckout();

        // Redirect to success page using trackingToken for security
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
    <div className="space-y-6">
      {/* Shipping Address Summary */}
      <div className="bg-stone-50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-[#B8860B]" />
          <h3 className="font-medium text-stone-800">Teslimat Adresi</h3>
        </div>
        {shippingInfo && (
          <div className="text-sm text-stone-600 space-y-1">
            <p className="font-medium text-stone-800">
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

      {/* Payment Method Summary */}
      <div className="bg-stone-50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-[#B8860B]" />
          <h3 className="font-medium text-stone-800">Odeme Yontemi</h3>
        </div>
        <p className="text-sm text-stone-600">
          {paymentMethod === "cash_on_delivery"
            ? "Kapida Odeme (Nakit veya Kredi Karti)"
            : "Kredi/Banka Karti"}
        </p>
      </div>

      {/* Order Items Summary */}
      <div className="bg-stone-50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="h-5 w-5 text-[#B8860B]" />
          <h3 className="font-medium text-stone-800">Siparis Urunleri</h3>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-3">
              <div className="relative w-16 h-16 overflow-hidden bg-white flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-stone-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-800 line-clamp-1">
                  {item.name}
                </p>
                <p className="text-xs text-stone-500">
                  {item.colorName} / {item.size} / x{item.quantity}
                </p>
                <p className="text-sm font-medium text-stone-800 mt-1">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-stone-200" />

      {/* Terms & Conditions */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            className="mt-0.5 data-[state=checked]:bg-[#B8860B] data-[state=checked]:border-[#B8860B]"
          />
          <label htmlFor="terms" className="text-sm text-stone-600 cursor-pointer">
            <Link
              href="/mesafeli-satis-sozlesmesi"
              className="text-[#B8860B] hover:underline"
              target="_blank"
            >
              Mesafeli Satis Sozlesmesi
            </Link>
            &apos;ni okudum ve onayliyorum. *
          </label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="kvkk"
            checked={acceptedKvkk}
            onCheckedChange={(checked) => setAcceptedKvkk(checked as boolean)}
            className="mt-0.5 data-[state=checked]:bg-[#B8860B] data-[state=checked]:border-[#B8860B]"
          />
          <label htmlFor="kvkk" className="text-sm text-stone-600 cursor-pointer">
            <Link
              href="/kvkk"
              className="text-[#B8860B] hover:underline"
              target="_blank"
            >
              KVKK Aydinlatma Metni
            </Link>
            &apos;ni okudum ve anladim. *
          </label>
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-green-50 border border-green-200 p-4 flex items-center gap-3 text-sm text-green-700">
        <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
        <span>
          Siparisiniz SSL sifreleme ile guvence altindadir. Bilgileriniz
          korunmaktadir.
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm uppercase tracking-wide">Geri</span>
        </button>
        <MagneticButton
          onClick={handlePlaceOrder}
          variant="primary"
          size="lg"
          className={!canPlaceOrder || isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Isleniyor...
            </span>
          ) : (
            "Siparisi Tamamla"
          )}
        </MagneticButton>
      </div>
    </div>
  );
}

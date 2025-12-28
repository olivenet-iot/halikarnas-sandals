"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Loader2,
  MapPin,
  CreditCard,
  ShoppingBag,
  FileText,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
        // Clear cart and checkout state
        clearCart();
        resetCheckout();

        // Redirect to success page
        router.push(`/siparis-tamamlandi/${data.orderNumber}`);
      } else {
        toast({
          title: "Hata",
          description: data.error || "Sipariş oluşturulurken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Hata",
        description: "Sipariş oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Shipping Address Summary */}
      <div className="bg-sand-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-5 w-5 text-aegean-600" />
          <h3 className="font-semibold text-leather-800">Teslimat Adresi</h3>
        </div>
        {shippingInfo && (
          <div className="text-body-sm text-leather-600 space-y-1">
            <p className="font-medium">
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
      <div className="bg-sand-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="h-5 w-5 text-aegean-600" />
          <h3 className="font-semibold text-leather-800">Ödeme Yöntemi</h3>
        </div>
        <p className="text-body-sm text-leather-600">
          {paymentMethod === "cash_on_delivery"
            ? "Kapıda Ödeme (Nakit veya Kredi Kartı)"
            : "Kredi/Banka Kartı"}
        </p>
      </div>

      {/* Order Items Summary */}
      <div className="bg-sand-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="h-5 w-5 text-aegean-600" />
          <h3 className="font-semibold text-leather-800">Sipariş Ürünleri</h3>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-sand-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-medium text-leather-800 line-clamp-1">
                  {item.name}
                </p>
                <p className="text-body-xs text-leather-500">
                  {item.colorName} / {item.size} / x{item.quantity}
                </p>
                <p className="text-body-sm font-semibold text-leather-800 mt-1">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Terms & Conditions */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
          />
          <Label htmlFor="terms" className="text-body-sm text-leather-600">
            <Link
              href="/mesafeli-satis-sozlesmesi"
              className="text-aegean-600 hover:underline"
              target="_blank"
            >
              Mesafeli Satış Sözleşmesi
            </Link>
            &apos;ni okudum ve onaylıyorum. *
          </Label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="kvkk"
            checked={acceptedKvkk}
            onCheckedChange={(checked) => setAcceptedKvkk(checked as boolean)}
          />
          <Label htmlFor="kvkk" className="text-body-sm text-leather-600">
            <Link
              href="/kvkk"
              className="text-aegean-600 hover:underline"
              target="_blank"
            >
              KVKK Aydınlatma Metni
            </Link>
            &apos;ni okudum ve anladım. *
          </Label>
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-body-sm text-green-700">
        <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
        <span>
          Siparişiniz SSL şifreleme ile güvence altındadır. Bilgileriniz
          korunmaktadır.
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Geri
        </Button>
        <Button
          type="button"
          className="btn-primary"
          size="lg"
          onClick={handlePlaceOrder}
          disabled={!canPlaceOrder || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              İşleniyor...
            </>
          ) : (
            <>
              Siparişi Tamamla
              <FileText className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

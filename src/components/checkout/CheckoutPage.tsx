"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutSteps } from "./CheckoutSteps";
import { CheckoutSummary } from "./CheckoutSummary";
import { ShippingForm } from "./ShippingForm";
import { PaymentForm } from "./PaymentForm";
import { OrderReview } from "./OrderReview";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore } from "@/stores/checkout-store";

export function CheckoutPage() {
  const router = useRouter();
  const { items } = useCartStore();
  const { currentStep, nextStep, prevStep } = useCheckoutStore();

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/sepet");
    }
  }, [items, router]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" asChild>
            <Link href="/sepet" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Sepete Dön
            </Link>
          </Button>
          <Link href="/" className="text-heading-4 font-accent text-leather-800">
            HALIKARNAS
          </Link>
        </div>

        {/* Steps */}
        <CheckoutSteps currentStep={currentStep} />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-sand-200 p-6">
              {/* Step Title */}
              <h2 className="text-heading-5 font-accent text-leather-800 mb-6">
                {currentStep === 1 && "Teslimat Bilgileri"}
                {currentStep === 2 && "Ödeme Yöntemi"}
                {currentStep === 3 && "Sipariş Onayı"}
              </h2>

              {/* Step Content */}
              {currentStep === 1 && <ShippingForm onNext={nextStep} />}
              {currentStep === 2 && (
                <PaymentForm onNext={nextStep} onBack={prevStep} />
              )}
              {currentStep === 3 && <OrderReview onBack={prevStep} />}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

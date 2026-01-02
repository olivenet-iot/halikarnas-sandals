"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShieldCheck, Truck, Lock } from "lucide-react";
import { CheckoutSteps } from "./CheckoutSteps";
import { CheckoutSummary } from "./CheckoutSummary";
import { ShippingForm } from "./ShippingForm";
import { PaymentForm } from "./PaymentForm";
import { OrderReview } from "./OrderReview";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import { EASE } from "@/lib/animations";

export function CheckoutPage() {
  const router = useRouter();
  const { items } = useCartStore();
  const { currentStep, nextStep, prevStep, isOrderCompleted } = useCheckoutStore();

  // Redirect to cart if empty (but not after order completion)
  useEffect(() => {
    if (isOrderCompleted) return;

    if (items.length === 0) {
      router.push("/sepet");
    }
  }, [items, router, isOrderCompleted]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/sepet"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm uppercase tracking-wide">Sepete Don</span>
          </Link>
          <Link href="/" className="font-serif text-xl tracking-wide text-stone-800">
            HALIKARNAS
          </Link>
        </div>

        {/* Steps */}
        <CheckoutSteps currentStep={currentStep} />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: EASE.luxury }}
                className="bg-white border border-stone-200 p-6 md:p-10"
              >
                {/* Step Title with gold underline */}
                <div className="mb-8">
                  <h2 className="font-serif text-2xl text-stone-800">
                    {currentStep === 1 && "Teslimat Bilgileri"}
                    {currentStep === 2 && "Odeme Yontemi"}
                    {currentStep === 3 && "Siparis Onayi"}
                  </h2>
                  <div className="w-12 h-0.5 bg-[#B8860B] mt-4" />
                </div>

                {/* Step Content */}
                {currentStep === 1 && <ShippingForm onNext={nextStep} />}
                {currentStep === 2 && (
                  <PaymentForm onNext={nextStep} onBack={prevStep} />
                )}
                {currentStep === 3 && <OrderReview onBack={prevStep} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CheckoutSummary />
          </div>
        </div>

        {/* Trust Footer */}
        <div className="border-t border-stone-200 mt-12 py-8">
          <div className="flex flex-wrap justify-center gap-8 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>256-bit SSL Sifreleme</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#B8860B]" />
              <span>Guvenli Odeme</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-stone-500" />
              <span>Hizli Teslimat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

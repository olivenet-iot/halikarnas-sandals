"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  const { currentStep, nextStep, prevStep, setStep, isOrderCompleted } =
    useCheckoutStore();

  // Redirect to cart if empty (but not after order completion)
  useEffect(() => {
    if (isOrderCompleted) return;

    if (items.length === 0) {
      router.push("/");
    }
  }, [items, router, isOrderCompleted]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-v2-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Steps */}
        <CheckoutSteps currentStep={currentStep} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Form Area */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: EASE.luxury }}
              >
                {currentStep === 1 && <ShippingForm onNext={nextStep} />}
                {currentStep === 2 && (
                  <PaymentForm onNext={nextStep} onBack={prevStep} />
                )}
                {currentStep === 3 && (
                  <OrderReview onBack={prevStep} setStep={setStep} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

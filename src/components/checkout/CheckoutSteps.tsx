"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CheckoutStep } from "@/stores/checkout-store";
import { EASE } from "@/lib/animations";

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
}

const steps = [
  { number: 1, label: "Teslimat" },
  { number: 2, label: "Odeme" },
  { number: 3, label: "Onay" },
];

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="py-8 mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: EASE.luxury }}
              className="flex flex-col items-center"
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center font-serif text-lg transition-all duration-500",
                  currentStep > step.number
                    ? "bg-[#B8860B] text-white"
                    : currentStep === step.number
                      ? "bg-stone-900 text-white ring-4 ring-[#B8860B]/30"
                      : "bg-stone-100 text-stone-400"
                )}
              >
                {currentStep > step.number ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "mt-3 text-xs uppercase tracking-[0.15em] transition-colors duration-300",
                  currentStep >= step.number ? "text-stone-800" : "text-stone-400"
                )}
              >
                {step.label}
              </span>
            </motion.div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="relative w-16 sm:w-24 md:w-32 h-0.5 mx-4 mt-[-20px]">
                <div className="absolute inset-0 bg-stone-200" />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: currentStep > step.number ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: EASE.luxury }}
                  className="absolute inset-0 bg-[#B8860B]"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

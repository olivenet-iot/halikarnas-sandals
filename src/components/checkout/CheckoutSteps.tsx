"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CheckoutStep } from "@/stores/checkout-store";

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
}

const steps = [
  { number: 1, label: "Teslimat" },
  { number: 2, label: "Ödeme" },
  { number: 3, label: "Onay" },
];

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                currentStep > step.number
                  ? "bg-green-500 text-white"
                  : currentStep === step.number
                    ? "bg-aegean-600 text-white"
                    : "bg-sand-200 text-leather-500"
              )}
            >
              {currentStep > step.number ? (
                <Check className="h-5 w-5" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={cn(
                "mt-2 text-body-sm font-medium",
                currentStep >= step.number
                  ? "text-leather-800"
                  : "text-leather-400"
              )}
            >
              {step.label}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-16 sm:w-24 h-1 mx-2 mt-[-20px]",
                currentStep > step.number ? "bg-green-500" : "bg-sand-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

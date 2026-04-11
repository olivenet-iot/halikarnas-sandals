"use client";

import { Check } from "lucide-react";
import { CheckoutStep } from "@/stores/checkout-store";

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
      <div className="flex items-center justify-center gap-3">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center gap-3">
            <span className="flex flex-col items-center">
              <span
                className={`font-inter font-medium text-xs tracking-[0.15em] uppercase ${
                  currentStep > step.number
                    ? "text-v2-text-muted"
                    : currentStep === step.number
                      ? "text-v2-text-primary"
                      : "text-v2-text-muted opacity-50"
                }`}
              >
                {currentStep > step.number && (
                  <Check className="w-3 h-3 inline mr-1" strokeWidth={1.5} />
                )}
                {step.label}
              </span>
              {currentStep === step.number && (
                <span className="block w-6 h-px bg-v2-accent mt-1" />
              )}
            </span>

            {index < steps.length - 1 && (
              <span className="text-v2-text-muted/30 text-xs">·</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

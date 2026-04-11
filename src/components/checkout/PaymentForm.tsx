"use client";

import { useCheckoutStore } from "@/stores/checkout-store";
import { cn } from "@/lib/utils";

interface PaymentFormProps {
  onNext: () => void;
  onBack: () => void;
}

const paymentOptions = [
  {
    id: "cash_on_delivery" as const,
    label: "Kapida Odeme",
    description: "Teslimat sirasinda nakit veya kredi karti ile odeme",
    disabled: false,
  },
  {
    id: "card" as const,
    label: "Kredi / Banka Karti",
    description: "Visa, Mastercard, Troy ile guvenli odeme",
    disabled: true,
  },
];

export function PaymentForm({ onNext, onBack }: PaymentFormProps) {
  const { paymentMethod, setPaymentMethod } = useCheckoutStore();

  return (
    <div>
      {/* Section Heading */}
      <h2 className="font-serif font-light text-2xl md:text-3xl text-v2-text-primary">
        Odeme Yontemi
      </h2>
      <div className="border-b border-v2-border-subtle mt-4 mb-8" />

      {/* Payment Options */}
      <div>
        {paymentOptions.map((option) => {
          const isSelected = paymentMethod === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                if (!option.disabled) setPaymentMethod(option.id);
              }}
              className={cn(
                "flex items-center gap-4 w-full text-left border-b border-v2-border-subtle py-5 transition-colors",
                option.disabled && "opacity-40 cursor-not-allowed pointer-events-none"
              )}
            >
              {/* Radio */}
              <span
                className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0",
                  isSelected ? "border-v2-text-primary" : "border-v2-text-muted"
                )}
              >
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-v2-text-primary" />
                )}
              </span>

              {/* Label + Description */}
              <div className="flex-1 min-w-0">
                <span
                  className={cn(
                    "block text-sm font-medium",
                    isSelected ? "text-v2-text-primary" : "text-v2-text-muted"
                  )}
                >
                  {option.label}
                </span>
                <span className="block text-xs text-v2-text-muted mt-0.5">
                  {option.description}
                </span>
              </div>

              {/* Disabled badge */}
              {option.disabled && (
                <span className="text-xs italic text-v2-text-muted ml-auto">
                  Yakinda
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-8">
        <button
          type="button"
          onClick={onBack}
          className="text-v2-text-muted hover:text-v2-text-primary underline underline-offset-4 text-sm transition-colors"
        >
          ← Geri
        </button>
        <button
          type="button"
          onClick={onNext}
          className="border border-v2-text-primary text-v2-text-primary bg-transparent hover:bg-v2-text-primary hover:text-white px-8 py-3 text-sm tracking-wide uppercase transition-colors"
        >
          Devam Et →
        </button>
      </div>
    </div>
  );
}

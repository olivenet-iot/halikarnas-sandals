"use client";

import { ArrowLeft, ArrowRight, CreditCard, Banknote } from "lucide-react";
import { MagneticButton } from "@/components/ui/luxury/MagneticButton";
import { useCheckoutStore } from "@/stores/checkout-store";
import { cn } from "@/lib/utils";

interface PaymentFormProps {
  onNext: () => void;
  onBack: () => void;
}

export function PaymentForm({ onNext, onBack }: PaymentFormProps) {
  const { paymentMethod, setPaymentMethod } = useCheckoutStore();

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm uppercase tracking-[0.15em] text-stone-500 font-medium mb-6">
          Odeme Yontemi Secin
        </h3>

        <div className="space-y-4">
          {/* Credit Card - Placeholder */}
          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={cn(
              "w-full text-left p-5 border-2 transition-all duration-300",
              paymentMethod === "card"
                ? "border-[#B8860B] bg-[#B8860B]/5"
                : "border-stone-200 hover:border-stone-300"
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                  paymentMethod === "card"
                    ? "border-[#B8860B]"
                    : "border-stone-300"
                )}
              >
                {paymentMethod === "card" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#B8860B]" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="h-5 w-5 text-stone-600" />
                  <span className="font-medium text-stone-800">
                    Kredi / Banka Karti
                  </span>
                </div>
                <p className="text-sm text-stone-500">
                  Visa, Mastercard, Troy ile guvenli odeme
                </p>

                {paymentMethod === "card" && (
                  <div className="mt-4 p-6 bg-white border border-stone-200">
                    <div className="flex items-center justify-center py-6 text-center">
                      <div>
                        <CreditCard className="h-10 w-10 text-stone-300 mx-auto mb-3" />
                        <p className="text-sm text-stone-500">
                          Kredi karti odeme entegrasyonu yakinda eklenecek
                        </p>
                        <p className="text-xs text-stone-400 mt-1">
                          Simdilik kapida odeme secenegini kullanabilirsiniz
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </button>

          {/* Cash on Delivery */}
          <button
            type="button"
            onClick={() => setPaymentMethod("cash_on_delivery")}
            className={cn(
              "w-full text-left p-5 border-2 transition-all duration-300",
              paymentMethod === "cash_on_delivery"
                ? "border-[#B8860B] bg-[#B8860B]/5"
                : "border-stone-200 hover:border-stone-300"
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                  paymentMethod === "cash_on_delivery"
                    ? "border-[#B8860B]"
                    : "border-stone-300"
                )}
              >
                {paymentMethod === "cash_on_delivery" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#B8860B]" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Banknote className="h-5 w-5 text-stone-600" />
                  <span className="font-medium text-stone-800">
                    Kapida Odeme
                  </span>
                </div>
                <p className="text-sm text-stone-500">
                  Teslimat sirasinda nakit veya kredi karti ile odeme yapin
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm uppercase tracking-wide">Geri</span>
        </button>
        <MagneticButton
          onClick={handleContinue}
          variant="primary"
          size="lg"
          icon={<ArrowRight className="w-4 h-4" />}
          className={paymentMethod === "card" ? "opacity-50 cursor-not-allowed" : ""}
        >
          Devam Et
        </MagneticButton>
      </div>
    </div>
  );
}

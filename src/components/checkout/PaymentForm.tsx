"use client";

import { ChevronLeft, ChevronRight, CreditCard, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCheckoutStore, PaymentMethod } from "@/stores/checkout-store";
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
        <h3 className="text-body-lg font-semibold text-leather-800 mb-4">
          Ödeme Yöntemi Seçin
        </h3>

        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
          className="space-y-4"
        >
          {/* Credit Card - Placeholder */}
          <div
            className={cn(
              "relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors",
              paymentMethod === "card"
                ? "border-aegean-500 bg-aegean-50"
                : "border-sand-200 hover:border-sand-300"
            )}
          >
            <RadioGroupItem value="card" id="card" className="mt-1" />
            <Label
              htmlFor="card"
              className="flex-1 ml-3 cursor-pointer space-y-2"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-leather-600" />
                <span className="font-medium text-leather-800">
                  Kredi / Banka Kartı
                </span>
              </div>
              <p className="text-body-sm text-leather-500">
                Visa, Mastercard, Troy ile güvenli ödeme
              </p>

              {paymentMethod === "card" && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-sand-200">
                  <div className="flex items-center justify-center py-8 text-center">
                    <div>
                      <CreditCard className="h-12 w-12 text-sand-300 mx-auto mb-3" />
                      <p className="text-body-sm text-leather-500">
                        Kredi kartı ödeme entegrasyonu yakında eklenecek
                      </p>
                      <p className="text-body-xs text-leather-400 mt-1">
                        Şimdilik kapıda ödeme seçeneğini kullanabilirsiniz
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Label>
          </div>

          {/* Cash on Delivery */}
          <div
            className={cn(
              "relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors",
              paymentMethod === "cash_on_delivery"
                ? "border-aegean-500 bg-aegean-50"
                : "border-sand-200 hover:border-sand-300"
            )}
          >
            <RadioGroupItem
              value="cash_on_delivery"
              id="cash_on_delivery"
              className="mt-1"
            />
            <Label
              htmlFor="cash_on_delivery"
              className="flex-1 ml-3 cursor-pointer space-y-2"
            >
              <div className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-leather-600" />
                <span className="font-medium text-leather-800">
                  Kapıda Ödeme
                </span>
              </div>
              <p className="text-body-sm text-leather-500">
                Teslimat sırasında nakit veya kredi kartı ile ödeme yapın
              </p>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Geri
        </Button>
        <Button
          type="button"
          className="btn-primary"
          size="lg"
          onClick={handleContinue}
          disabled={paymentMethod === "card"} // Disabled until card payment is implemented
        >
          Devam Et
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

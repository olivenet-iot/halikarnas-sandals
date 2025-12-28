import { Metadata } from "next";
import { CheckoutPage } from "@/components/checkout";

export const metadata: Metadata = {
  title: "Ödeme | Halikarnas Sandals",
  description: "Siparişinizi tamamlayın ve güvenli ödeme yapın.",
};

export default function OdemePage() {
  return <CheckoutPage />;
}

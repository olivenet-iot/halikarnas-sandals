import { Metadata } from "next";
import { CartPage } from "@/components/cart";

export const metadata: Metadata = {
  title: "Sepetim | Halikarnas Sandals",
  description: "Sepetinizdeki ürünleri görüntüleyin ve siparişinizi tamamlayın.",
};

export default function SepetPage() {
  return <CartPage />;
}

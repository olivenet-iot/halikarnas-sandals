import { Metadata } from "next";
import { RegisterForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Kayıt Ol | Halikarnas Sandals",
  description: "Halikarnas Sandals'a üye olun ve ayrıcalıklardan yararlanın.",
};

export default function KayitPage() {
  return <RegisterForm />;
}

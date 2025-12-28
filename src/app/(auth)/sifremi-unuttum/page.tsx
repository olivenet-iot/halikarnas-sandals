import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Şifremi Unuttum | Halikarnas Sandals",
  description: "Şifrenizi sıfırlamak için e-posta adresinizi girin.",
};

export default function SifremiUnuttumPage() {
  return <ForgotPasswordForm />;
}

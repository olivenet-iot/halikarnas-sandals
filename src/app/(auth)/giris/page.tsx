import { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Giriş Yap | Halikarnas Sandals",
  description: "Halikarnas Sandals hesabınıza giriş yapın.",
};

export default function GirisPage() {
  return (
    <Suspense fallback={<div className="animate-pulse bg-sand-100 rounded-xl h-96" />}>
      <LoginForm />
    </Suspense>
  );
}

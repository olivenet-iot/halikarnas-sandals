import { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Şifre Sıfırla | Halikarnas Sandals",
  description: "Yeni şifrenizi belirleyin.",
};

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function SifreSifirlaPage({ params }: PageProps) {
  const { token } = await params;

  // Verify token exists and hasn't expired
  const resetToken = await db.passwordResetToken.findUnique({
    where: { token },
  });

  const isValidToken = resetToken && resetToken.expires > new Date();

  return <ResetPasswordForm token={token} isValidToken={!!isValidToken} />;
}

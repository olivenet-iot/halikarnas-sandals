import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PasswordChangeForm } from "@/components/account/PasswordChangeForm";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata = {
  title: "Şifre Değiştir | Halikarnas Sandals",
  description: "Hesap şifrenizi değiştirin.",
};

export default async function SifreDegistirPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  // If user doesn't have a password (OAuth only), show message
  const hasPassword = !!user?.password;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-accent font-semibold text-leather-800">
          Şifre Değiştir
        </h1>
        <p className="text-leather-500 mt-1">
          Hesabınızın güvenliği için şifrenizi düzenli olarak değiştirin.
        </p>
      </div>

      {hasPassword ? (
        <div className="bg-white rounded-xl border border-sand-200 p-6 max-w-lg">
          <PasswordChangeForm />
        </div>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Şifre Değiştirme Kullanılamıyor</AlertTitle>
          <AlertDescription>
            Hesabınız Google ile oluşturulmuş. Şifre değiştirmek için lütfen
            Google hesabınızın güvenlik ayarlarını kullanın.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

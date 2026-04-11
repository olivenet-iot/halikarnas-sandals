import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PasswordChangeForm } from "@/components/account/PasswordChangeForm";

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

  const hasPassword = !!user?.password;

  return (
    <div>
      <div className="pb-8 border-b border-v2-border-subtle">
        <h1 className="font-serif font-light text-3xl md:text-4xl text-v2-text-primary">
          Şifre Değiştir
        </h1>
        <p className="text-v2-text-muted font-inter text-sm mt-2">
          Hesabınızın güvenliği için şifrenizi düzenli olarak değiştirin.
        </p>
      </div>

      {hasPassword ? (
        <div className="mt-8 max-w-md">
          <PasswordChangeForm />
        </div>
      ) : (
        <div className="py-12">
          <p className="font-inter text-sm text-v2-text-muted">
            Hesabınız Google ile oluşturulmuş. Şifre değiştirmek için Google
            hesabınızın güvenlik ayarlarını kullanın.
          </p>
        </div>
      )}
    </div>
  );
}

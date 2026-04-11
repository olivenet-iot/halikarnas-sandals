import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileForm } from "@/components/account/ProfileForm";
import { DeleteAccountDialog } from "@/components/account/DeleteAccountDialog";

export const metadata = {
  title: "Hesap Bilgilerim | Halikarnas Sandals",
  description: "Hesap bilgilerinizi görüntüleyin ve düzenleyin.",
};

export default async function BilgilerimPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      password: true,
    },
  });

  if (!user) {
    return null;
  }

  const hasPassword = !!user.password;

  return (
    <div>
      <div className="pb-8 border-b border-v2-border-subtle">
        <h1 className="font-serif font-light text-3xl md:text-4xl text-v2-text-primary">
          Hesap Bilgilerim
        </h1>
        <p className="text-v2-text-muted font-inter text-sm mt-2">
          Kişisel bilgilerinizi güncelleyin.
        </p>
      </div>

      <div className="mt-8">
        <ProfileForm
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
          }}
        />
      </div>

      {/* Account Delete */}
      <div className="mt-16 pt-8 border-t border-v2-border-subtle">
        <DeleteAccountDialog hasPassword={hasPassword} />
      </div>
    </div>
  );
}

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
      image: true,
      password: true,
    },
  });

  if (!user) {
    return null;
  }

  const hasPassword = !!user.password;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-accent font-semibold text-leather-800">
          Hesap Bilgilerim
        </h1>
        <p className="text-leather-500 mt-1">
          Kişisel bilgilerinizi güncelleyin.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-sand-200 p-6">
        <ProfileForm
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            image: user.image,
          }}
        />
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Tehlikeli Bölge</h2>
        <p className="text-sm text-leather-500 mb-4">
          Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak silinecektir.
          Bu işlem geri alınamaz.
        </p>
        <DeleteAccountDialog hasPassword={hasPassword} />
      </div>
    </div>
  );
}

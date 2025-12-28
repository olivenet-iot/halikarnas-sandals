import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrderCard } from "@/components/account";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export const metadata = {
  title: "Siparişlerim | Halikarnas Sandals",
  description: "Tüm siparişlerinizi görüntüleyin ve takip edin.",
};

export default async function SiparislerimPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const orders = await db.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            select: {
              images: {
                where: { isPrimary: true },
                take: 1,
                select: { url: true },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-accent font-semibold text-leather-800">
          Siparişlerim
        </h1>
        <p className="text-leather-500 mt-1">
          Toplam {orders.length} sipariş
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              id={order.id}
              orderNumber={order.orderNumber}
              createdAt={order.createdAt}
              status={order.status as "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"}
              items={order.items.map((item) => ({
                id: item.id,
                productName: item.productName,
                productImage: item.product.images[0]?.url || "",
                variant: `${item.variantColor || ""} ${item.variantSize}`.trim(),
                quantity: item.quantity,
                price: Number(item.unitPrice),
              }))}
              total={Number(order.total)}
              trackingNumber={order.trackingNumber || undefined}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-sand-200 p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-sand-100 flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-leather-400" />
          </div>
          <h2 className="text-lg font-semibold text-leather-800 mb-2">
            Henüz siparişiniz bulunmuyor
          </h2>
          <p className="text-leather-500 mb-6">
            Alışverişe başlayarak ilk siparişinizi oluşturun.
          </p>
          <Button asChild>
            <Link href="/kadin">Alışverişe Başla</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

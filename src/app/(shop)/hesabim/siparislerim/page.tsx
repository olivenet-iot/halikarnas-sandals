import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Onay Bekliyor",
  CONFIRMED: "Onaylandı",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
  REFUNDED: "İade Edildi",
};

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
        take: 2,
        select: { productName: true },
      },
    },
  });

  return (
    <div>
      <div className="pb-8 border-b border-v2-border-subtle">
        <h1 className="font-serif font-light text-3xl md:text-4xl text-v2-text-primary">
          Siparişlerim
        </h1>
        {orders.length > 0 && (
          <p className="text-v2-text-muted font-inter text-sm mt-2">
            Toplam {orders.length} sipariş
          </p>
        )}
      </div>

      {orders.length > 0 ? (
        <div className="mt-8">
          {orders.map((order) => {
            const itemSummary = order.items
              .map((i) => i.productName)
              .join(", ");
            const hasMore = order.items.length > 2;

            return (
              <Link
                key={order.id}
                href={`/hesabim/siparislerim/${order.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-v2-border-subtle hover:bg-v2-bg-primary/50 transition-colors -mx-2 px-2 gap-3"
              >
                <div>
                  <p className="font-inter text-sm text-v2-text-primary font-medium">
                    #{order.orderNumber}
                  </p>
                  <p className="font-inter text-xs text-v2-text-muted mt-1">
                    {formatDate(order.createdAt)}
                    {itemSummary && ` · ${itemSummary}`}
                    {hasMore && "..."}
                  </p>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="font-inter text-sm font-medium text-v2-text-primary">
                    {formatPrice(Number(order.total))}
                  </span>
                  <span className="font-inter text-xs text-v2-accent">
                    {ORDER_STATUS_LABELS[order.status] || order.status}
                  </span>
                  <span className="font-inter text-xs text-v2-text-muted">
                    Detay &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-12">
          <p className="font-inter text-sm text-v2-text-muted">
            Henüz siparişiniz bulunmuyor.
          </p>
          <Link
            href="/kadin"
            className="font-inter text-sm text-v2-text-primary underline underline-offset-4 hover:text-v2-text-muted transition-colors mt-3 inline-block"
          >
            Alışverişe başla &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}

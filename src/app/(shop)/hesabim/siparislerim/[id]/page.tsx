import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice, formatDate, getProductUrl } from "@/lib/utils";
import { formatPaymentMethod } from "@/lib/format-payment-method";

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Onay Bekliyor",
  CONFIRMED: "Onaylandı",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
  REFUNDED: "İade Edildi",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    select: { orderNumber: true },
  });

  return {
    title: order
      ? `Sipariş #${order.orderNumber} | Halikarnas Sandals`
      : "Sipariş Bulunamadı",
  };
}

export default async function SiparisDetayPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: {
              slug: true,
              gender: true,
              images: {
                where: { isPrimary: true },
                take: 1,
                select: { url: true },
              },
            },
          },
        },
      },
      statusHistory: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!order || order.userId !== userId) {
    notFound();
  }

  return (
    <div>
      {/* Header */}
      <div className="pb-8 border-b border-v2-border-subtle">
        <Link
          href="/hesabim/siparislerim"
          className="font-inter text-xs text-v2-text-muted hover:text-v2-text-primary underline underline-offset-4 transition-colors"
        >
          &larr; Siparişlerime dön
        </Link>
        <h1 className="font-serif font-light text-3xl md:text-4xl text-v2-text-primary mt-4">
          Sipariş #{order.orderNumber}
        </h1>
        <div className="flex items-center gap-4 mt-2">
          <span className="font-inter text-sm text-v2-text-muted">
            {formatDate(order.createdAt)}
          </span>
          <span className="font-inter text-xs text-v2-accent uppercase tracking-wide">
            {ORDER_STATUS_LABELS[order.status] || order.status}
          </span>
        </div>
      </div>

      {/* Products */}
      <section className="py-8 border-b border-v2-border-subtle">
        <span className="font-inter text-xs uppercase tracking-widest text-v2-text-muted block mb-6">
          ÜRÜNLER
        </span>
        <div className="space-y-4">
          {order.items.map((item) => {
            const productUrl = getProductUrl(item.product);
            return (
            <div key={item.id} className="flex gap-4">
              <Link
                href={productUrl}
                className="w-[60px] h-[60px] flex-shrink-0 overflow-hidden bg-v2-bg-primary"
              >
                <Image
                  src={item.product.images[0]?.url || "/images/placeholder.jpg"}
                  alt={item.productName}
                  width={60}
                  height={60}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={productUrl}
                  className="font-inter text-sm text-v2-text-primary hover:underline underline-offset-4"
                >
                  {item.productName}
                </Link>
                <p className="font-inter text-xs text-v2-text-muted mt-1">
                  {item.variantColor && `${item.variantColor}, `}
                  Beden: {item.variantSize} · Adet: {item.quantity}
                </p>
              </div>
              <span className="font-inter text-sm text-v2-text-primary font-medium">
                {formatPrice(Number(item.total))}
              </span>
            </div>
            );
          })}
        </div>

        {/* Subtotals */}
        <div className="mt-8 pt-4 border-t border-v2-border-subtle space-y-2">
          <div className="flex justify-between font-inter text-sm">
            <span className="text-v2-text-muted">Ara Toplam</span>
            <span className="text-v2-text-primary">{formatPrice(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between font-inter text-sm">
            <span className="text-v2-text-muted">Kargo</span>
            <span className="text-v2-text-primary">
              {Number(order.shippingCost) === 0 ? "Ücretsiz" : formatPrice(Number(order.shippingCost))}
            </span>
          </div>
          {Number(order.discount) > 0 && (
            <div className="flex justify-between font-inter text-sm">
              <span className="text-v2-text-muted">İndirim</span>
              <span className="text-v2-accent">-{formatPrice(Number(order.discount))}</span>
            </div>
          )}
          <div className="flex justify-between font-inter text-sm font-medium pt-2 border-t border-v2-border-subtle">
            <span className="text-v2-text-primary">Toplam</span>
            <span className="text-v2-text-primary">{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </section>

      {/* Shipping Address */}
      <section className="py-8 border-b border-v2-border-subtle">
        <span className="font-inter text-xs uppercase tracking-widest text-v2-text-muted block mb-4">
          TESLİMAT ADRESİ
        </span>
        <div className="font-inter text-sm text-v2-text-muted space-y-1">
          <p className="text-v2-text-primary font-medium">{order.shippingName}</p>
          <p>{order.shippingAddress}</p>
          <p>{order.shippingDistrict} / {order.shippingCity}</p>
          {order.shippingPostalCode && <p>{order.shippingPostalCode}</p>}
          <p>{order.shippingPhone}</p>
        </div>
      </section>

      {/* Payment Method */}
      <section className="py-8 border-b border-v2-border-subtle">
        <span className="font-inter text-xs uppercase tracking-widest text-v2-text-muted block mb-4">
          ÖDEME YÖNTEMİ
        </span>
        <p className="font-inter text-sm text-v2-text-muted">
          {formatPaymentMethod(order.paymentMethod)}
        </p>
      </section>

      {/* Tracking */}
      {order.trackingNumber && (
        <section className="py-8 border-b border-v2-border-subtle">
          <span className="font-inter text-xs uppercase tracking-widest text-v2-text-muted block mb-4">
            KARGO TAKİP
          </span>
          <div className="font-inter text-sm text-v2-text-muted space-y-1">
            <p>
              <span className="text-v2-text-primary">{order.carrier || "Kargo"}</span>
              {" · "}
              {order.trackingNumber}
            </p>
            <a
              href={`https://www.mngkargo.com.tr/gonderi-takibi?gonderiBarkod=${order.trackingNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-v2-text-primary underline underline-offset-4 hover:text-v2-text-muted transition-colors inline-block mt-2"
            >
              Kargoyu takip et &rarr;
            </a>
          </div>
        </section>
      )}

      {/* Status History */}
      {order.statusHistory.length > 0 && (
        <section className="py-8">
          <span className="font-inter text-xs uppercase tracking-widest text-v2-text-muted block mb-6">
            DURUM GEÇMİŞİ
          </span>
          <ul className="space-y-3">
            {order.statusHistory.map((history) => (
              <li key={history.id} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-v2-accent mt-2 flex-shrink-0" />
                <div>
                  <p className="font-inter text-sm text-v2-text-primary">
                    {ORDER_STATUS_LABELS[history.status] || history.status}
                  </p>
                  <p className="font-inter text-xs text-v2-text-muted mt-0.5">
                    {formatDate(history.createdAt)}
                    {history.note && ` · ${history.note}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Customer Note */}
      {order.customerNote && (
        <section className="py-8 border-t border-v2-border-subtle">
          <span className="font-inter text-xs uppercase tracking-widest text-v2-text-muted block mb-4">
            SİPARİŞ NOTU
          </span>
          <p className="font-inter text-sm text-v2-text-muted">{order.customerNote}</p>
        </section>
      )}
    </div>
  );
}

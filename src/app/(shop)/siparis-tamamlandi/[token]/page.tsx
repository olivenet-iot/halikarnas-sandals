import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { token } = await params;

  const order = await db.order.findUnique({
    where: { trackingToken: token },
    select: { orderNumber: true },
  });

  return {
    title: order
      ? `Sipariş Tamamlandı - ${order.orderNumber} | Halikarnas Sandals`
      : "Sipariş Bulunamadı | Halikarnas Sandals",
    description: "Siparişiniz başarıyla oluşturuldu.",
  };
}

export default async function SiparisTamamlandiPage({ params }: PageProps) {
  const { token } = await params;

  const order = await db.order.findUnique({
    where: { trackingToken: token },
    include: {
      items: {
        include: {
          product: {
            select: {
              slug: true,
              images: {
                where: { isPrimary: true },
                select: { url: true, alt: true },
                take: 1,
              },
            },
          },
        },
      },
      user: { select: { email: true } },
    },
  });

  if (!order) {
    notFound();
  }

  const customerEmail = order.guestEmail || order.user?.email || "";

  return (
    <div className="min-h-screen bg-v2-bg-primary">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        {/* Hero */}
        <div className="text-center">
          <span className="font-inter text-xs tracking-[0.2em] uppercase text-v2-accent">
            Teşekkürler
          </span>
          <h1 className="font-serif font-light text-3xl md:text-4xl text-v2-text-primary mt-6">
            Siparişiniz alındı.
          </h1>
          {customerEmail && (
            <p className="font-inter text-sm md:text-base text-v2-text-muted mt-4">
              Sipariş onayı{" "}
              <strong className="font-medium text-v2-text-primary">
                {customerEmail}
              </strong>{" "}
              adresine gönderildi.
            </p>
          )}
        </div>

        {/* Sections */}
        <div className="mt-16">
          {/* Sipariş Numarası */}
          <section className="border-b border-v2-border-subtle py-6">
            <h2 className="font-inter text-xs tracking-[0.2em] uppercase text-v2-text-muted mb-3">
              Sipariş Numarası
            </h2>
            <p className="font-mono text-base md:text-lg text-v2-text-primary">
              {order.orderNumber}
            </p>
          </section>

          {/* Teslimat Adresi */}
          <section className="border-b border-v2-border-subtle py-6">
            <h2 className="font-inter text-xs tracking-[0.2em] uppercase text-v2-text-muted mb-3">
              Teslimat Adresi
            </h2>
            <div className="font-inter text-sm md:text-base space-y-1">
              <p className="font-medium text-v2-text-primary">
                {order.shippingName}
              </p>
              <p className="text-v2-text-muted">{order.shippingAddress}</p>
              <p className="text-v2-text-muted">
                {order.shippingDistrict} / {order.shippingCity}
              </p>
              <p className="text-v2-text-muted">{order.shippingPhone}</p>
            </div>
          </section>

          {/* Tahmini Teslimat */}
          <section className="border-b border-v2-border-subtle py-6">
            <h2 className="font-inter text-xs tracking-[0.2em] uppercase text-v2-text-muted mb-3">
              Tahmini Teslimat
            </h2>
            <p className="font-inter text-sm md:text-base text-v2-text-primary">
              3–5 iş günü
            </p>
          </section>

          {/* Ödeme Yöntemi */}
          <section className="border-b border-v2-border-subtle py-6">
            <h2 className="font-inter text-xs tracking-[0.2em] uppercase text-v2-text-muted mb-3">
              Ödeme Yöntemi
            </h2>
            <p className="font-inter text-sm md:text-base text-v2-text-primary">
              {order.paymentMethod}
            </p>
          </section>

          {/* Ürünler */}
          <section className="border-b border-v2-border-subtle py-6">
            <h2 className="font-inter text-xs tracking-[0.2em] uppercase text-v2-text-muted mb-3">
              Ürünler
            </h2>
            <div>
              {order.items.map((item) => {
                const imageUrl = item.product?.images?.[0]?.url ?? null;
                const imageAlt =
                  item.product?.images?.[0]?.alt ?? item.productName;
                const meta = [
                  item.variantColor,
                  `Beden: ${item.variantSize}`,
                  `× ${item.quantity}`,
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 items-center py-3"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 bg-v2-bg-primary overflow-hidden">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={imageAlt}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-7 w-7 text-v2-text-muted" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-inter text-sm md:text-base text-v2-text-primary line-clamp-1">
                        {item.productName}
                      </p>
                      <p className="font-inter text-xs text-v2-text-muted mt-1">
                        {meta}
                      </p>
                    </div>
                    <p className="font-inter text-sm md:text-base text-v2-text-primary ml-auto">
                      {formatPrice(Number(item.total))}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Toplam */}
          <section className="border-b border-v2-border-subtle py-6">
            <h2 className="font-inter text-xs tracking-[0.2em] uppercase text-v2-text-muted mb-3">
              Toplam
            </h2>
            <div className="space-y-2 font-inter text-sm md:text-base">
              <div className="flex justify-between">
                <span className="text-v2-text-muted">Ara Toplam</span>
                <span className="text-v2-text-primary">
                  {formatPrice(Number(order.subtotal))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-v2-text-muted">Kargo</span>
                <span
                  className={
                    Number(order.shippingCost) === 0
                      ? "text-v2-accent"
                      : "text-v2-text-primary"
                  }
                >
                  {Number(order.shippingCost) === 0
                    ? "Ücretsiz"
                    : formatPrice(Number(order.shippingCost))}
                </span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between">
                  <span className="text-v2-text-muted">
                    İndirim
                    {order.couponCode ? ` (${order.couponCode})` : ""}
                  </span>
                  <span className="text-v2-accent">
                    −{formatPrice(Number(order.discount))}
                  </span>
                </div>
              )}
              <div className="border-t border-v2-border-subtle my-3" />
              <div className="flex justify-between">
                <span className="font-inter font-medium text-lg text-v2-text-primary">
                  Toplam
                </span>
                <span className="font-inter font-medium text-lg text-v2-text-primary">
                  {formatPrice(Number(order.total))}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Buttons */}
        <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/siparis/${order.trackingToken}`}
            className="border border-v2-text-primary text-v2-text-primary bg-transparent hover:bg-v2-text-primary hover:text-white transition-colors px-8 py-3 text-sm tracking-wide font-inter text-center"
          >
            Siparişimi Takip Et
          </Link>
          <Link
            href="/"
            className="bg-v2-text-primary text-white hover:opacity-90 transition-colors px-8 py-3 text-sm tracking-wide font-inter text-center"
          >
            Alışverişe Devam Et →
          </Link>
        </div>

        {/* Footer Date */}
        <p className="mt-12 text-center font-inter text-xs text-v2-text-muted">
          Sipariş Tarihi: {formatDate(order.createdAt)}
        </p>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, MapPin, CreditCard, ExternalLink } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS, OrderStatus } from "@/components/account/OrderCard";
import { OrderTimeline } from "@/components/account/OrderTimeline";

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

  // Check if order exists and belongs to user
  if (!order || order.userId !== userId) {
    notFound();
  }

  const statusConfig = ORDER_STATUS[order.status as OrderStatus];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/hesabim/siparislerim"
            className="inline-flex items-center text-sm text-leather-500 hover:text-aegean-600 mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Siparişlerime Dön
          </Link>
          <h1 className="text-2xl font-accent font-semibold text-leather-800">
            Sipariş #{order.orderNumber}
          </h1>
          <p className="text-leather-500 mt-1">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge className={statusConfig.color}>
          {statusConfig.label}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl border border-sand-200 overflow-hidden">
            <div className="p-4 border-b border-sand-100 bg-sand-50">
              <h2 className="font-semibold text-leather-800">Ürünler</h2>
            </div>
            <div className="divide-y divide-sand-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex gap-4">
                  <Link
                    href={`/urun/${item.product.slug}`}
                    className="h-20 w-20 rounded-lg overflow-hidden bg-sand-100 flex-shrink-0"
                  >
                    <Image
                      src={item.product.images[0]?.url || "/images/placeholder.jpg"}
                      alt={item.productName}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/urun/${item.product.slug}`}
                      className="font-medium text-leather-800 hover:text-aegean-600"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-sm text-leather-500 mt-1">
                      {item.variantColor && `${item.variantColor}, `}
                      Beden: {item.variantSize}
                    </p>
                    <p className="text-sm text-leather-500">
                      Adet: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-leather-800">
                      {formatPrice(Number(item.total))}
                    </p>
                    <p className="text-sm text-leather-500">
                      {formatPrice(Number(item.unitPrice))} / adet
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <OrderTimeline
            currentStatus={order.status as OrderStatus}
            statusHistory={order.statusHistory.map((h) => ({
              ...h,
              status: h.status as OrderStatus,
            }))}
          />

          {/* Tracking */}
          {order.trackingNumber && (
            <div className="bg-white rounded-xl border border-sand-200 p-6">
              <h3 className="font-semibold text-leather-800 mb-4">Kargo Takip</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-leather-500">Kargo Firması</p>
                  <p className="font-medium text-leather-800">
                    {order.carrier || "Belirtilmemiş"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-leather-500">Takip Numarası</p>
                  <p className="font-medium text-leather-800">
                    {order.trackingNumber}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://www.mngkargo.com.tr/gonderi-takibi?gonderiBarkod=${order.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Takip Et
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-sand-200 p-6">
            <h3 className="font-semibold text-leather-800 mb-4">
              Sipariş Özeti
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-leather-500">Ara Toplam</span>
                <span className="text-leather-800">
                  {formatPrice(Number(order.subtotal))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-leather-500">Kargo</span>
                <span className="text-leather-800">
                  {Number(order.shippingCost) === 0
                    ? "Ücretsiz"
                    : formatPrice(Number(order.shippingCost))}
                </span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>İndirim</span>
                  <span>-{formatPrice(Number(order.discount))}</span>
                </div>
              )}
              <div className="border-t border-sand-100 pt-3 flex justify-between font-semibold">
                <span className="text-leather-800">Toplam</span>
                <span className="text-aegean-600">
                  {formatPrice(Number(order.total))}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-sand-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-leather-500" />
              <h3 className="font-semibold text-leather-800">Teslimat Adresi</h3>
            </div>
            <div className="text-sm text-leather-600 space-y-1">
              <p className="font-medium text-leather-800">{order.shippingName}</p>
              <p>{order.shippingAddress}</p>
              <p>
                {order.shippingDistrict} / {order.shippingCity}
              </p>
              {order.shippingPostalCode && <p>{order.shippingPostalCode}</p>}
              <p>{order.shippingPhone}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-sand-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-leather-500" />
              <h3 className="font-semibold text-leather-800">Ödeme Yöntemi</h3>
            </div>
            <p className="text-sm text-leather-600">
              {order.paymentMethod === "credit_card"
                ? "Kredi Kartı"
                : order.paymentMethod === "bank_transfer"
                ? "Banka Havalesi"
                : order.paymentMethod === "cash_on_delivery"
                ? "Kapıda Ödeme"
                : order.paymentMethod || "Belirtilmemiş"}
            </p>
          </div>

          {/* Customer Note */}
          {order.customerNote && (
            <div className="bg-white rounded-xl border border-sand-200 p-6">
              <h3 className="font-semibold text-leather-800 mb-4">
                Sipariş Notu
              </h3>
              <p className="text-sm text-leather-600">{order.customerNote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Truck,
  MapPin,
  ExternalLink,
  Clock,
  Check,
  CheckCircle,
  X,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { db } from "@/lib/db";
import { cn, formatPrice, formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ token: string }>;
}

const ORDER_STATUS = {
  PENDING: { label: "Onay Bekliyor", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  CONFIRMED: { label: "Onaylandi", color: "bg-blue-100 text-blue-800", icon: Check },
  PROCESSING: { label: "Hazirlaniyor", color: "bg-orange-100 text-orange-800", icon: Package },
  SHIPPED: { label: "Kargoda", color: "bg-purple-100 text-purple-800", icon: Truck },
  DELIVERED: { label: "Teslim Edildi", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Iptal Edildi", color: "bg-red-100 text-red-800", icon: X },
  REFUNDED: { label: "Iade Edildi", color: "bg-gray-100 text-gray-800", icon: RotateCcw },
} as const;

type OrderStatus = keyof typeof ORDER_STATUS;

const STATUS_ORDER: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

const CARRIER_URLS: Record<string, string> = {
  MNG: "https://www.mngkargo.com.tr/takip?no=",
  "MNG Kargo": "https://www.mngkargo.com.tr/takip?no=",
  "Yurtici": "https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=",
  "Yurtici Kargo": "https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=",
  Aras: "https://www.araskargo.com.tr/trmobile/gonderi/",
  "Aras Kargo": "https://www.araskargo.com.tr/trmobile/gonderi/",
  PTT: "https://gonderitakip.ptt.gov.tr/Track/Verify?q=",
  "PTT Kargo": "https://gonderitakip.ptt.gov.tr/Track/Verify?q=",
  UPS: "https://www.ups.com/track?tracknum=",
  DHL: "https://www.dhl.com/tr-tr/home/tracking.html?tracking-id=",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;

  const order = await db.order.findUnique({
    where: { trackingToken: token },
    select: { orderNumber: true },
  });

  if (!order) {
    return {
      title: "Siparis Bulunamadi | Halikarnas Sandals",
    };
  }

  return {
    title: `Siparis #${order.orderNumber} | Halikarnas Sandals`,
    description: `Siparis detaylari ve takip bilgileri - ${order.orderNumber}`,
  };
}

function getTrackingUrl(carrier: string, trackingNumber: string): string | null {
  const baseUrl = CARRIER_URLS[carrier];
  if (!baseUrl) return null;
  return baseUrl + trackingNumber;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { token } = await params;

  const order = await db.order.findUnique({
    where: { trackingToken: token },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
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

  if (!order) {
    notFound();
  }

  const currentStatusIndex = STATUS_ORDER.indexOf(order.status as OrderStatus);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Header */}
      <section className="pt-32 pb-8 text-center">
        <div className="w-12 h-0.5 bg-[#B8860B] mx-auto mb-8" />

        <div className="inline-flex items-center gap-3 mb-6">
          <span className="w-8 h-px bg-[#B8860B]/50" />
          <span className="text-[#B8860B] text-xs tracking-[0.3em] uppercase font-medium">
            Siparis Detayi
          </span>
          <span className="w-8 h-px bg-[#B8860B]/50" />
        </div>

        <h1 className="font-serif text-3xl md:text-4xl text-stone-800 mb-2">
          {order.orderNumber}
        </h1>
        <p className="text-stone-500">
          Siparis Tarihi: {formatDate(order.createdAt)}
        </p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Order Status Card */}
        <div className="bg-white border border-stone-200 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="font-serif text-xl text-stone-800">Siparis Durumu</h2>
            <div
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                ORDER_STATUS[order.status as OrderStatus].color
              )}
            >
              {(() => {
                const Icon = ORDER_STATUS[order.status as OrderStatus].icon;
                return <Icon className="h-4 w-4" />;
              })()}
              {ORDER_STATUS[order.status as OrderStatus].label}
            </div>
          </div>

          {/* Status Timeline (for normal orders) */}
          {order.status !== "CANCELLED" && order.status !== "REFUNDED" && (
            <div className="relative pt-4">
              {/* Progress line background */}
              <div className="absolute left-0 right-0 top-8 h-1 bg-stone-200 rounded-full" />
              {/* Progress line filled */}
              <div
                className="absolute left-0 top-8 h-1 bg-[#B8860B] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(0, currentStatusIndex) / (STATUS_ORDER.length - 1) * 100}%`,
                }}
              />

              {/* Status Steps */}
              <div className="relative flex justify-between">
                {STATUS_ORDER.map((status, index) => {
                  const statusConfig = ORDER_STATUS[status];
                  const Icon = statusConfig.icon;
                  const isPast = index < currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const historyItem = order.statusHistory.find((h) => h.status === status);

                  return (
                    <div key={status} className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all",
                          isPast || isCurrent
                            ? "bg-[#B8860B] text-white"
                            : "bg-stone-200 text-stone-400"
                        )}
                      >
                        {isPast ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-xs mt-2 text-center max-w-[80px]",
                          isPast || isCurrent ? "text-stone-800 font-medium" : "text-stone-400"
                        )}
                      >
                        {statusConfig.label}
                      </p>
                      {historyItem && (
                        <p className="text-[10px] text-stone-400 mt-1">
                          {formatDate(historyItem.createdAt, { day: "numeric", month: "short" })}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tracking Info */}
          {order.trackingNumber && order.carrier && (
            <div className="mt-8 p-4 bg-stone-50 rounded-lg border border-stone-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-[#B8860B]" />
                  <div>
                    <p className="text-sm text-stone-500">{order.carrier}</p>
                    <p className="font-mono text-stone-800">{order.trackingNumber}</p>
                  </div>
                </div>
                {getTrackingUrl(order.carrier, order.trackingNumber) && (
                  <a
                    href={getTrackingUrl(order.carrier, order.trackingNumber)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#B8860B] text-white text-sm font-medium rounded hover:bg-[#9a7209] transition-colors"
                  >
                    Kargo Takip
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white border border-stone-200 p-6 md:p-8 mb-6">
          <h3 className="font-serif text-lg text-stone-800 mb-6">Siparis Detaylari</h3>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-4 border-b border-stone-100 last:border-0 last:pb-0"
              >
                <div className="w-20 h-20 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                  {item.product.images[0]?.url ? (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.productName}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-stone-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-stone-800 truncate">{item.productName}</h4>
                  <p className="text-sm text-stone-500">
                    {item.variantColor && `${item.variantColor} / `}
                    Beden: {item.variantSize} / Adet: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-stone-800">{formatPrice(Number(item.total))}</p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-stone-500">{formatPrice(Number(item.unitPrice))} / adet</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Totals */}
          <div className="mt-6 pt-6 border-t border-stone-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Ara Toplam</span>
              <span className="text-stone-800">{formatPrice(Number(order.subtotal))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Kargo</span>
              <span className="text-stone-800">
                {Number(order.shippingCost) === 0 ? "Ucretsiz" : formatPrice(Number(order.shippingCost))}
              </span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Indirim</span>
                <span className="text-green-600">-{formatPrice(Number(order.discount))}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-stone-200">
              <span className="text-stone-800">Toplam</span>
              <span className="text-stone-900">{formatPrice(Number(order.total))}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-white border border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5 text-[#B8860B]" />
              <h3 className="font-serif text-lg text-stone-800">Teslimat Adresi</h3>
            </div>
            <div className="text-sm text-stone-600 space-y-1">
              <p className="font-medium text-stone-800">{order.shippingName}</p>
              <p>{order.shippingAddress}</p>
              <p>
                {order.shippingDistrict} / {order.shippingCity}
              </p>
              <p>{order.shippingPhone}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white border border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-5 w-5 text-[#B8860B]" />
              <h3 className="font-serif text-lg text-stone-800">Odeme Bilgileri</h3>
            </div>
            <div className="text-sm text-stone-600 space-y-2">
              <div className="flex justify-between">
                <span>Odeme Yontemi</span>
                <span className="text-stone-800">{order.paymentMethod || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span>Odeme Durumu</span>
                <span
                  className={cn(
                    "font-medium",
                    order.paymentStatus === "PAID" ? "text-green-600" : "text-yellow-600"
                  )}
                >
                  {order.paymentStatus === "PAID" ? "Odendi" : "Beklemede"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Help Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-stone-500 mb-2">
            Siparisizle ilgili sorulariniz mi var?
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-2 text-[#B8860B] hover:text-[#9a7209] transition-colors text-sm font-medium"
          >
            Bizimle iletisime gecin
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

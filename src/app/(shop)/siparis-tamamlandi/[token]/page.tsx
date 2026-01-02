import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Package, Truck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

  // Fetch order to get orderNumber for metadata
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

  // Fetch order from database using trackingToken (secure, non-guessable)
  const order = await db.order.findUnique({
    where: { trackingToken: token },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-heading-3 font-accent text-leather-800 mb-2">
            SİPARİŞİNİZ BAŞARIYLA OLUŞTURULDU!
          </h1>
          <p className="text-body-lg text-leather-600">
            Sipariş Numarası:{" "}
            <span className="font-semibold text-aegean-600">
              {order.orderNumber}
            </span>
          </p>
        </div>

        {/* Email Notification */}
        <div className="bg-aegean-50 border border-aegean-200 rounded-lg p-4 mb-8 flex items-center gap-3">
          <Mail className="h-5 w-5 text-aegean-600 flex-shrink-0" />
          <p className="text-body-sm text-aegean-800">
            Sipariş onayı{" "}
            <span className="font-semibold">{order.guestEmail}</span> adresine
            gönderildi.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-sand-50 rounded-xl p-6 mb-8">
          <h2 className="text-heading-5 font-accent text-leather-800 mb-6">
            SİPARİŞ DETAYLARI
          </h2>

          {/* Shipping Info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-5 w-5 text-aegean-600" />
              <h3 className="font-semibold text-leather-800">
                Teslimat Adresi
              </h3>
            </div>
            <div className="text-body-sm text-leather-600 space-y-1 ml-7">
              <p className="font-medium">{order.shippingName}</p>
              <p>{order.shippingAddress}</p>
              <p>
                {order.shippingDistrict}/{order.shippingCity}
              </p>
              <p>{order.shippingPhone}</p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Delivery Estimate */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-aegean-600" />
              <h3 className="font-semibold text-leather-800">
                Tahmini Teslimat
              </h3>
            </div>
            <p className="text-body-sm text-leather-600 ml-7">3-5 iş günü</p>
          </div>

          <Separator className="my-4" />

          {/* Payment Info */}
          <div className="mb-6">
            <h3 className="font-semibold text-leather-800 mb-2">Ödeme</h3>
            <p className="text-body-sm text-leather-600">
              {order.paymentMethod}
            </p>
          </div>

          <Separator className="my-4" />

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-leather-800 mb-3">Ürünler</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-body-sm"
                >
                  <span className="text-leather-600">
                    {item.productName} ({item.variantSize}) x{item.quantity}
                  </span>
                  <span className="font-medium text-leather-800">
                    {formatPrice(Number(item.total))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-body-sm">
              <span className="text-leather-600">Ara Toplam</span>
              <span className="text-leather-800">
                {formatPrice(Number(order.subtotal))}
              </span>
            </div>
            <div className="flex justify-between text-body-sm">
              <span className="text-leather-600">Kargo</span>
              <span className="text-leather-800">
                {Number(order.shippingCost) === 0
                  ? "Ücretsiz"
                  : formatPrice(Number(order.shippingCost))}
              </span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-body-sm">
                <span className="text-green-600">
                  İndirim{" "}
                  {order.couponCode && (
                    <span className="text-body-xs">({order.couponCode})</span>
                  )}
                </span>
                <span className="text-green-600">
                  -{formatPrice(Number(order.discount))}
                </span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between text-body-lg font-semibold">
              <span className="text-leather-800">Toplam</span>
              <span className="text-leather-900">
                {formatPrice(Number(order.total))}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" size="lg" asChild>
            <Link href={`/siparis/${order.trackingToken}`}>Siparişimi Takip Et</Link>
          </Button>
          <Button className="btn-primary" size="lg" asChild>
            <Link href="/kadin">Alışverişe Devam Et</Link>
          </Button>
        </div>

        {/* Order Date */}
        <p className="text-center text-body-xs text-leather-400 mt-8">
          Sipariş Tarihi: {formatDate(order.createdAt)}
        </p>
      </div>
    </div>
  );
}

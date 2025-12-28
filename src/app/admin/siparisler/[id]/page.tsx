"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Truck,
  CreditCard,
  Loader2,
  Save,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  OrderStatusBadge,
  OrderStatusSelect,
  OrderTimeline,
} from "@/components/admin/orders";

interface OrderItem {
  id: string;
  productName: string;
  variantSize: string;
  variantColor: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
  product: { images: { url: string }[] };
}

interface StatusHistory {
  id: string;
  status: string;
  note: string | null;
  createdAt: string;
  createdBy: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingPostalCode: string | null;
  subtotal: number;
  shippingCost: number;
  discount: number;
  tax: number;
  total: number;
  couponCode: string | null;
  trackingNumber: string | null;
  carrier: string | null;
  customerNote: string | null;
  adminNote: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
  guestEmail: string | null;
  items: OrderItem[];
  statusHistory: StatusHistory[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (!res.ok) throw new Error("Sipariş bulunamadı");
      const data = await res.json();
      setOrder(data.order);
      setNewStatus(data.order.status);
      setTrackingNumber(data.order.trackingNumber || "");
      setCarrier(data.order.carrier || "");
      setAdminNote(data.order.adminNote || "");
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
      router.push("/admin/siparisler");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async () => {
    if (!order || newStatus === order.status) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          statusNote: statusNote || undefined,
        }),
      });

      if (!res.ok) throw new Error("Durum güncellenemedi");

      toast({ title: "Sipariş durumu güncellendi" });
      setStatusNote("");
      fetchOrder();
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateTracking = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingNumber: trackingNumber || null,
          carrier: carrier || null,
        }),
      });

      if (!res.ok) throw new Error("Kargo bilgisi güncellenemedi");

      toast({ title: "Kargo bilgisi güncellendi" });
      fetchOrder();
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateAdminNote = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote: adminNote || null }),
      });

      if (!res.ok) throw new Error("Not güncellenemedi");

      toast({ title: "Not güncellendi" });
      fetchOrder();
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Sipariş bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/siparisler">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">#{order.orderNumber}</h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {new Date(order.createdAt).toLocaleString("tr-TR")}
            </p>
          </div>
        </div>
        <Button variant="outline">
          <Printer className="h-4 w-4 mr-2" />
          Fatura Yazdır
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Ürünler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.productName}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                          Yok
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        {item.variantColor && `${item.variantColor}, `}
                        Beden: {item.variantSize}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.total)}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Pricing Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kargo</span>
                  <span>
                    {order.shippingCost > 0
                      ? formatPrice(order.shippingCost)
                      : "Ücretsiz"}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>
                      İndirim {order.couponCode && `(${order.couponCode})`}
                    </span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Toplam</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Müşteri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{order.user?.name || order.shippingName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{order.user?.email || order.guestEmail || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{order.shippingPhone}</span>
                </div>
                {order.user && (
                  <Button variant="outline" size="sm" asChild className="mt-2">
                    <Link href={`/admin/kullanicilar/${order.user.id}`}>
                      Müşteri Profiline Git
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Teslimat Adresi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{order.shippingName}</p>
                <p className="text-gray-600 mt-1">{order.shippingAddress}</p>
                <p className="text-gray-600">
                  {order.shippingDistrict} / {order.shippingCity}
                  {order.shippingPostalCode && ` ${order.shippingPostalCode}`}
                </p>
                <p className="text-gray-600">{order.shippingPhone}</p>
              </CardContent>
            </Card>
          </div>

          {/* Customer Note */}
          {order.customerNote && (
            <Card>
              <CardHeader>
                <CardTitle>Müşteri Notu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{order.customerNote}</p>
              </CardContent>
            </Card>
          )}

          {/* Admin Note */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Notu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Sipariş hakkında not ekleyin..."
                rows={3}
              />
              <Button
                size="sm"
                onClick={updateAdminNote}
                disabled={isSaving || adminNote === (order.adminNote || "")}
              >
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                Notu Kaydet
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle>Sipariş Durumu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Durum</Label>
                <OrderStatusSelect
                  value={newStatus}
                  onValueChange={setNewStatus}
                  disabled={isSaving}
                />
              </div>
              {newStatus !== order.status && (
                <>
                  <div className="space-y-2">
                    <Label>Not (opsiyonel)</Label>
                    <Textarea
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="Durum değişikliği hakkında not..."
                      rows={2}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={updateStatus}
                    disabled={isSaving}
                  >
                    {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Durumu Güncelle
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tracking Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Kargo Bilgisi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Kargo Firması</Label>
                <Input
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="MNG, Yurtiçi, Aras..."
                />
              </div>
              <div className="space-y-2">
                <Label>Takip Numarası</Label>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Kargo takip no..."
                />
              </div>
              <Button
                size="sm"
                onClick={updateTracking}
                disabled={
                  isSaving ||
                  (trackingNumber === (order.trackingNumber || "") &&
                    carrier === (order.carrier || ""))
                }
              >
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                Kaydet
              </Button>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Ödeme Bilgisi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Yöntem</span>
                  <span className="font-medium">
                    {order.paymentMethod === "credit_card"
                      ? "Kredi Kartı"
                      : order.paymentMethod === "bank_transfer"
                      ? "Havale/EFT"
                      : "Kapıda Ödeme"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durum</span>
                  <span
                    className={`font-medium ${
                      order.paymentStatus === "PAID"
                        ? "text-green-600"
                        : order.paymentStatus === "FAILED"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.paymentStatus === "PAID"
                      ? "Ödendi"
                      : order.paymentStatus === "FAILED"
                      ? "Başarısız"
                      : order.paymentStatus === "REFUNDED"
                      ? "İade Edildi"
                      : "Bekliyor"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status History */}
          <Card>
            <CardHeader>
              <CardTitle>Sipariş Geçmişi</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline history={order.statusHistory} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

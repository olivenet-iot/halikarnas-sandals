"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
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
import { useToast } from "@/hooks/use-toast";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import { formatPaymentMethod } from "@/lib/format-payment-method";

const trackSchema = z.object({
  email: z.string().email("Gecerli bir e-posta adresi girin"),
  orderNumber: z.string().min(1, "Siparis numarasi gerekli"),
});

type TrackFormData = z.infer<typeof trackSchema>;

type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

const ORDER_STATUS = {
  PENDING: { label: "Onay Bekliyor", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  CONFIRMED: { label: "Onaylandi", color: "bg-blue-100 text-blue-800", icon: Check },
  PROCESSING: { label: "Hazirlaniyor", color: "bg-orange-100 text-orange-800", icon: Package },
  SHIPPED: { label: "Kargoda", color: "bg-purple-100 text-purple-800", icon: Truck },
  DELIVERED: { label: "Teslim Edildi", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Iptal Edildi", color: "bg-red-100 text-red-800", icon: X },
  REFUNDED: { label: "Iade Edildi", color: "bg-gray-100 text-gray-800", icon: RotateCcw },
} as const;

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

interface OrderItem {
  id: string;
  productName: string;
  variantSize: string;
  variantColor: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
  image: string | null;
}

interface OrderData {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  paymentMethod: string;
  trackingToken: string;
  trackingNumber: string | null;
  carrier: string | null;
  createdAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postalCode: string | null;
  };
  totals: {
    subtotal: number;
    shippingCost: number;
    discount: number;
    total: number;
  };
  statusHistory: Array<{
    status: OrderStatus;
    note: string | null;
    createdAt: string;
  }>;
}

export default function OrderTrackingPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackFormData>({
    resolver: zodResolver(trackSchema),
    defaultValues: {
      email: "",
      orderNumber: "",
    },
  });

  const onSubmit = async (data: TrackFormData) => {
    setIsLoading(true);
    setOrder(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        toast({
          title: "Siparis Bulunamadi",
          description: result.error || "Lutfen bilgilerinizi kontrol edin.",
          variant: "destructive",
        });
        return;
      }

      setOrder(result.order);
    } catch {
      toast({
        title: "Hata",
        description: "Bir hata olustu. Lutfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTrackingUrl = (carrier: string, trackingNumber: string): string | null => {
    const baseUrl = CARRIER_URLS[carrier];
    if (!baseUrl) return null;
    return baseUrl + trackingNumber;
  };

  const currentStatusIndex = order ? STATUS_ORDER.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-v2-bg-primary">
      {/* Hero + Form Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          {/* Hero */}
          <div className="text-center mb-14">
            <span className="text-v2-accent tracking-widest text-xs font-inter uppercase">
              Siparis Takibi
            </span>
            <h1 className="font-serif font-light text-4xl md:text-5xl text-v2-text-primary mt-4">
              Siparisizi takip edin
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Email */}
            <div>
              <label className="font-inter text-xs tracking-wide uppercase text-v2-text-muted block mb-3">
                E-posta Adresi
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="Siparisinizde kullandiginiz e-posta"
                className={cn(
                  "w-full px-0 py-3 bg-transparent border-0 border-b transition-colors duration-200",
                  "border-v2-border-subtle focus:border-v2-text-primary focus:ring-0",
                  "placeholder:text-v2-text-muted/50 text-v2-text-primary outline-none",
                  errors.email && "border-red-400"
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-2">{errors.email.message}</p>
              )}
            </div>

            {/* Order Number */}
            <div>
              <label className="font-inter text-xs tracking-wide uppercase text-v2-text-muted block mb-3">
                Siparis Numarasi
              </label>
              <input
                {...register("orderNumber")}
                placeholder="Ornek: HS-20260101-1234"
                className={cn(
                  "w-full px-0 py-3 bg-transparent border-0 border-b transition-colors duration-200",
                  "border-v2-border-subtle focus:border-v2-text-primary focus:ring-0",
                  "placeholder:text-v2-text-muted/50 text-v2-text-primary outline-none font-mono",
                  errors.orderNumber && "border-red-400"
                )}
              />
              {errors.orderNumber && (
                <p className="text-xs text-red-500 mt-2">{errors.orderNumber.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full py-3.5 border border-v2-text-primary text-v2-text-primary",
                  "hover:bg-v2-text-primary hover:text-white",
                  "transition-colors duration-200 text-sm tracking-wide",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sorgulaniyor...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Sorgula
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Order Result Section */}
      <AnimatePresence mode="wait">
        {order && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-2xl mx-auto px-4 sm:px-6 pb-24"
          >
            {/* Order Header */}
            <div className="border-b border-v2-border-subtle pb-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <p className="font-inter text-xs tracking-wide uppercase text-v2-text-muted mb-1">
                    Siparis Numarasi
                  </p>
                  <h2 className="font-serif font-light text-2xl text-v2-text-primary">{order.orderNumber}</h2>
                  <p className="text-sm text-v2-text-muted mt-1">
                    Siparis Tarihi: {formatDate(order.createdAt)}
                  </p>
                </div>
                <div
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                    ORDER_STATUS[order.status].color
                  )}
                >
                  {(() => {
                    const Icon = ORDER_STATUS[order.status].icon;
                    return <Icon className="h-4 w-4" />;
                  })()}
                  {ORDER_STATUS[order.status].label}
                </div>
              </div>

              {/* Status Timeline (for normal orders) */}
              {order.status !== "CANCELLED" && order.status !== "REFUNDED" && (
                <div className="relative pt-4">
                  {/* Progress line background */}
                  <div className="absolute left-0 right-0 top-8 h-px bg-v2-border-subtle" />
                  {/* Progress line filled */}
                  <div
                    className="absolute left-0 top-8 h-px bg-v2-text-primary transition-all duration-500"
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
                                ? "bg-v2-text-primary text-white"
                                : "bg-v2-border-subtle text-v2-text-muted"
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
                              isPast || isCurrent
                                ? "text-v2-text-primary font-medium"
                                : "text-v2-text-muted"
                            )}
                          >
                            {statusConfig.label}
                          </p>
                          {historyItem && (
                            <p className="text-[10px] text-v2-text-muted mt-1">
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
                <div className="mt-8 py-4 border-t border-v2-border-subtle">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-v2-text-muted" />
                      <div>
                        <p className="text-sm text-v2-text-muted">{order.carrier}</p>
                        <p className="font-mono text-v2-text-primary">{order.trackingNumber}</p>
                      </div>
                    </div>
                    {getTrackingUrl(order.carrier, order.trackingNumber) && (
                      <a
                        href={getTrackingUrl(order.carrier, order.trackingNumber)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-v2-text-primary text-v2-text-primary text-sm hover:bg-v2-text-primary hover:text-white transition-colors"
                      >
                        Kargo Takip
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="font-inter text-xs tracking-wide uppercase text-v2-text-muted mb-6">
                Siparis Detaylari
              </h3>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-v2-border-subtle last:border-0 last:pb-0"
                  >
                    <div className="w-20 h-20 bg-v2-border-subtle overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.productName}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-v2-text-muted" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-v2-text-primary truncate">{item.productName}</h4>
                      <p className="text-sm text-v2-text-muted">
                        {item.variantColor && `${item.variantColor} / `}
                        Beden: {item.variantSize} / Adet: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-v2-text-primary">{formatPrice(item.total)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-v2-text-muted">{formatPrice(item.unitPrice)} / adet</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="mt-6 pt-6 border-t border-v2-border-subtle space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-v2-text-muted">Ara Toplam</span>
                  <span className="text-v2-text-primary">{formatPrice(order.totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-v2-text-muted">Kargo</span>
                  <span className="text-v2-text-primary">
                    {order.totals.shippingCost === 0 ? "Ucretsiz" : formatPrice(order.totals.shippingCost)}
                  </span>
                </div>
                {order.totals.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Indirim</span>
                    <span className="text-green-600">-{formatPrice(order.totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-medium pt-3 border-t border-v2-border-subtle">
                  <span className="text-v2-text-primary">Toplam</span>
                  <span className="text-v2-text-primary">{formatPrice(order.totals.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Shipping Address */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-v2-text-muted" />
                  <h3 className="font-inter text-xs tracking-wide uppercase text-v2-text-muted">
                    Teslimat Adresi
                  </h3>
                </div>
                <div className="text-sm text-v2-text-muted space-y-1">
                  <p className="font-medium text-v2-text-primary">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.district} / {order.shippingAddress.city}
                  </p>
                  <p>{order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-4 w-4 text-v2-text-muted" />
                  <h3 className="font-inter text-xs tracking-wide uppercase text-v2-text-muted">
                    Odeme Bilgileri
                  </h3>
                </div>
                <div className="text-sm text-v2-text-muted space-y-2">
                  <div className="flex justify-between">
                    <span>Odeme Yontemi</span>
                    <span className="text-v2-text-primary">{formatPaymentMethod(order.paymentMethod)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Odeme Durumu</span>
                    <span className={cn(
                      "font-medium",
                      order.paymentStatus === "PAID" ? "text-green-600" : "text-yellow-600"
                    )}>
                      {order.paymentStatus === "PAID" ? "Odendi" : "Beklemede"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Link */}
            <div className="mt-12 pt-8 border-t border-v2-border-subtle text-center">
              <p className="text-sm text-v2-text-muted mb-2">
                Siparisizle ilgili sorulariniz mi var?
              </p>
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 text-v2-text-primary hover:opacity-70 transition-opacity text-sm"
              >
                Bizimle iletisime gecin
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

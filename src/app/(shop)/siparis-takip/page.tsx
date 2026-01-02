"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  Search,
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
import { GoldDivider } from "@/components/ui/luxury/GoldDivider";
import { TextFadeIn } from "@/components/ui/luxury/TextReveal";
import { MagneticButton } from "@/components/ui/luxury/MagneticButton";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import { EASE } from "@/lib/animations";

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
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Hero Section */}
      <section className="pt-32 pb-16 text-center">
        <GoldDivider variant="default" className="mx-auto mb-8" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE.luxury }}
          className="inline-flex items-center gap-3 mb-6"
        >
          <span className="w-8 h-px bg-[#B8860B]/50" />
          <span className="text-[#B8860B] text-xs tracking-[0.3em] uppercase font-medium">
            Siparis Takibi
          </span>
          <span className="w-8 h-px bg-[#B8860B]/50" />
        </motion.div>

        <TextFadeIn delay={0.1}>
          <h1 className="font-serif text-4xl md:text-5xl text-stone-800 mb-6">
            Siparisizi Takip Edin
          </h1>
        </TextFadeIn>

        <TextFadeIn delay={0.2}>
          <p className="text-stone-600 max-w-xl mx-auto text-lg">
            Siparis numaraniz ve e-posta adresiniz ile siparisinin durumunu ogrenebilirsiniz.
          </p>
        </TextFadeIn>
      </section>

      {/* Form Section */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE.luxury, delay: 0.3 }}
          className="bg-white border border-stone-200 p-8 md:p-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 border border-[#B8860B]/30 flex items-center justify-center">
              <Search className="h-4 w-4 text-[#B8860B]" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-stone-800">Siparis Sorgula</h2>
              <p className="text-sm text-stone-500">Bilgilerinizi girerek sorgulayın</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.15em] text-stone-500 font-medium block">
                E-posta Adresi <span className="text-[#B8860B]">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="Siparisinizde kullandiginiz e-posta"
                className={cn(
                  "w-full px-0 py-3 bg-transparent border-0 border-b transition-all duration-300",
                  "border-stone-300 focus:border-[#B8860B] focus:ring-0",
                  "placeholder:text-stone-400 text-stone-800 outline-none",
                  errors.email && "border-red-400"
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Order Number */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.15em] text-stone-500 font-medium block">
                Siparis Numarasi <span className="text-[#B8860B]">*</span>
              </label>
              <input
                {...register("orderNumber")}
                placeholder="Ornek: HS-20260101-1234"
                className={cn(
                  "w-full px-0 py-3 bg-transparent border-0 border-b transition-all duration-300",
                  "border-stone-300 focus:border-[#B8860B] focus:ring-0",
                  "placeholder:text-stone-400 text-stone-800 outline-none font-mono",
                  errors.orderNumber && "border-red-400"
                )}
              />
              {errors.orderNumber && (
                <p className="text-xs text-red-500">{errors.orderNumber.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-4">
              <MagneticButton
                onClick={handleSubmit(onSubmit)}
                variant="primary"
                size="lg"
                className="w-full"
                icon={isLoading ? undefined : <ArrowRight className="w-4 h-4" />}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sorgulaniyor...
                  </span>
                ) : (
                  "Siparisi Sorgula"
                )}
              </MagneticButton>
            </div>
          </form>
        </motion.div>
      </section>

      {/* Order Result Section */}
      <AnimatePresence mode="wait">
        {order && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: EASE.luxury }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
          >
            {/* Order Header */}
            <div className="bg-white border border-stone-200 p-6 md:p-8 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-stone-500 mb-1">Siparis Numarasi</p>
                  <h2 className="font-serif text-2xl text-stone-800">{order.orderNumber}</h2>
                  <p className="text-sm text-stone-500 mt-1">
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
                      <p className="font-medium text-stone-800">{formatPrice(item.total)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-stone-500">{formatPrice(item.unitPrice)} / adet</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="mt-6 pt-6 border-t border-stone-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Ara Toplam</span>
                  <span className="text-stone-800">{formatPrice(order.totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Kargo</span>
                  <span className="text-stone-800">
                    {order.totals.shippingCost === 0 ? "Ucretsiz" : formatPrice(order.totals.shippingCost)}
                  </span>
                </div>
                {order.totals.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Indirim</span>
                    <span className="text-green-600">-{formatPrice(order.totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-stone-200">
                  <span className="text-stone-800">Toplam</span>
                  <span className="text-stone-900">{formatPrice(order.totals.total)}</span>
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
                  <p className="font-medium text-stone-800">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.district} / {order.shippingAddress.city}
                  </p>
                  <p>{order.shippingAddress.phone}</p>
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
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

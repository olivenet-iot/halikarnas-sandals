"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Check,
  Package,
  Truck,
  CheckCircle,
  X,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const ORDER_STATUS = {
  PENDING: { label: "Onay Bekliyor", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  CONFIRMED: { label: "Onaylandı", color: "bg-blue-100 text-blue-800", icon: Check },
  PROCESSING: { label: "Hazırlanıyor", color: "bg-orange-100 text-orange-800", icon: Package },
  SHIPPED: { label: "Kargoda", color: "bg-purple-100 text-purple-800", icon: Truck },
  DELIVERED: { label: "Teslim Edildi", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "İptal Edildi", color: "bg-red-100 text-red-800", icon: X },
  REFUNDED: { label: "İade Edildi", color: "bg-gray-100 text-gray-800", icon: RotateCcw },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS;

interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  variant: string;
  quantity: number;
  price: number;
}

interface OrderCardProps {
  id: string;
  orderNumber: string;
  createdAt: Date;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  trackingNumber?: string;
  compact?: boolean;
}

export function OrderCard({
  id,
  orderNumber,
  createdAt,
  status,
  items,
  total,
  trackingNumber,
  compact = false,
}: OrderCardProps) {
  const statusConfig = ORDER_STATUS[status];
  const StatusIcon = statusConfig.icon;

  if (compact) {
    return (
      <Link
        href={`/hesabim/siparislerim/${id}`}
        className="flex items-center justify-between p-4 bg-white rounded-lg border border-sand-200 hover:border-aegean-300 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {items.slice(0, 2).map((item, idx) => (
              <div
                key={item.id}
                className="h-10 w-10 rounded-lg border-2 border-white overflow-hidden bg-sand-100"
                style={{ zIndex: 2 - idx }}
              >
                <Image
                  src={item.productImage || "/images/placeholder.jpg"}
                  alt={item.productName}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
            {items.length > 2 && (
              <div className="h-10 w-10 rounded-lg border-2 border-white bg-sand-200 flex items-center justify-center text-xs font-medium text-leather-600">
                +{items.length - 2}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-leather-800">#{orderNumber}</p>
            <p className="text-xs text-leather-500">{formatDate(createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
          <p className="text-sm font-semibold text-leather-800">{formatPrice(total)}</p>
          <ChevronRight className="h-4 w-4 text-leather-400" />
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-sand-200 overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-sand-100 bg-sand-50">
        <div>
          <p className="text-sm font-semibold text-leather-800">
            Sipariş #{orderNumber}
          </p>
          <p className="text-xs text-leather-500">{formatDate(createdAt)}</p>
        </div>
        <Badge className={statusConfig.color}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {statusConfig.label}
        </Badge>
      </div>

      {/* Items */}
      <div className="p-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="h-16 w-16 rounded-lg overflow-hidden bg-sand-100 flex-shrink-0">
              <Image
                src={item.productImage || "/images/placeholder.jpg"}
                alt={item.productName}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-leather-800 truncate">
                {item.productName}
              </p>
              <p className="text-xs text-leather-500">{item.variant}</p>
              <p className="text-xs text-leather-500">Adet: {item.quantity}</p>
            </div>
            <p className="text-sm font-medium text-leather-800">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-sand-100 bg-sand-50">
        <div>
          {trackingNumber && (
            <p className="text-xs text-leather-500">
              Kargo Takip: <span className="font-medium">{trackingNumber}</span>
            </p>
          )}
          <p className="text-sm font-semibold text-leather-800">
            Toplam: {formatPrice(total)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/hesabim/siparislerim/${id}`}>Detay Gör</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

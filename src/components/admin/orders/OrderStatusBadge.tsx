"use client";

import { Badge } from "@/components/ui/badge";

const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }
> = {
  PENDING: { label: "Bekliyor", variant: "secondary", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "Onaylandı", variant: "default", color: "bg-green-100 text-green-800" },
  PROCESSING: { label: "Hazırlanıyor", variant: "default", color: "bg-orange-100 text-orange-800" },
  SHIPPED: { label: "Kargoda", variant: "default", color: "bg-blue-100 text-blue-800" },
  DELIVERED: { label: "Teslim Edildi", variant: "outline", color: "bg-purple-100 text-purple-800" },
  CANCELLED: { label: "İptal Edildi", variant: "destructive", color: "bg-red-100 text-red-800" },
  REFUNDED: { label: "İade Edildi", variant: "outline", color: "bg-gray-100 text-gray-800" },
};

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status] || {
    label: status,
    variant: "secondary" as const,
    color: "bg-gray-100 text-gray-800",
  };

  return (
    <Badge className={`${config.color} border-0 ${className || ""}`}>
      {config.label}
    </Badge>
  );
}

export { ORDER_STATUS_CONFIG };

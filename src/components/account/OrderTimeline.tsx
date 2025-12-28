"use client";

import { Check } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ORDER_STATUS, OrderStatus } from "./OrderCard";

interface StatusHistoryItem {
  id: string;
  status: OrderStatus;
  note?: string | null;
  createdAt: Date;
}

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  statusHistory: StatusHistoryItem[];
}

const STATUS_ORDER: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export function OrderTimeline({
  currentStatus,
  statusHistory,
}: OrderTimelineProps) {
  // Handle cancelled/refunded orders
  if (currentStatus === "CANCELLED" || currentStatus === "REFUNDED") {
    return (
      <div className="bg-white rounded-xl border border-sand-200 p-6">
        <h3 className="font-semibold text-leather-800 mb-4">Sipariş Durumu</h3>
        <div className="space-y-4">
          {statusHistory.map((item) => {
            const statusConfig = ORDER_STATUS[item.status];
            const Icon = statusConfig.icon;

            return (
              <div key={item.id} className="flex items-start gap-4">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                    item.status === "CANCELLED" || item.status === "REFUNDED"
                      ? "bg-red-100"
                      : "bg-aegean-100"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      item.status === "CANCELLED" || item.status === "REFUNDED"
                        ? "text-red-600"
                        : "text-aegean-600"
                    )}
                  />
                </div>
                <div>
                  <p className="font-medium text-leather-800">
                    {statusConfig.label}
                  </p>
                  <p className="text-sm text-leather-500">
                    {formatDate(item.createdAt)}
                  </p>
                  {item.note && (
                    <p className="text-sm text-leather-600 mt-1">{item.note}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const currentStatusIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="bg-white rounded-xl border border-sand-200 p-6">
      <h3 className="font-semibold text-leather-800 mb-6">Sipariş Durumu</h3>

      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-sand-200" />
        <div
          className="absolute left-4 top-4 w-0.5 bg-aegean-500 transition-all duration-500"
          style={{
            height: `${(currentStatusIndex / (STATUS_ORDER.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="space-y-6 relative">
          {STATUS_ORDER.map((status, index) => {
            const statusConfig = ORDER_STATUS[status];
            const Icon = statusConfig.icon;
            const isPast = index < currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const historyItem = statusHistory.find((h) => h.status === status);

            return (
              <div key={status} className="flex items-start gap-4">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all",
                    isPast || isCurrent
                      ? "bg-aegean-500"
                      : "bg-sand-200"
                  )}
                >
                  {isPast ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        isCurrent ? "text-white" : "text-leather-400"
                      )}
                    />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p
                    className={cn(
                      "font-medium",
                      isPast || isCurrent
                        ? "text-leather-800"
                        : "text-leather-400"
                    )}
                  >
                    {statusConfig.label}
                  </p>
                  {historyItem && (
                    <p className="text-sm text-leather-500">
                      {formatDate(historyItem.createdAt)}
                    </p>
                  )}
                  {historyItem?.note && (
                    <p className="text-sm text-leather-600 mt-1">
                      {historyItem.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

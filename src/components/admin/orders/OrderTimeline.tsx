"use client";

import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Check, Circle } from "lucide-react";
import { ORDER_STATUS_CONFIG } from "./OrderStatusBadge";

interface StatusHistory {
  id: string;
  status: string;
  note?: string | null;
  createdAt: Date | string;
  createdBy?: string | null;
}

interface OrderTimelineProps {
  history: StatusHistory[];
}

export function OrderTimeline({ history }: OrderTimelineProps) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">
        Henüz durum geçmişi yok
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item, index) => {
        const config = ORDER_STATUS_CONFIG[item.status] || {
          label: item.status,
          color: "bg-gray-100 text-gray-800",
        };
        const isFirst = index === 0;

        return (
          <div key={item.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  isFirst ? "bg-aegean-500 text-white" : "bg-gray-200"
                }`}
              >
                {isFirst ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </div>
              {index < history.length - 1 && (
                <div className="w-0.5 h-full bg-gray-200 my-1" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium px-2 py-0.5 rounded ${config.color}`}>
                  {config.label}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </span>
              </div>
              {item.note && (
                <p className="text-sm text-gray-600 mt-1">{item.note}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(item.createdAt).toLocaleString("tr-TR")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

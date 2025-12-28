"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ORDER_STATUSES = [
  { value: "PENDING", label: "Bekliyor" },
  { value: "CONFIRMED", label: "Onaylandı" },
  { value: "PROCESSING", label: "Hazırlanıyor" },
  { value: "SHIPPED", label: "Kargoda" },
  { value: "DELIVERED", label: "Teslim Edildi" },
  { value: "CANCELLED", label: "İptal Edildi" },
  { value: "REFUNDED", label: "İade Edildi" },
];

interface OrderStatusSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function OrderStatusSelect({
  value,
  onValueChange,
  disabled,
}: OrderStatusSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Durum seçin" />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { ORDER_STATUSES };

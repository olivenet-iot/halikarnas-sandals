"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterStore, SortOption } from "@/stores/filter-store";
import { sortOptions } from "@/lib/constants";

interface SortSelectProps {
  className?: string;
}

export function SortSelect({ className }: SortSelectProps) {
  const { sort, setSort } = useFilterStore();

  return (
    <Select
      value={sort}
      onValueChange={(value: SortOption) => setSort(value)}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Sırala" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

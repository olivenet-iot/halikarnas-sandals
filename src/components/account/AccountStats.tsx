"use client";

import Link from "next/link";
import { Package, Heart, MapPin, LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  href: string;
}

function StatCard({ icon: Icon, value, label, href }: StatCardProps) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl border border-sand-200 p-6 hover:border-aegean-300 hover:shadow-soft transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-aegean-50 flex items-center justify-center">
          <Icon className="h-6 w-6 text-aegean-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-leather-800">{value}</p>
          <p className="text-sm text-leather-500">{label}</p>
        </div>
      </div>
    </Link>
  );
}

interface AccountStatsProps {
  orderCount: number;
  wishlistCount: number;
  addressCount: number;
}

export function AccountStats({
  orderCount,
  wishlistCount,
  addressCount,
}: AccountStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        icon={Package}
        value={orderCount}
        label="Sipariş"
        href="/hesabim/siparislerim"
      />
      <StatCard
        icon={Heart}
        value={wishlistCount}
        label="Favori"
        href="/hesabim/favorilerim"
      />
      <StatCard
        icon={MapPin}
        value={addressCount}
        label="Adres"
        href="/hesabim/adreslerim"
      />
    </div>
  );
}

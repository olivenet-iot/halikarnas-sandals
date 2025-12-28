"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-sand-100 flex items-center justify-center mb-6">
        <ShoppingBag className="h-12 w-12 text-sand-400" />
      </div>
      <h2 className="text-heading-4 text-leather-800 mb-2">Sepetiniz Boş</h2>
      <p className="text-body-md text-leather-500 mb-8 max-w-md">
        Sepetinizde henüz ürün bulunmuyor. Hemen alışverişe başlayarak el yapımı
        hakiki deri sandaletlerimizi keşfedin!
      </p>
      <Button asChild className="btn-primary" size="lg">
        <Link href="/kadin">Alışverişe Başla</Link>
      </Button>
    </div>
  );
}

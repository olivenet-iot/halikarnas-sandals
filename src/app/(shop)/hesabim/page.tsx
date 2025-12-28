import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AccountStats, OrderCard } from "@/components/account";
import { Button } from "@/components/ui/button";

export default async function HesabimPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // Fetch stats
  const [orderCount, wishlistCount, addressCount, recentOrders, wishlistItems] =
    await Promise.all([
      db.order.count({ where: { userId } }),
      db.wishlistItem.count({ where: { userId } }),
      db.address.count({ where: { userId } }),
      db.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                    select: { url: true },
                  },
                },
              },
            },
          },
        },
      }),
      db.wishlistItem.findMany({
        where: { userId },
        take: 4,
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              basePrice: true,
              images: {
                where: { isPrimary: true },
                take: 1,
                select: { url: true },
              },
            },
          },
        },
      }),
    ]);

  const userName = session?.user?.name?.split(" ")[0] || "Kullanıcı";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-accent font-semibold text-leather-800">
          Hoş geldin, {userName}!
        </h1>
        <p className="text-leather-500 mt-1">
          Hesabınızı buradan yönetebilirsiniz.
        </p>
      </div>

      {/* Stats */}
      <AccountStats
        orderCount={orderCount}
        wishlistCount={wishlistCount}
        addressCount={addressCount}
      />

      {/* Recent Orders */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-leather-800">
            Son Siparişleriniz
          </h2>
          {orderCount > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/hesabim/siparislerim">
                Tümünü Gör
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          )}
        </div>

        {recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <OrderCard
                key={order.id}
                id={order.id}
                orderNumber={order.orderNumber}
                createdAt={order.createdAt}
                status={order.status as "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"}
                items={order.items.map((item) => ({
                  id: item.id,
                  productName: item.productName,
                  productImage: item.product.images[0]?.url || "",
                  variant: `${item.variantColor || ""} ${item.variantSize}`.trim(),
                  quantity: item.quantity,
                  price: Number(item.unitPrice),
                }))}
                total={Number(order.total)}
                trackingNumber={order.trackingNumber || undefined}
                compact
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-sand-200 p-8 text-center">
            <p className="text-leather-500 mb-4">Henüz siparişiniz bulunmuyor</p>
            <Button asChild>
              <Link href="/kadin">Alışverişe Başla</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Wishlist Preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-leather-800">
            Favorileriniz
          </h2>
          {wishlistCount > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/hesabim/favorilerim">
                Tümünü Gör
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          )}
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {wishlistItems.map((item) => (
              <Link
                key={item.id}
                href={`/urun/${item.product.slug}`}
                className="bg-white rounded-xl border border-sand-200 overflow-hidden hover:border-aegean-300 hover:shadow-soft transition-all group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={item.product.images[0]?.url || "/images/placeholder.jpg"}
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-leather-800 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-aegean-600 font-semibold">
                    {new Intl.NumberFormat("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    }).format(Number(item.product.basePrice))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-sand-200 p-8 text-center">
            <p className="text-leather-500 mb-4">
              Henüz favorilerinize ürün eklemediniz
            </p>
            <Button asChild>
              <Link href="/kadin">Ürünleri Keşfet</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

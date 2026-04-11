import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { ProductCardV2 } from "@/components/shop/ProductCardV2";

export default async function HesabimPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [recentOrders, wishlistItems] = await Promise.all([
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
            sku: true,
            gender: true,
            basePrice: true,
            compareAtPrice: true,
            category: { select: { slug: true } },
            images: {
              take: 2,
              orderBy: { position: "asc" },
              select: { url: true, alt: true },
            },
          },
        },
      },
    }),
  ]);

  const userName = session?.user?.name?.split(" ")[0] || "Kullanıcı";

  return (
    <div>
      {/* Welcome */}
      <div className="pb-8 border-b border-v2-border-subtle">
        <h1 className="font-serif font-light text-3xl md:text-4xl text-v2-text-primary">
          Hoş geldiniz, {userName}
        </h1>
        <p className="text-v2-text-muted font-inter text-sm mt-2">
          Hesabınızı buradan yönetebilirsiniz.
        </p>
      </div>

      {/* Recent Orders */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <span className="font-inter text-xs uppercase tracking-widest text-v2-text-muted">
            SON SİPARİŞLER
          </span>
          {recentOrders.length > 0 && (
            <Link
              href="/hesabim/siparislerim"
              className="font-inter text-xs text-v2-text-muted hover:text-v2-text-primary underline underline-offset-4 transition-colors"
            >
              Tümünü gör &rarr;
            </Link>
          )}
        </div>

        {recentOrders.length > 0 ? (
          <div>
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/hesabim/siparislerim/${order.id}`}
                className="flex items-center justify-between py-4 border-b border-v2-border-subtle hover:bg-v2-bg-primary/50 transition-colors -mx-2 px-2"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-inter text-sm text-v2-text-primary">
                      #{order.orderNumber}
                    </p>
                    <p className="font-inter text-xs text-v2-text-muted mt-0.5">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-inter text-sm text-v2-text-primary">
                    {formatPrice(Number(order.total))}
                  </span>
                  <span className="font-inter text-xs text-v2-text-muted">
                    Detay &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-6">
            <p className="font-inter text-sm text-v2-text-muted">
              Henüz siparişiniz bulunmuyor.
            </p>
            <div className="flex gap-4 mt-3">
              <Link
                href="/kadin"
                className="font-inter text-sm text-v2-text-primary underline underline-offset-4 hover:text-v2-text-muted transition-colors"
              >
                Kadın &rarr;
              </Link>
              <Link
                href="/erkek"
                className="font-inter text-sm text-v2-text-primary underline underline-offset-4 hover:text-v2-text-muted transition-colors"
              >
                Erkek &rarr;
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Wishlist Preview */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <span className="font-inter text-xs uppercase tracking-widest text-v2-text-muted">
            FAVORİLER
          </span>
          {wishlistItems.length > 0 && (
            <Link
              href="/hesabim/favorilerim"
              className="font-inter text-xs text-v2-text-muted hover:text-v2-text-primary underline underline-offset-4 transition-colors"
            >
              Tümünü gör &rarr;
            </Link>
          )}
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <ProductCardV2
                key={item.id}
                id={item.product.id}
                name={item.product.name}
                slug={item.product.slug}
                sku={item.product.sku || ""}
                gender={item.product.gender as "ERKEK" | "KADIN" | "UNISEX" | null}
                price={Number(item.product.basePrice)}
                compareAtPrice={item.product.compareAtPrice ? Number(item.product.compareAtPrice) : null}
                images={item.product.images.map((img) => ({ url: img.url, alt: img.alt || undefined }))}
                categorySlug={item.product.category?.slug || null}
              />
            ))}
          </div>
        ) : (
          <div className="py-6">
            <p className="font-inter text-sm text-v2-text-muted">
              Henüz favoriniz yok.
            </p>
            <Link
              href="/kadin"
              className="font-inter text-sm text-v2-text-primary underline underline-offset-4 hover:text-v2-text-muted transition-colors mt-3 inline-block"
            >
              Ürünleri Keşfet &rarr;
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

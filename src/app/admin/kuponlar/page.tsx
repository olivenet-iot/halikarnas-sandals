import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Plus, Search, Ticket, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteCouponButton } from "@/components/admin/coupons";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 15;

function CouponsTableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

async function CouponsTable({
  search,
  page,
}: {
  search?: string;
  page: number;
}) {
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { code: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [coupons, total] = await Promise.all([
    db.coupon.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    db.coupon.count({ where }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const now = new Date();

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3 font-medium text-gray-500">Kod</th>
              <th className="pb-3 font-medium text-gray-500">İndirim</th>
              <th className="pb-3 font-medium text-gray-500">Kullanım</th>
              <th className="pb-3 font-medium text-gray-500">Geçerlilik</th>
              <th className="pb-3 font-medium text-gray-500">Durum</th>
              <th className="pb-3 font-medium text-gray-500 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => {
              const isExpired = coupon.expiresAt && coupon.expiresAt < now;
              const isNotStarted = coupon.startsAt && coupon.startsAt > now;
              const isLimitReached = coupon.usageLimit && coupon.usageCount >= coupon.usageLimit;

              let statusBadge;
              if (!coupon.isActive) {
                statusBadge = <Badge variant="secondary">Pasif</Badge>;
              } else if (isExpired) {
                statusBadge = <Badge variant="destructive">Süresi Doldu</Badge>;
              } else if (isNotStarted) {
                statusBadge = <Badge variant="outline">Başlamadı</Badge>;
              } else if (isLimitReached) {
                statusBadge = <Badge variant="destructive">Limit Doldu</Badge>;
              } else {
                statusBadge = <Badge variant="default">Aktif</Badge>;
              }

              return (
                <tr key={coupon.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3">
                    <span className="font-mono font-medium text-aegean-600">
                      {coupon.code}
                    </span>
                    {coupon.description && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {coupon.description}
                      </p>
                    )}
                  </td>
                  <td className="py-3 font-medium">
                    {coupon.discountType === "PERCENTAGE"
                      ? `%${Number(coupon.discountValue)}`
                      : formatPrice(Number(coupon.discountValue))}
                    {coupon.maxDiscount && (
                      <p className="text-xs text-gray-500">
                        Maks: {formatPrice(Number(coupon.maxDiscount))}
                      </p>
                    )}
                  </td>
                  <td className="py-3 text-sm">
                    {coupon.usageCount}
                    {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                  </td>
                  <td className="py-3 text-sm text-gray-500">
                    {coupon.startsAt || coupon.expiresAt ? (
                      <>
                        {coupon.startsAt && (
                          <p>
                            Başlangıç:{" "}
                            {new Date(coupon.startsAt).toLocaleDateString("tr-TR")}
                          </p>
                        )}
                        {coupon.expiresAt && (
                          <p>
                            Bitiş:{" "}
                            {new Date(coupon.expiresAt).toLocaleDateString("tr-TR")}
                          </p>
                        )}
                      </>
                    ) : (
                      "Süresiz"
                    )}
                  </td>
                  <td className="py-3">{statusBadge}</td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/kuponlar/${coupon.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteCouponButton couponId={coupon.id} couponCode={coupon.code} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  Kupon bulunamadı
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-gray-500">
            {total} kupondan {(page - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(page * ITEMS_PER_PAGE, total)} gösteriliyor
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/admin/kuponlar?page=${page - 1}${
                    search ? `&search=${search}` : ""
                  }`}
                >
                  Önceki
                </Link>
              </Button>
            )}
            {page < totalPages && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/admin/kuponlar?page=${page + 1}${
                    search ? `&search=${search}` : ""
                  }`}
                >
                  Sonraki
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default async function CouponsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search;
  const page = Number(params.page) || 1;

  // Get active coupon count
  const activeCoupons = await db.coupon.count({
    where: {
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kuponlar</h1>
          <p className="text-gray-500 mt-1">
            <span className="font-medium text-green-600">{activeCoupons}</span> aktif kupon
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/kuponlar/new">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Kupon
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Arama
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="search"
                placeholder="Kupon kodu veya açıklama..."
                defaultValue={search}
                className="pl-10"
              />
            </div>
            <Button type="submit">Ara</Button>
          </form>
        </CardContent>
      </Card>

      {/* Coupons Table */}
      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<CouponsTableSkeleton />}>
            <CouponsTable search={search} page={page} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

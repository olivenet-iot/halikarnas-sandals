import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Search, Filter, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatusBadge } from "@/components/admin/orders";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 15;

function OrdersTableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-8" />
        </div>
      ))}
    </div>
  );
}

async function OrdersTable({
  search,
  status,
  page,
}: {
  search?: string;
  status?: string;
  page: number;
}) {
  // Build where clause
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { shippingName: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } },
      { guestEmail: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && status !== "all") {
    where.status = status;
  }

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    db.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3 font-medium text-gray-500">Sipariş No</th>
              <th className="pb-3 font-medium text-gray-500">Müşteri</th>
              <th className="pb-3 font-medium text-gray-500">Ürün</th>
              <th className="pb-3 font-medium text-gray-500">Tutar</th>
              <th className="pb-3 font-medium text-gray-500">Durum</th>
              <th className="pb-3 font-medium text-gray-500">Tarih</th>
              <th className="pb-3 font-medium text-gray-500 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-3">
                  <Link
                    href={`/admin/siparisler/${order.id}`}
                    className="font-mono text-sm text-aegean-600 hover:underline"
                  >
                    #{order.orderNumber}
                  </Link>
                </td>
                <td className="py-3">
                  <div>
                    <p className="font-medium">
                      {order.user?.name || order.shippingName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.user?.email || order.guestEmail || "-"}
                    </p>
                  </div>
                </td>
                <td className="py-3 text-sm text-gray-600">
                  {order.items.length} ürün
                </td>
                <td className="py-3 font-medium">
                  {formatPrice(Number(order.total))}
                </td>
                <td className="py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="py-3 text-sm text-gray-500">
                  {formatDistanceToNow(new Date(order.createdAt), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </td>
                <td className="py-3 text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/siparisler/${order.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  Sipariş bulunamadı
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
            {total} siparişten {(page - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(page * ITEMS_PER_PAGE, total)} gösteriliyor
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/admin/siparisler?page=${page - 1}${
                    search ? `&search=${search}` : ""
                  }${status ? `&status=${status}` : ""}`}
                >
                  Önceki
                </Link>
              </Button>
            )}
            {page < totalPages && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/admin/siparisler?page=${page + 1}${
                    search ? `&search=${search}` : ""
                  }${status ? `&status=${status}` : ""}`}
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

export default async function OrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search;
  const status = params.status;
  const page = Number(params.page) || 1;

  // Get status counts
  const statusCounts = await db.order.groupBy({
    by: ["status"],
    _count: true,
  });

  const pendingCount = statusCounts.find((s) => s.status === "PENDING")?._count || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Siparişler</h1>
          <p className="text-gray-500 mt-1">
            {pendingCount > 0 && (
              <span className="text-orange-600 font-medium">
                {pendingCount} bekleyen sipariş
              </span>
            )}
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Dışa Aktar
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtreler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="search"
                placeholder="Sipariş no, müşteri adı veya email..."
                defaultValue={search}
                className="pl-10"
              />
            </div>
            <Select name="status" defaultValue={status || "all"}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="PENDING">Bekliyor</SelectItem>
                <SelectItem value="CONFIRMED">Onaylandı</SelectItem>
                <SelectItem value="PROCESSING">Hazırlanıyor</SelectItem>
                <SelectItem value="SHIPPED">Kargoda</SelectItem>
                <SelectItem value="DELIVERED">Teslim Edildi</SelectItem>
                <SelectItem value="CANCELLED">İptal</SelectItem>
                <SelectItem value="REFUNDED">İade</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Filtrele</Button>
          </form>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<OrdersTableSkeleton />}>
            <OrdersTable search={search} status={status} page={page} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

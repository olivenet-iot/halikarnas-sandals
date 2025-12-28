import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Stats card type
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  href?: string;
}

function StatCard({ title, value, change, icon, href }: StatCardProps) {
  const content = (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <div className="h-9 w-9 rounded-lg bg-leather-100 flex items-center justify-center text-leather-700">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p
            className={`text-xs flex items-center mt-1 ${
              change >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {change >= 0 ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {Math.abs(change)}% geçen aya göre
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

// Order status badge
const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Beklemede", variant: "secondary" },
  PROCESSING: { label: "Hazırlanıyor", variant: "default" },
  SHIPPED: { label: "Kargoda", variant: "default" },
  DELIVERED: { label: "Teslim Edildi", variant: "outline" },
  CANCELLED: { label: "İptal", variant: "destructive" },
};

export default async function AdminDashboardPage() {
  // Get current month dates
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Fetch stats in parallel
  const [
    totalProducts,
    totalOrders,
    totalUsers,
    monthlyRevenue,
    lastMonthRevenue,
    pendingOrders,
    recentOrders,
    monthlyOrders,
  ] = await Promise.all([
    // Total active products
    db.product.count({ where: { status: "ACTIVE" } }),

    // Total orders
    db.order.count(),

    // Total users
    db.user.count(),

    // This month's revenue
    db.order.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
        status: { not: "CANCELLED" },
      },
      _sum: { total: true },
    }),

    // Last month's revenue
    db.order.aggregate({
      where: {
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        status: { not: "CANCELLED" },
      },
      _sum: { total: true },
    }),

    // Pending orders
    db.order.count({ where: { status: "PENDING" } }),

    // Recent orders (last 5)
    db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    }),

    // This month's order count
    db.order.count({
      where: { createdAt: { gte: startOfMonth } },
    }),
  ]);

  // Calculate revenue change percentage
  const currentRevenue = Number(monthlyRevenue._sum.total || 0);
  const previousRevenue = Number(lastMonthRevenue._sum.total || 0);
  const revenueChange = previousRevenue > 0
    ? Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100)
    : 0;

  // Get last 7 days sales for chart
  const last7Days = await db.order.groupBy({
    by: ["createdAt"],
    where: {
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      status: { not: "CANCELLED" },
    },
    _sum: { total: true },
    _count: true,
  });

  // Process chart data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
    const dateStr = date.toLocaleDateString("tr-TR", { weekday: "short" });
    const dayOrders = last7Days.filter(
      (o) => new Date(o.createdAt).toDateString() === date.toDateString()
    );
    const total = dayOrders.reduce((sum, o) => sum + Number(o._sum.total || 0), 0);
    return { day: dateStr, total };
  });

  const maxChartValue = Math.max(...chartData.map((d) => d.total), 1);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Mağazanızın genel durumuna göz atın
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Gelir"
          value={formatPrice(currentRevenue)}
          change={revenueChange}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="Siparişler"
          value={monthlyOrders}
          icon={<ShoppingCart className="h-5 w-5" />}
          href="/admin/siparisler"
        />
        <StatCard
          title="Ürünler"
          value={totalProducts}
          icon={<Package className="h-5 w-5" />}
          href="/admin/urunler"
        />
        <StatCard
          title="Kullanıcılar"
          value={totalUsers}
          icon={<Users className="h-5 w-5" />}
          href="/admin/kullanicilar"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Son 7 Günlük Satışlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2">
              {chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-t relative flex-1 flex items-end">
                    <div
                      className="w-full bg-aegean-500 rounded-t transition-all duration-300"
                      style={{
                        height: `${(data.total / maxChartValue) * 100}%`,
                        minHeight: data.total > 0 ? "8px" : "0",
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{data.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Hızlı İstatistikler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Bekleyen Siparişler</span>
              <Badge variant="secondary">{pendingOrders}</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Toplam Siparişler</span>
              <span className="font-semibold">{totalOrders}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Bu Ay Gelir</span>
              <span className="font-semibold">{formatPrice(currentRevenue)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Aktif Ürünler</span>
              <span className="font-semibold">{totalProducts}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Son Siparişler</CardTitle>
          <Link
            href="/admin/siparisler"
            className="text-sm text-aegean-600 hover:text-aegean-700"
          >
            Tümünü Gör →
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-gray-500">Sipariş No</th>
                  <th className="pb-3 font-medium text-gray-500">Müşteri</th>
                  <th className="pb-3 font-medium text-gray-500">Ürünler</th>
                  <th className="pb-3 font-medium text-gray-500">Tutar</th>
                  <th className="pb-3 font-medium text-gray-500">Durum</th>
                  <th className="pb-3 font-medium text-gray-500">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const status = statusMap[order.status] || {
                    label: order.status,
                    variant: "secondary" as const,
                  };
                  return (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3">
                        <Link
                          href={`/admin/siparisler/${order.id}`}
                          className="text-aegean-600 hover:underline font-mono text-sm"
                        >
                          #{order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{order.user?.name || "Misafir"}</p>
                          <p className="text-xs text-gray-500">
                            {order.user?.email || "-"}
                          </p>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-gray-600">
                          {order.items.length} ürün
                        </span>
                      </td>
                      <td className="py-3 font-medium">
                        {formatPrice(Number(order.total))}
                      </td>
                      <td className="py-3">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="py-3 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                    </tr>
                  );
                })}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      Henüz sipariş bulunmuyor
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

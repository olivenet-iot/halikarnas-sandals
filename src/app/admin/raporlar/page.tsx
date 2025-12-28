"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Package,
  Users,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ReportType = "sales" | "products" | "customers" | "inventory";
type DateRange = "7d" | "30d" | "90d" | "1y";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("sales");
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType, dateRange]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: reportType,
        range: dateRange,
      });

      const res = await fetch(`/api/admin/reports?${params}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "sales", label: "Satışlar", icon: TrendingUp },
    { id: "products", label: "Ürünler", icon: Package },
    { id: "customers", label: "Müşteriler", icon: Users },
    { id: "inventory", label: "Stok", icon: BarChart3 },
  ];

  const dateRanges = [
    { id: "7d", label: "Son 7 Gün" },
    { id: "30d", label: "Son 30 Gün" },
    { id: "90d", label: "Son 90 Gün" },
    { id: "1y", label: "Son 1 Yıl" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Raporlar</h1>
          <p className="text-sm text-gray-500 mt-1">
            Satış, ürün ve müşteri analitiklerini görüntüleyin
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchReport}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Yenile
          </Button>
          <Link href="/api/admin/products/export">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Dışa Aktar
            </Button>
          </Link>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as ReportType)}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm
              ${
                reportType === tab.id
                  ? "bg-white shadow text-aegean-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-4">
        <Calendar className="w-4 h-4 text-gray-400" />
        <div className="flex gap-2">
          {dateRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setDateRange(range.id as DateRange)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors
                ${
                  dateRange === range.id
                    ? "bg-aegean-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        data && (
          <>
            {reportType === "sales" && <SalesReport data={data} />}
            {reportType === "products" && <ProductsReport data={data} />}
            {reportType === "customers" && <CustomersReport data={data} />}
            {reportType === "inventory" && <InventoryReport data={data} />}
          </>
        )
      )}
    </div>
  );
}

import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SalesReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Toplam Satış</p>
          <p className="text-2xl font-semibold">
            ₺{data.totalRevenue?.toLocaleString("tr-TR")}
          </p>
          <p
            className={`text-xs ${Number(data.revenueGrowth) >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {Number(data.revenueGrowth) >= 0 ? "↑" : "↓"} {data.revenueGrowth}%
            önceki döneme göre
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Sipariş Sayısı</p>
          <p className="text-2xl font-semibold">{data.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Ortalama Sipariş</p>
          <p className="text-2xl font-semibold">
            ₺{data.avgOrderValue?.toLocaleString("tr-TR")}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Dönüşüm Oranı</p>
          <p className="text-2xl font-semibold">{data.conversionRate}%</p>
        </div>
      </div>

      {/* Sales Trend */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-medium mb-4">Satış Trendi</h3>
        {data.salesTrend?.length > 0 ? (
          <div className="h-64 flex items-end gap-1">
            {data.salesTrend.map(
              (day: { date: string; revenue: number }, i: number) => {
                const maxRevenue = Math.max(
                  ...data.salesTrend.map((d: { revenue: number }) => d.revenue)
                );
                const height = (day.revenue / maxRevenue) * 100;
                return (
                  <div
                    key={i}
                    className="flex-1 bg-aegean-500 rounded-t hover:bg-aegean-600 transition-colors group relative"
                    style={{ height: `${height}%`, minHeight: "4px" }}
                    title={`${day.date}: ₺${day.revenue.toLocaleString("tr-TR")}`}
                  >
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      ₺{day.revenue.toLocaleString("tr-TR")}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Bu dönemde satış verisi yok
          </p>
        )}
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-medium">En Çok Satan Ürünler</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-600">
                Ürün
              </th>
              <th className="p-3 text-right text-sm font-medium text-gray-600">
                Satış Adedi
              </th>
              <th className="p-3 text-right text-sm font-medium text-gray-600">
                Gelir
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.topProducts?.map(
              (
                product: { name: string; quantity: number; revenue: number },
                i: number
              ) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3 text-right">{product.quantity}</td>
                  <td className="p-3 text-right">
                    ₺{product.revenue?.toLocaleString("tr-TR")}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        {(!data.topProducts || data.topProducts.length === 0) && (
          <p className="p-8 text-center text-gray-500">
            Bu dönemde satış verisi yok
          </p>
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProductsReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-4">
        <p className="text-sm text-gray-500">Aktif Ürün Sayısı</p>
        <p className="text-2xl font-semibold">{data.totalProducts}</p>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-medium">En Çok Satan Ürünler</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-600">
                Ürün
              </th>
              <th className="p-3 text-right text-sm font-medium text-gray-600">
                Satış
              </th>
              <th className="p-3 text-right text-sm font-medium text-gray-600">
                Görüntüleme
              </th>
              <th className="p-3 text-right text-sm font-medium text-gray-600">
                Stok
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.topProducts?.map(
              (
                product: {
                  name: string;
                  soldCount: number;
                  viewCount: number;
                  totalStock: number;
                },
                i: number
              ) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3 text-right">{product.soldCount}</td>
                  <td className="p-3 text-right">{product.viewCount}</td>
                  <td className="p-3 text-right">{product.totalStock}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomersReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Yeni Müşteri</p>
          <p className="text-2xl font-semibold">{data.newCustomers}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Toplam Müşteri</p>
          <p className="text-2xl font-semibold">{data.totalCustomers}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Sipariş Veren</p>
          <p className="text-2xl font-semibold">{data.customersWithOrders}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Tekrar Alışveriş</p>
          <p className="text-2xl font-semibold">{data.repeatRate}%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-medium">En Değerli Müşteriler</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-600">
                Müşteri
              </th>
              <th className="p-3 text-right text-sm font-medium text-gray-600">
                Sipariş Sayısı
              </th>
              <th className="p-3 text-right text-sm font-medium text-gray-600">
                Toplam Harcama
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.topCustomers?.map(
              (
                customer: {
                  name: string;
                  email: string;
                  orderCount: number;
                  totalSpent: number;
                },
                i: number
              ) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-3">
                    <div>{customer.name}</div>
                    <div className="text-xs text-gray-500">{customer.email}</div>
                  </td>
                  <td className="p-3 text-right">{customer.orderCount}</td>
                  <td className="p-3 text-right">
                    ₺{customer.totalSpent?.toLocaleString("tr-TR")}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InventoryReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Toplam Ürün</p>
          <p className="text-2xl font-semibold">{data.totalProducts}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Toplam Varyant</p>
          <p className="text-2xl font-semibold">{data.totalVariants}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Düşük Stok</p>
          <p className="text-2xl font-semibold text-yellow-600">
            {data.lowStock}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Tükenen</p>
          <p className="text-2xl font-semibold text-red-600">
            {data.outOfStock}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-medium">Kritik Stok Ürünleri</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-600">
                SKU
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">
                Ürün
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">
                Varyant
              </th>
              <th className="p-3 text-right text-sm font-medium text-gray-600">
                Stok
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.lowStockItems?.map(
              (
                item: {
                  sku: string;
                  productName: string;
                  color: string;
                  size: string;
                  stock: number;
                },
                i: number
              ) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{item.sku}</td>
                  <td className="p-3">{item.productName}</td>
                  <td className="p-3 text-gray-600">
                    {item.color} / {item.size}
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs font-medium
                      ${item.stock === 0 ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {item.stock}
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

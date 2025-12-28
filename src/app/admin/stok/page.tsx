"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Save,
  Download,
  AlertTriangle,
  Package,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VariantStock {
  id: string;
  sku: string;
  productName: string;
  productSlug: string;
  color: string;
  size: string;
  stock: number;
}

type FilterType = "all" | "low" | "out";

export default function StockManagementPage() {
  const [variants, setVariants] = useState<VariantStock[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [changes, setChanges] = useState<Map<string, number>>(new Map());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVariants();
  }, [filter]);

  const fetchVariants = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/inventory?filter=${filter}`);
      if (!res.ok) {
        console.error("API error:", res.status);
        setVariants([]);
        return;
      }
      const data = await res.json();
      setVariants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch variants:", error);
      setVariants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (id: string, newStock: number) => {
    const variant = variants.find((v) => v.id === id);
    if (!variant) return;

    const newChanges = new Map(changes);
    if (newStock === variant.stock) {
      newChanges.delete(id);
    } else {
      newChanges.set(id, newStock);
    }
    setChanges(newChanges);
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const updates = Array.from(changes.entries()).map(([id, stock]) => ({
        id,
        stock,
      }));

      const res = await fetch("/api/admin/inventory/bulk-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (res.ok) {
        setChanges(new Map());
        fetchVariants();
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
    } finally {
      setSaving(false);
    }
  };

  const filteredVariants = variants.filter(
    (v) =>
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      v.productName.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = variants.filter((v) => v.stock > 0 && v.stock < 10).length;
  const outOfStockCount = variants.filter((v) => v.stock === 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Stok Yönetimi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tüm ürün varyantlarının stok durumunu görüntüleyin ve güncelleyin
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchVariants}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Yenile
          </Button>
          <Link href="/api/admin/products/export">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Stok Raporu
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{variants.length}</p>
              <p className="text-sm text-gray-500">Toplam Varyant</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{lowStockCount}</p>
              <p className="text-sm text-gray-500">Düşük Stok</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Package className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{outOfStockCount}</p>
              <p className="text-sm text-gray-500">Tükenen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="SKU veya ürün adı ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className="px-4 py-2 border rounded-lg bg-white text-sm"
        >
          <option value="all">Tüm Ürünler</option>
          <option value="low">Düşük Stok (&lt;10)</option>
          <option value="out">Tükenen (0)</option>
        </select>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">Yükleniyor...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-600">
                  SKU
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">
                  Ürün
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">
                  Renk
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">
                  Beden
                </th>
                <th className="p-3 text-center text-sm font-medium text-gray-600">
                  Mevcut Stok
                </th>
                <th className="p-3 text-center text-sm font-medium text-gray-600">
                  Yeni Stok
                </th>
                <th className="p-3 text-center text-sm font-medium text-gray-600">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredVariants.map((variant) => {
                const hasChange = changes.has(variant.id);
                const newStock = changes.get(variant.id) ?? variant.stock;

                return (
                  <tr
                    key={variant.id}
                    className={hasChange ? "bg-yellow-50" : "hover:bg-gray-50"}
                  >
                    <td className="p-3 font-mono text-sm text-gray-600">
                      {variant.sku}
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/admin/urunler/${variant.productSlug}`}
                        className="text-aegean-600 hover:underline"
                      >
                        {variant.productName}
                      </Link>
                    </td>
                    <td className="p-3 text-gray-600">{variant.color}</td>
                    <td className="p-3 text-gray-600">{variant.size}</td>
                    <td className="p-3 text-center text-gray-900">
                      {variant.stock}
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        value={newStock}
                        onChange={(e) =>
                          handleStockChange(
                            variant.id,
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-20 text-center px-2 py-1 border rounded mx-auto block"
                      />
                    </td>
                    <td className="p-3 text-center">
                      {variant.stock === 0 ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Tükendi
                        </span>
                      ) : variant.stock < 10 ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          Düşük
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Yeterli
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {!loading && filteredVariants.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            {search
              ? "Arama sonucu bulunamadı"
              : "Henüz ürün varyantı bulunmuyor"}
          </div>
        )}
      </div>

      {/* Save Bar */}
      {changes.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between shadow-lg z-50">
          <span className="text-sm text-gray-600">
            <strong>{changes.size}</strong> değişiklik bekliyor
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setChanges(new Map())}>
              İptal
            </Button>
            <Button onClick={saveChanges} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </Button>
          </div>
        </div>
      )}

      {/* Padding for fixed save bar */}
      {changes.size > 0 && <div className="h-20" />}
    </div>
  );
}

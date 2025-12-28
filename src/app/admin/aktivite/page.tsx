"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  User,
  Package,
  ShoppingCart,
  Settings,
  RefreshCw,
  Tag,
  FileText,
  Layers,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface ActivityItem {
  id: string;
  action: string;
  entity: string | null;
  entityId: string | null;
  details: string | null;
  user: { name: string; email: string };
  ipAddress: string | null;
  createdAt: string;
}

const ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  PRODUCT: Package,
  ORDER: ShoppingCart,
  USER: User,
  SETTINGS: Settings,
  CATEGORY: Tag,
  COLLECTION: Layers,
  PAGE: FileText,
  STOCK: Package,
  BULK: Package,
  DEFAULT: Activity,
};

const ACTION_COLORS: Record<string, string> = {
  CREATE: "text-green-600 bg-green-50",
  UPDATE: "text-blue-600 bg-blue-50",
  DELETE: "text-red-600 bg-red-50",
  IMPORT: "text-purple-600 bg-purple-50",
  EXPORT: "text-indigo-600 bg-indigo-50",
  DEFAULT: "text-gray-600 bg-gray-50",
};

const ACTION_TRANSLATIONS: Record<string, string> = {
  PRODUCT_CREATE: "Ürün oluşturuldu",
  PRODUCT_UPDATE: "Ürün güncellendi",
  PRODUCT_DELETE: "Ürün silindi",
  PRODUCT_BULK_IMPORT: "Toplu ürün içe aktarıldı",
  PRODUCT_EXPORT: "Ürünler dışa aktarıldı",
  ORDER_CREATE: "Sipariş oluşturuldu",
  ORDER_UPDATE: "Sipariş güncellendi",
  ORDER_STATUS_CHANGE: "Sipariş durumu değişti",
  ORDER_CANCEL: "Sipariş iptal edildi",
  STOCK_UPDATE: "Stok güncellendi",
  BULK_STOCK_UPDATE: "Toplu stok güncellendi",
  USER_CREATE: "Kullanıcı oluşturuldu",
  USER_UPDATE: "Kullanıcı güncellendi",
  USER_DELETE: "Kullanıcı silindi",
  CATEGORY_CREATE: "Kategori oluşturuldu",
  CATEGORY_UPDATE: "Kategori güncellendi",
  CATEGORY_DELETE: "Kategori silindi",
  COLLECTION_CREATE: "Koleksiyon oluşturuldu",
  COLLECTION_UPDATE: "Koleksiyon güncellendi",
  COLLECTION_DELETE: "Koleksiyon silindi",
  SETTINGS_UPDATE: "Ayarlar güncellendi",
  COUPON_CREATE: "Kupon oluşturuldu",
  COUPON_UPDATE: "Kupon güncellendi",
  COUPON_DELETE: "Kupon silindi",
  BANNER_CREATE: "Banner oluşturuldu",
  BANNER_UPDATE: "Banner güncellendi",
  BANNER_DELETE: "Banner silindi",
  PAGE_CREATE: "Sayfa oluşturuldu",
  PAGE_UPDATE: "Sayfa güncellendi",
  PAGE_DELETE: "Sayfa silindi",
  ADMIN_LOGIN: "Admin girişi",
  ADMIN_LOGOUT: "Admin çıkışı",
};

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        filter,
        page: page.toString(),
      });
      const res = await fetch(`/api/admin/activity?${params}`);
      if (!res.ok) {
        console.error("API error:", res.status);
        setActivities([]);
        setTotalPages(1);
        return;
      }
      const data = await res.json();
      setActivities(Array.isArray(data.activities) ? data.activities : []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      setActivities([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (action: string) => {
    const entity = action.split("_")[0];
    return ACTION_ICONS[entity] || ACTION_ICONS.DEFAULT;
  };

  const getColor = (action: string) => {
    const parts = action.split("_");
    const type = parts[parts.length - 1];
    return ACTION_COLORS[type] || ACTION_COLORS.DEFAULT;
  };

  const formatAction = (action: string) => {
    return ACTION_TRANSLATIONS[action] || action;
  };

  const filters = [
    { value: "", label: "Tüm Aktiviteler" },
    { value: "PRODUCT", label: "Ürün İşlemleri" },
    { value: "ORDER", label: "Sipariş İşlemleri" },
    { value: "USER", label: "Kullanıcı İşlemleri" },
    { value: "STOCK", label: "Stok İşlemleri" },
    { value: "SETTINGS", label: "Ayar Değişiklikleri" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Aktivite Günlüğü
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sistemdeki tüm işlemlerin kaydı
          </p>
        </div>
        <Button variant="outline" onClick={fetchActivities}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Yenile
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setFilter(f.value);
              setPage(1);
            }}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors
              ${
                filter === f.value
                  ? "bg-aegean-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-lg border divide-y">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          </div>
        ) : activities.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Aktivite kaydı bulunamadı
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = getIcon(activity.action);
            const colorClass = getColor(activity.action);

            return (
              <div
                key={activity.id}
                className="p-4 flex items-start gap-4 hover:bg-gray-50"
              >
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span>
                    {" - "}
                    {formatAction(activity.action)}
                  </p>
                  {activity.details && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {activity.details}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(activity.createdAt), {
                        addSuffix: true,
                        locale: tr,
                      })}
                    </p>
                    {activity.ipAddress && (
                      <p className="text-xs text-gray-400">
                        IP: {activity.ipAddress}
                      </p>
                    )}
                  </div>
                </div>
                {activity.entityId && activity.entity && (
                  <a
                    href={`/admin/${activity.entity.toLowerCase()}/${activity.entityId}`}
                    className="text-xs text-aegean-600 hover:underline"
                  >
                    Görüntüle
                  </a>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Önceki
          </Button>
          <span className="text-sm text-gray-600">
            Sayfa {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Sonraki
          </Button>
        </div>
      )}
    </div>
  );
}

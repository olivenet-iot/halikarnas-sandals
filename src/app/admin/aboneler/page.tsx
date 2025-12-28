"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Trash2,
  RefreshCw,
  Mail,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  source: string | null;
  isActive: boolean;
  createdAt: string;
}

type StatusFilter = "all" | "active" | "inactive";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0 });

  useEffect(() => {
    fetchSubscribers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: statusFilter,
      });
      const res = await fetch(`/api/admin/subscribers?${params}`);
      if (!res.ok) {
        console.error("API error:", res.status);
        setSubscribers([]);
        setStats({ total: 0, active: 0 });
        return;
      }
      const data = await res.json();
      setSubscribers(Array.isArray(data.subscribers) ? data.subscribers : []);
      setStats({ total: data.total || 0, active: data.active || 0 });
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
      setSubscribers([]);
      setStats({ total: 0, active: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu aboneyi silmek istediğinize emin misiniz?")) return;

    try {
      await fetch(`/api/admin/subscribers?id=${id}`, {
        method: "DELETE",
      });
      fetchSubscribers();
    } catch (error) {
      console.error("Failed to delete subscriber:", error);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await fetch("/api/admin/subscribers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      fetchSubscribers();
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  const exportCSV = () => {
    window.location.href = "/api/admin/subscribers?format=csv";
  };

  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Newsletter Aboneleri
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            E-posta bültenine kayıtlı kullanıcıları yönetin
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSubscribers}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Yenile
          </Button>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            CSV İndir
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.total}</p>
              <p className="text-sm text-gray-500">Toplam Abone</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ToggleRight className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.active}</p>
              <p className="text-sm text-gray-500">Aktif</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ToggleLeft className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {stats.total - stats.active}
              </p>
              <p className="text-sm text-gray-500">Pasif</p>
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
            placeholder="E-posta ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="px-4 py-2 border rounded-lg bg-white text-sm"
        >
          <option value="all">Tüm Aboneler</option>
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
        </select>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-600">
                  E-posta
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">
                  İsim
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">
                  Kaynak
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">
                  Kayıt Tarihi
                </th>
                <th className="p-3 text-center text-sm font-medium text-gray-600">
                  Durum
                </th>
                <th className="p-3 text-center text-sm font-medium text-gray-600">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <a
                      href={`mailto:${subscriber.email}`}
                      className="text-aegean-600 hover:underline"
                    >
                      {subscriber.email}
                    </a>
                  </td>
                  <td className="p-3 text-gray-600">
                    {subscriber.name || "-"}
                  </td>
                  <td className="p-3">
                    {subscriber.source && (
                      <span className="inline-flex px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                        {subscriber.source}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-gray-500 text-sm">
                    {formatDistanceToNow(new Date(subscriber.createdAt), {
                      addSuffix: true,
                      locale: tr,
                    })}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        handleToggleStatus(subscriber.id, subscriber.isActive)
                      }
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                        ${
                          subscriber.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {subscriber.isActive ? (
                        <>
                          <ToggleRight className="w-3 h-3" /> Aktif
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-3 h-3" /> Pasif
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(subscriber.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredSubscribers.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            {search ? "Arama sonucu bulunamadı" : "Henüz abone bulunmuyor"}
          </div>
        )}
      </div>
    </div>
  );
}

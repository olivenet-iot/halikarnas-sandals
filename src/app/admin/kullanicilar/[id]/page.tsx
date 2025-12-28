"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Calendar,
  Shield,
  Loader2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { OrderStatusBadge } from "@/components/admin/orders";

interface Address {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string | null;
  isDefault: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { id: string }[];
}

interface UserData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  addresses: Address[];
  orders: Order[];
  _count: {
    orders: number;
    reviews: number;
  };
}

const ROLE_OPTIONS = [
  { value: "CUSTOMER", label: "Müşteri" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Süper Admin" },
];

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const userId = params.id as string;

  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) throw new Error("Kullanıcı bulunamadı");
      const data = await res.json();
      setUser(data.user);
      setNewRole(data.user.role);
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
      router.push("/admin/kullanicilar");
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = async () => {
    if (!user || newRole === user.role) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error("Rol güncellenemedi");

      toast({ title: "Kullanıcı rolü güncellendi" });
      fetchUser();
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Kullanıcı bulunamadı</p>
      </div>
    );
  }

  const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/kullanicilar">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-aegean-100 flex items-center justify-center text-aegean-700 text-2xl font-medium">
            {user.name ? user.name[0].toUpperCase() : "?"}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name || "İsimsiz"}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Kullanıcı Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {user.phone || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kayıt Tarihi</p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Toplam Sipariş</p>
                  <p className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    {user._count.orders} sipariş
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adresler
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.addresses.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  Kayıtlı adres yok
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {user.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-4 border rounded-lg relative"
                    >
                      {address.isDefault && (
                        <Badge className="absolute top-2 right-2" variant="secondary">
                          Varsayılan
                        </Badge>
                      )}
                      <p className="font-medium">{address.title}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.firstName} {address.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{address.address}</p>
                      <p className="text-sm text-gray-600">
                        {address.district} / {address.city}
                        {address.postalCode && ` ${address.postalCode}`}
                      </p>
                      <p className="text-sm text-gray-600">{address.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Son Siparişler
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.orders.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  Henüz sipariş yok
                </p>
              ) : (
                <div className="space-y-3">
                  {user.orders.slice(0, 10).map((order) => (
                    <Link
                      key={order.id}
                      href={`/admin/siparisler/${order.id}`}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-mono text-sm text-aegean-600">
                            #{order.orderNumber}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.items.length} ürün
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <OrderStatusBadge status={order.status} />
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(order.total)}</p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(order.createdAt), {
                              addSuffix: true,
                              locale: tr,
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-500">Toplam Harcama</p>
                <p className="text-2xl font-bold text-aegean-600">
                  {formatPrice(totalSpent)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-500">Değerlendirme</p>
                <p className="text-2xl font-bold">{user._count.reviews}</p>
              </CardContent>
            </Card>
          </div>

          {/* Role Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Rol Yönetimi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Kullanıcı Rolü</Label>
                <Select
                  value={newRole}
                  onValueChange={setNewRole}
                  disabled={isSaving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rol seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {newRole !== user.role && (
                <Button
                  className="w-full"
                  onClick={updateRole}
                  disabled={isSaving}
                >
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <Save className="h-4 w-4 mr-2" />
                  Rolü Güncelle
                </Button>
              )}
              <Separator />
              <p className="text-xs text-gray-500">
                <strong>Müşteri:</strong> Normal site kullanıcısı
                <br />
                <strong>Admin:</strong> Ürün ve sipariş yönetimi
                <br />
                <strong>Süper Admin:</strong> Tüm yetkilere sahip
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`mailto:${user.email}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email Gönder
                </Link>
              </Button>
              {user.phone && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`tel:${user.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Ara
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

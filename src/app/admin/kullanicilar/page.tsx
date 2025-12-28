import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Search, Users, Eye, ShieldCheck, ShieldAlert } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    role?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 20;

const ROLE_CONFIG = {
  CUSTOMER: { label: "Müşteri", variant: "secondary" as const },
  ADMIN: { label: "Admin", variant: "default" as const },
  SUPER_ADMIN: { label: "Süper Admin", variant: "destructive" as const },
};

function UserRoleBadge({ role }: { role: string }) {
  const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] || {
    label: role,
    variant: "secondary" as const,
  };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function UsersTableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8" />
        </div>
      ))}
    </div>
  );
}

async function UsersTable({
  search,
  role,
  page,
}: {
  search?: string;
  role?: string;
  page: number;
}) {
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role && role !== "all") {
    where.role = role;
  }

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    db.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3 font-medium text-gray-500">Kullanıcı</th>
              <th className="pb-3 font-medium text-gray-500">Email</th>
              <th className="pb-3 font-medium text-gray-500">Telefon</th>
              <th className="pb-3 font-medium text-gray-500">Rol</th>
              <th className="pb-3 font-medium text-gray-500">Sipariş</th>
              <th className="pb-3 font-medium text-gray-500">Kayıt</th>
              <th className="pb-3 font-medium text-gray-500 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-aegean-100 flex items-center justify-center text-aegean-700 font-medium">
                      {user.name ? user.name[0].toUpperCase() : "?"}
                    </div>
                    <span className="font-medium">{user.name || "-"}</span>
                  </div>
                </td>
                <td className="py-3 text-sm text-gray-600">{user.email}</td>
                <td className="py-3 text-sm text-gray-600">{user.phone || "-"}</td>
                <td className="py-3">
                  <UserRoleBadge role={user.role} />
                </td>
                <td className="py-3 text-sm">{user._count.orders}</td>
                <td className="py-3 text-sm text-gray-500">
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </td>
                <td className="py-3 text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/kullanicilar/${user.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  Kullanıcı bulunamadı
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
            {total} kullanıcıdan {(page - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(page * ITEMS_PER_PAGE, total)} gösteriliyor
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/admin/kullanicilar?page=${page - 1}${
                    search ? `&search=${search}` : ""
                  }${role ? `&role=${role}` : ""}`}
                >
                  Önceki
                </Link>
              </Button>
            )}
            {page < totalPages && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/admin/kullanicilar?page=${page + 1}${
                    search ? `&search=${search}` : ""
                  }${role ? `&role=${role}` : ""}`}
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

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search;
  const role = params.role;
  const page = Number(params.page) || 1;

  // Get role counts
  const roleCounts = await db.user.groupBy({
    by: ["role"],
    _count: true,
  });

  const adminCount = roleCounts.find((r) => r.role === "ADMIN")?._count || 0;
  const superAdminCount = roleCounts.find((r) => r.role === "SUPER_ADMIN")?._count || 0;
  const totalUsers = roleCounts.reduce((sum, r) => sum + r._count, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kullanıcılar</h1>
          <p className="text-gray-500 mt-1">
            <span className="font-medium">{totalUsers}</span> kayıtlı kullanıcı
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ShieldCheck className="h-4 w-4 text-blue-500" />
            <span>{adminCount} Admin</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            <span>{superAdminCount} Süper Admin</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Filtreler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="search"
                placeholder="Ad, email veya telefon..."
                defaultValue={search}
                className="pl-10"
              />
            </div>
            <Select name="role" defaultValue={role || "all"}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Roller</SelectItem>
                <SelectItem value="CUSTOMER">Müşteri</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPER_ADMIN">Süper Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Filtrele</Button>
          </form>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<UsersTableSkeleton />}>
            <UsersTable search={search} role={role} page={page} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

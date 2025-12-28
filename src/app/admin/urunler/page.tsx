import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { formatPrice, getProductUrl } from "@/lib/utils";
import { Plus, Search, Filter, MoreHorizontal, Edit, Eye } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductsTableSkeleton } from "./loading";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 10;

async function ProductsTable({
  search,
  category,
  status,
  page,
}: {
  search?: string;
  category?: string;
  status?: string;
  page: number;
}) {
  // Build where clause
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category && category !== "all") {
    where.categoryId = category;
  }

  if (status === "active") {
    where.status = "ACTIVE";
  } else if (status === "draft") {
    where.status = "DRAFT";
  } else if (status === "archived") {
    where.status = "ARCHIVED";
  }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
        variants: { select: { id: true, stock: true } },
        images: { take: 1, orderBy: { position: "asc" } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    db.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3 font-medium text-gray-500">Ürün</th>
              <th className="pb-3 font-medium text-gray-500">SKU</th>
              <th className="pb-3 font-medium text-gray-500">Kategori</th>
              <th className="pb-3 font-medium text-gray-500">Fiyat</th>
              <th className="pb-3 font-medium text-gray-500">Stok</th>
              <th className="pb-3 font-medium text-gray-500">Durum</th>
              <th className="pb-3 font-medium text-gray-500 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const totalStock = product.variants.reduce(
                (sum, v) => sum + v.stock,
                0
              );
              const image = product.images[0];

              return (
                <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {image ? (
                          <Image
                            src={image.url}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                            Yok
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          {product.variants.length} varyant
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                      {product.sku || "-"}
                    </code>
                  </td>
                  <td className="py-3 text-sm text-gray-600">
                    {product.category?.name || "-"}
                  </td>
                  <td className="py-3">
                    <div>
                      <p className="font-medium">{formatPrice(Number(product.basePrice))}</p>
                      {product.compareAtPrice && (
                        <p className="text-xs text-gray-500 line-through">
                          {formatPrice(Number(product.compareAtPrice))}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge
                      variant={
                        totalStock > 10
                          ? "outline"
                          : totalStock > 0
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {totalStock}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Badge
                      variant={
                        product.status === "ACTIVE"
                          ? "default"
                          : product.status === "DRAFT"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {product.status === "ACTIVE" ? "Aktif" : product.status === "DRAFT" ? "Taslak" : "Arşiv"}
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={product.sku ? getProductUrl({
                              sku: product.sku,
                              gender: product.gender as "ERKEK" | "KADIN" | "UNISEX" | null,
                              category: product.category,
                            }) : `/urun/${product.slug}`}
                            target="_blank"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ürünü Görüntüle
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/urunler/${product.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Düzenle
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  Ürün bulunamadı
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
            {total} üründen {(page - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(page * ITEMS_PER_PAGE, total)} gösteriliyor
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/admin/urunler?page=${page - 1}${
                    search ? `&search=${search}` : ""
                  }${category ? `&category=${category}` : ""}${
                    status ? `&status=${status}` : ""
                  }`}
                >
                  Önceki
                </Link>
              </Button>
            )}
            {page < totalPages && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/admin/urunler?page=${page + 1}${
                    search ? `&search=${search}` : ""
                  }${category ? `&category=${category}` : ""}${
                    status ? `&status=${status}` : ""
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

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search;
  const category = params.category;
  const status = params.status;
  const page = Number(params.page) || 1;

  // Fetch categories for filter
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
          <p className="text-gray-500 mt-1">
            Ürün envanterinizi yönetin
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/urunler/yeni">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Ürün
          </Link>
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
                placeholder="Ürün adı veya SKU ara..."
                defaultValue={search}
                className="pl-10"
              />
            </div>
            <Select name="category" defaultValue={category || "all"}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select name="status" defaultValue={status || "all"}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="draft">Taslak</SelectItem>
                <SelectItem value="archived">Arşiv</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Filtrele</Button>
          </form>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<ProductsTableSkeleton />}>
            <ProductsTable
              search={search}
              category={category}
              status={status}
              page={page}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

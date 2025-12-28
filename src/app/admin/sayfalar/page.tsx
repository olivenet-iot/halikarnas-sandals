import Link from "next/link";
import { db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Plus, FileText, Edit, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeletePageButton } from "@/components/admin/pages";

export default async function PagesPage() {
  const pages = await db.page.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sayfalar</h1>
          <p className="text-gray-500 mt-1">
            Hakkımızda, İletişim, SSS gibi statik sayfalar
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/sayfalar/new">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Sayfa
          </Link>
        </Button>
      </div>

      {/* Pages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Tüm Sayfalar
            <Badge variant="secondary" className="ml-2">
              {pages.length} sayfa
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pages.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Henüz sayfa eklenmemiş</p>
              <Button asChild className="mt-4">
                <Link href="/admin/sayfalar/new">
                  <Plus className="h-4 w-4 mr-2" />
                  İlk Sayfayı Oluştur
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-gray-500">Sayfa</th>
                    <th className="pb-3 font-medium text-gray-500">Slug</th>
                    <th className="pb-3 font-medium text-gray-500">Durum</th>
                    <th className="pb-3 font-medium text-gray-500">Güncelleme</th>
                    <th className="pb-3 font-medium text-gray-500 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr key={page.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{page.title}</p>
                          {page.metaDescription && (
                            <p className="text-xs text-gray-500 truncate max-w-xs">
                              {page.metaDescription}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        <code className="text-sm text-aegean-600 bg-aegean-50 px-2 py-0.5 rounded">
                          /{page.slug}
                        </code>
                      </td>
                      <td className="py-3">
                        <Badge variant={page.isActive ? "default" : "secondary"}>
                          {page.isActive ? "Aktif" : "Pasif"}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm text-gray-500">
                        {formatDistanceToNow(new Date(page.updatedAt), {
                          addSuffix: true,
                          locale: tr,
                        })}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/${page.slug}`} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/sayfalar/${page.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeletePageButton pageId={page.id} pageTitle={page.title} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

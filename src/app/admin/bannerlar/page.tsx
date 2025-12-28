import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Plus, ImageIcon, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteBannerButton } from "@/components/admin/banners";

const POSITION_LABELS: Record<string, string> = {
  hero: "Ana Slider",
  category: "Kategori",
  promo: "Promosyon",
};

export default async function BannersPage() {
  const banners = await db.banner.findMany({
    orderBy: [{ position: "asc" }, { sortOrder: "asc" }],
  });

  const now = new Date();

  // Group banners by position
  const groupedBanners = banners.reduce((acc, banner) => {
    const position = banner.position;
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(banner);
    return acc;
  }, {} as Record<string, typeof banners>);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banner Yönetimi</h1>
          <p className="text-gray-500 mt-1">
            Ana sayfa slider ve promosyon banner&apos;ları
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/bannerlar/new">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Banner
          </Link>
        </Button>
      </div>

      {/* Banner Groups */}
      {Object.entries(groupedBanners).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Henüz banner eklenmemiş</p>
            <Button asChild className="mt-4">
              <Link href="/admin/bannerlar/new">
                <Plus className="h-4 w-4 mr-2" />
                İlk Banner&apos;ı Ekle
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedBanners).map(([position, positionBanners]) => (
          <Card key={position}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                {POSITION_LABELS[position] || position}
                <Badge variant="secondary" className="ml-2">
                  {positionBanners.length} banner
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {positionBanners.map((banner) => {
                  const isExpired = banner.endsAt && banner.endsAt < now;
                  const isNotStarted = banner.startsAt && banner.startsAt > now;

                  let statusBadge;
                  if (!banner.isActive) {
                    statusBadge = <Badge variant="secondary">Pasif</Badge>;
                  } else if (isExpired) {
                    statusBadge = <Badge variant="destructive">Süresi Doldu</Badge>;
                  } else if (isNotStarted) {
                    statusBadge = <Badge variant="outline">Başlamadı</Badge>;
                  } else {
                    statusBadge = <Badge variant="default">Aktif</Badge>;
                  }

                  return (
                    <div
                      key={banner.id}
                      className="border rounded-lg overflow-hidden group"
                    >
                      <div className="relative aspect-[16/9] bg-gray-100">
                        {banner.imageUrl ? (
                          <Image
                            src={banner.imageUrl}
                            alt={banner.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          {statusBadge}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium truncate">{banner.title}</h3>
                        {banner.subtitle && (
                          <p className="text-sm text-gray-500 truncate">
                            {banner.subtitle}
                          </p>
                        )}
                        {banner.linkUrl && (
                          <p className="text-xs text-aegean-600 truncate mt-1">
                            {banner.linkUrl}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <span className="text-xs text-gray-500">
                            Sıra: {banner.sortOrder}
                          </span>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/admin/bannerlar/${banner.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <DeleteBannerButton
                              bannerId={banner.id}
                              bannerTitle={banner.title}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

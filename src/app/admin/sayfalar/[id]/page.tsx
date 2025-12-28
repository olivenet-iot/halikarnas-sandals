"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const pageSchema = z.object({
  title: z.string().min(1, "Başlık gerekli"),
  slug: z.string().min(1, "Slug gerekli").regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  content: z.string().min(1, "İçerik gerekli"),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  isActive: z.boolean(),
});

type PageFormData = z.infer<typeof pageSchema>;

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PageFormPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const pageId = params.id as string;
  const isNew = pageId === "new";

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      isActive: true,
    },
  });

  const title = watch("title");
  const slug = watch("slug");

  useEffect(() => {
    if (!isNew) {
      fetchPage();
    }
  }, [pageId, isNew]);

  // Auto-generate slug from title for new pages
  useEffect(() => {
    if (isNew && title && !slug) {
      setValue("slug", generateSlug(title));
    }
  }, [title, isNew, slug, setValue]);

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`);
      if (!res.ok) throw new Error("Sayfa bulunamadı");
      const data = await res.json();

      const page = data.page;
      reset({
        title: page.title,
        slug: page.slug,
        content: page.content,
        metaTitle: page.metaTitle || "",
        metaDescription: page.metaDescription || "",
        isActive: page.isActive,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
      router.push("/admin/sayfalar");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: PageFormData) => {
    setIsSaving(true);
    try {
      const url = isNew
        ? "/api/admin/pages"
        : `/api/admin/pages/${pageId}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Sayfa kaydedilemedi");
      }

      toast({ title: isNew ? "Sayfa oluşturuldu" : "Sayfa güncellendi" });
      router.push("/admin/sayfalar");
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/sayfalar">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">
            {isNew ? "Yeni Sayfa" : "Sayfa Düzenle"}
          </h1>
        </div>
        {!isNew && slug && (
          <Button variant="outline" asChild>
            <Link href={`/${slug}`} target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Önizle
            </Link>
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Sayfa Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Başlık *</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Sayfa başlığı"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">/</span>
                    <Input
                      id="slug"
                      {...register("slug")}
                      placeholder="sayfa-slug"
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-sm text-red-500">{errors.slug.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Sadece küçük harf, rakam ve tire kullanın
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">İçerik *</Label>
                  <Textarea
                    id="content"
                    {...register("content")}
                    placeholder="Sayfa içeriği... (HTML desteklenir)"
                    rows={15}
                    className="font-mono text-sm"
                  />
                  {errors.content && (
                    <p className="text-sm text-red-500">{errors.content.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    HTML etiketleri kullanabilirsiniz
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Başlık</Label>
                  <Input
                    id="metaTitle"
                    {...register("metaTitle")}
                    placeholder="SEO için sayfa başlığı"
                  />
                  <p className="text-xs text-gray-500">
                    Boş bırakılırsa sayfa başlığı kullanılır
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Açıklama</Label>
                  <Textarea
                    id="metaDescription"
                    {...register("metaDescription")}
                    placeholder="Arama motorları için açıklama"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    150-160 karakter önerilir
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Durum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Aktif</p>
                    <p className="text-sm text-gray-500">
                      Sayfa sitede görünsün
                    </p>
                  </div>
                  <Switch
                    checked={watch("isActive")}
                    onCheckedChange={(checked) => setValue("isActive", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <Button className="w-full" type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <Save className="h-4 w-4 mr-2" />
                  {isNew ? "Sayfa Oluştur" : "Değişiklikleri Kaydet"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

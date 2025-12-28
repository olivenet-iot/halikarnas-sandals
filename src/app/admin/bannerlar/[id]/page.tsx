"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Save, ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const bannerSchema = z.object({
  title: z.string().min(1, "Başlık gerekli"),
  subtitle: z.string().optional().nullable(),
  imageUrl: z.string().url("Geçerli bir URL giriniz"),
  mobileImageUrl: z.string().url("Geçerli bir URL giriniz").optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  linkText: z.string().optional().nullable(),
  position: z.string().min(1, "Pozisyon gerekli"),
  sortOrder: z.number().min(0),
  startsAt: z.string().optional().nullable(),
  endsAt: z.string().optional().nullable(),
  isActive: z.boolean(),
});

type BannerFormData = z.infer<typeof bannerSchema>;

const POSITIONS = [
  { value: "hero", label: "Ana Slider" },
  { value: "category", label: "Kategori" },
  { value: "promo", label: "Promosyon" },
];

// Helper: URL'in geçerli bir görsel URL'i olup olmadığını kontrol et
const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  if (url.length < 20) return false; // "https://x.com/a.jpg" minimum uzunluk

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

// Banner Image Upload Component
function BannerImageUpload({
  onUpload,
  label,
}: {
  onUpload: (url: string) => void;
  label: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Lütfen bir görsel dosyası seçin");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'dan küçük olmalı");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "halikarnas/banners");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onUpload(data.url);
      } else {
        alert("Yükleme başarısız: " + data.error);
      }
    } catch (error) {
      alert("Yükleme sırasında hata oluştu");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const inputId = `banner-upload-${label.replace(/\s/g, "-").toLowerCase()}`;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors duration-200
        ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
        ${isUploading ? "pointer-events-none opacity-50" : ""}
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        id={inputId}
        disabled={isUploading}
      />
      <label htmlFor={inputId} className="cursor-pointer block">
        {isUploading ? (
          <Loader2 className="w-6 h-6 mx-auto text-gray-400 animate-spin" />
        ) : (
          <Upload className="w-6 h-6 mx-auto text-gray-400" />
        )}
        <p className="mt-1 text-xs text-gray-600">
          {isUploading ? "Yükleniyor..." : "Görsel yükle"}
        </p>
      </label>
    </div>
  );
}

export default function BannerFormPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const bannerId = params.id as string;
  const isNew = bannerId === "new";

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      imageUrl: "",
      mobileImageUrl: "",
      linkUrl: "",
      linkText: "",
      position: "hero",
      sortOrder: 0,
      startsAt: null,
      endsAt: null,
      isActive: true,
    },
  });

  const imageUrl = watch("imageUrl");
  const position = watch("position");

  useEffect(() => {
    if (!isNew) {
      fetchBanner();
    }
  }, [bannerId, isNew]);

  const fetchBanner = async () => {
    try {
      const res = await fetch(`/api/admin/banners/${bannerId}`);
      if (!res.ok) throw new Error("Banner bulunamadı");
      const data = await res.json();

      const banner = data.banner;
      reset({
        title: banner.title,
        subtitle: banner.subtitle || "",
        imageUrl: banner.imageUrl,
        mobileImageUrl: banner.mobileImageUrl || "",
        linkUrl: banner.linkUrl || "",
        linkText: banner.linkText || "",
        position: banner.position,
        sortOrder: banner.sortOrder,
        startsAt: banner.startsAt
          ? new Date(banner.startsAt).toISOString().split("T")[0]
          : null,
        endsAt: banner.endsAt
          ? new Date(banner.endsAt).toISOString().split("T")[0]
          : null,
        isActive: banner.isActive,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
      router.push("/admin/bannerlar");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: BannerFormData) => {
    setIsSaving(true);
    try {
      const url = isNew
        ? "/api/admin/banners"
        : `/api/admin/banners/${bannerId}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          startsAt: data.startsAt ? new Date(data.startsAt).toISOString() : null,
          endsAt: data.endsAt ? new Date(data.endsAt).toISOString() : null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Banner kaydedilemedi");
      }

      toast({ title: isNew ? "Banner oluşturuldu" : "Banner güncellendi" });
      router.push("/admin/bannerlar");
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/bannerlar">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">
          {isNew ? "Yeni Banner" : "Banner Düzenle"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Temel Bilgiler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Başlık *</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Banner başlığı"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Alt Başlık</Label>
                  <Input
                    id="subtitle"
                    {...register("subtitle")}
                    placeholder="Banner alt başlığı"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkUrl">Link URL</Label>
                    <Input
                      id="linkUrl"
                      {...register("linkUrl")}
                      placeholder="/koleksiyonlar/yaz"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkText">Link Metni</Label>
                    <Input
                      id="linkText"
                      {...register("linkText")}
                      placeholder="Koleksiyonu Keşfet"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Görsel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Desktop Image */}
                <div className="space-y-2">
                  <Label>Masaüstü Görsel *</Label>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <Input
                      {...register("imageUrl")}
                      placeholder="https://example.com/banner.jpg"
                    />
                    <BannerImageUpload
                      label="desktop"
                      onUpload={(url) => setValue("imageUrl", url)}
                    />
                  </div>
                  {errors.imageUrl && (
                    <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
                  )}
                </div>

                {/* Görsel Preview - sadece geçerli URL'ler için */}
                {isValidImageUrl(imageUrl) ? (
                  <div className="relative aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt="Banner preview"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Görsel önizlemesi için geçerli URL girin</p>
                    </div>
                  </div>
                )}

                {/* Mobile Image */}
                <div className="space-y-2">
                  <Label>Mobil Görsel (opsiyonel)</Label>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <Input
                      {...register("mobileImageUrl")}
                      placeholder="https://example.com/banner-mobile.jpg"
                    />
                    <BannerImageUpload
                      label="mobile"
                      onUpload={(url) => setValue("mobileImageUrl", url)}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Mobil cihazlarda farklı görsel göstermek için
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Gösterim Tarihleri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startsAt">Başlangıç Tarihi</Label>
                    <Input
                      id="startsAt"
                      type="date"
                      {...register("startsAt")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endsAt">Bitiş Tarihi</Label>
                    <Input
                      id="endsAt"
                      type="date"
                      {...register("endsAt")}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Tarih belirtmezseniz banner süresiz gösterilir
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Position & Order */}
            <Card>
              <CardHeader>
                <CardTitle>Yerleşim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Pozisyon *</Label>
                  <Select
                    value={position}
                    onValueChange={(value) => setValue("position", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pozisyon seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITIONS.map((pos) => (
                        <SelectItem key={pos.value} value={pos.value}>
                          {pos.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sıralama</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    {...register("sortOrder", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-gray-500">
                    Düşük değerler önce gösterilir
                  </p>
                </div>
              </CardContent>
            </Card>

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
                      Banner sitede gösterilsin
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
                  {isNew ? "Banner Oluştur" : "Değişiklikleri Kaydet"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

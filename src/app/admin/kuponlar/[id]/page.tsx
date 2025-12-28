"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const couponSchema = z.object({
  code: z.string().min(3, "Kupon kodu en az 3 karakter olmalı").toUpperCase(),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: z.number().min(0, "İndirim değeri 0'dan büyük olmalı"),
  minOrderAmount: z.number().min(0).optional().nullable(),
  maxDiscount: z.number().min(0).optional().nullable(),
  usageLimit: z.number().min(0).optional().nullable(),
  perUserLimit: z.number().min(0).optional().nullable(),
  startsAt: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  isActive: z.boolean(),
});

type CouponFormData = z.infer<typeof couponSchema>;

export default function CouponFormPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const couponId = params.id as string;
  const isNew = couponId === "new";

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderAmount: null,
      maxDiscount: null,
      usageLimit: null,
      perUserLimit: 1,
      startsAt: null,
      expiresAt: null,
      isActive: true,
    },
  });

  const discountType = watch("discountType");

  useEffect(() => {
    if (!isNew) {
      fetchCoupon();
    }
  }, [couponId, isNew]);

  const fetchCoupon = async () => {
    try {
      const res = await fetch(`/api/admin/coupons/${couponId}`);
      if (!res.ok) throw new Error("Kupon bulunamadı");
      const data = await res.json();

      const coupon = data.coupon;
      reset({
        code: coupon.code,
        description: coupon.description || "",
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscount: coupon.maxDiscount,
        usageLimit: coupon.usageLimit,
        perUserLimit: coupon.perUserLimit,
        startsAt: coupon.startsAt
          ? new Date(coupon.startsAt).toISOString().split("T")[0]
          : null,
        expiresAt: coupon.expiresAt
          ? new Date(coupon.expiresAt).toISOString().split("T")[0]
          : null,
        isActive: coupon.isActive,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
      router.push("/admin/kuponlar");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CouponFormData) => {
    setIsSaving(true);
    try {
      const url = isNew
        ? "/api/admin/coupons"
        : `/api/admin/coupons/${couponId}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          startsAt: data.startsAt ? new Date(data.startsAt).toISOString() : null,
          expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Kupon kaydedilemedi");
      }

      toast({ title: isNew ? "Kupon oluşturuldu" : "Kupon güncellendi" });
      router.push("/admin/kuponlar");
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
          <Link href="/admin/kuponlar">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">
          {isNew ? "Yeni Kupon" : "Kupon Düzenle"}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Kupon Kodu *</Label>
                    <Input
                      id="code"
                      {...register("code")}
                      placeholder="YILBASI2024"
                      className="uppercase"
                    />
                    {errors.code && (
                      <p className="text-sm text-red-500">{errors.code.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountType">İndirim Tipi *</Label>
                    <Select
                      value={discountType}
                      onValueChange={(value) =>
                        setValue("discountType", value as "PERCENTAGE" | "FIXED_AMOUNT")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tip seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Yüzdelik (%)</SelectItem>
                        <SelectItem value="FIXED_AMOUNT">Sabit Tutar (TL)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountValue">
                    İndirim Değeri * {discountType === "PERCENTAGE" ? "(%)" : "(TL)"}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    step={discountType === "PERCENTAGE" ? "1" : "0.01"}
                    {...register("discountValue", { valueAsNumber: true })}
                  />
                  {errors.discountValue && (
                    <p className="text-sm text-red-500">{errors.discountValue.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Kupon hakkında açıklama..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Limits */}
            <Card>
              <CardHeader>
                <CardTitle>Limitler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minOrderAmount">Minimum Sipariş Tutarı (TL)</Label>
                    <Input
                      id="minOrderAmount"
                      type="number"
                      step="0.01"
                      {...register("minOrderAmount", { valueAsNumber: true })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscount">Maksimum İndirim (TL)</Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      step="0.01"
                      {...register("maxDiscount", { valueAsNumber: true })}
                      placeholder="Limit yok"
                    />
                    <p className="text-xs text-gray-500">
                      Yüzdelik indirimlerde geçerli
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">Toplam Kullanım Limiti</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      {...register("usageLimit", { valueAsNumber: true })}
                      placeholder="Sınırsız"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="perUserLimit">Kullanıcı Başına Limit</Label>
                    <Input
                      id="perUserLimit"
                      type="number"
                      {...register("perUserLimit", { valueAsNumber: true })}
                      placeholder="1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Geçerlilik Tarihleri</CardTitle>
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
                    <Label htmlFor="expiresAt">Bitiş Tarihi</Label>
                    <Input
                      id="expiresAt"
                      type="date"
                      {...register("expiresAt")}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Tarih belirtmezseniz kupon süresiz geçerli olur
                </p>
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
                      Kupon kullanıma açık olsun
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
                  {isNew ? "Kupon Oluştur" : "Değişiklikleri Kaydet"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

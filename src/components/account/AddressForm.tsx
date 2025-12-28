"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getCitiesSorted, getDistrictsSorted, cities as allCities } from "@/lib/turkey-locations";

const addressSchema = z.object({
  title: z.string().min(1, "Adres başlığı gerekli"),
  firstName: z.string().min(1, "Ad gerekli"),
  lastName: z.string().min(1, "Soyad gerekli"),
  phone: z.string().min(10, "Geçerli bir telefon numarası girin"),
  address: z.string().min(10, "Adres en az 10 karakter olmalı"),
  city: z.string().min(1, "İl seçiniz"),
  district: z.string().min(1, "İlçe seçiniz"),
  postalCode: z.string().optional(),
  isDefault: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface Address {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode?: string | null;
  isDefault: boolean;
}

interface AddressFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: Address | null;
  onSuccess: () => void;
}

const ADDRESS_TITLES = ["Ev", "İş", "Diğer"];

export function AddressForm({
  open,
  onOpenChange,
  address,
  onSuccess,
}: AddressFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isEditing = !!address;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      title: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      district: "",
      postalCode: "",
      isDefault: false,
    },
  });

  const selectedCityName = watch("city");
  const cities = getCitiesSorted();

  // Find city ID by name to get districts
  const selectedCityObj = allCities.find(c => c.name === selectedCityName);
  const districts = selectedCityObj ? getDistrictsSorted(selectedCityObj.id) : [];

  // Reset form when dialog opens/closes or address changes
  useEffect(() => {
    if (open) {
      if (address) {
        reset({
          title: address.title,
          firstName: address.firstName,
          lastName: address.lastName,
          phone: address.phone,
          address: address.address,
          city: address.city,
          district: address.district,
          postalCode: address.postalCode || "",
          isDefault: address.isDefault,
        });
      } else {
        reset({
          title: "",
          firstName: "",
          lastName: "",
          phone: "",
          address: "",
          city: "",
          district: "",
          postalCode: "",
          isDefault: false,
        });
      }
    }
  }, [open, address, reset]);

  // Reset district when city changes
  useEffect(() => {
    if (selectedCityName && address?.city !== selectedCityName) {
      setValue("district", "");
    }
  }, [selectedCityName, address?.city, setValue]);

  const onSubmit = async (data: AddressFormData) => {
    setIsLoading(true);
    try {
      const url = isEditing
        ? `/api/addresses/${address.id}`
        : "/api/addresses";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Bir hata oluştu");
      }

      toast({
        title: isEditing ? "Adres güncellendi" : "Adres eklendi",
        description: isEditing
          ? "Adres başarıyla güncellendi."
          : "Yeni adres başarıyla eklendi.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Hata",
        description:
          error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Adresi Düzenle" : "Yeni Adres Ekle"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Address Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Adres Başlığı</Label>
            <Select
              value={watch("title")}
              onValueChange={(value) => setValue("title", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {ADDRESS_TITLES.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Ad</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Soyad</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="05XX XXX XX XX"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* City & District */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">İl</Label>
              <Select
                value={watch("city")}
                onValueChange={(value) => setValue("city", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="İl seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">İlçe</Label>
              <Select
                value={watch("district")}
                onValueChange={(value) => setValue("district", value)}
                disabled={!selectedCityName}
              >
                <SelectTrigger>
                  <SelectValue placeholder="İlçe seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.name}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.district && (
                <p className="text-sm text-red-600">{errors.district.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Adres</Label>
            <Textarea
              id="address"
              placeholder="Mahalle, cadde, sokak, bina no, daire no..."
              rows={3}
              {...register("address")}
            />
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <Label htmlFor="postalCode">Posta Kodu (Opsiyonel)</Label>
            <Input id="postalCode" {...register("postalCode")} />
          </div>

          {/* Default Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={watch("isDefault")}
              onCheckedChange={(checked) =>
                setValue("isDefault", checked as boolean)
              }
            />
            <Label htmlFor="isDefault" className="font-normal cursor-pointer">
              Varsayılan adres olarak ayarla
            </Label>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              İptal
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? "Güncelle" : "Ekle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { V2Input, V2Select, V2Textarea } from "@/components/ui/v2-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getCitiesSorted, getDistrictsSorted, cities as allCities } from "@/lib/turkey-locations";

const addressSchema = z.object({
  title: z.string().min(1, "Adres basligi gerekli"),
  firstName: z.string().min(1, "Ad gerekli"),
  lastName: z.string().min(1, "Soyad gerekli"),
  phone: z.string().min(10, "Gecerli bir telefon numarasi girin"),
  address: z.string().min(10, "Adres en az 10 karakter olmali"),
  city: z.string().min(1, "Il seciniz"),
  district: z.string().min(1, "Ilce seciniz"),
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

const ADDRESS_TITLES = ["Ev", "Is", "Diger"];

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
  const selectedCityObj = allCities.find((c) => c.name === selectedCityName);
  const districts = selectedCityObj ? getDistrictsSorted(selectedCityObj.id) : [];

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

  useEffect(() => {
    if (selectedCityName && address?.city !== selectedCityName) {
      setValue("district", "");
    }
  }, [selectedCityName, address?.city, setValue]);

  const onSubmit = async (data: AddressFormData) => {
    setIsLoading(true);
    try {
      const url = isEditing ? `/api/addresses/${address.id}` : "/api/addresses";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Bir hata olustu");
      }

      toast({
        title: isEditing ? "Adres guncellendi" : "Adres eklendi",
        description: isEditing
          ? "Adres basariyla guncellendi."
          : "Yeni adres basariyla eklendi.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata olustu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-v2-bg-primary border border-v2-border-subtle p-10 rounded-none">
        <DialogHeader>
          <DialogTitle className="font-serif font-light text-2xl text-v2-text-primary">
            {isEditing ? "Adresi Duzenle" : "Yeni Adres"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {/* Address Title */}
            <div className="md:col-span-2">
              <V2Select
                label="Adres Basligi"
                required
                value={watch("title")}
                onChange={(e) => setValue("title", e.target.value)}
                error={errors.title?.message}
              >
                <option value="">Seciniz</option>
                {ADDRESS_TITLES.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </V2Select>
            </div>

            {/* First Name */}
            <V2Input
              label="Ad"
              required
              {...register("firstName")}
              error={errors.firstName?.message}
            />

            {/* Last Name */}
            <V2Input
              label="Soyad"
              required
              {...register("lastName")}
              error={errors.lastName?.message}
            />

            {/* Phone */}
            <div className="md:col-span-2">
              <V2Input
                label="Telefon"
                required
                type="tel"
                placeholder="05XX XXX XX XX"
                {...register("phone")}
                error={errors.phone?.message}
              />
            </div>

            {/* City */}
            <V2Select
              label="Il"
              required
              value={watch("city")}
              onChange={(e) => setValue("city", e.target.value)}
              error={errors.city?.message}
            >
              <option value="">Il seciniz</option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </V2Select>

            {/* District */}
            <V2Select
              label="Ilce"
              required
              value={watch("district")}
              onChange={(e) => setValue("district", e.target.value)}
              disabled={!selectedCityName}
              error={errors.district?.message}
            >
              <option value="">Ilce seciniz</option>
              {districts.map((district) => (
                <option key={district.id} value={district.name}>
                  {district.name}
                </option>
              ))}
            </V2Select>

            {/* Address */}
            <div className="md:col-span-2">
              <V2Textarea
                label="Adres"
                required
                placeholder="Mahalle, cadde, sokak, bina no, daire no..."
                rows={3}
                {...register("address")}
                error={errors.address?.message}
              />
            </div>

            {/* Postal Code */}
            <V2Input
              label="Posta Kodu (Opsiyonel)"
              {...register("postalCode")}
            />

            {/* Default Checkbox */}
            <div className="flex items-center gap-2 self-end pb-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={watch("isDefault")}
                onChange={(e) => setValue("isDefault", e.target.checked)}
                className="w-4 h-4 accent-v2-accent"
              />
              <label
                htmlFor="isDefault"
                className="font-inter text-sm text-v2-text-muted cursor-pointer"
              >
                Varsayilan adres
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-6 mt-8 pt-6 border-t border-v2-border-subtle">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="font-inter text-sm text-v2-text-muted hover:text-v2-text-primary underline underline-offset-4 transition-colors"
            >
              Iptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="border border-v2-text-primary text-v2-text-primary bg-transparent hover:bg-v2-text-primary hover:text-white px-8 py-3 font-inter text-xs tracking-wide uppercase transition-colors rounded-none disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />}
              {isEditing ? "Guncelle" : "Kaydet"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCheckoutStore, ShippingInfo } from "@/stores/checkout-store";
import { City, District } from "@/lib/turkey-locations";
import { V2Input, V2Select, V2Textarea } from "@/components/ui/v2-form";

const shippingSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalidir"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalidir"),
  email: z.string().email("Gecerli bir e-posta adresi giriniz"),
  phone: z
    .string()
    .regex(/^5[0-9]{9}$/, "Gecerli telefon numarasi: 5XX XXX XX XX"),
  city: z.string().min(1, "Il seciniz"),
  district: z.string().min(1, "Ilce seciniz"),
  neighborhood: z.string(),
  address: z.string().min(10, "Adres en az 10 karakter olmalidir"),
  postalCode: z.string(),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingFormProps {
  onNext: () => void;
}


export function ShippingForm({ onNext }: ShippingFormProps) {
  const { shippingInfo, setShippingInfo } = useCheckoutStore();
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: shippingInfo?.firstName ?? "",
      lastName: shippingInfo?.lastName ?? "",
      email: shippingInfo?.email ?? "",
      phone: shippingInfo?.phone ?? "",
      city: shippingInfo?.city ?? "",
      district: shippingInfo?.district ?? "",
      neighborhood: shippingInfo?.neighborhood ?? "",
      address: shippingInfo?.address ?? "",
      postalCode: shippingInfo?.postalCode ?? "",
    },
  });

  const selectedCity = watch("city");

  // Fetch cities on mount
  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch("/api/locations/cities");
        const data = await response.json();
        setCities(data.cities || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setIsLoadingCities(false);
      }
    }
    fetchCities();
  }, []);

  // Fetch districts when city changes
  useEffect(() => {
    if (!selectedCity) {
      setDistricts([]);
      return;
    }

    async function fetchDistricts() {
      setIsLoadingDistricts(true);
      try {
        const response = await fetch(
          `/api/locations/districts?cityId=${selectedCity}`
        );
        const data = await response.json();
        setDistricts(data.districts || []);
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setIsLoadingDistricts(false);
      }
    }
    fetchDistricts();

    // Reset district when city changes
    setValue("district", "");
  }, [selectedCity, setValue]);

  const onSubmit = (data: ShippingFormData) => {
    const cityData = cities.find((c) => c.id === data.city);
    const districtData = districts.find((d) => d.id === data.district);

    const info: ShippingInfo = {
      ...data,
      cityName: cityData?.name || "",
      districtName: districtData?.name || "",
    };

    setShippingInfo(info);
    onNext();
  };

  return (
    <div>
      {/* Section Heading */}
      <h2 className="font-serif font-light text-2xl md:text-3xl text-v2-text-primary">
        Teslimat Bilgileri
      </h2>
      <div className="border-b border-v2-border-subtle mt-4 mb-8" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <V2Input
            label="Ad"
            required
            placeholder="Adiniz"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <V2Input
            label="Soyad"
            required
            placeholder="Soyadiniz"
            error={errors.lastName?.message}
            {...register("lastName")}
          />

          <V2Input
            label="E-posta"
            required
            type="email"
            placeholder="ornek@email.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <V2Input
            label="Telefon"
            required
            placeholder="5XX XXX XX XX"
            error={errors.phone?.message}
            {...register("phone")}
          />

          <V2Select
            label="Il"
            required
            disabled={isLoadingCities}
            error={errors.city?.message}
            {...register("city")}
          >
            <option value="">
              {isLoadingCities ? "Yukleniyor..." : "Il seciniz"}
            </option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </V2Select>

          <V2Select
            label="Ilce"
            required
            disabled={!selectedCity || isLoadingDistricts}
            error={errors.district?.message}
            {...register("district")}
          >
            <option value="">
              {isLoadingDistricts
                ? "Yukleniyor..."
                : selectedCity
                  ? "Ilce seciniz"
                  : "Once il seciniz"}
            </option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </V2Select>

          <div className="md:col-span-2">
            <V2Input
              label="Mahalle"
              placeholder="Mahalle adi"
              error={errors.neighborhood?.message}
              {...register("neighborhood")}
            />
          </div>

          <div className="md:col-span-2">
            <V2Textarea
              label="Adres"
              required
              placeholder="Sokak, cadde, bina no, daire no..."
              rows={3}
              error={errors.address?.message}
              {...register("address")}
            />
          </div>

          <V2Input
            label="Posta Kodu"
            placeholder="XXXXX"
            maxLength={5}
            error={errors.postalCode?.message}
            {...register("postalCode")}
          />
        </div>

        <div className="flex justify-end pt-8">
          <button
            type="submit"
            className="border border-v2-text-primary text-v2-text-primary bg-transparent hover:bg-v2-text-primary hover:text-white px-8 py-3 text-sm tracking-wide uppercase transition-colors"
          >
            Devam Et →
          </button>
        </div>
      </form>
    </div>
  );
}

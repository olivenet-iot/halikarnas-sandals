"use client";

import { useEffect, useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/luxury/MagneticButton";
import { useCheckoutStore, ShippingInfo } from "@/stores/checkout-store";
import { City, District } from "@/lib/turkey-locations";
import { cn } from "@/lib/utils";

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

// Luxury input wrapper
const LuxuryInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
    required?: boolean;
  }
>(({ label, error, required, ...props }, ref) => {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-[0.15em] text-stone-500 font-medium block">
        {label} {required && <span className="text-[#B8860B]">*</span>}
      </label>
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 bg-white border transition-all duration-300 outline-none",
          "border-stone-200 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20",
          "placeholder:text-stone-400 text-stone-800",
          error && "border-red-400 focus:border-red-400 focus:ring-red-400/20"
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});
LuxuryInput.displayName = "LuxuryInput";

// Luxury select wrapper
const LuxurySelect = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    error?: string;
    required?: boolean;
  }
>(({ label, error, required, children, ...props }, ref) => {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-[0.15em] text-stone-500 font-medium block">
        {label} {required && <span className="text-[#B8860B]">*</span>}
      </label>
      <select
        ref={ref}
        className={cn(
          "w-full px-4 py-3 bg-white border transition-all duration-300 outline-none appearance-none cursor-pointer",
          "border-stone-200 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20",
          "text-stone-800",
          error && "border-red-400 focus:border-red-400 focus:ring-red-400/20"
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a8a29e'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          backgroundSize: "20px",
        }}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});
LuxurySelect.displayName = "LuxurySelect";

// Luxury textarea wrapper
const LuxuryTextarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    error?: string;
    required?: boolean;
  }
>(({ label, error, required, ...props }, ref) => {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-[0.15em] text-stone-500 font-medium block">
        {label} {required && <span className="text-[#B8860B]">*</span>}
      </label>
      <textarea
        ref={ref}
        className={cn(
          "w-full px-4 py-3 bg-white border transition-all duration-300 outline-none resize-none",
          "border-stone-200 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20",
          "placeholder:text-stone-400 text-stone-800",
          error && "border-red-400 focus:border-red-400 focus:ring-red-400/20"
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});
LuxuryTextarea.displayName = "LuxuryTextarea";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <LuxuryInput
          label="Ad"
          required
          placeholder="Adiniz"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <LuxuryInput
          label="Soyad"
          required
          placeholder="Soyadiniz"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <LuxuryInput
          label="E-posta"
          required
          type="email"
          placeholder="ornek@email.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <LuxuryInput
          label="Telefon"
          required
          placeholder="5XX XXX XX XX"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <LuxurySelect
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
        </LuxurySelect>

        <LuxurySelect
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
        </LuxurySelect>
      </div>

      <LuxuryInput
        label="Mahalle"
        placeholder="Mahalle adi"
        error={errors.neighborhood?.message}
        {...register("neighborhood")}
      />

      <LuxuryTextarea
        label="Adres"
        required
        placeholder="Sokak, cadde, bina no, daire no..."
        rows={3}
        error={errors.address?.message}
        {...register("address")}
      />

      <LuxuryInput
        label="Posta Kodu"
        placeholder="XXXXX"
        maxLength={5}
        className="w-32"
        error={errors.postalCode?.message}
        {...register("postalCode")}
      />

      <div className="flex justify-end pt-4">
        <MagneticButton
          type="submit"
          variant="primary"
          size="lg"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Devam Et
        </MagneticButton>
      </div>
    </form>
  );
}

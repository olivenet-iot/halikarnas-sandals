"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCheckoutStore, ShippingInfo } from "@/stores/checkout-store";
import { City, District } from "@/lib/turkey-locations";

const shippingSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z
    .string()
    .regex(/^5[0-9]{9}$/, "Geçerli telefon numarası: 5XX XXX XX XX"),
  city: z.string().min(1, "İl seçiniz"),
  district: z.string().min(1, "İlçe seçiniz"),
  neighborhood: z.string().optional(),
  address: z.string().min(10, "Adres en az 10 karakter olmalıdır"),
  postalCode: z.string().optional(),
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

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: shippingInfo?.firstName || "",
      lastName: shippingInfo?.lastName || "",
      email: shippingInfo?.email || "",
      phone: shippingInfo?.phone || "",
      city: shippingInfo?.city || "",
      district: shippingInfo?.district || "",
      neighborhood: shippingInfo?.neighborhood || "",
      address: shippingInfo?.address || "",
      postalCode: shippingInfo?.postalCode || "",
    },
  });

  const selectedCity = form.watch("city");

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
    form.setValue("district", "");
  }, [selectedCity, form]);

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ad *</FormLabel>
                <FormControl>
                  <Input placeholder="Adınız" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Soyad *</FormLabel>
                <FormControl>
                  <Input placeholder="Soyadınız" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-posta *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="ornek@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon *</FormLabel>
                <FormControl>
                  <Input placeholder="5XX XXX XX XX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>İl *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingCities}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingCities ? "Yükleniyor..." : "İl seçiniz"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>İlçe *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedCity || isLoadingDistricts}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingDistricts
                            ? "Yükleniyor..."
                            : selectedCity
                              ? "İlçe seçiniz"
                              : "Önce il seçiniz"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district.id} value={district.id}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mahalle</FormLabel>
              <FormControl>
                <Input placeholder="Mahalle adı" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adres *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Sokak, cadde, bina no, daire no..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Posta Kodu</FormLabel>
              <FormControl>
                <Input
                  placeholder="XXXXX"
                  maxLength={5}
                  {...field}
                  className="w-32"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" className="btn-primary" size="lg">
            Devam Et
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </form>
    </Form>
  );
}

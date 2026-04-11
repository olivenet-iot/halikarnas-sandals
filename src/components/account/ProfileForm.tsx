"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { V2Input } from "@/components/ui/v2-form";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalı"),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      phone: user.phone || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Bir hata oluştu");
      }

      toast({
        title: "Profil güncellendi",
        description: "Bilgileriniz başarıyla kaydedildi.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 max-w-xl">
        {/* Name */}
        <div className="md:col-span-2">
          <V2Input
            label="Ad Soyad"
            required
            {...register("name")}
            error={errors.name?.message}
            placeholder="Adınız Soyadınız"
          />
        </div>

        {/* Email (read-only) */}
        <div className="md:col-span-2">
          <div>
            <label className="font-inter text-xs uppercase tracking-[0.15em] text-v2-text-muted mb-2 block">
              E-POSTA
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-0 pb-2 bg-transparent border-0 border-b border-v2-border-subtle text-v2-text-muted text-sm outline-none opacity-60"
            />
            <p className="font-inter text-xs text-v2-text-muted mt-1">
              E-posta adresi değiştirilemez
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="md:col-span-2">
          <V2Input
            label="Telefon"
            type="tel"
            {...register("phone")}
            placeholder="05XX XXX XX XX"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end mt-8">
        <button
          type="submit"
          disabled={isLoading || !isDirty}
          className="border border-v2-text-primary text-v2-text-primary bg-transparent hover:bg-v2-text-primary hover:text-white px-8 py-3 font-inter text-xs tracking-wide uppercase transition-colors rounded-none disabled:opacity-50"
        >
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />}
          Değişiklikleri Kaydet
        </button>
      </div>
    </form>
  );
}

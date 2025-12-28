"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    image: string | null;
  };
}

function getInitials(name: string | null): string {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
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
        description:
          error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
          <AvatarFallback className="bg-aegean-100 text-aegean-700 text-xl font-semibold">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-leather-800">{user.name}</p>
          <p className="text-sm text-leather-500">{user.email}</p>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Ad Soyad</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Adınız Soyadınız"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email (read-only) */}
      <div className="space-y-2">
        <Label htmlFor="email">E-posta</Label>
        <Input
          id="email"
          type="email"
          value={user.email}
          disabled
          className="bg-sand-50"
        />
        <p className="text-xs text-leather-500">
          E-posta adresi değiştirilemez
        </p>
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <Input
          id="phone"
          type="tel"
          {...register("phone")}
          placeholder="05XX XXX XX XX"
        />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isLoading || !isDirty}>
        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Değişiklikleri Kaydet
      </Button>
    </form>
  );
}

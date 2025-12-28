"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Eye, EyeOff, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifre gerekli"),
    newPassword: z.string().min(8, "Yeni şifre en az 8 karakter olmalı"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function PasswordChangeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const passwordChecks = [
    { label: "En az 8 karakter", valid: newPassword.length >= 8 },
    { label: "Büyük harf içermeli", valid: /[A-Z]/.test(newPassword) },
    { label: "Küçük harf içermeli", valid: /[a-z]/.test(newPassword) },
    { label: "Rakam içermeli", valid: /[0-9]/.test(newPassword) },
  ];

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Bir hata oluştu");
      }

      toast({
        title: "Şifre değiştirildi",
        description: "Şifreniz başarıyla güncellendi.",
      });

      reset();
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
      {/* Current Password */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Mevcut Şifre</Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            {...register("currentPassword")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? (
              <EyeOff className="h-4 w-4 text-leather-500" />
            ) : (
              <Eye className="h-4 w-4 text-leather-500" />
            )}
          </Button>
        </div>
        {errors.currentPassword && (
          <p className="text-sm text-red-600">{errors.currentPassword.message}</p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword">Yeni Şifre</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            {...register("newPassword")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? (
              <EyeOff className="h-4 w-4 text-leather-500" />
            ) : (
              <Eye className="h-4 w-4 text-leather-500" />
            )}
          </Button>
        </div>
        {errors.newPassword && (
          <p className="text-sm text-red-600">{errors.newPassword.message}</p>
        )}

        {/* Password strength checks */}
        {newPassword && (
          <div className="space-y-1 mt-2">
            {passwordChecks.map((check) => (
              <div
                key={check.label}
                className={cn(
                  "flex items-center gap-2 text-xs",
                  check.valid ? "text-green-600" : "text-leather-400"
                )}
              >
                {check.valid ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
                {check.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Yeni Şifre Tekrar</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-leather-500" />
            ) : (
              <Eye className="h-4 w-4 text-leather-500" />
            )}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Şifreyi Güncelle
      </Button>
    </form>
  );
}

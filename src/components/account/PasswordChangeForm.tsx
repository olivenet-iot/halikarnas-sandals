"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Eye, EyeOff, Check, X } from "lucide-react";
import { V2Input } from "@/components/ui/v2-form";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifre gerekli"),
    newPassword: z.string().min(12, "Yeni şifre en az 12 karakter olmalı"),
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
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Current Password */}
      <div className="relative">
        <V2Input
          label="Mevcut Şifre"
          required
          type={showCurrentPassword ? "text" : "password"}
          {...register("currentPassword")}
          error={errors.currentPassword?.message}
        />
        <button
          type="button"
          className="absolute right-0 top-6 p-1 text-v2-text-muted hover:text-v2-text-primary transition-colors"
          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
        >
          {showCurrentPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* New Password */}
      <div>
        <div className="relative">
          <V2Input
            label="Yeni Şifre"
            required
            type={showNewPassword ? "text" : "password"}
            {...register("newPassword")}
            error={errors.newPassword?.message}
          />
          <button
            type="button"
            className="absolute right-0 top-6 p-1 text-v2-text-muted hover:text-v2-text-primary transition-colors"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Password strength checks */}
        {newPassword && (
          <div className="space-y-1 mt-3">
            {passwordChecks.map((check) => (
              <div
                key={check.label}
                className={cn(
                  "flex items-center gap-2 text-xs font-inter",
                  check.valid ? "text-v2-accent" : "text-v2-text-muted"
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
      <div className="relative">
        <V2Input
          label="Yeni Şifre Tekrar"
          required
          type={showConfirmPassword ? "text" : "password"}
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
        <button
          type="button"
          className="absolute right-0 top-6 p-1 text-v2-text-muted hover:text-v2-text-primary transition-colors"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="border border-v2-text-primary text-v2-text-primary bg-transparent hover:bg-v2-text-primary hover:text-white px-8 py-3 font-inter text-xs tracking-wide uppercase transition-colors rounded-none disabled:opacity-50"
        >
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />}
          Şifreyi Güncelle
        </button>
      </div>
    </form>
  );
}

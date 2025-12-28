"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır")
      .regex(/[A-Z]/, "En az bir büyük harf içermelidir")
      .regex(/[a-z]/, "En az bir küçük harf içermelidir")
      .regex(/[0-9]/, "En az bir rakam içermelidir"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
  isValidToken: boolean;
}

export function ResetPasswordForm({
  token,
  isValidToken,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Hata",
          description: result.error || "Bir hata oluştu",
          variant: "destructive",
        });
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/giris");
      }, 3000);
    } catch {
      toast({
        title: "Hata",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-sand-200 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-heading-4 font-accent text-leather-800 mb-2">
          Geçersiz veya Süresi Dolmuş Link
        </h1>
        <p className="text-body-sm text-leather-600 mb-6">
          Bu şifre sıfırlama linki geçersiz veya süresi dolmuş. Lütfen yeni bir
          şifre sıfırlama talebi oluşturun.
        </p>
        <Button asChild className="btn-primary">
          <Link href="/sifremi-unuttum">Yeni Link Talep Et</Link>
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-sand-200 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-heading-4 font-accent text-leather-800 mb-2">
          Şifreniz Güncellendi
        </h1>
        <p className="text-body-sm text-leather-600 mb-6">
          Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...
        </p>
        <Button asChild variant="outline">
          <Link href="/giris">Giriş Yap</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-sand-200 p-8">
      <div className="text-center mb-6">
        <h1 className="text-heading-4 font-accent text-leather-800 mb-2">
          Yeni Şifre Belirleyin
        </h1>
        <p className="text-body-sm text-leather-500">
          Hesabınız için yeni bir şifre oluşturun.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yeni Şifre</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-leather-400 hover:text-leather-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şifre Tekrar</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-leather-400 hover:text-leather-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full btn-primary"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Güncelleniyor...
              </>
            ) : (
              "Şifreyi Güncelle"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

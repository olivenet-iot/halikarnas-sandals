"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Mail, CheckCircle } from "lucide-react";
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

const forgotPasswordSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
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

      setSubmittedEmail(data.email);
      setIsSuccess(true);
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

  if (isSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-sand-200 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-heading-4 font-accent text-leather-800 mb-2">
          E-posta Gönderildi
        </h1>
        <p className="text-body-sm text-leather-600 mb-6">
          Şifre sıfırlama linki{" "}
          <span className="font-semibold">{submittedEmail}</span> adresine
          gönderildi. Lütfen gelen kutunuzu kontrol edin.
        </p>
        <p className="text-body-xs text-leather-400 mb-6">
          E-posta birkaç dakika içinde gelmezse, spam klasörünüzü kontrol edin.
        </p>
        <Button variant="outline" asChild>
          <Link href="/giris">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Giriş sayfasına dön
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-sand-200 p-8">
      <div className="text-center mb-6">
        <h1 className="text-heading-4 font-accent text-leather-800 mb-2">
          Şifremi Unuttum
        </h1>
        <p className="text-body-sm text-leather-500">
          E-posta adresinizi girin, size şifre sıfırlama linki gönderelim.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-posta</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="ornek@email.com"
                      {...field}
                      disabled={isLoading}
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-leather-400" />
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
                Gönderiliyor...
              </>
            ) : (
              "Şifre Sıfırlama Linki Gönder"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <Link
          href="/giris"
          className="inline-flex items-center text-body-sm text-aegean-600 hover:text-aegean-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Giriş sayfasına dön
        </Link>
      </div>
    </div>
  );
}

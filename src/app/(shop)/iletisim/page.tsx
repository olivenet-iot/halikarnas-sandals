"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Ad soyad en az 2 karakter olmali"),
  email: z.string().email("Gecerli bir email adresi girin"),
  subject: z.string().min(1, "Konu secin"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmali"),
  honeypot: z.string().max(0, "Bot tespit edildi"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const subjects = [
  { value: "general", label: "Genel Bilgi" },
  { value: "order", label: "Siparis Hakkinda" },
  { value: "return", label: "Iade/Degisim" },
  { value: "partnership", label: "Is Birligi" },
  { value: "other", label: "Diger" },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      honeypot: "",
    },
  });

  const subject = watch("subject");

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Mesaj gonderilemedi");
      }

      toast({
        title: "Mesajiniz gonderildi",
        description: "En kisa surede size donus yapacagiz.",
      });
      reset();
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata olustu",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-v2-bg-primary">
      <section className="py-20 md:py-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Hero */}
          <div className="text-center mb-16">
            <span className="text-v2-accent tracking-widest text-xs font-inter uppercase">
              Iletisim
            </span>
            <h1 className="font-serif font-light text-4xl md:text-5xl text-v2-text-primary mt-4">
              Bizimle iletisime gecin
            </h1>
            <p className="font-inter text-v2-text-muted mt-4">
              Sorulariniz, onerileriniz veya is birligi talepleriniz icin buradayiz.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              {...register("honeypot")}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Ad Soyad */}
            <div>
              <label className="font-inter text-xs tracking-wide uppercase text-v2-text-muted mb-2 block">
                Ad Soyad
              </label>
              <input
                {...register("name")}
                placeholder="Adiniz ve soyadiniz"
                className={cn(
                  "w-full px-0 py-3 bg-transparent border-0 border-b transition-colors duration-200",
                  "border-v2-border-subtle focus:border-v2-text-primary focus:ring-0",
                  "placeholder:text-v2-text-muted/50 text-v2-text-primary font-inter text-sm outline-none",
                  errors.name && "border-red-400"
                )}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* E-posta */}
            <div>
              <label className="font-inter text-xs tracking-wide uppercase text-v2-text-muted mb-2 block">
                E-posta
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="ornek@email.com"
                className={cn(
                  "w-full px-0 py-3 bg-transparent border-0 border-b transition-colors duration-200",
                  "border-v2-border-subtle focus:border-v2-text-primary focus:ring-0",
                  "placeholder:text-v2-text-muted/50 text-v2-text-primary font-inter text-sm outline-none",
                  errors.email && "border-red-400"
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Konu */}
            <div>
              <label className="font-inter text-xs tracking-wide uppercase text-v2-text-muted mb-2 block">
                Konu
              </label>
              <select
                value={subject}
                onChange={(e) => setValue("subject", e.target.value)}
                className={cn(
                  "w-full px-0 py-3 bg-transparent border-0 border-b transition-colors duration-200",
                  "border-v2-border-subtle focus:border-v2-text-primary focus:ring-0",
                  "text-v2-text-primary font-inter text-sm outline-none appearance-none cursor-pointer",
                  !subject && "text-v2-text-muted/50",
                  errors.subject && "border-red-400"
                )}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B6560'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right center",
                  backgroundSize: "20px",
                }}
              >
                <option value="" disabled>
                  Konu secin
                </option>
                {subjects.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>
              )}
            </div>

            {/* Mesaj */}
            <div>
              <label className="font-inter text-xs tracking-wide uppercase text-v2-text-muted mb-2 block">
                Mesaj
              </label>
              <textarea
                {...register("message")}
                placeholder="Mesajinizi yazin..."
                rows={5}
                className={cn(
                  "w-full px-0 py-3 bg-transparent border-0 border-b transition-colors duration-200 resize-none",
                  "border-v2-border-subtle focus:border-v2-text-primary focus:ring-0",
                  "placeholder:text-v2-text-muted/50 text-v2-text-primary font-inter text-sm outline-none",
                  errors.message && "border-red-400"
                )}
              />
              {errors.message && (
                <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "border border-v2-text-primary text-v2-text-primary",
                  "hover:bg-v2-text-primary hover:text-white",
                  "font-inter text-sm tracking-wide uppercase py-3 px-8",
                  "transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Gonderiliyor...
                  </span>
                ) : (
                  "Mesaj Gonder"
                )}
              </button>
            </div>
          </form>

          {/* Contact info line */}
          <p className="text-v2-accent font-inter text-sm mt-12 text-center">
            info@halikarnassandals.com &middot; +90 252 123 45 67 &middot; Bodrum, Mugla
          </p>
        </div>
      </section>
    </div>
  );
}

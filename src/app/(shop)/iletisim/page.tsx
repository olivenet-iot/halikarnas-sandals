"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, Send, Loader2, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Ad soyad en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir email adresi girin"),
  subject: z.string().min(1, "Konu seçin"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalı"),
  honeypot: z.string().max(0, "Bot tespit edildi"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const subjects = [
  { value: "general", label: "Genel Bilgi" },
  { value: "order", label: "Sipariş Hakkında" },
  { value: "return", label: "İade/Değişim" },
  { value: "partnership", label: "İş Birliği" },
  { value: "other", label: "Diğer" },
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
        throw new Error(errorData.error || "Mesaj gönderilemedi");
      }

      toast({
        title: "Mesajınız gönderildi",
        description: "En kısa sürede size dönüş yapacağız.",
      });
      reset();
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-leather-900 mb-4">
          İletişim
        </h1>
        <p className="text-leather-600 max-w-2xl mx-auto">
          Sorularınız, önerileriniz veya iş birliği talepleriniz için bizimle iletişime geçin.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>İletişim Formu</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                {...register("honeypot")}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Adınız ve soyadınız"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="ornek@email.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Konu *</Label>
                <Select
                  value={subject}
                  onValueChange={(value) => setValue("subject", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Konu seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && (
                  <p className="text-sm text-red-500">{errors.subject.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mesajınız *</Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  placeholder="Mesajınızı yazın..."
                  rows={5}
                />
                {errors.message && (
                  <p className="text-sm text-red-500">{errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Gönder
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-aegean-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-aegean-600" />
                </div>
                <div>
                  <h3 className="font-medium text-leather-900">Adres</h3>
                  <p className="text-leather-600 text-sm mt-1">
                    Kumbahçe Mahallesi, Atatürk Caddesi<br />
                    No: 45, Bodrum / Muğla
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-aegean-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-aegean-600" />
                </div>
                <div>
                  <h3 className="font-medium text-leather-900">Telefon</h3>
                  <p className="text-leather-600 text-sm mt-1">
                    +90 252 316 XX XX
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-aegean-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-aegean-600" />
                </div>
                <div>
                  <h3 className="font-medium text-leather-900">E-posta</h3>
                  <p className="text-leather-600 text-sm mt-1">
                    info@halikarnassandals.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-aegean-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-aegean-600" />
                </div>
                <div>
                  <h3 className="font-medium text-leather-900">Çalışma Saatleri</h3>
                  <p className="text-leather-600 text-sm mt-1">
                    Pazartesi - Cuma: 09:00 - 18:00<br />
                    Cumartesi: 10:00 - 16:00<br />
                    Pazar: Kapalı
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sosyal Medya</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/halikarnassandals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-sand-100 flex items-center justify-center hover:bg-aegean-100 transition-colors"
                >
                  <Instagram className="h-5 w-5 text-leather-700" />
                </a>
                <a
                  href="https://facebook.com/halikarnassandals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-sand-100 flex items-center justify-center hover:bg-aegean-100 transition-colors"
                >
                  <Facebook className="h-5 w-5 text-leather-700" />
                </a>
                <a
                  href="https://twitter.com/halikarnassandals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-sand-100 flex items-center justify-center hover:bg-aegean-100 transition-colors"
                >
                  <Twitter className="h-5 w-5 text-leather-700" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map */}
      <div className="mt-12">
        <Card>
          <CardContent className="p-0">
            <div className="aspect-[16/9] md:aspect-[21/9] rounded-lg overflow-hidden bg-sand-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3182.7766847024636!2d27.42548!3d37.03542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDAyJzA3LjUiTiAyN8KwMjUnMzEuNyJF!5e0!3m2!1str!2str!4v1640000000000!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Halikarnas Sandals Konum"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

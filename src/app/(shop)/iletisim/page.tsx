"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Loader2, Instagram, Facebook, Twitter, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GoldDivider } from "@/components/ui/luxury/GoldDivider";
import { TextFadeIn } from "@/components/ui/luxury/TextReveal";
import { MagneticButton } from "@/components/ui/luxury/MagneticButton";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/animations";

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

const contactInfo = [
  {
    icon: MapPin,
    title: "Adres",
    content: "Kumbahce Mahallesi, Ataturk Caddesi\nNo: 45, Bodrum / Mugla",
  },
  {
    icon: Phone,
    title: "Telefon",
    content: "+90 252 316 XX XX",
  },
  {
    icon: Mail,
    title: "E-posta",
    content: "info@halikarnassandals.com",
  },
  {
    icon: Clock,
    title: "Calisma Saatleri",
    content: "Pazartesi - Cuma: 09:00 - 18:00\nCumartesi: 10:00 - 16:00\nPazar: Kapali",
  },
];

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/halikarnassandals", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/halikarnassandals", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/halikarnassandals", label: "Twitter" },
];

// Animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE.luxury },
  },
};

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
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Hero Section */}
      <section className="pt-32 pb-16 text-center">
        <GoldDivider variant="default" className="mx-auto mb-8" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE.luxury }}
          className="inline-flex items-center gap-3 mb-6"
        >
          <span className="w-8 h-px bg-[#B8860B]/50" />
          <span className="text-[#B8860B] text-xs tracking-[0.3em] uppercase font-medium">
            Iletisim
          </span>
          <span className="w-8 h-px bg-[#B8860B]/50" />
        </motion.div>

        <TextFadeIn delay={0.1}>
          <h1 className="font-serif text-4xl md:text-5xl text-stone-800 mb-6">
            Bizimle Iletisime Gecin
          </h1>
        </TextFadeIn>

        <TextFadeIn delay={0.2}>
          <p className="text-stone-600 max-w-xl mx-auto text-lg">
            Sorulariniz, onerileriniz veya is birligi talepleriniz icin buradayiz.
          </p>
        </TextFadeIn>
      </section>

      {/* Two-Column Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info Card - Dark */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE.luxury, delay: 0.3 }}
            className="lg:col-span-2 bg-stone-900 text-white p-8 md:p-10"
          >
            {/* Gold accent bar */}
            <div className="w-12 h-0.5 bg-[#B8860B] mb-8" />

            <h2 className="font-serif text-2xl text-white mb-10">
              Iletisim Bilgileri
            </h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {contactInfo.map((item) => (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 border border-[#B8860B]/30 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-4 w-4 text-[#B8860B]" />
                  </div>
                  <div>
                    <h3 className="text-sm uppercase tracking-[0.15em] text-[#B8860B] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/80 text-sm whitespace-pre-line leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Links */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-4">
                Bizi Takip Edin
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center
                             hover:border-[#B8860B] hover:bg-[#B8860B]/10 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4 text-white/70" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE.luxury, delay: 0.4 }}
            className="lg:col-span-3 bg-white border border-stone-200 p-8 md:p-10"
          >
            <h2 className="font-serif text-2xl text-stone-800 mb-2">
              Mesaj Gonderin
            </h2>
            <div className="w-12 h-0.5 bg-[#B8860B] mb-8" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                {...register("honeypot")}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.15em] text-stone-500 font-medium block">
                    Ad Soyad <span className="text-[#B8860B]">*</span>
                  </label>
                  <input
                    {...register("name")}
                    placeholder="Adiniz ve soyadiniz"
                    className={cn(
                      "w-full px-0 py-3 bg-transparent border-0 border-b transition-all duration-300",
                      "border-stone-300 focus:border-[#B8860B] focus:ring-0",
                      "placeholder:text-stone-400 text-stone-800 outline-none",
                      errors.name && "border-red-400"
                    )}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.15em] text-stone-500 font-medium block">
                    E-posta <span className="text-[#B8860B]">*</span>
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="ornek@email.com"
                    className={cn(
                      "w-full px-0 py-3 bg-transparent border-0 border-b transition-all duration-300",
                      "border-stone-300 focus:border-[#B8860B] focus:ring-0",
                      "placeholder:text-stone-400 text-stone-800 outline-none",
                      errors.email && "border-red-400"
                    )}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.15em] text-stone-500 font-medium block">
                  Konu <span className="text-[#B8860B]">*</span>
                </label>
                <select
                  value={subject}
                  onChange={(e) => setValue("subject", e.target.value)}
                  className={cn(
                    "w-full px-0 py-3 bg-transparent border-0 border-b transition-all duration-300",
                    "border-stone-300 focus:border-[#B8860B] focus:ring-0",
                    "text-stone-800 outline-none appearance-none cursor-pointer",
                    !subject && "text-stone-400",
                    errors.subject && "border-red-400"
                  )}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a8a29e'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right center",
                    backgroundSize: "20px",
                  }}
                >
                  <option value="" disabled>Konu secin</option>
                  {subjects.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="text-xs text-red-500">{errors.subject.message}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.15em] text-stone-500 font-medium block">
                  Mesajiniz <span className="text-[#B8860B]">*</span>
                </label>
                <textarea
                  {...register("message")}
                  placeholder="Mesajinizi yazin..."
                  rows={5}
                  className={cn(
                    "w-full px-0 py-3 bg-transparent border-0 border-b transition-all duration-300 resize-none",
                    "border-stone-300 focus:border-[#B8860B] focus:ring-0",
                    "placeholder:text-stone-400 text-stone-800 outline-none",
                    errors.message && "border-red-400"
                  )}
                />
                {errors.message && (
                  <p className="text-xs text-red-500">{errors.message.message}</p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-4">
                <MagneticButton
                  onClick={handleSubmit(onSubmit)}
                  variant="primary"
                  size="lg"
                  className="w-full md:w-auto"
                  icon={isSubmitting ? undefined : <ArrowRight className="w-4 h-4" />}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Gonderiliyor...
                    </span>
                  ) : (
                    "Mesaj Gonder"
                  )}
                </MagneticButton>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative">
        {/* Gradient overlay at top */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FAF9F6] to-transparent z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="h-[400px] md:h-[500px] bg-stone-200"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3182.7766847024636!2d27.42548!3d37.03542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDAyJzA3LjUiTiAyN8KwMjUnMzEuNyJF!5e0!3m2!1str!2str!4v1640000000000!5m2!1str!2str"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "grayscale(20%)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Halikarnas Sandals Konum"
          />
        </motion.div>
      </section>
    </div>
  );
}

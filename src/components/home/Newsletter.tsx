"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bir hata oluştu");
      }

      setStatus("success");
      setMessage(data.message || "Bültene başarıyla kaydoldunuz!");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Bir hata oluştu");
    }
  };

  return (
    <section className="py-24 md:py-32 bg-luxury-cream">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Luxury heading */}
          <span className="inline-flex items-center gap-3 text-luxury-gold text-xs tracking-[0.3em] uppercase font-medium mb-6">
            <span className="w-8 h-px bg-luxury-gold/50" />
            Özel Ayrıcalıklar
            <span className="w-8 h-px bg-luxury-gold/50" />
          </span>

          <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-luxury-primary mb-6">
            Koleksiyonumuza Katılın
          </h3>

          <p className="text-luxury-charcoal/70 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Yeni koleksiyonlar, özel davetler ve ilk siparişinizde{" "}
            <span className="text-luxury-gold font-medium">%10 indirim</span>{" "}
            fırsatından yararlanın.
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 text-luxury-primary py-8"
            >
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <span className="text-lg">{message}</span>
            </motion.div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  required
                  disabled={status === "loading"}
                  className="flex-1 px-6 py-4 bg-white border border-luxury-stone text-luxury-primary placeholder:text-luxury-charcoal/40 focus:outline-none focus:border-luxury-gold transition-colors disabled:opacity-50"
                />
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-luxury-primary text-luxury-cream hover:bg-luxury-primary-light px-10 py-4 text-sm tracking-[0.15em] uppercase font-medium disabled:opacity-50 rounded-none h-auto"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Kaydediliyor
                    </>
                  ) : (
                    "Abone Ol"
                  )}
                </Button>
              </form>

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2 mt-4 text-luxury-terracotta"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{message}</span>
                </motion.div>
              )}
            </>
          )}

          <p className="text-luxury-charcoal/50 text-xs tracking-wide mt-6">
            Gizlilik politikamızı kabul etmiş sayılırsınız. İstediğiniz zaman abonelikten çıkabilirsiniz.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

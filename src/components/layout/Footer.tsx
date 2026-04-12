"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Loader2 } from "lucide-react";

export function Footer() {
  // Newsletter form state (absorbed from Newsletter.tsx)
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className="bg-[#2A2A26] text-white">
      {/* Newsletter row */}
      <div className="border-b border-white/10">
        <div className="container-v2 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <h3 className="font-serif font-light text-xl md:text-2xl text-white">
              Atölyeden haberler ve erken erişim
            </h3>

            {status === "success" ? (
              <p className="font-inter text-sm text-white/70">
                Teşekkürler, kayıt tamamlandı.
              </p>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex items-center gap-4"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  required
                  className="bg-transparent border-b border-white/30 text-white placeholder:text-white/40 font-inter text-sm py-2 px-0 w-64 focus:outline-none focus:border-white/60 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="font-inter text-xs tracking-[0.15em] uppercase text-white link-underline-v2 shrink-0"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Abone Ol"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-v2 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="font-serif font-normal tracking-[0.25em] text-lg text-white inline-block mb-6"
            >
              HALIKARNAS
            </Link>
            <p className="text-white/60 font-inter text-sm leading-relaxed mb-6 max-w-xs">
              El yapımı hakiki deri sandaletler. Bodrum atölyemizden, sizin hikayenize.
            </p>

            {/* Contact */}
            <div className="space-y-2">
              <a
                href="mailto:info@halikarnassandals.com"
                className="flex items-center gap-3 text-white/60 hover:text-white font-inter text-sm transition-colors"
              >
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                info@halikarnassandals.com
              </a>
              <a
                href="tel:+902521234567"
                className="flex items-center gap-3 text-white/60 hover:text-white font-inter text-sm transition-colors"
              >
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                +90 252 123 45 67
              </a>
              <div className="flex items-start gap-3 text-white/60 font-inter text-sm">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} />
                <span>
                  Kumbahçe Mah. Neyzen Tevfik Cad.
                  <br />
                  No:12, 48400 Bodrum / Muğla
                </span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Alışveriş */}
            <div>
              <h4 className="text-white/50 font-inter font-medium text-xs tracking-[0.2em] uppercase mb-5">
                Alışveriş
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/kadin" className="text-white/60 hover:text-white font-inter text-sm transition-colors">
                    Kadın
                  </Link>
                </li>
                <li>
                  <Link href="/erkek" className="text-white/60 hover:text-white font-inter text-sm transition-colors">
                    Erkek
                  </Link>
                </li>
              </ul>
            </div>

            {/* Yardım */}
            <div>
              <h4 className="text-white/50 font-inter font-medium text-xs tracking-[0.2em] uppercase mb-5">
                Yardım
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/sss" className="text-white/60 hover:text-white font-inter text-sm transition-colors">
                    SSS
                  </Link>
                </li>
                <li>
                  <Link href="/siparis-takip" className="text-white/60 hover:text-white font-inter text-sm transition-colors">
                    Sipariş Takip
                  </Link>
                </li>
                <li>
                  <Link href="/beden-rehberi" className="text-white/60 hover:text-white font-inter text-sm transition-colors">
                    Beden Rehberi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kurumsal */}
            <div>
              <h4 className="text-white/50 font-inter font-medium text-xs tracking-[0.2em] uppercase mb-5">
                Kurumsal
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/hikayemiz" className="text-white/60 hover:text-white font-inter text-sm transition-colors">
                    Hikayemiz
                  </Link>
                </li>
                <li>
                  <Link href="/iletisim" className="text-white/60 hover:text-white font-inter text-sm transition-colors">
                    İletişim
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-v2 py-6">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center md:gap-4">
            <p className="text-white/40 font-inter text-xs">
              &copy; {new Date().getFullYear()} Halikarnas. Tüm hakları saklıdır.
            </p>

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
              <div className="flex items-center gap-6">
                <Link
                  href="/sayfa/gizlilik-politikasi"
                  className="text-white/40 hover:text-white font-inter text-xs transition-colors"
                >
                  Gizlilik
                </Link>
                <Link
                  href="/sayfa/kvkk"
                  className="text-white/40 hover:text-white font-inter text-xs transition-colors"
                >
                  KVKK
                </Link>
                <Link
                  href="/sayfa/cerez-politikasi"
                  className="text-white/40 hover:text-white font-inter text-xs transition-colors"
                >
                  Çerezler
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="https://instagram.com/halikarnassandals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" strokeWidth={1.5} />
                </a>
                <a
                  href="https://facebook.com/halikarnassandals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" strokeWidth={1.5} />
                </a>
                <a
                  href="https://twitter.com/halikarnassandals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

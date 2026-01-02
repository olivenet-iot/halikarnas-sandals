"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-luxury-primary text-white">
      {/* Ana Footer */}
      <div className="container mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Sol - Brand */}
          <div className="lg:col-span-4">
            <h2 className="font-display text-2xl tracking-[0.15em] mb-6">
              HALİKARNAS
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-sm">
              Antik Halikarnas&apos;ın zarafetini modern çizgilerle buluşturan,
              usta ellerde şekillenen el yapımı hakiki deri sandaletler.
            </p>

            {/* İletişim Bilgileri */}
            <div className="space-y-3 mb-8">
              <a
                href="mailto:info@halikarnassandals.com"
                className="flex items-center gap-3 text-white/70 hover:text-luxury-gold text-sm transition-colors duration-300"
              >
                <Mail className="w-4 h-4" />
                info@halikarnassandals.com
              </a>
              <a
                href="tel:+902521234567"
                className="flex items-center gap-3 text-white/70 hover:text-luxury-gold text-sm transition-colors duration-300"
              >
                <Phone className="w-4 h-4" />
                +90 252 123 45 67
              </a>
              <div className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Kumbahçe Mah. Neyzen Tevfik Cad.
                  <br />
                  No:12, 48400 Bodrum / Muğla
                </span>
              </div>
            </div>

            {/* Sosyal Medya */}
            <div className="flex gap-3">
              <a
                href="https://instagram.com/halikarnassandals"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/halikarnassandals"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/halikarnassandals"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Orta ve Sağ - Linkler */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Alışveriş */}
            <div>
              <h3 className="text-luxury-gold text-xs tracking-[0.2em] uppercase mb-6 font-medium">
                Alışveriş
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/kadin" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                    Kadın
                  </Link>
                </li>
                <li>
                  <Link href="/erkek" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                    Erkek
                  </Link>
                </li>
                <li>
                  <Link href="/yeni-gelenler" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                    Yeni Gelenler
                  </Link>
                </li>
                <li>
                  <Link href="/koleksiyonlar" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                    Koleksiyonlar
                  </Link>
                </li>
                <li>
                  <Link href="/indirim" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                    İndirimler
                  </Link>
                </li>
              </ul>
            </div>

            {/* Yardım */}
            <div>
              <h3 className="text-luxury-gold text-xs tracking-[0.2em] uppercase mb-6 font-medium">
                Yardım
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/siparis-takip" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                    Sipariş Takip
                  </Link>
                </li>
                <li>
                  <Link href="/sss" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                    Sıkça Sorulan Sorular
                  </Link>
                </li>
                <li>
                  <Link href="/sayfa/kargo-ve-teslimat" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                    Kargo ve Teslimat
                  </Link>
                </li>
                <li>
                  <Link href="/sayfa/iade-ve-degisim" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                    İade ve Değişim
                  </Link>
                </li>
                <li>
                  <Link href="/beden-rehberi" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                    Beden Rehberi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kurumsal */}
            <div>
              <h3 className="text-luxury-gold text-xs tracking-[0.2em] uppercase mb-6 font-medium">
                Kurumsal
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/hakkimizda" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/hakkimizda#hikaye" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                    Hikayemiz
                  </Link>
                </li>
                <li>
                  <Link href="/iletisim" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                    İletişim
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Bülten */}
            <div>
              <h3 className="text-luxury-gold text-xs tracking-[0.2em] uppercase mb-6 font-medium">
                Bülten
              </h3>
              <p className="text-white/70 text-sm mb-4 leading-relaxed">
                Yeni koleksiyonlar ve özel fırsatlardan haberdar olun.
              </p>
              <Link
                href="/#newsletter"
                className="inline-block text-white text-sm font-medium border-b border-luxury-gold pb-1 hover:text-luxury-gold transition-colors duration-300"
              >
                Abone Ol
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Alt kısım - Copyright */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-xs">
              © {new Date().getFullYear()} Halikarnas. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/sayfa/gizlilik-politikasi" className="text-white/50 hover:text-white text-xs transition-colors duration-300">
                Gizlilik
              </Link>
              <Link href="/sayfa/kvkk" className="text-white/50 hover:text-white text-xs transition-colors duration-300">
                KVKK
              </Link>
              <Link href="/sayfa/cerez-politikasi" className="text-white/50 hover:text-white text-xs transition-colors duration-300">
                Çerezler
              </Link>
            </div>
            {/* Ödeme Logoları */}
            <div className="flex items-center gap-3 text-white/40 text-xs">
              <span>Güvenli Ödeme:</span>
              <span className="font-medium">Visa</span>
              <span className="font-medium">Mastercard</span>
              <span className="font-medium">Troy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

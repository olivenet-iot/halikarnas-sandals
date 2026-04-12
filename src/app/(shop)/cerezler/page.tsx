/**
 * Çerez Politikası — Halikarnas Sandals
 *
 * Placeholder / başlangıç metni. Launch öncesi çerez envanteri çıkarılıp
 * (zorunlu, analitik, pazarlama) detaylı bir tabloya dönüştürülmelidir.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Çerez Politikası | Halikarnas Sandals",
  description:
    "Halikarnas Sandals çerez politikası — sitede kullanılan çerezler ve amaçları hakkında bilgi.",
};

const LAST_UPDATED = "12 Nisan 2026";

export default function CerezlerPage() {
  return (
    <div className="bg-v2-bg-primary">
      <section className="pt-32 pb-12">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="text-v2-accent tracking-widest text-xs font-inter uppercase">
            Yasal Metinler
          </p>
          <h1 className="font-serif font-light text-3xl md:text-4xl text-v2-text-primary mt-4">
            Çerez Politikası
          </h1>
          <p className="font-inter text-sm text-v2-text-muted mt-4">
            Son güncelleme: {LAST_UPDATED}
          </p>
          <div className="border-b border-v2-border-subtle mt-8" />
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 font-inter text-sm md:text-base text-v2-text-primary leading-relaxed">
          <p className="text-v2-text-muted">
            Halikarnas Sandals internet sitesi, kullanıcı deneyiminizi
            iyileştirmek, sitenin güvenli ve işlevsel çalışmasını sağlamak ve
            istatistiki analizler yapmak amacıyla çerezler (cookies)
            kullanmaktadır. Bu politika, hangi çerezleri ne amaçla
            kullandığımızı ve bunlar üzerindeki kontrolünüzü açıklar.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            1. Çerez Nedir?
          </h2>
          <p className="text-v2-text-muted">
            Çerezler, ziyaret ettiğiniz internet sitelerinin tarayıcınız
            aracılığıyla cihazınıza yerleştirdiği küçük metin dosyalarıdır.
            Çerezler, siteyi daha verimli kullanmanıza, tercih ve ayarlarınızın
            hatırlanmasına ve oturum bilgilerinizin korunmasına yardımcı olur.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            2. Kullandığımız Çerez Türleri
          </h2>
          <h3 className="font-serif text-base text-v2-text-primary mt-6 mb-2">
            Zorunlu Çerezler
          </h3>
          <p className="text-v2-text-muted">
            Sitenin temel işlevlerinin çalışabilmesi için gerekli olan
            çerezlerdir. Oturum yönetimi, sepet içeriğinin korunması, güvenli
            giriş ve form gönderimi gibi işlemler için kullanılır. Bu çerezler
            devre dışı bırakıldığında sitenin bazı bölümleri çalışmayabilir.
          </p>

          <h3 className="font-serif text-base text-v2-text-primary mt-6 mb-2">
            Performans ve Analitik Çerezler
          </h3>
          <p className="text-v2-text-muted">
            Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olan
            çerezlerdir. Hangi sayfaların en çok ziyaret edildiği, kullanıcı
            akışı ve olası hatalar gibi anonim istatistiki bilgiler toplanır.
          </p>

          <h3 className="font-serif text-base text-v2-text-primary mt-6 mb-2">
            İşlevsellik Çerezleri
          </h3>
          <p className="text-v2-text-muted">
            Dil tercihi, favori ürünler ve kişisel tercihleriniz gibi bilgileri
            hatırlayarak bir sonraki ziyaretinizde size daha iyi bir deneyim
            sunmak için kullanılır.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            3. Çerezleri Yönetme
          </h2>
          <p className="text-v2-text-muted">
            Tarayıcınızın ayarlarından çerezleri yönetebilir, mevcut çerezleri
            silebilir veya yeni çerezlerin yerleştirilmesini engelleyebilirsiniz.
            Ancak bazı çerezlerin devre dışı bırakılması, sitenin bazı
            özelliklerinin düzgün çalışmamasına yol açabilir.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            4. Daha Fazla Bilgi
          </h2>
          <p className="text-v2-text-muted">
            Çerezler aracılığıyla elde edilen kişisel verilerin işlenmesine
            ilişkin detaylı bilgi için{" "}
            <a
              href="/kvkk"
              className="text-v2-text-primary underline underline-offset-4 hover:text-v2-accent"
            >
              KVKK Aydınlatma Metni
            </a>{" "}
            sayfamızı inceleyebilirsiniz.
          </p>
          <div className="border-b border-v2-border-subtle mt-16" />
          <p className="text-xs text-v2-text-muted mt-6 italic">
            Bu metin başlangıç sürümüdür; sitede kullanılan çerezlerin detaylı
            envanteri çıkarıldıkça güncellenecektir.
          </p>
        </div>
      </section>
    </div>
  );
}

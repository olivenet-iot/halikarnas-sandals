import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hikayemiz | Halikarnas",
  description: "Halikarnassos'tan bugüne — el yapımı hakiki deri sandaletler.",
};

export default function HikayemizPage() {
  return (
    <div>
      {/* ==================== SECTION 1 — TEZ (HERO) ==================== */}
      <section className="py-[120px] md:py-[180px] bg-v2-bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4">
          <span className="text-v2-accent tracking-widest text-xs font-inter uppercase">
            HALİKARNAS
          </span>
          <h1 className="font-serif font-light text-5xl md:text-7xl text-v2-text-primary leading-tight mt-6">
            Dünyanın yedi harikasından birinin şehrinde.
          </h1>
          <p className="font-inter text-base md:text-lg text-v2-text-muted max-w-xl mx-auto mt-8">
            Halikarnassos, bugünkü Bodrum. Binlerce yıl önce Mausolos&apos;un
            Anıt Mezarı&apos;nın yükseldiği kıyıda, deri hâlâ elde işleniyor.
          </p>
        </div>
      </section>

      {/* ==================== SECTION 2 — ZANAAT ==================== */}
      <section className="py-[100px] md:py-[160px] bg-v2-bg-primary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-16 lg:gap-24 items-center">
            {/* Left — Image */}
            <div className="md:col-span-7">
              <div className="aspect-[4/5] relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1200"
                  alt="Halikarnas atölye"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right — Text */}
            <div className="md:col-span-5">
              <span className="text-v2-accent tracking-widest text-xs font-inter uppercase">
                ZANAAT
              </span>
              <h2 className="font-serif font-light text-4xl md:text-5xl text-v2-text-primary mt-4">
                Hızlı değil, kalıcı
              </h2>
              <p className="font-inter text-sm text-v2-text-muted leading-relaxed mt-6">
                Atölyemizde her sandalet, hammaddeden son dikişe kadar aynı
                ellerde şekilleniyor. Seri üretim yapmıyoruz.
              </p>
              <p className="font-inter text-sm text-v2-text-muted leading-relaxed mt-4">
                Her çift, sahibine özel bir zamanda, özenle tamamlanıyor. Bu
                yavaşlık bizim için bir tercih — hızlı moda değil, kalıcı
                zanaat.
              </p>
              <p className="font-inter text-sm text-v2-text-muted leading-relaxed mt-4">
                İtalyan tabakhanelerinden özenle seçilmiş hakiki deri,
                geleneksel Bodrum teknikleriyle işleniyor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3 — CTA ==================== */}
      <section className="py-[80px] bg-v2-bg-primary">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h3 className="font-serif font-light italic text-2xl md:text-3xl text-v2-text-primary">
            Koleksiyonlarımızı keşfedin
          </h3>
          <div className="flex items-center justify-center gap-8 mt-8">
            <Link
              href="/kadin"
              className="font-inter font-medium text-sm text-v2-text-primary underline underline-offset-4 hover:text-v2-text-muted transition-colors"
            >
              Kadın &rarr;
            </Link>
            <Link
              href="/erkek"
              className="font-inter font-medium text-sm text-v2-text-primary underline underline-offset-4 hover:text-v2-text-muted transition-colors"
            >
              Erkek &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

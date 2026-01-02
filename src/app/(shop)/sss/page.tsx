"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { GoldDivider } from "@/components/ui/luxury/GoldDivider";
import { TextFadeIn } from "@/components/ui/luxury/TextReveal";
import { MagneticButton } from "@/components/ui/luxury/MagneticButton";
import { LuxuryFAQAccordion } from "@/components/faq/LuxuryFAQAccordion";
import { FAQJsonLd } from "@/components/seo/JsonLd";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/animations";

const faqData = [
  {
    category: "Siparis & Kargo",
    questions: [
      {
        q: "Siparisim ne zaman kargoya verilir?",
        a: "Siparisiniz 1-2 is gunu icinde hazirlanir ve kargoya verilir. Siparis onayi ve kargo takip numarasi email ile tarafiniza iletilir.",
      },
      {
        q: "Kargo ucreti ne kadar?",
        a: "500 TL ve uzeri siparislerde kargo ucretsizdir. 500 TL alti siparislerde standart kargo ucreti 29.90 TL'dir.",
      },
      {
        q: "Hangi kargo firmasi ile gonderim yapiyorsunuz?",
        a: "Siparislerinizi Yurtici Kargo veya MNG Kargo ile gonderiyoruz. Tercih ettiginiz kargo firmasini siparis sirasinda secebilirsiniz.",
      },
      {
        q: "Siparisimi nasil takip edebilirim?",
        a: "Siparisiniz kargoya verildiginde, kargo takip numaraniz email adresinize gonderilir. Ayrica hesabinizdan siparislerim bolumunden de takip edebilirsiniz.",
      },
      {
        q: "Teslimat suresi ne kadar?",
        a: "Kargoya verilen siparisler genellikle 1-3 is gunu icinde teslim edilir. Uzak bolgeler icin bu sure 3-5 is gunu olabilir.",
      },
    ],
  },
  {
    category: "Iade & Degisim",
    questions: [
      {
        q: "Urunu iade edebilir miyim?",
        a: "Evet, urunlerimizi teslim tarihinden itibaren 14 gun icinde, kullanilmamis ve orijinal ambalajinda olmak kaydiyla iade edebilirsiniz.",
      },
      {
        q: "Beden degisikligi yapabilir miyim?",
        a: "Evet, beden degisikligi icin urunu 14 gun icinde bize gondermeniz yeterli. Yeni bedeni ucretsiz olarak gonderiyoruz.",
      },
      {
        q: "Iade kargo ucreti kime ait?",
        a: "Beden degisikligi ve hatali urun gonderimlerinde kargo ucreti bize aittir. Fikir degisikligi nedeniyle yapilan iadelerde kargo ucreti musteriye aittir.",
      },
      {
        q: "Iade islemi ne kadar surer?",
        a: "Urun bize ulastiktan sonra 3-5 is gunu icinde kontrol edilir ve iade tutari ayni odeme yontemine aktarilir. Banka islemleri ek 3-5 is gunu surebilir.",
      },
    ],
  },
  {
    category: "Urunler",
    questions: [
      {
        q: "Sandaletler hakiki deri mi?",
        a: "Evet, tum sandaletlerimiz %100 hakiki deriden el isciligi ile uretilmektedir. Sentetik malzeme kullanmiyoruz.",
      },
      {
        q: "Ayakkabi numarasi nasil secmeliyim?",
        a: "Beden rehberimizi kullanarak ayak olcunuzu alabilirsiniz. Sandaletlerimiz standart kaliptadir. Suphe durumunda bir buyuk beden almanizi oneririz, cunku deri zamanla ayaginiza gore form alir.",
      },
      {
        q: "Sandaletlerin bakimi nasil yapilir?",
        a: "Derinin uzun omurlu olmasi icin duzenli olarak deri bakim kremi uygulamanizi oneririz. Sandaletleri direkt gunes isigindan uzak, serin ve kuru bir yerde saklayin.",
      },
      {
        q: "Sandaletler suya dayanikli mi?",
        a: "Hakiki deri zamanla suya karsi daha dayanikli hale gelir ancak uzun sureli su temasindan kacinmanizi oneririz. Deniz ve havuz kullanimi icin uygun degildir.",
      },
      {
        q: "Ozel siparis verebilir miyim?",
        a: "Evet, ozel renk ve tasarim talepleri icin bizimle iletisime gecebilirsiniz. Ozel siparisler icin ek sure gerekebilir.",
      },
    ],
  },
  {
    category: "Odeme",
    questions: [
      {
        q: "Hangi odeme yontemlerini kabul ediyorsunuz?",
        a: "Kredi karti, banka karti, havale/EFT ve kapida odeme seceneklerimiz mevcuttur. Kredi kartina taksit imkani sunuyoruz.",
      },
      {
        q: "Taksitli odeme yapabilir miyim?",
        a: "Evet, kredi kartina 3, 6, 9 ve 12 taksit secenekleri sunuyoruz. Taksit secenekleri banka ve kart tipine gore degisebilir.",
      },
      {
        q: "Odeme guvenli mi?",
        a: "Evet, tum odemeler 256-bit SSL sertifikasi ile sifrelenerek alinir. Kart bilgileriniz bizde saklanmaz.",
      },
    ],
  },
];

const categories = faqData.map((section) => section.category);

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQs based on search query
  const filteredFaqs = useMemo(() => {
    const currentSection = faqData.find((s) => s.category === activeCategory);
    if (!currentSection) return [];

    if (!searchQuery.trim()) {
      return currentSection.questions;
    }

    const query = searchQuery.toLowerCase();
    return currentSection.questions.filter(
      (faq) =>
        faq.q.toLowerCase().includes(query) ||
        faq.a.toLowerCase().includes(query)
    );
  }, [activeCategory, searchQuery]);

  // Search across all categories
  const allFilteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return null;

    const query = searchQuery.toLowerCase();
    const results: { category: string; questions: typeof faqData[0]["questions"] }[] = [];

    faqData.forEach((section) => {
      const matchedQuestions = section.questions.filter(
        (faq) =>
          faq.q.toLowerCase().includes(query) ||
          faq.a.toLowerCase().includes(query)
      );
      if (matchedQuestions.length > 0) {
        results.push({ category: section.category, questions: matchedQuestions });
      }
    });

    return results;
  }, [searchQuery]);

  // Flatten all FAQs for JSON-LD
  const allFaqs = faqData.flatMap((section) =>
    section.questions.map((q) => ({
      question: q.q,
      answer: q.a,
    }))
  );

  return (
    <>
      <FAQJsonLd faqs={allFaqs} />
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
              Yardim
            </span>
            <span className="w-8 h-px bg-[#B8860B]/50" />
          </motion.div>

          <TextFadeIn delay={0.1}>
            <h1 className="font-serif text-4xl md:text-5xl text-stone-800 mb-6">
              Sikca Sorulan Sorular
            </h1>
          </TextFadeIn>

          <TextFadeIn delay={0.2}>
            <p className="text-stone-600 max-w-xl mx-auto text-lg mb-10">
              Merak ettiginiz her seyin yaniti burada
            </p>
          </TextFadeIn>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE.luxury, delay: 0.3 }}
            className="max-w-xl mx-auto px-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                type="text"
                placeholder="Soru ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200
                         focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20
                         transition-all duration-300 outline-none text-stone-800
                         placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <span className="sr-only">Clear</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        </section>

        {/* Category Tabs */}
        {!searchQuery && (
          <section className="border-b border-stone-200 bg-white/50">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex gap-1 overflow-x-auto hide-scrollbar py-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "relative px-6 py-4 text-sm tracking-wide uppercase whitespace-nowrap transition-colors duration-300",
                      activeCategory === category
                        ? "text-[#B8860B]"
                        : "text-stone-500 hover:text-stone-700"
                    )}
                  >
                    {category}
                    {activeCategory === category && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B8860B]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Content */}
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4">
            {searchQuery ? (
              // Search Results
              <div>
                {allFilteredFaqs && allFilteredFaqs.length > 0 ? (
                  <div className="space-y-12">
                    {allFilteredFaqs.map((section) => (
                      <div key={section.category}>
                        <h2 className="text-xs uppercase tracking-[0.2em] text-[#B8860B] mb-6">
                          {section.category}
                        </h2>
                        <LuxuryFAQAccordion items={section.questions} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <p className="text-stone-500 mb-4">
                      &quot;{searchQuery}&quot; icin sonuc bulunamadi
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-[#B8860B] hover:underline"
                    >
                      Tum sorulari goster
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              // Category FAQs
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: EASE.luxury }}
                >
                  <LuxuryFAQAccordion items={filteredFaqs} />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-stone-100/50 py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <GoldDivider variant="default" className="mx-auto mb-8" />

            <TextFadeIn>
              <h2 className="font-serif text-2xl md:text-3xl text-stone-800 mb-4">
                Sorunuza Yanit Bulamadiniz mi?
              </h2>
            </TextFadeIn>

            <TextFadeIn delay={0.1}>
              <p className="text-stone-600 mb-10 max-w-md mx-auto">
                Musteri hizmetlerimiz size yardimci olmak icin hazir.
              </p>
            </TextFadeIn>

            <MagneticButton
              href="/iletisim"
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Bize Ulasin
            </MagneticButton>
          </div>
        </section>
      </div>
    </>
  );
}

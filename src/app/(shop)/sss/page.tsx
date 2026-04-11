import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Sikca Sorulan Sorular | Halikarnas Sandals",
  description:
    "Halikarnas Sandals hakkinda sikca sorulan sorular. Siparis, kargo, iade, urun bakimi ve odeme hakkinda merak ettikleriniz.",
};

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

const allFaqs = faqData.flatMap((section) =>
  section.questions.map((q) => ({
    question: q.q,
    answer: q.a,
  }))
);

const allQuestions = faqData.flatMap((section, sectionIndex) =>
  section.questions.map((q, questionIndex) => ({
    id: `faq-${sectionIndex}-${questionIndex}`,
    ...q,
  }))
);

export default function FAQPage() {
  return (
    <div className="bg-v2-bg-primary">
      <FAQJsonLd faqs={allFaqs} />

      {/* Hero */}
      <section className="pt-32 pb-12 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-[#8B6F47] tracking-widest text-xs font-inter uppercase">
            Sikca Sorulan Sorular
          </p>
          <h1 className="font-serif font-light text-4xl md:text-5xl text-v2-text-primary mt-4">
            Yardimci olabilir miyiz?
          </h1>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4">
          <Accordion type="single" collapsible>
            {allQuestions.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-t border-v2-border-subtle border-b-0"
              >
                <AccordionTrigger className="font-serif text-lg hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="font-inter text-sm text-v2-text-muted leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}

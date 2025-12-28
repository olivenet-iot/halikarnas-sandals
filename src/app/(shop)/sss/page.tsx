import { Metadata } from "next";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular | Halikarnas Sandals",
  description: "Siparişler, kargo, iade ve ürünler hakkında merak ettiğiniz her şeyin yanıtı burada.",
};

const faqData = [
  {
    category: "Sipariş & Kargo",
    questions: [
      {
        q: "Siparişim ne zaman kargoya verilir?",
        a: "Siparişiniz 1-2 iş günü içinde hazırlanır ve kargoya verilir. Sipariş onayı ve kargo takip numarası email ile tarafınıza iletilir.",
      },
      {
        q: "Kargo ücreti ne kadar?",
        a: "500 TL ve üzeri siparişlerde kargo ücretsizdir. 500 TL altı siparişlerde standart kargo ücreti 29.90 TL'dir.",
      },
      {
        q: "Hangi kargo firması ile gönderim yapıyorsunuz?",
        a: "Siparişlerinizi Yurtiçi Kargo veya MNG Kargo ile gönderiyoruz. Tercih ettiğiniz kargo firmasını sipariş sırasında seçebilirsiniz.",
      },
      {
        q: "Siparişimi nasıl takip edebilirim?",
        a: "Siparişiniz kargoya verildiğinde, kargo takip numaranız email adresinize gönderilir. Ayrıca hesabınızdan siparişlerim bölümünden de takip edebilirsiniz.",
      },
      {
        q: "Teslimat süresi ne kadar?",
        a: "Kargoya verilen siparişler genellikle 1-3 iş günü içinde teslim edilir. Uzak bölgeler için bu süre 3-5 iş günü olabilir.",
      },
    ],
  },
  {
    category: "İade & Değişim",
    questions: [
      {
        q: "Ürünü iade edebilir miyim?",
        a: "Evet, ürünlerimizi teslim tarihinden itibaren 14 gün içinde, kullanılmamış ve orijinal ambalajında olmak kaydıyla iade edebilirsiniz.",
      },
      {
        q: "Beden değişikliği yapabilir miyim?",
        a: "Evet, beden değişikliği için ürünü 14 gün içinde bize göndermeniz yeterli. Yeni bedeni ücretsiz olarak gönderiyoruz.",
      },
      {
        q: "İade kargo ücreti kime ait?",
        a: "Beden değişikliği ve hatalı ürün gönderimlerinde kargo ücreti bize aittir. Fikir değişikliği nedeniyle yapılan iadelerde kargo ücreti müşteriye aittir.",
      },
      {
        q: "İade işlemi ne kadar sürer?",
        a: "Ürün bize ulaştıktan sonra 3-5 iş günü içinde kontrol edilir ve iade tutarı aynı ödeme yöntemine aktarılır. Banka işlemleri ek 3-5 iş günü sürebilir.",
      },
    ],
  },
  {
    category: "Ürünler",
    questions: [
      {
        q: "Sandaletler hakiki deri mi?",
        a: "Evet, tüm sandaletlerimiz %100 hakiki deriden el işçiliği ile üretilmektedir. Sentetik malzeme kullanmıyoruz.",
      },
      {
        q: "Ayakkabı numarası nasıl seçmeliyim?",
        a: "Beden rehberimizi kullanarak ayak ölçünüzü alabilirsiniz. Sandaletlerimiz standart kalıptadır. Şüphe durumunda bir büyük beden almanızı öneririz, çünkü deri zamanla ayağınıza göre form alır.",
      },
      {
        q: "Sandaletlerin bakımı nasıl yapılır?",
        a: "Derinin uzun ömürlü olması için düzenli olarak deri bakım kremi uygulamanızı öneririz. Sandaletleri direkt güneş ışığından uzak, serin ve kuru bir yerde saklayın.",
      },
      {
        q: "Sandaletler suya dayanıklı mı?",
        a: "Hakiki deri zamanla suya karşı daha dayanıklı hale gelir ancak uzun süreli su temasından kaçınmanızı öneririz. Deniz ve havuz kullanımı için uygun değildir.",
      },
      {
        q: "Özel sipariş verebilir miyim?",
        a: "Evet, özel renk ve tasarım talepleri için bizimle iletişime geçebilirsiniz. Özel siparişler için ek süre gerekebilir.",
      },
    ],
  },
  {
    category: "Ödeme",
    questions: [
      {
        q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
        a: "Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerimiz mevcuttur. Kredi kartına taksit imkanı sunuyoruz.",
      },
      {
        q: "Taksitli ödeme yapabilir miyim?",
        a: "Evet, kredi kartına 3, 6, 9 ve 12 taksit seçenekleri sunuyoruz. Taksit seçenekleri banka ve kart tipine göre değişebilir.",
      },
      {
        q: "Ödeme güvenli mi?",
        a: "Evet, tüm ödemeler 256-bit SSL sertifikası ile şifrelenerek alınır. Kart bilgileriniz bizde saklanmaz.",
      },
    ],
  },
];

export default function FAQPage() {
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
      <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-leather-900 mb-4">
          Sıkça Sorulan Sorular
        </h1>
        <p className="text-leather-600 max-w-2xl mx-auto">
          Aradığınız yanıtı bulamadıysanız iletişim sayfamızdan bize ulaşabilirsiniz.
        </p>
      </div>

      {/* Search - Client-side only, disabled for now */}
      <div className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-leather-400" />
          <Input
            placeholder="Soru ara..."
            className="pl-10"
            disabled
          />
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="max-w-3xl mx-auto space-y-8">
        {faqData.map((section) => (
          <div key={section.category}>
            <h2 className="text-xl font-semibold text-leather-900 mb-4">
              {section.category}
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {section.questions.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`${section.category}-${index}`}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-leather-600">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12 p-8 bg-sand-50 rounded-lg">
        <h3 className="text-xl font-semibold text-leather-900 mb-2">
          Sorunuza yanıt bulamadınız mı?
        </h3>
        <p className="text-leather-600 mb-4">
          Müşteri hizmetlerimiz size yardımcı olmak için hazır.
        </p>
        <a
          href="/iletisim"
          className="inline-flex items-center justify-center px-6 py-2 bg-aegean-600 text-white font-medium rounded-lg hover:bg-aegean-700 transition-colors"
        >
          Bize Ulaşın
        </a>
      </div>
      </div>
    </>
  );
}

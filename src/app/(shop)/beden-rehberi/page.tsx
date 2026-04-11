import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beden Rehberi | Halikarnas Sandals",
  description:
    "Ayak ölçülerinize uygun sandalet bedenini bulun. Kadın ve erkek beden tabloları ve ölçüm talimatları.",
};

const womenSizes = [
  { eu: "35", uk: "2", us: "4", cm: "22.5" },
  { eu: "36", uk: "3", us: "5", cm: "23" },
  { eu: "37", uk: "4", us: "6", cm: "23.5" },
  { eu: "38", uk: "5", us: "7", cm: "24.5" },
  { eu: "39", uk: "6", us: "8", cm: "25" },
  { eu: "40", uk: "7", us: "9", cm: "25.5" },
  { eu: "41", uk: "8", us: "10", cm: "26.5" },
  { eu: "42", uk: "9", us: "11", cm: "27" },
];

const menSizes = [
  { eu: "39", uk: "5", us: "6", cm: "25" },
  { eu: "40", uk: "6", us: "7", cm: "25.5" },
  { eu: "41", uk: "7", us: "8", cm: "26.5" },
  { eu: "42", uk: "8", us: "9", cm: "27" },
  { eu: "43", uk: "9", us: "10", cm: "28" },
  { eu: "44", uk: "10", us: "11", cm: "28.5" },
  { eu: "45", uk: "11", us: "12", cm: "29.5" },
  { eu: "46", uk: "12", us: "13", cm: "30" },
];

function SizeTable({
  title,
  sizes,
}: {
  title: string;
  sizes: typeof womenSizes;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-v2-text-primary text-center mb-8">
        {title}
      </h2>
      <table className="w-full border-t border-b border-v2-border-subtle">
        <thead>
          <tr className="border-b border-v2-border-subtle">
            <th className="py-3 px-4 text-left font-inter text-xs uppercase tracking-wide text-v2-text-muted">
              EU
            </th>
            <th className="py-3 px-4 text-left font-inter text-xs uppercase tracking-wide text-v2-text-muted">
              UK
            </th>
            <th className="py-3 px-4 text-left font-inter text-xs uppercase tracking-wide text-v2-text-muted">
              US
            </th>
            <th className="py-3 px-4 text-left font-inter text-xs uppercase tracking-wide text-v2-text-muted">
              Ayak Uzunluğu (cm)
            </th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((size, index) => (
            <tr
              key={size.eu}
              className={
                index < sizes.length - 1
                  ? "border-b border-v2-border-subtle"
                  : ""
              }
            >
              <td className="py-3 px-4 font-inter text-sm text-v2-text-primary">
                {size.eu}
              </td>
              <td className="py-3 px-4 font-inter text-sm text-v2-text-primary">
                {size.uk}
              </td>
              <td className="py-3 px-4 font-inter text-sm text-v2-text-primary">
                {size.us}
              </td>
              <td className="py-3 px-4 font-inter text-sm text-v2-text-primary">
                {size.cm}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SizeGuidePage() {
  return (
    <div className="bg-v2-bg-primary">
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-28">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-[#8B6F47] tracking-widest text-xs font-inter uppercase">
            BEDEN REHBERİ
          </p>
          <h1 className="font-serif font-light text-4xl md:text-5xl text-v2-text-primary mt-4">
            Beden Rehberi
          </h1>
          <p className="font-inter text-v2-text-muted mt-4">
            Doğru bedeni bulmak için ayak ölçülerinizi aşağıdaki tablolarla karşılaştırın.
          </p>
        </div>

        {/* Measurement Instructions */}
        <section className="mb-16">
          <div className="space-y-4">
            <p className="font-inter text-sm text-v2-text-muted leading-relaxed">
              <strong className="text-v2-text-primary">Kağıt hazırlayın.</strong> Bir
              A4 kağıdı yere koyun ve ayağınızı üzerine yerleştirin.
            </p>
            <p className="font-inter text-sm text-v2-text-muted leading-relaxed">
              <strong className="text-v2-text-primary">Ayağınızı çizin.</strong> Kalemi
              dik tutarak ayağınızın çevresini çizin.
            </p>
            <p className="font-inter text-sm text-v2-text-muted leading-relaxed">
              <strong className="text-v2-text-primary">Ölçüm alın.</strong> Topuğunuzun
              en arka noktasından en uzun parmağınızın ucuna kadar ölçün.
            </p>
            <p className="font-inter text-sm text-v2-text-muted leading-relaxed">
              <strong className="text-v2-text-primary">Tablodan bulun.</strong> Ölçümünüzü
              aşağıdaki tablodaki cm değerleriyle eşleştirin.
            </p>
          </div>
        </section>

        {/* Tips */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl text-v2-text-primary text-center mb-6">
            İpuçları
          </h2>
          <ul className="list-disc pl-5 space-y-2 font-inter text-sm text-v2-text-muted leading-relaxed">
            <li>
              Akşam saatlerinde ölçüm yapın — ayak gün boyunca hafifçe şişer.
            </li>
            <li>
              Her iki ayağınızı da ölçün ve büyük olanı baz alın.
            </li>
            <li>
              Ağırlığınızı eşit dağıtarak ayakta durun.
            </li>
            <li>
              Hakiki deri zamanla ayağınızın formuna göre şekillenir; iki beden
              arasındaysanız bir üst bedeni tercih edin.
            </li>
            <li>
              Geniş ayak yapısına sahipseniz bir üst beden daha konforlu olacaktır.
            </li>
          </ul>
        </section>

        {/* Women's Size Table */}
        <section className="mb-16">
          <SizeTable title="Kadın Beden Tablosu" sizes={womenSizes} />
        </section>

        {/* Men's Size Table */}
        <section>
          <SizeTable title="Erkek Beden Tablosu" sizes={menSizes} />
        </section>
      </div>
    </div>
  );
}

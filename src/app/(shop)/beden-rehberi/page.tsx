import { Metadata } from "next";
import { Ruler, Footprints, HelpCircle, Lightbulb } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Beden Rehberi | Halikarnas Sandals",
  description: "Ayak ölçülerinize uygun sandalet bedenini bulun. Kadın ve erkek beden tabloları ve ölçüm talimatları.",
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

const measurementSteps = [
  {
    step: 1,
    title: "Kağıt Hazırlayın",
    description: "Bir A4 kağıdı yere koyun ve üzerine çorabsız ayağınızla basın.",
  },
  {
    step: 2,
    title: "Ayağınızı Çizin",
    description: "Kalemi dik tutarak ayağınızın çevresini çizin. Kalemi ayağınıza yakın tutun.",
  },
  {
    step: 3,
    title: "Ölçüm Alın",
    description: "Topuğunuzun en arka noktasından en uzun parmağınızın ucuna kadar olan mesafeyi ölçün.",
  },
  {
    step: 4,
    title: "Bedeni Bulun",
    description: "Ölçtüğünüz değeri (cm) aşağıdaki tabloda bularak beden numaranızı öğrenin.",
  },
];

export default function SizeGuidePage() {
  return (
    <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-leather-900 mb-4">
          Beden Rehberi
        </h1>
        <p className="text-leather-600 max-w-2xl mx-auto">
          Doğru bedeni bulmak için ayak ölçülerinizi aşağıdaki tablolarla karşılaştırın.
        </p>
      </div>

      {/* How to Measure */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Ruler className="h-6 w-6 text-aegean-600" />
          <h2 className="text-2xl font-bold text-leather-900">
            Nasıl Ölçüm Yapılır?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {measurementSteps.map((step) => (
            <Card key={step.step} className="relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-aegean-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {step.step}
              </div>
              <CardHeader className="pt-6">
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-leather-600 text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Visual Guide */}
        <div className="mt-8 p-6 bg-sand-50 rounded-lg">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex items-center justify-center w-48 h-48 bg-white rounded-lg border-2 border-dashed border-sand-300">
              <Footprints className="w-24 h-24 text-sand-400" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-leather-700 font-medium mb-2">
                En doğru ölçüm için:
              </p>
              <ul className="text-leather-600 text-sm space-y-1">
                <li>• Akşam saatlerinde ölçüm yapın (ayak gün boyunca hafifçe şişer)</li>
                <li>• Her iki ayağınızı da ölçün ve büyük olanı baz alın</li>
                <li>• Ağırlığınızı eşit dağıtarak ayakta durun</li>
                <li>• Cetvelinizi ayağa paralel tutun</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Women's Size Chart */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-leather-900">
            Kadın Beden Tablosu
          </h2>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow className="bg-terracotta-50">
                <TableHead className="font-bold">EU</TableHead>
                <TableHead className="font-bold">UK</TableHead>
                <TableHead className="font-bold">US</TableHead>
                <TableHead className="font-bold">Ayak Uzunluğu (cm)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {womenSizes.map((size, index) => (
                <TableRow key={size.eu} className={index % 2 === 0 ? "bg-white" : "bg-sand-50"}>
                  <TableCell className="font-medium">{size.eu}</TableCell>
                  <TableCell>{size.uk}</TableCell>
                  <TableCell>{size.us}</TableCell>
                  <TableCell>{size.cm}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Men's Size Chart */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-leather-900">
            Erkek Beden Tablosu
          </h2>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow className="bg-aegean-50">
                <TableHead className="font-bold">EU</TableHead>
                <TableHead className="font-bold">UK</TableHead>
                <TableHead className="font-bold">US</TableHead>
                <TableHead className="font-bold">Ayak Uzunluğu (cm)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menSizes.map((size, index) => (
                <TableRow key={size.eu} className={index % 2 === 0 ? "bg-white" : "bg-sand-50"}>
                  <TableCell className="font-medium">{size.eu}</TableCell>
                  <TableCell>{size.uk}</TableCell>
                  <TableCell>{size.us}</TableCell>
                  <TableCell>{size.cm}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Tips */}
      <section className="mb-12">
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-amber-900">Faydalı İpuçları</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-amber-800">
              <strong>Hakiki Deri Özelliği:</strong> Sandaletlerimiz %100 hakiki deriden üretilmektedir.
              Deri, zamanla ayağınızın formuna göre şekillenir ve daha konforlu hale gelir.
            </p>
            <p className="text-amber-800">
              <strong>İki Beden Arasındaysanız:</strong> Bir üst bedeni tercih etmenizi öneririz.
              Deri yumuşadıkça ayağınıza tam oturacaktır.
            </p>
            <p className="text-amber-800">
              <strong>Geniş Ayaklar İçin:</strong> Geniş ayak yapısına sahipseniz,
              bir üst beden seçmeniz daha konforlu bir kullanım sağlayacaktır.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-6 w-6 text-aegean-600" />
          <h2 className="text-2xl font-bold text-leather-900">
            Sık Sorulan Sorular
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Beden değişikliği yapabilir miyim?</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Evet, ürünü 14 gün içinde kullanılmamış ve orijinal ambalajında olmak kaydıyla
                ücretsiz beden değişikliği yapabilirsiniz.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sandaletler dar mı geniş mi kalıp?</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Sandaletlerimiz standart kalıptadır. Ancak hakiki deri olduğu için
                zamanla ayağınıza göre form alır ve daha konforlu hale gelir.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Çocuk bedenleri var mı?</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Şu an için çocuk bedenleri üretmiyoruz. Koleksiyonumuz EU 35-46
                arası yetişkin bedenlerini kapsamaktadır.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Özel beden sipariş edebilir miyim?</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Evet, tabloda bulunmayan bedenler için özel sipariş verebilirsiniz.
                Detaylı bilgi için bizimle iletişime geçin.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center mt-12 p-8 bg-sand-50 rounded-lg">
        <h3 className="text-xl font-semibold text-leather-900 mb-2">
          Hâlâ emin değil misiniz?
        </h3>
        <p className="text-leather-600 mb-4">
          Uzman ekibimiz size yardımcı olmak için hazır.
        </p>
        <a
          href="/iletisim"
          className="inline-flex items-center justify-center px-6 py-2 bg-aegean-600 text-white font-medium rounded-lg hover:bg-aegean-700 transition-colors"
        >
          Bize Ulaşın
        </a>
      </div>
    </div>
  );
}

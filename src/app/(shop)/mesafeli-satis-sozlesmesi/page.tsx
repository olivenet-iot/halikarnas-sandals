/**
 * Mesafeli Satış Sözleşmesi — Halikarnas Sandals
 *
 * Bu sözleşme 6502 sayılı Tüketicinin Korunması Hakkında Kanun'un 48. maddesi
 * ve Mesafeli Sözleşmeler Yönetmeliği (27.11.2014 tarihli Resmi Gazete) hükümleri
 * çerçevesinde hazırlanmıştır.
 *
 * UYARI: Bu metin bir başlangıç şablonudur. Yayına almadan önce bir avukat
 * tarafından gözden geçirilmelidir. Aşağıdaki TODO ile işaretli yer tutucu
 * satıcı bilgileri (ticari unvan, adres, vergi dairesi, vergi no, MERSİS no,
 * iletişim) gerçek verilerle doldurulmalıdır.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi | Halikarnas Sandals",
  description:
    "Halikarnas Sandals mesafeli satış sözleşmesi — 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında hazırlanmıştır.",
};

const LAST_UPDATED = "12 Nisan 2026";

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <div className="bg-v2-bg-primary">
      <section className="pt-32 pb-12">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="text-v2-accent tracking-widest text-xs font-inter uppercase">
            Yasal Metinler
          </p>
          <h1 className="font-serif font-light text-3xl md:text-4xl text-v2-text-primary mt-4">
            Mesafeli Satış Sözleşmesi
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
            İşbu Mesafeli Satış Sözleşmesi (&ldquo;Sözleşme&rdquo;), 6502 sayılı
            Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
            Yönetmeliği hükümleri uyarınca, aşağıda bilgileri yer alan Satıcı
            ile Alıcı arasında, elektronik ortamda kurulmuştur. Alıcı, siparişi
            onayladığı anda işbu Sözleşme&rsquo;nin tüm hükümlerini kabul
            etmiş sayılır.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            1. Taraflar
          </h2>
          <h3 className="font-serif text-base text-v2-text-primary mt-6 mb-2">
            1.1. Satıcı
          </h3>
          <ul className="list-none space-y-1 text-v2-text-muted">
            <li>
              <span className="text-v2-text-primary">Ticari Unvan:</span>{" "}
              Halikarnas Sandals {/* TODO: resmi ticari unvanı doldurun */}
            </li>
            <li>
              <span className="text-v2-text-primary">Adres:</span> Bodrum,
              Muğla, Türkiye {/* TODO: açık adres doldurun */}
            </li>
            <li>
              <span className="text-v2-text-primary">Telefon:</span>{" "}
              +90 (___) ___ __ __ {/* TODO: iletişim telefonu */}
            </li>
            <li>
              <span className="text-v2-text-primary">E-posta:</span>{" "}
              info@halikarnassandals.com {/* TODO: iletişim e-postası */}
            </li>
            <li>
              <span className="text-v2-text-primary">Vergi Dairesi / No:</span>{" "}
              _______ / _______ {/* TODO: vergi dairesi ve numarası */}
            </li>
            <li>
              <span className="text-v2-text-primary">MERSİS No:</span>{" "}
              _______ {/* TODO: MERSİS numarası */}
            </li>
          </ul>

          <h3 className="font-serif text-base text-v2-text-primary mt-6 mb-2">
            1.2. Alıcı
          </h3>
          <p className="text-v2-text-muted">
            Sipariş sırasında Satıcı&rsquo;nın internet sitesinde bilgilerini
            beyan eden gerçek veya tüzel kişidir. Ad, soyad, teslimat adresi,
            fatura bilgileri ve iletişim bilgileri, Alıcı tarafından siparişin
            onaylandığı anda kayıt altına alınır.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            2. Sözleşmenin Konusu
          </h2>
          <p className="text-v2-text-muted">
            İşbu Sözleşme&rsquo;nin konusu, Alıcı&rsquo;nın Satıcı&rsquo;ya ait{" "}
            <span className="text-v2-text-primary">halikarnassandals.com</span>{" "}
            alan adlı internet sitesinden elektronik ortamda sipariş verdiği,
            aşağıda nitelik ve satış bedeli belirtilen ürün/ürünlerin satışı
            ve teslimi ile tarafların 6502 sayılı Tüketicinin Korunması
            Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri
            gereğince hak ve yükümlülüklerinin belirlenmesidir.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            3. Sözleşme Konusu Ürün ve Ödeme Bilgileri
          </h2>
          <p className="text-v2-text-muted">
            Sözleşmeye konu ürün/ürünlerin türü, miktarı, marka/modeli, rengi,
            bedeni, adedi, satış bedeli, ödeme şekli ve teslimat bilgileri,
            Alıcı tarafından sipariş özetinde görüntülenen ve onaylanan
            bilgilerden ibarettir. Sipariş anında Alıcı&rsquo;ya gösterilen
            ürün bilgileri, bu Sözleşme&rsquo;nin ayrılmaz bir parçasıdır.
          </p>
          <p className="text-v2-text-muted mt-4">
            Ürün satış bedeline KDV dahildir. Kargo ücreti, sipariş özetinde
            ayrı bir kalem olarak belirtilir; Satıcı tarafından belirlenen
            tutarı aşan siparişlerde kargo ücreti Satıcı tarafından karşılanır.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            4. Genel Hükümler
          </h2>
          <ol className="list-[lower-alpha] list-inside space-y-2 text-v2-text-muted">
            <li>
              Alıcı, Satıcı&rsquo;ya ait internet sitesinde Sözleşme konusu
              ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile
              teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve
              elektronik ortamda gerekli teyidi verdiğini beyan eder.
            </li>
            <li>
              Satıcı, Sözleşme konusu ürünü sağlam, eksiksiz, siparişte
              belirtilen niteliklere uygun ve varsa garanti belgeleri ve
              kullanım kılavuzları ile teslim etmeyi kabul ve taahhüt eder.
            </li>
            <li>
              Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu
              ile her bir ürün için Alıcı&rsquo;nın yerleşim yerinin uzaklığına
              bağlı olarak ön bilgiler içinde açıklanan süre zarfında
              Alıcı&rsquo;ya veya gösterdiği adresteki kişi/kuruluşa teslim
              edilir.
            </li>
            <li>
              Sözleşme konusu ürünün teslimatı için işbu Sözleşme&rsquo;nin
              elektronik ortamda onaylanmış olması ve satış bedelinin
              Alıcı&rsquo;nın tercih ettiği ödeme şekli ile ödenmiş olması
              şarttır. Herhangi bir nedenle ürün bedeli ödenmez veya banka
              kayıtlarında iptal edilir ise, Satıcı ürünün teslimi yükümlülüğünden
              kurtulmuş kabul edilir.
            </li>
            <li>
              Ürünün tesliminden sonra Alıcı&rsquo;ya ait kredi kartının
              Alıcı&rsquo;nın kusurundan kaynaklanmayan bir şekilde
              yetkisiz kişilerce haksız veya hukuka aykırı olarak kullanılması
              nedeni ile ilgili banka veya finans kuruluşunun ürün bedelini
              Satıcı&rsquo;ya ödememesi halinde, Alıcı kendisine teslim
              edilmiş olan ürünü 3 (üç) gün içinde Satıcı&rsquo;ya göndermekle
              yükümlüdür.
            </li>
            <li>
              Satıcı, mücbir sebepler veya nakliyeyi engelleyen olağanüstü
              durumlar nedeni ile Sözleşme konusu ürünü süresi içinde teslim
              edemez ise, durumu Alıcı&rsquo;ya bildirmekle yükümlüdür. Bu
              takdirde Alıcı, siparişin iptal edilmesini, Sözleşme konusu
              ürünün varsa emsali ile değiştirilmesini ve/veya teslimat
              süresinin engelleyici durumun ortadan kalkmasına kadar
              ertelenmesi haklarından birini kullanabilir.
            </li>
          </ol>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            5. Cayma Hakkı
          </h2>
          <p className="text-v2-text-muted">
            Alıcı, Sözleşme konusu ürünün kendisine veya gösterdiği adresteki
            kişi/kuruluşa tesliminden itibaren{" "}
            <span className="text-v2-text-primary">14 (on dört) gün içinde</span>{" "}
            herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin
            Sözleşme&rsquo;den cayma hakkına sahiptir.
          </p>
          <p className="text-v2-text-muted mt-4">
            Cayma hakkının kullanıldığına dair bildirimin, cayma hakkı süresi
            dolmadan, yazılı olarak veya kalıcı veri saklayıcısı ile (e-posta
            dahil) Satıcı&rsquo;ya iletilmesi yeterlidir. Cayma bildirimi
            aşağıdaki kanallardan yapılabilir:
          </p>
          <ul className="list-disc list-inside space-y-1 text-v2-text-muted mt-4">
            <li>E-posta: info@halikarnassandals.com</li>
            <li>Posta yoluyla Satıcı adresine yazılı bildirim</li>
          </ul>
          <p className="text-v2-text-muted mt-4">
            Cayma hakkının kullanılması halinde, Alıcı&rsquo;ya veya onun
            bildirdiği üçüncü kişiye yapılan tüm ödemeler, cayma bildiriminin
            Satıcı&rsquo;ya ulaştığı tarihten itibaren 14 gün içinde, Alıcı&rsquo;nın
            satın alırken kullandığı ödeme aracına uygun bir şekilde ve
            Alıcı&rsquo;ya herhangi bir masraf veya yükümlülük getirmeden tek
            seferde iade edilir.
          </p>

          <h3 className="font-serif text-base text-v2-text-primary mt-8 mb-2">
            5.1. Cayma Hakkının Kullanılamayacağı Ürünler
          </h3>
          <p className="text-v2-text-muted">
            Mesafeli Sözleşmeler Yönetmeliği&rsquo;nin 15. maddesi uyarınca,
            Alıcı&rsquo;nın istek veya açıkça kişisel ihtiyaçları doğrultusunda
            hazırlanan, niteliği itibarıyla geri gönderilmeye elverişli olmayan
            ürünler (örneğin kişiye özel ölçü, kişiye özel renk/desen, isim
            işlemeli özel üretim siparişler) cayma hakkı kapsamı dışındadır.
          </p>
          <p className="text-v2-text-muted mt-4">
            Halikarnas Sandals&rsquo;ın standart koleksiyon ürünleri stoktan
            teslim edildiği için 14 günlük cayma hakkı kapsamındadır. Ancak
            kişiye özel üretim siparişler bu kapsamın dışındadır ve sipariş
            sırasında açıkça belirtilir.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            6. İade Koşulları ve Prosedürü
          </h2>
          <ol className="list-[lower-alpha] list-inside space-y-2 text-v2-text-muted">
            <li>
              İade edilecek ürünün, kullanılmamış ve orijinal ambalajı
              bozulmamış olması gerekir. Kutusunda, aksesuarlarında veya
              etiketlerinde zarar bulunan ürünlerin iadesi kabul edilmeyebilir.
            </li>
            <li>
              Alıcı, cayma bildirimini takiben ürünü 14 gün içinde Satıcı
              tarafından bildirilen adrese iade etmekle yükümlüdür.
            </li>
            <li>
              Satıcı tarafından belirtilen taşıyıcı/kargo firması kullanıldığı
              takdirde, iade kargo masrafları Satıcı tarafından karşılanır.
              Farklı bir taşıyıcı tercih edilmesi halinde iade masrafları
              Alıcı&rsquo;ya aittir.
            </li>
            <li>
              Ürün Satıcı&rsquo;ya ulaştıktan sonra kontrol edilir ve iade
              şartlarını taşıdığının tespiti halinde satış bedeli, Alıcı&rsquo;nın
              ödeme yaptığı yönteme uygun şekilde Alıcı&rsquo;ya iade edilir.
            </li>
          </ol>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            7. Teslimat
          </h2>
          <p className="text-v2-text-muted">
            Sözleşme konusu ürün, Alıcı&rsquo;nın sipariş sırasında belirttiği
            teslimat adresine, yasal 30 günlük süreyi aşmamak koşulu ile anlaşmalı
            kargo firması aracılığıyla teslim edilir. Alıcı teslim sırasında
            adreste bulunamazsa, kargo firmasının bildirim sürecinde ürünü
            teslim almakla yükümlüdür. Alıcı&rsquo;nın teslim almaması nedeniyle
            iade edilen ürünlerde doğacak ek kargo masraflarından Alıcı
            sorumludur.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            8. Ödeme
          </h2>
          <p className="text-v2-text-muted">
            Alıcı, ödemeyi aşağıdaki yöntemlerden biri ile yapabilir:
          </p>
          <ul className="list-disc list-inside space-y-1 text-v2-text-muted mt-4">
            <li>Kredi kartı / banka kartı (ödeme sağlayıcı: iyzico)</li>
            <li>Kapıda ödeme (aktif olduğu bölgelerde)</li>
            <li>
              Havale / EFT{" "}
              {/* TODO: aktif ödeme yöntemlerini kontrol edin */}
            </li>
          </ul>
          <p className="text-v2-text-muted mt-4">
            Fatura, sipariş onayı ile birlikte Alıcı&rsquo;nın e-posta adresine
            gönderilir veya ürünle birlikte paket içinde teslim edilir.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            9. Temerrüt Hükümleri
          </h2>
          <p className="text-v2-text-muted">
            Tarafların işbu Sözleşme&rsquo;den kaynaklanan edimlerini yerine
            getirmemesi durumunda Borçlar Kanunu&rsquo;nun 106-108. maddelerinde
            yer alan &ldquo;Borçlunun Temerrüdü&rdquo; hükümleri uygulanır.
            Temerrüt halinde, herhangi bir tarafın edimini haklı bir sebep
            olmaksızın yerine getirmemesi durumunda, diğer taraf söz konusu
            edimin yerine getirilmesi için kendisine 7 günlük süre tanıyacak
            ve bu süre zarfında edimin yerine getirilmemesi halinde Sözleşme
            feshedilmiş sayılacaktır.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            10. Şikayet ve İtirazlar
          </h2>
          <p className="text-v2-text-muted">
            İşbu Sözleşme ile ilgili çıkacak ihtilaflarda; her yıl Ticaret
            Bakanlığı tarafından ilan edilen değere kadar olan uyuşmazlıklarda
            Alıcı&rsquo;nın yerleşim yerindeki Tüketici Hakem Heyetleri, söz
            konusu değerin üzerindeki ihtilaflarda ise Tüketici Mahkemeleri
            yetkilidir.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            11. Yürürlük
          </h2>
          <p className="text-v2-text-muted">
            İşbu Sözleşme 11 (on bir) maddeden ibaret olup, Alıcı tarafından
            elektronik ortamda okunarak kabul edilmiş ve siparişin onaylandığı
            anda yürürlüğe girmiştir.
          </p>
          <div className="border-b border-v2-border-subtle mt-16" />
          <p className="text-xs text-v2-text-muted mt-6 italic">
            Bu metin, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve
            Mesafeli Sözleşmeler Yönetmeliği hükümleri çerçevesinde genel bir
            şablon olarak hazırlanmıştır ve hukuki mütalaa niteliği taşımaz.
          </p>
        </div>
      </section>
    </div>
  );
}

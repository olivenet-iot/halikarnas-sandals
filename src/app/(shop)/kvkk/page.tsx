/**
 * KVKK Aydınlatma Metni — Halikarnas Sandals
 *
 * Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 10. maddesi
 * kapsamında veri sorumlusunun aydınlatma yükümlülüğü çerçevesinde
 * hazırlanmıştır.
 *
 * UYARI: Bu metin bir başlangıç şablonudur. Yayına almadan önce bir avukat
 * tarafından gözden geçirilmelidir. TODO ile işaretli yer tutucu veri
 * sorumlusu bilgileri (ticari unvan, adres, vergi no, iletişim e-postası)
 * gerçek verilerle doldurulmalıdır. Ayrıca KVKK Kurumu VERBİS (Veri
 * Sorumluları Sicili) kayıt yükümlülüğü ayrıca kontrol edilmelidir.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | Halikarnas Sandals",
  description:
    "Halikarnas Sandals KVKK aydınlatma metni — 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu aydınlatma metni.",
};

const LAST_UPDATED = "12 Nisan 2026";

export default function KvkkPage() {
  return (
    <div className="bg-v2-bg-primary">
      <section className="pt-32 pb-12">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="text-v2-accent tracking-widest text-xs font-inter uppercase">
            Yasal Metinler
          </p>
          <h1 className="font-serif font-light text-3xl md:text-4xl text-v2-text-primary mt-4">
            KVKK Aydınlatma Metni
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
            6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;)
            kapsamında, veri sorumlusu sıfatıyla Halikarnas Sandals olarak,
            kişisel verilerinizin işlenmesine ilişkin aşağıdaki hususlarda
            sizleri bilgilendirmek isteriz. Kişisel verileriniz, KVKK&rsquo;nın
            4. maddesinde belirtilen genel ilkelere uygun şekilde ve aşağıda
            açıklanan amaçlarla işlenmektedir.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            1. Veri Sorumlusu
          </h2>
          <p className="text-v2-text-muted">
            KVKK uyarınca kişisel verileriniz, aşağıda bilgileri yer alan veri
            sorumlusu tarafından işlenmektedir:
          </p>
          <ul className="list-none space-y-1 text-v2-text-muted mt-4">
            <li>
              <span className="text-v2-text-primary">Ticari Unvan:</span>{" "}
              Halikarnas Sandals {/* TODO: resmi ticari unvanı doldurun */}
            </li>
            <li>
              <span className="text-v2-text-primary">Adres:</span> Bodrum,
              Muğla, Türkiye {/* TODO: açık adres */}
            </li>
            <li>
              <span className="text-v2-text-primary">E-posta:</span>{" "}
              kvkk@halikarnassandals.com{" "}
              {/* TODO: KVKK başvuruları için resmi e-posta */}
            </li>
            <li>
              <span className="text-v2-text-primary">Telefon:</span>{" "}
              +90 (___) ___ __ __ {/* TODO: iletişim telefonu */}
            </li>
          </ul>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            2. İşlenen Kişisel Veri Kategorileri
          </h2>
          <p className="text-v2-text-muted">
            Halikarnas Sandals tarafından, ürün ve hizmetlerimizi sunabilmek
            amacıyla aşağıda belirtilen kategorilerde kişisel verileriniz
            işlenmektedir:
          </p>
          <ul className="list-disc list-inside space-y-2 text-v2-text-muted mt-4">
            <li>
              <span className="text-v2-text-primary">Kimlik Bilgileri:</span>{" "}
              Ad, soyad, fatura gerektiğinde T.C. kimlik numarası
            </li>
            <li>
              <span className="text-v2-text-primary">İletişim Bilgileri:</span>{" "}
              E-posta adresi, telefon numarası, teslimat ve fatura adresi
            </li>
            <li>
              <span className="text-v2-text-primary">
                Müşteri İşlem Bilgileri:
              </span>{" "}
              Sipariş geçmişi, sepet içeriği, favori ürünler, kullanılan
              indirim kuponları, sipariş iadeleri
            </li>
            <li>
              <span className="text-v2-text-primary">Finansal Bilgiler:</span>{" "}
              Ödeme yöntemi tercihi. Kredi kartı bilgileri Halikarnas Sandals
              sunucularında saklanmaz; yalnızca PCI-DSS uyumlu ödeme sağlayıcı
              iyzico nezdinde işlenir.
            </li>
            <li>
              <span className="text-v2-text-primary">
                İşlem Güvenliği Bilgileri:
              </span>{" "}
              IP adresi, tarayıcı türü, cihaz bilgisi, log kayıtları, çerez
              verileri
            </li>
            <li>
              <span className="text-v2-text-primary">Pazarlama Bilgileri:</span>{" "}
              Açık rızanıza bağlı olarak bülten aboneliği, alışveriş tercihleri
              ve ilgi alanları
            </li>
          </ul>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            3. Kişisel Verilerin İşlenme Amaçları
          </h2>
          <p className="text-v2-text-muted">
            Kişisel verileriniz, aşağıdaki amaçlarla ve bu amaçlarla sınırlı
            olmak üzere işlenmektedir:
          </p>
          <ul className="list-disc list-inside space-y-2 text-v2-text-muted mt-4">
            <li>
              Siparişlerinizin oluşturulması, takibi, teslimi ve sonrasındaki
              müşteri destek süreçlerinin yürütülmesi
            </li>
            <li>
              Fatura düzenlenmesi ve ilgili mevzuat gereğince mali belgelerin
              saklanması
            </li>
            <li>
              Üyelik hesabınızın oluşturulması, güvenli şekilde yönetilmesi ve
              parola kurtarma gibi işlemlerin yapılması
            </li>
            <li>
              Sepet ve favoriler gibi kişiselleştirilmiş site işlevlerinin
              sunulması
            </li>
            <li>
              6502 sayılı Tüketicinin Korunması Hakkında Kanun, 213 sayılı
              Vergi Usul Kanunu ve diğer ilgili mevzuattan doğan yükümlülüklerin
              yerine getirilmesi
            </li>
            <li>
              Alışveriş deneyiminizin iyileştirilmesine yönelik istatistik ve
              analiz faaliyetlerinin yürütülmesi (anonimleştirilmiş veriler ile)
            </li>
            <li>
              Açık rızanız bulunduğu takdirde pazarlama, kampanya ve bülten
              iletişiminin gerçekleştirilmesi
            </li>
            <li>
              Dolandırıcılık önleme ve site güvenliğinin sağlanması
            </li>
          </ul>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            4. Kişisel Verilerin İşlenme Hukuki Sebepleri
          </h2>
          <p className="text-v2-text-muted">
            Kişisel verileriniz, KVKK&rsquo;nın 5. maddesinde öngörülen
            aşağıdaki hukuki sebeplere dayalı olarak işlenmektedir:
          </p>
          <ul className="list-disc list-inside space-y-2 text-v2-text-muted mt-4">
            <li>
              <span className="text-v2-text-primary">Madde 5/2-c:</span>{" "}
              Sözleşmenin kurulması ve ifası için gerekli olması (sipariş,
              teslimat, iade süreçleri)
            </li>
            <li>
              <span className="text-v2-text-primary">Madde 5/2-ç:</span>{" "}
              Hukuki yükümlülüklerin yerine getirilmesi (vergi, fatura,
              tüketici hukuku)
            </li>
            <li>
              <span className="text-v2-text-primary">Madde 5/2-f:</span>{" "}
              Meşru menfaatler için zorunlu olması (site güvenliği,
              dolandırıcılık önleme, hizmet kalitesinin artırılması)
            </li>
            <li>
              <span className="text-v2-text-primary">Madde 5/1:</span>{" "}
              Açık rıza (pazarlama iletişimi, bülten aboneliği ve benzeri
              opsiyonel işlemler için)
            </li>
          </ul>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            5. Kişisel Verilerin Aktarıldığı Üçüncü Kişiler
          </h2>
          <p className="text-v2-text-muted">
            Kişisel verileriniz, yukarıda belirtilen amaçlar doğrultusunda ve
            KVKK&rsquo;nın 8. ve 9. maddelerine uygun olarak aşağıdaki alıcı
            gruplarına aktarılabilir:
          </p>
          <ul className="list-disc list-inside space-y-2 text-v2-text-muted mt-4">
            <li>
              <span className="text-v2-text-primary">Kargo firmaları:</span>{" "}
              Ürün teslimatının gerçekleştirilmesi için ad, adres, telefon
              bilgileriniz paylaşılır.
            </li>
            <li>
              <span className="text-v2-text-primary">Ödeme kuruluşları:</span>{" "}
              Ödeme işleminin tamamlanması için iyzico ile sipariş tutarı ve
              fatura bilgileriniz paylaşılır. Kart bilgileri yalnızca iyzico
              nezdinde işlenir.
            </li>
            <li>
              <span className="text-v2-text-primary">
                Altyapı ve bulut hizmet sağlayıcıları:
              </span>{" "}
              Sitenin barındırılması ve veri güvenliği için hosting ve görsel
              depolama hizmeti aldığımız tedarikçiler (örn. Vercel, Cloudinary)
            </li>
            <li>
              <span className="text-v2-text-primary">
                E-posta servis sağlayıcıları:
              </span>{" "}
              Sipariş bildirimleri ve bülten gönderimi için kullanılan servis
              sağlayıcılar (örn. Resend)
            </li>
            <li>
              <span className="text-v2-text-primary">
                Yetkili kamu kurum ve kuruluşları:
              </span>{" "}
              Yasal talep, dava veya inceleme durumunda mevzuatın gerektirdiği
              ölçüde
            </li>
          </ul>
          <p className="text-v2-text-muted mt-4">
            Bazı hizmet sağlayıcılarımızın sunucuları yurt dışında bulunabilir.
            Bu durumda kişisel verileriniz, KVKK&rsquo;nın 9. maddesi uyarınca
            açık rızanıza veya yeterli koruma bulunan ülkeler / taahhütname
            çerçevesinde yurt dışına aktarılabilir.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            6. Kişisel Verilerin Toplanma Yöntemi
          </h2>
          <p className="text-v2-text-muted">
            Kişisel verileriniz; internet sitesi üzerindeki üyelik formu,
            sipariş formu, iletişim formu, bülten aboneliği ve müşteri destek
            kanalları aracılığıyla tarafınızca iletilen bilgiler ile çerezler
            ve log kayıtları gibi otomatik yollarla elde edilmektedir.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            7. İlgili Kişi Hakları (KVKK Madde 11)
          </h2>
          <p className="text-v2-text-muted">
            KVKK&rsquo;nın 11. maddesi uyarınca, veri sahibi olarak aşağıdaki
            haklara sahipsiniz:
          </p>
          <ul className="list-disc list-inside space-y-2 text-v2-text-muted mt-4">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>
              İşlenme amacını ve bunların amacına uygun kullanılıp
              kullanılmadığını öğrenme
            </li>
            <li>
              Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı
              üçüncü kişileri bilme
            </li>
            <li>
              Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde
              bunların düzeltilmesini isteme
            </li>
            <li>
              KVKK&rsquo;nın 7. maddesinde öngörülen şartlar çerçevesinde
              kişisel verilerinizin silinmesini veya yok edilmesini isteme
            </li>
            <li>
              Düzeltme, silme ve yok etme taleplerinin, kişisel verilerinizin
              aktarıldığı üçüncü kişilere bildirilmesini isteme
            </li>
            <li>
              İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla
              analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına
              itiraz etme
            </li>
            <li>
              Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle
              zarara uğramanız halinde zararın giderilmesini talep etme
            </li>
          </ul>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            8. Başvuru Yolları
          </h2>
          <p className="text-v2-text-muted">
            Yukarıda sayılan haklarınızı kullanmak için, &ldquo;Veri Sorumlusuna
            Başvuru Usul ve Esasları Hakkında Tebliğ&rdquo; hükümleri uyarınca
            aşağıdaki kanallardan bizimle iletişime geçebilirsiniz:
          </p>
          <ul className="list-disc list-inside space-y-2 text-v2-text-muted mt-4">
            <li>
              <span className="text-v2-text-primary">Posta yoluyla:</span>{" "}
              Halikarnas Sandals, Bodrum, Muğla{" "}
              {/* TODO: açık posta adresi */}
            </li>
            <li>
              <span className="text-v2-text-primary">E-posta yoluyla:</span>{" "}
              kvkk@halikarnassandals.com{" "}
              {/* TODO: KVKK başvuruları için resmi e-posta */}
            </li>
          </ul>
          <p className="text-v2-text-muted mt-4">
            Başvurunuzda ad, soyad, imza (yazılı başvuruda), T.C. kimlik
            numarası, tebligata esas adres, varsa bildirime esas e-posta
            adresi, telefon ve talep konusunun yer alması gerekmektedir.
            Başvurularınız en geç 30 gün içinde ücretsiz olarak sonuçlandırılır;
            ancak işlem ayrıca bir maliyet gerektirirse KVKK Kurulu tarafından
            belirlenen tarifedeki ücret talep edilebilir.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            9. Çerez Politikası
          </h2>
          <p className="text-v2-text-muted">
            İnternet sitemiz, temel işlevselliğin sağlanması, kullanıcı
            deneyiminin iyileştirilmesi ve istatistiki analiz amacıyla çerezler
            kullanmaktadır. Detaylı bilgi için{" "}
            <a
              href="/cerezler"
              className="text-v2-text-primary underline underline-offset-4 hover:text-v2-accent"
            >
              Çerez Politikası
            </a>{" "}
            sayfamızı inceleyebilirsiniz.
          </p>

          <h2 className="font-serif text-xl text-v2-text-primary mt-12 mb-4">
            10. Güncellemeler
          </h2>
          <p className="text-v2-text-muted">
            İşbu aydınlatma metni, mevzuat değişiklikleri ve Halikarnas
            Sandals&rsquo;ın veri işleme süreçlerindeki gelişmelere göre
            güncellenebilir. Güncel versiyon her zaman bu sayfada yayınlanır.
          </p>
          <div className="border-b border-v2-border-subtle mt-16" />
          <p className="text-xs text-v2-text-muted mt-6 italic">
            Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu ve ilgili
            ikincil mevzuat kapsamında genel bir şablon olarak hazırlanmıştır
            ve hukuki mütalaa niteliği taşımaz.
          </p>
        </div>
      </section>
    </div>
  );
}

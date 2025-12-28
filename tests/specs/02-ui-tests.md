# UI Testleri

## Genel Bilgiler

- **Base URL:** `http://localhost:3000`
- **Browser:** Chrome/Chromium
- **Viewport Desktop:** 1920x1080
- **Viewport Mobile:** 375x812
- **Toplam Test:** ~151

---

## Icerik

1. [Homepage](#1-homepage)
2. [Header & Navigation](#2-header--navigation)
3. [Kadin Sayfalari](#3-kadin-sayfalari)
4. [Erkek Sayfalari](#4-erkek-sayfalari)
5. [Urun Detay](#5-urun-detay)
6. [Koleksiyonlar](#6-koleksiyonlar)
7. [Sepet](#7-sepet)
8. [Odeme](#8-odeme)
9. [Hesabim](#9-hesabim)
10. [Authentication](#10-authentication)
11. [Arama](#11-arama)
12. [Bilgi Sayfalari](#12-bilgi-sayfalari)
13. [Error States](#13-error-states)
14. [Responsive](#14-responsive)

---

## 1. Homepage

### TEST-UI-001: Homepage Load
- **URL:** `/`
- **Kontrol Listesi:**
  - [ ] Sayfa 3 saniye icinde yukleniyor
  - [ ] HTTP 200 donuyor
  - [ ] Console'da hata yok
  - [ ] Hero section gorunuyor
  - [ ] Header gorunuyor
  - [ ] Footer gorunuyor

---

### TEST-UI-002: Hero Section
- **URL:** `/`
- **Kontrol Listesi:**
  - [ ] Hero gorseli yukleniyor
  - [ ] Baslik gorunuyor
  - [ ] Alt baslik gorunuyor
  - [ ] "Koleksiyonu Kesfet" butonu var
  - [ ] "Hikayemiz" butonu var
  - [ ] Parallax scroll efekti calisiyor

---

### TEST-UI-003: Hero Buttons
- **URL:** `/`
- **Adimlar:**
  1. "Koleksiyonu Kesfet" butonuna tikla
  2. Geri don
  3. "Hikayemiz" butonuna tikla
- **Kontrol Listesi:**
  - [ ] "Koleksiyonu Kesfet" -> `/kadin` sayfasina gidiyor
  - [ ] "Hikayemiz" -> `/hakkimizda` sayfasina gidiyor

---

### TEST-UI-004: Best Sellers Section
- **URL:** `/`
- **Kontrol Listesi:**
  - [ ] "En Cok Tercih Edilenler" section gorunuyor
  - [ ] 4 urun karti gorunuyor
  - [ ] Her kartta gorsel var
  - [ ] Her kartta isim var
  - [ ] Her kartta fiyat var
  - [ ] Kart tiklaninca urun sayfasina gidiyor

---

### TEST-UI-005: Featured Categories
- **URL:** `/`
- **Kontrol Listesi:**
  - [ ] Kategori kartlari gorunuyor
  - [ ] Kadin kategorisi var
  - [ ] Erkek kategorisi var
  - [ ] Her kartta gorsel var
  - [ ] Kartlar tiklanabilir

---

### TEST-UI-006: Newsletter Section
- **URL:** `/`
- **Kontrol Listesi:**
  - [ ] Newsletter formu gorunuyor
  - [ ] Email input var
  - [ ] Abone ol butonu var

---

### TEST-UI-007: Newsletter Submit
- **URL:** `/`
- **Adimlar:**
  1. Email gir: `test@example.com`
  2. Abone ol butonuna tikla
- **Kontrol Listesi:**
  - [ ] Basari mesaji gorunuyor
  - [ ] Input temizleniyor

---

### TEST-UI-008: Footer
- **URL:** `/`
- **Kontrol Listesi:**
  - [ ] Footer gorunuyor
  - [ ] Logo var
  - [ ] Hizli linkler calisiyor
  - [ ] Sosyal medya ikonlari var
  - [ ] Iletisim bilgileri var
  - [ ] Copyright var

---

## 2. Header & Navigation

### TEST-UI-010: Header Initial State
- **URL:** `/`
- **Kontrol Listesi:**
  - [ ] Logo gorunuyor
  - [ ] KADIN menu gorunuyor
  - [ ] ERKEK menu gorunuyor
  - [ ] KOLEKSIYONLAR linki gorunuyor
  - [ ] HAKKIMIZDA linki gorunuyor
  - [ ] Arama ikonu gorunuyor
  - [ ] Favoriler ikonu gorunuyor
  - [ ] Sepet ikonu gorunuyor
  - [ ] Kullanici ikonu gorunuyor

---

### TEST-UI-011: Header Scroll Animation
- **URL:** `/`
- **Adimlar:**
  1. Sayfa en ustte - header stilini kontrol et
  2. 100px asagi scroll yap
  3. Header stilini tekrar kontrol et
- **Kontrol Listesi:**
  - [ ] Baslangicta header seffaf/minimal
  - [ ] Scroll sonrasi beyaz/blur arka plan
  - [ ] Gecis animasyonu smooth

---

### TEST-UI-012: Kadin Dropdown Menu
- **URL:** `/`
- **Adimlar:**
  1. KADIN menusune hover yap
- **Kontrol Listesi:**
  - [ ] Dropdown aciliyor
  - [ ] "Tum Sandaletler" linki var
  - [ ] Kategori linkleri var (Bodrum Sandalet, Terlik, vs.)
  - [ ] Linkler dogru sayfalara gidiyor

---

### TEST-UI-013: Erkek Dropdown Menu
- **URL:** `/`
- **Adimlar:**
  1. ERKEK menusune hover yap
- **Kontrol Listesi:**
  - [ ] Dropdown aciliyor
  - [ ] Kategori linkleri var
  - [ ] Linkler dogru sayfalara gidiyor

---

### TEST-UI-014: Logo Click
- **URL:** `/kadin`
- **Adimlar:**
  1. Logo'ya tikla
- **Kontrol Listesi:**
  - [ ] Ana sayfaya yonlendiriyor

---

### TEST-UI-015: Cart Icon Badge
- **URL:** `/`
- **Onkosul:** Sepete 2 urun ekli
- **Kontrol Listesi:**
  - [ ] Sepet ikonunda "2" badge gorunuyor
  - [ ] Bos sepette badge yok

---

### TEST-UI-016: Cart Drawer
- **URL:** `/`
- **Onkosul:** Sepette urun var
- **Adimlar:**
  1. Sepet ikonuna tikla
- **Kontrol Listesi:**
  - [ ] Cart drawer aciliyor
  - [ ] Urunler listeleniyor
  - [ ] Toplam gorunuyor
  - [ ] Odemeye git butonu var
  - [ ] Kapatma butonu calisiyor

---

### TEST-UI-017: User Menu - Not Logged In
- **URL:** `/`
- **Onkosul:** Giris yapilmamis
- **Adimlar:**
  1. Kullanici ikonuna tikla
- **Kontrol Listesi:**
  - [ ] Giris yap sayfasina yonlendiriyor

---

### TEST-UI-018: User Menu - Logged In
- **URL:** `/`
- **Onkosul:** Giris yapilmis
- **Adimlar:**
  1. Kullanici ikonuna tikla
- **Kontrol Listesi:**
  - [ ] Dropdown menu aciliyor
  - [ ] Hesabim linki var
  - [ ] Siparislerim linki var
  - [ ] Cikis yap linki var

---

## 3. Kadin Sayfalari

### TEST-UI-020: Kadin Main Page
- **URL:** `/kadin`
- **Kontrol Listesi:**
  - [ ] Breadcrumb: Ana Sayfa > Kadin
  - [ ] Sayfa basligi gorunuyor
  - [ ] Filtre sidebar gorunuyor (desktop)
  - [ ] Urun sayisi gorunuyor
  - [ ] Urun gridi gorunuyor
  - [ ] Siralama dropdown var

---

### TEST-UI-021: Kadin Category Page
- **URL:** `/kadin/bodrum-sandalet`
- **Kontrol Listesi:**
  - [ ] Breadcrumb: Ana Sayfa > Kadin > Bodrum Sandalet
  - [ ] Sadece Bodrum Sandalet urunleri gorunuyor
  - [ ] Urun sayisi dogru
  - [ ] URL dogru

---

### TEST-UI-022: Filter Sidebar - Category
- **URL:** `/kadin`
- **Adimlar:**
  1. Sidebar'dan "Bodrum Sandalet" kategorisini sec
- **Kontrol Listesi:**
  - [ ] Urun listesi guncelleniyor
  - [ ] Sadece secilen kategori urunleri gorunuyor
  - [ ] Aktif filtre gorunuyor
  - [ ] Filtre temizle butonu gorunuyor

---

### TEST-UI-023: Filter Sidebar - Color
- **URL:** `/kadin`
- **Adimlar:**
  1. Sidebar'dan bir renk sec (ornek: Siyah)
- **Kontrol Listesi:**
  - [ ] Urun listesi guncelleniyor
  - [ ] Sadece o renk olan urunler gorunuyor

---

### TEST-UI-024: Filter Sidebar - Size
- **URL:** `/kadin`
- **Adimlar:**
  1. Sidebar'dan bir beden sec (ornek: 38)
- **Kontrol Listesi:**
  - [ ] Urun listesi guncelleniyor
  - [ ] O bedeni olan urunler gorunuyor

---

### TEST-UI-025: Filter Sidebar - Price Range
- **URL:** `/kadin`
- **Adimlar:**
  1. Fiyat araligini ayarla (500-1000 TL)
- **Kontrol Listesi:**
  - [ ] Urun listesi guncelleniyor
  - [ ] Sadece fiyat araligindaki urunler gorunuyor

---

### TEST-UI-026: Clear Filters
- **URL:** `/kadin`
- **Onkosul:** Birkac filtre uygulanmis
- **Adimlar:**
  1. "Filtreleri Temizle" butonuna tikla
- **Kontrol Listesi:**
  - [ ] Tum filtreler temizleniyor
  - [ ] Tum urunler gorunuyor

---

### TEST-UI-027: Sort Products
- **URL:** `/kadin`
- **Adimlar:**
  1. Siralama dropdown'indan "Fiyat: Dusukten Yuksege" sec
- **Kontrol Listesi:**
  - [ ] Urunler fiyata gore sirali
  - [ ] Ilk urun en ucuz

---

### TEST-UI-028: Product Card Hover
- **URL:** `/kadin`
- **Adimlar:**
  1. Urun kartina hover yap
- **Kontrol Listesi:**
  - [ ] Ikinci gorsel gorunuyor (varsa)
  - [ ] Favori butonu gorunuyor
  - [ ] Hover animasyonu smooth

---

### TEST-UI-029: Product Card Wishlist
- **URL:** `/kadin`
- **Onkosul:** Giris yapilmis
- **Adimlar:**
  1. Urun kartindaki kalp ikonuna tikla
- **Kontrol Listesi:**
  - [ ] Ikon dolu hale geliyor
  - [ ] Toast mesaji gorunuyor
  - [ ] Tekrar tikla - ikon bos hale geliyor

---

### TEST-UI-030: Product Card Click
- **URL:** `/kadin`
- **Adimlar:**
  1. Urun kartina tikla
- **Kontrol Listesi:**
  - [ ] Urun detay sayfasina gidiyor
  - [ ] URL formati: `/kadin/[kategori]/[sku]`

---

## 4. Erkek Sayfalari

### TEST-UI-031: Erkek Main Page
- **URL:** `/erkek`
- **Kontrol Listesi:**
  - [ ] Breadcrumb: Ana Sayfa > Erkek
  - [ ] Erkek urunleri gorunuyor
  - [ ] Filtreler calisiyor

---

### TEST-UI-032: Erkek Category Page
- **URL:** `/erkek/bodrum-terlik`
- **Kontrol Listesi:**
  - [ ] Breadcrumb dogru
  - [ ] Sadece erkek terlik urunleri

---

## 5. Urun Detay

### TEST-UI-040: Product Detail Load
- **URL:** `/kadin/bodrum-sandalet/[sku]`
- **Kontrol Listesi:**
  - [ ] Sayfa yukleniyor
  - [ ] Breadcrumb dogru
  - [ ] Urun gorselleri gorunuyor
  - [ ] Urun adi gorunuyor
  - [ ] Fiyat gorunuyor
  - [ ] Aciklama gorunuyor

---

### TEST-UI-041: Product Images Gallery
- **URL:** `/kadin/bodrum-sandalet/[sku]`
- **Kontrol Listesi:**
  - [ ] Ana gorsel buyuk gorunuyor
  - [ ] Thumbnail'lar gorunuyor
  - [ ] Thumbnail tiklaninca ana gorsel degisiyor
  - [ ] Ok butonlari calisiyor (varsa)

---

### TEST-UI-042: Color Selection
- **URL:** `/kadin/bodrum-sandalet/[sku]`
- **Onkosul:** Urunun birden fazla rengi var
- **Adimlar:**
  1. Farkli bir renk sec
- **Kontrol Listesi:**
  - [ ] Renk secenekleri gorunuyor
  - [ ] Secilen renk vurgulaniyor
  - [ ] Gorseller secilen renge gore filtreleniyor
  - [ ] Stok bilgisi guncelleniyor

---

### TEST-UI-043: Size Selection
- **URL:** `/kadin/bodrum-sandalet/[sku]`
- **Kontrol Listesi:**
  - [ ] Beden secenekleri gorunuyor
  - [ ] Stokta olmayan bedenler isaretli (disabled)
  - [ ] Beden secilince buton aktif oluyor

---

### TEST-UI-044: Quantity Selector
- **URL:** `/kadin/bodrum-sandalet/[sku]`
- **Onkosul:** Renk ve beden secili
- **Adimlar:**
  1. + butonuna tikla
  2. - butonuna tikla
- **Kontrol Listesi:**
  - [ ] Miktar artip azaliyor
  - [ ] Minimum 1
  - [ ] Maximum stok kadar

---

### TEST-UI-045: Add to Cart - Success
- **URL:** `/kadin/bodrum-sandalet/[sku]`
- **Onkosul:** Renk ve beden secili
- **Adimlar:**
  1. "Sepete Ekle" butonuna tikla
- **Kontrol Listesi:**
  - [ ] Basari mesaji gorunuyor
  - [ ] Sepet ikonu badge guncelleniyor
  - [ ] Cart drawer aciliyor (opsiyonel)

---

### TEST-UI-046: Add to Cart - No Size
- **URL:** `/kadin/bodrum-sandalet/[sku]`
- **Onkosul:** Beden secilmemis
- **Kontrol Listesi:**
  - [ ] "Sepete Ekle" butonu disabled
  - [ ] Veya tiklaninca uyari veriyor

---

### TEST-UI-047: Add to Wishlist
- **URL:** `/kadin/bodrum-sandalet/[sku]`
- **Onkosul:** Giris yapilmis
- **Adimlar:**
  1. Kalp ikonuna tikla
- **Kontrol Listesi:**
  - [ ] Ikon dolu hale geliyor
  - [ ] Toast mesaji gorunuyor
  - [ ] Favorilerime eklendi

---

### TEST-UI-048: Add to Wishlist - Not Logged In
- **URL:** `/kadin/bodrum-sandalet/[sku]`
- **Onkosul:** Giris yapilmamis
- **Adimlar:**
  1. Kalp ikonuna tikla
- **Kontrol Listesi:**
  - [ ] Giris sayfasina yonlendiriyor
  - [ ] callbackUrl dogru

---

### TEST-UI-049: Product Tabs
- **URL:** `/kadin/bodrum-sandalet/[sku]`
- **Kontrol Listesi:**
  - [ ] "Urun Detaylari" tab var
  - [ ] "Kargo & Iade" tab var
  - [ ] "Degerlendirmeler" tab var
  - [ ] Tab'lar arasi gecis calisiyor

---

### TEST-UI-050: Product Details Tab
- **URL:** `/kadin/bodrum-sandalet/[sku]`
- **Adimlar:**
  1. "Urun Detaylari" tab'ina tikla
- **Kontrol Listesi:**
  - [ ] Aciklama gorunuyor
  - [ ] Malzeme bilgisi var
  - [ ] Taban tipi var
  - [ ] SKU gorunuyor
  - [ ] Bakim talimatlari var

---

### TEST-UI-051: Related Products
- **URL:** `/kadin/bodrum-sandalet/[sku]`
- **Kontrol Listesi:**
  - [ ] "Benzer Urunler" section var
  - [ ] Urun kartlari gorunuyor
  - [ ] Kartlar tiklanabilir

---

### TEST-UI-052: Product Badges
- **URL:** `/kadin/bodrum-sandalet/[sku]`
- **Onkosul:** Urun indirimli veya yeni
- **Kontrol Listesi:**
  - [ ] "Yeni" badge gorunuyor (isNew)
  - [ ] "-%X" badge gorunuyor (indirimli)
  - [ ] "Cok Satan" badge gorunuyor (isBestSeller)

---

### TEST-UI-053: Out of Stock Product
- **URL:** `/kadin/bodrum-sandalet/[stoksuz-sku]`
- **Onkosul:** Urun tamamen stokta yok
- **Kontrol Listesi:**
  - [ ] "Stokta Yok" mesaji gorunuyor
  - [ ] Sepete ekle butonu disabled
  - [ ] Tum bedenler disabled

---

## 6. Koleksiyonlar

### TEST-UI-060: Collections List
- **URL:** `/koleksiyonlar`
- **Kontrol Listesi:**
  - [ ] Koleksiyon kartlari gorunuyor
  - [ ] Her kartta gorsel var
  - [ ] Her kartta isim var
  - [ ] Kartlar tiklanabilir

---

### TEST-UI-061: Collection Detail
- **URL:** `/koleksiyonlar/[slug]`
- **Kontrol Listesi:**
  - [ ] Koleksiyon hero gorunuyor
  - [ ] Koleksiyon adi gorunuyor
  - [ ] Aciklama gorunuyor
  - [ ] Urunler vitrin layout'ta

---

### TEST-UI-062: Collection Product Click
- **URL:** `/koleksiyonlar/[slug]`
- **Adimlar:**
  1. Bir urune tikla
- **Kontrol Listesi:**
  - [ ] Urun detay sayfasina gidiyor
  - [ ] URL dogru formatta

---

## 7. Sepet

### TEST-UI-070: Cart Page - Empty
- **URL:** `/sepet`
- **Onkosul:** Sepet bos
- **Kontrol Listesi:**
  - [ ] "Sepetiniz bos" mesaji
  - [ ] Alisverise devam linki
  - [ ] Urun onerileri (opsiyonel)

---

### TEST-UI-071: Cart Page - With Items
- **URL:** `/sepet`
- **Onkosul:** Sepette urun var
- **Kontrol Listesi:**
  - [ ] Urunler listeleniyor
  - [ ] Her urunde gorsel var
  - [ ] Her urunde isim, renk, beden var
  - [ ] Fiyat gorunuyor
  - [ ] Ara toplam dogru

---

### TEST-UI-072: Cart - Update Quantity
- **URL:** `/sepet`
- **Adimlar:**
  1. + butonuna tikla
- **Kontrol Listesi:**
  - [ ] Miktar artiyor
  - [ ] Toplam guncelleniyor
  - [ ] Maximum stok kadar

---

### TEST-UI-073: Cart - Remove Item
- **URL:** `/sepet`
- **Adimlar:**
  1. Sil butonuna tikla
- **Kontrol Listesi:**
  - [ ] Onay dialog gorunuyor (varsa)
  - [ ] Urun sepetten cikariyor
  - [ ] Toplam guncelleniyor

---

### TEST-UI-074: Cart - Coupon Apply
- **URL:** `/sepet`
- **Adimlar:**
  1. Kupon kodu gir: `INDIRIM10`
  2. Uygula butonuna tikla
- **Kontrol Listesi:**
  - [ ] Indirim hesaplaniyor
  - [ ] Indirim tutari gorunuyor
  - [ ] Toplam guncelleniyor

---

### TEST-UI-075: Cart - Coupon Remove
- **URL:** `/sepet`
- **Onkosul:** Kupon uygulanmis
- **Adimlar:**
  1. Kuponu kaldir butonuna tikla
- **Kontrol Listesi:**
  - [ ] Indirim kalkiyor
  - [ ] Toplam guncelleniyor

---

### TEST-UI-076: Cart - Shipping Threshold
- **URL:** `/sepet`
- **Kontrol Listesi:**
  - [ ] 500 TL alti: Kargo ucreti 49.90 TL
  - [ ] 500 TL ustu: Ucretsiz kargo
  - [ ] Esik mesaji gorunuyor

---

### TEST-UI-077: Cart - Checkout Button
- **URL:** `/sepet`
- **Adimlar:**
  1. "Odemeye Git" butonuna tikla
- **Kontrol Listesi:**
  - [ ] Odeme sayfasina yonlendiriyor
  - [ ] Giris yapilmamissa giris sayfasina (veya misafir devam)

---

## 8. Odeme

### TEST-UI-080: Checkout Page Load
- **URL:** `/odeme`
- **Onkosul:** Sepette urun var
- **Kontrol Listesi:**
  - [ ] 3 adimli form gorunuyor
  - [ ] Siparis ozeti gorunuyor
  - [ ] Adim 1 aktif (Teslimat)

---

### TEST-UI-081: Checkout Step 1 - Shipping
- **URL:** `/odeme`
- **Kontrol Listesi:**
  - [ ] Kayitli adres secenegi var (giris yapildiysa)
  - [ ] Yeni adres formu var
  - [ ] Ad, soyad, telefon alanlari
  - [ ] Sehir dropdown
  - [ ] Ilce dropdown (sehire bagli)
  - [ ] Adres textarea
  - [ ] Devam butonu

---

### TEST-UI-082: Checkout - City/District Cascade
- **URL:** `/odeme`
- **Adimlar:**
  1. Sehir sec: Istanbul
- **Kontrol Listesi:**
  - [ ] Ilce dropdown doldu
  - [ ] Istanbul ilceleri gorunuyor

---

### TEST-UI-083: Checkout - Saved Address
- **URL:** `/odeme`
- **Onkosul:** Giris yapilmis, kayitli adres var
- **Adimlar:**
  1. Kayitli adresi sec
  2. Devam butonuna tikla
- **Kontrol Listesi:**
  - [ ] Adres seciliyor
  - [ ] Form doluyor
  - [ ] Adim 2'ye geciyor

---

### TEST-UI-084: Checkout Step 2 - Payment
- **URL:** `/odeme`
- **Onkosul:** Adim 1 tamamlanmis
- **Kontrol Listesi:**
  - [ ] Odeme yontemi secenekleri
  - [ ] Kredi karti formu (varsa)
  - [ ] Kapida odeme secenegi (varsa)

---

### TEST-UI-085: Checkout Step 3 - Review
- **URL:** `/odeme`
- **Onkosul:** Adim 1 ve 2 tamamlanmis
- **Kontrol Listesi:**
  - [ ] Siparis ozeti gorunuyor
  - [ ] Teslimat adresi gorunuyor
  - [ ] Odeme yontemi gorunuyor
  - [ ] Sozlesme onay checkbox'lari
  - [ ] "Siparisi Tamamla" butonu

---

### TEST-UI-086: Checkout - Place Order
- **URL:** `/odeme`
- **Onkosul:** Tum adimlar tamamlanmis
- **Adimlar:**
  1. Sozlesmeleri onayla
  2. "Siparisi Tamamla" butonuna tikla
- **Kontrol Listesi:**
  - [ ] Siparis olusturuyor
  - [ ] Onay sayfasina yonlendiriyor
  - [ ] Siparis numarasi gorunuyor

---

### TEST-UI-087: Checkout - Back Navigation
- **URL:** `/odeme`
- **Adimlar:**
  1. Adim 2'de iken "Geri" butonuna tikla
- **Kontrol Listesi:**
  - [ ] Adim 1'e donuyor
  - [ ] Veriler korunuyor

---

### TEST-UI-088: Order Confirmation Page
- **URL:** `/siparis-tamamlandi/[orderNumber]`
- **Kontrol Listesi:**
  - [ ] Basari mesaji gorunuyor
  - [ ] Siparis numarasi gorunuyor
  - [ ] Siparis detaylari gorunuyor
  - [ ] "Siparislerime Git" linki

---

## 9. Hesabim

### TEST-UI-090: Account Dashboard
- **URL:** `/hesabim`
- **Onkosul:** Giris yapilmis
- **Kontrol Listesi:**
  - [ ] Sidebar menu gorunuyor
  - [ ] Hosgeldin mesaji
  - [ ] Ozet istatistikler (siparis, favori sayisi)

---

### TEST-UI-091: Account Sidebar Navigation
- **URL:** `/hesabim`
- **Kontrol Listesi:**
  - [ ] Siparislerim linki calisiyor
  - [ ] Adreslerim linki calisiyor
  - [ ] Bilgilerim linki calisiyor
  - [ ] Favorilerim linki calisiyor
  - [ ] Sifre Degistir linki calisiyor
  - [ ] Cikis linki calisiyor

---

### TEST-UI-092: Orders Page
- **URL:** `/hesabim/siparislerim`
- **Kontrol Listesi:**
  - [ ] Siparis listesi gorunuyor
  - [ ] Her sipariste numara, tarih, durum var
  - [ ] Detaya git linki

---

### TEST-UI-093: Order Detail Page
- **URL:** `/hesabim/siparislerim/[id]`
- **Kontrol Listesi:**
  - [ ] Siparis numarasi gorunuyor
  - [ ] Siparis durumu gorunuyor
  - [ ] Timeline gorunuyor
  - [ ] Urunler listeleniyor
  - [ ] Teslimat adresi gorunuyor
  - [ ] Kargo takip numarasi (varsa)

---

### TEST-UI-094: Addresses Page
- **URL:** `/hesabim/adreslerim`
- **Kontrol Listesi:**
  - [ ] Adres kartlari gorunuyor
  - [ ] Varsayilan adres isaretli
  - [ ] Duzenle butonu var
  - [ ] Sil butonu var
  - [ ] Yeni adres ekle butonu var

---

### TEST-UI-095: Add New Address
- **URL:** `/hesabim/adreslerim`
- **Adimlar:**
  1. "Yeni Adres Ekle" butonuna tikla
  2. Formu doldur
  3. Kaydet
- **Kontrol Listesi:**
  - [ ] Form gorunuyor
  - [ ] Kayit basarili
  - [ ] Listeye eklendi

---

### TEST-UI-096: Edit Address
- **URL:** `/hesabim/adreslerim`
- **Adimlar:**
  1. Bir adresin "Duzenle" butonuna tikla
  2. Degisiklik yap
  3. Kaydet
- **Kontrol Listesi:**
  - [ ] Form onceki verilerle dolu
  - [ ] Guncelleme basarili

---

### TEST-UI-097: Delete Address
- **URL:** `/hesabim/adreslerim`
- **Adimlar:**
  1. Bir adresin "Sil" butonuna tikla
- **Kontrol Listesi:**
  - [ ] Onay dialog gorunuyor
  - [ ] Onaylaninca siliniyor
  - [ ] Listeden kalkiyor

---

### TEST-UI-098: Profile Page
- **URL:** `/hesabim/bilgilerim`
- **Kontrol Listesi:**
  - [ ] Ad gorunuyor
  - [ ] Email gorunuyor
  - [ ] Telefon gorunuyor
  - [ ] Duzenle formu

---

### TEST-UI-099: Update Profile
- **URL:** `/hesabim/bilgilerim`
- **Adimlar:**
  1. Ismi degistir
  2. Kaydet
- **Kontrol Listesi:**
  - [ ] Basari mesaji
  - [ ] Isim guncellendi

---

### TEST-UI-100: Favorites Page
- **URL:** `/hesabim/favorilerim`
- **Kontrol Listesi:**
  - [ ] Favori urunler listeleniyor
  - [ ] Urun kartlari tiklanabilir
  - [ ] URL formati dogru (/kadin/kategori/sku)
  - [ ] Favoriden cikar butonu var

---

### TEST-UI-101: Remove from Favorites
- **URL:** `/hesabim/favorilerim`
- **Adimlar:**
  1. Bir urunun kalp ikonuna tikla
- **Kontrol Listesi:**
  - [ ] Urun listeden kalkiyor
  - [ ] Toast mesaji gorunuyor

---

### TEST-UI-102: Change Password Page
- **URL:** `/hesabim/sifre-degistir`
- **Kontrol Listesi:**
  - [ ] Mevcut sifre alani
  - [ ] Yeni sifre alani
  - [ ] Yeni sifre tekrar alani
  - [ ] Degistir butonu

---

### TEST-UI-103: Change Password - Success
- **URL:** `/hesabim/sifre-degistir`
- **Adimlar:**
  1. Mevcut sifreyi gir
  2. Yeni sifreyi gir (2 kez)
  3. Degistir butonuna tikla
- **Kontrol Listesi:**
  - [ ] Basari mesaji
  - [ ] Yeni sifre ile giris yapilabilir

---

### TEST-UI-104: Logout
- **URL:** `/hesabim`
- **Adimlar:**
  1. "Cikis Yap" linkine tikla
- **Kontrol Listesi:**
  - [ ] Session sonlaniyor
  - [ ] Ana sayfaya yonlendiriyor
  - [ ] Header'da giris butonu gorunuyor

---

## 10. Authentication

### TEST-UI-110: Login Page
- **URL:** `/giris`
- **Kontrol Listesi:**
  - [ ] Email input var
  - [ ] Password input var
  - [ ] Giris yap butonu var
  - [ ] Kayit ol linki var
  - [ ] Sifremi unuttum linki var
  - [ ] Google ile giris butonu (varsa)

---

### TEST-UI-111: Login - Success
- **URL:** `/giris`
- **Adimlar:**
  1. Email gir
  2. Password gir
  3. Giris yap'a tikla
- **Kontrol Listesi:**
  - [ ] Basarili giriste yonlendirme
  - [ ] Hesabim sayfasina gidiyor
  - [ ] callbackUrl varsa oraya gidiyor

---

### TEST-UI-112: Login - Invalid Credentials
- **URL:** `/giris`
- **Adimlar:**
  1. Yanlis email/password gir
  2. Giris yap'a tikla
- **Kontrol Listesi:**
  - [ ] Hata mesaji gorunuyor
  - [ ] Form temizlenmiyor

---

### TEST-UI-113: Login - Loading State
- **URL:** `/giris`
- **Adimlar:**
  1. Formu doldur
  2. Giris yap'a tikla
- **Kontrol Listesi:**
  - [ ] Buton loading state'e geciyor
  - [ ] Spinner gorunuyor

---

### TEST-UI-114: Register Page
- **URL:** `/kayit`
- **Kontrol Listesi:**
  - [ ] Ad input var
  - [ ] Email input var
  - [ ] Password input var
  - [ ] Kayit ol butonu var
  - [ ] Giris yap linki var

---

### TEST-UI-115: Register - Success
- **URL:** `/kayit`
- **Adimlar:**
  1. Formu doldur
  2. Kayit ol'a tikla
- **Kontrol Listesi:**
  - [ ] Basari mesaji
  - [ ] Giris sayfasina veya dashboarda yonlendiriyor

---

### TEST-UI-116: Register - Validation
- **URL:** `/kayit`
- **Adimlar:**
  1. Bos form gonder
- **Kontrol Listesi:**
  - [ ] Zorunlu alan hatalari gorunuyor

---

### TEST-UI-117: Forgot Password Page
- **URL:** `/sifremi-unuttum`
- **Kontrol Listesi:**
  - [ ] Email input var
  - [ ] Gonder butonu var
  - [ ] Giris yap linki var

---

### TEST-UI-118: Forgot Password - Submit
- **URL:** `/sifremi-unuttum`
- **Adimlar:**
  1. Email gir
  2. Gonder'e tikla
- **Kontrol Listesi:**
  - [ ] Basari mesaji gorunuyor
  - [ ] Email gonderildi bilgisi

---

### TEST-UI-119: Reset Password Page
- **URL:** `/sifre-sifirla/[token]`
- **Kontrol Listesi:**
  - [ ] Yeni sifre input var
  - [ ] Sifre tekrar input var
  - [ ] Sifirla butonu var

---

## 11. Arama

### TEST-UI-120: Search Dialog Open
- **URL:** `/` (herhangi bir sayfa)
- **Adimlar:**
  1. Arama ikonuna tikla
- **Kontrol Listesi:**
  - [ ] Search dialog aciliyor
  - [ ] Input focus oluyor
  - [ ] Esc ile kapaniyor

---

### TEST-UI-121: Search - Type Query
- **URL:** `/`
- **Adimlar:**
  1. Arama dialog'u ac
  2. "bodrum" yaz
- **Kontrol Listesi:**
  - [ ] Yazarken sonuclar gorunuyor
  - [ ] Debounce calisiyor

---

### TEST-UI-122: Search - Click Result
- **URL:** `/`
- **Adimlar:**
  1. Arama dialog'u ac
  2. "bodrum" yaz
  3. Bir sonuca tikla
- **Kontrol Listesi:**
  - [ ] Urun sayfasina gidiyor
  - [ ] Dialog kapaniyor

---

### TEST-UI-123: Search - No Results
- **URL:** `/`
- **Adimlar:**
  1. Arama dialog'u ac
  2. "asdfghjkl" yaz (sonuc yok)
- **Kontrol Listesi:**
  - [ ] "Sonuc bulunamadi" mesaji

---

### TEST-UI-124: Search Results Page
- **URL:** `/arama?q=sandalet`
- **Kontrol Listesi:**
  - [ ] Arama sonuclari gorunuyor
  - [ ] Filtreler calisiyor
  - [ ] Siralama calisiyor

---

## 12. Bilgi Sayfalari

### TEST-UI-130: About Page
- **URL:** `/hakkimizda`
- **Kontrol Listesi:**
  - [ ] Hero section gorunuyor
  - [ ] Hikaye section gorunuyor
  - [ ] Degerler section gorunuyor
  - [ ] Gallery gorunuyor

---

### TEST-UI-131: Contact Page
- **URL:** `/iletisim`
- **Kontrol Listesi:**
  - [ ] Iletisim formu gorunuyor
  - [ ] Ad, email, konu, mesaj alanlari
  - [ ] Gonder butonu

---

### TEST-UI-132: Contact Form Submit
- **URL:** `/iletisim`
- **Adimlar:**
  1. Formu doldur
  2. Gonder'e tikla
- **Kontrol Listesi:**
  - [ ] Basari mesaji gorunuyor
  - [ ] Form temizleniyor

---

### TEST-UI-133: Size Guide Page
- **URL:** `/beden-rehberi`
- **Kontrol Listesi:**
  - [ ] Beden tablosu gorunuyor
  - [ ] Olcum bilgileri var

---

### TEST-UI-134: FAQ Page
- **URL:** `/sss`
- **Kontrol Listesi:**
  - [ ] SSS listesi gorunuyor
  - [ ] Accordion calisiyor
  - [ ] Soruya tiklaninca cevap aciliyor

---

### TEST-UI-135: Dynamic CMS Page
- **URL:** `/sayfa/[slug]`
- **Kontrol Listesi:**
  - [ ] Sayfa yukleniyor
  - [ ] Icerik gorunuyor
  - [ ] Meta bilgileri dogru

---

## 13. Error States

### TEST-UI-140: 404 Page
- **URL:** `/olmayan-sayfa`
- **Kontrol Listesi:**
  - [ ] 404 sayfasi gorunuyor
  - [ ] Hata mesaji var
  - [ ] Ana sayfaya link var

---

### TEST-UI-141: Product Not Found
- **URL:** `/kadin/sandalet/OLMAYAN-SKU`
- **Kontrol Listesi:**
  - [ ] 404 veya "urun bulunamadi" sayfasi
  - [ ] Kullanici bilgilendiriliyor

---

### TEST-UI-142: Server Error (500)
- **Onkosul:** Backend hatasi simule et
- **Kontrol Listesi:**
  - [ ] Hata sayfasi gorunuyor
  - [ ] Tekrar dene butonu var (varsa)

---

## 14. Responsive

### TEST-UI-150: Mobile - Homepage
- **Viewport:** 375x812
- **URL:** `/`
- **Kontrol Listesi:**
  - [ ] Hamburger menu gorunuyor
  - [ ] Logo gorunuyor
  - [ ] Hero responsive
  - [ ] Urun gridi 2 kolon
  - [ ] Footer responsive

---

### TEST-UI-151: Mobile - Navigation
- **Viewport:** 375x812
- **Adimlar:**
  1. Hamburger menuye tikla
- **Kontrol Listesi:**
  - [ ] Menu aciliyor
  - [ ] Linkler gorunuyor
  - [ ] Kapatma calisiyor

---

### TEST-UI-152: Mobile - Product Grid
- **Viewport:** 375x812
- **URL:** `/kadin`
- **Kontrol Listesi:**
  - [ ] 2 kolonlu grid
  - [ ] Kartlar dogru boyutta
  - [ ] Scroll calisiyor

---

### TEST-UI-153: Mobile - Filters
- **Viewport:** 375x812
- **URL:** `/kadin`
- **Adimlar:**
  1. "Filtrele" butonuna tikla
- **Kontrol Listesi:**
  - [ ] Filtre drawer aciliyor
  - [ ] Filtreler calisiyor
  - [ ] Kapatma butonu var

---

### TEST-UI-154: Mobile - Product Detail
- **Viewport:** 375x812
- **URL:** `/kadin/sandalet/[sku]`
- **Kontrol Listesi:**
  - [ ] Gorsel tam genislik
  - [ ] Butonlar ulasabilir
  - [ ] Form elemanlar touch-friendly

---

### TEST-UI-155: Mobile - Checkout
- **Viewport:** 375x812
- **URL:** `/odeme`
- **Kontrol Listesi:**
  - [ ] Form alanlari dogru boyutta
  - [ ] Dropdown'lar calisiyor
  - [ ] Butonlar tam genislik

---

### TEST-UI-156: Tablet View
- **Viewport:** 768x1024
- **URL:** `/kadin`
- **Kontrol Listesi:**
  - [ ] 3 kolonlu grid
  - [ ] Sidebar gorunebilir veya gizli
  - [ ] Layout dengeli

---

## Test Ozeti

| Kategori | Test Sayisi |
|----------|-------------|
| Homepage | 8 |
| Header & Navigation | 9 |
| Kadin Sayfalari | 11 |
| Erkek Sayfalari | 2 |
| Urun Detay | 14 |
| Koleksiyonlar | 3 |
| Sepet | 8 |
| Odeme | 9 |
| Hesabim | 15 |
| Authentication | 10 |
| Arama | 5 |
| Bilgi Sayfalari | 6 |
| Error States | 3 |
| Responsive | 7 |
| **TOPLAM** | **~110** |

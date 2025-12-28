# Admin Panel Testleri

## Genel Bilgiler

- **Base URL:** `http://localhost:3000/admin`
- **Auth:** Admin veya Super Admin session gerekli
- **Toplam Test:** ~124

---

## Icerik

1. [Dashboard](#1-dashboard)
2. [Urunler](#2-urunler)
3. [Kategoriler](#3-kategoriler)
4. [Koleksiyonlar](#4-koleksiyonlar)
5. [Siparisler](#5-siparisler)
6. [Kullanicilar](#6-kullanicilar)
7. [Kuponlar](#7-kuponlar)
8. [Bannerlar](#8-bannerlar)
9. [Sayfalar](#9-sayfalar)
10. [Ayarlar](#10-ayarlar)
11. [Stok Yonetimi](#11-stok-yonetimi)

---

## 1. Dashboard

### TEST-ADM-001: Dashboard Load
- **URL:** `/admin`
- **Auth:** Admin session
- **Kontrol Listesi:**
  - [ ] Sayfa yukleniyor
  - [ ] Sidebar gorunuyor
  - [ ] Stat kartlari gorunuyor

---

### TEST-ADM-002: Dashboard Stats
- **URL:** `/admin`
- **Kontrol Listesi:**
  - [ ] Toplam gelir karti gorunuyor
  - [ ] Siparis sayisi gorunuyor
  - [ ] Urun sayisi gorunuyor
  - [ ] Kullanici sayisi gorunuyor
  - [ ] Degerler dogru hesaplanmis

---

### TEST-ADM-003: Dashboard - Quick Stats
- **URL:** `/admin`
- **Kontrol Listesi:**
  - [ ] Bekleyen siparis sayisi
  - [ ] Aylik gelir
  - [ ] Aktif urun sayisi

---

### TEST-ADM-004: Dashboard - Recent Orders
- **URL:** `/admin`
- **Kontrol Listesi:**
  - [ ] Son siparisler tablosu gorunuyor
  - [ ] Siparis numarasi tiklanabilir
  - [ ] Durum badge gorunuyor

---

### TEST-ADM-005: Dashboard - Sales Chart
- **URL:** `/admin`
- **Kontrol Listesi:**
  - [ ] Son 7 gun grafigi gorunuyor
  - [ ] Veriler dogru

---

### TEST-ADM-006: Admin Access Control - User Role
- **URL:** `/admin`
- **Auth:** Customer session (CUSTOMER role)
- **Kontrol Listesi:**
  - [ ] 403 sayfasi veya login'e yonlendirme
  - [ ] Admin panele erisilemiyor

---

### TEST-ADM-007: Admin Access Control - No Auth
- **URL:** `/admin`
- **Auth:** Yok
- **Kontrol Listesi:**
  - [ ] Login sayfasina yonlendirme

---

### TEST-ADM-008: Admin Sidebar Navigation
- **URL:** `/admin`
- **Kontrol Listesi:**
  - [ ] Dashboard linki calisiyor
  - [ ] Urunler linki calisiyor
  - [ ] Kategoriler linki calisiyor
  - [ ] Koleksiyonlar linki calisiyor
  - [ ] Siparisler linki calisiyor
  - [ ] Kullanicilar linki calisiyor
  - [ ] Kuponlar linki calisiyor
  - [ ] Bannerlar linki calisiyor
  - [ ] Sayfalar linki calisiyor
  - [ ] Ayarlar linki calisiyor

---

## 2. Urunler

### TEST-ADM-010: Products List
- **URL:** `/admin/urunler`
- **Kontrol Listesi:**
  - [ ] Urun listesi gorunuyor
  - [ ] Tablo kolonlari: Gorsel, Isim, SKU, Fiyat, Stok, Durum
  - [ ] Pagination calisiyor
  - [ ] Arama calisiyor

---

### TEST-ADM-011: Products - Filter by Status
- **URL:** `/admin/urunler`
- **Adimlar:**
  1. Durum filtresini sec: "DRAFT"
- **Kontrol Listesi:**
  - [ ] Sadece DRAFT urunler gorunuyor

---

### TEST-ADM-012: Products - Search
- **URL:** `/admin/urunler`
- **Adimlar:**
  1. Arama kutusuna "bodrum" yaz
- **Kontrol Listesi:**
  - [ ] Arama sonuclari filtreleniyor

---

### TEST-ADM-013: Create Product - Page Load
- **URL:** `/admin/urunler/yeni`
- **Kontrol Listesi:**
  - [ ] Form gorunuyor
  - [ ] Temel bilgiler section
  - [ ] Gorseller section
  - [ ] Varyantlar section
  - [ ] Fiyatlandirma section
  - [ ] Kategori/Koleksiyon section

---

### TEST-ADM-014: Create Product - Basic Info
- **URL:** `/admin/urunler/yeni`
- **Adimlar:**
  1. Urun adi gir: "Test Sandalet"
  2. Slug gir: "test-sandalet"
  3. SKU gir: "TS-001"
  4. Aciklama gir
- **Kontrol Listesi:**
  - [ ] Alanlar dolduruluyor
  - [ ] Slug validation calisiyor

---

### TEST-ADM-015: Create Product - Image Upload
- **URL:** `/admin/urunler/yeni`
- **Adimlar:**
  1. Gorsel yukle butonuna tikla
  2. Bir gorsel sec
- **Kontrol Listesi:**
  - [ ] Gorsel yukleniyor
  - [ ] Preview gorunuyor
  - [ ] Cloudinary'e yuklendi

---

### TEST-ADM-016: Create Product - Image Reorder
- **URL:** `/admin/urunler/yeni`
- **Onkosul:** Birden fazla gorsel yuklenmis
- **Adimlar:**
  1. Gorseli suruklayip baska siraya birak
- **Kontrol Listesi:**
  - [ ] Siralama degisiyor
  - [ ] Position guncelleniyor

---

### TEST-ADM-017: Create Product - Add Variant
- **URL:** `/admin/urunler/yeni`
- **Adimlar:**
  1. "Varyant Ekle" butonuna tikla
  2. Beden sec: 38
  3. Renk gir: Siyah
  4. Renk kodu gir: #000000
  5. Stok gir: 10
- **Kontrol Listesi:**
  - [ ] Varyant ekleniyor
  - [ ] Tum alanlar dolduruluyor

---

### TEST-ADM-018: Create Product - Multiple Variants
- **URL:** `/admin/urunler/yeni`
- **Adimlar:**
  1. 3 farkli varyant ekle (38-Siyah, 39-Siyah, 38-Kahve)
- **Kontrol Listesi:**
  - [ ] Tum varyantlar listeleniyor
  - [ ] Her biri ayri satirda

---

### TEST-ADM-019: Create Product - Category Selection
- **URL:** `/admin/urunler/yeni`
- **Adimlar:**
  1. Kategori dropdown'indan sec
- **Kontrol Listesi:**
  - [ ] Kategoriler listeleniyor
  - [ ] Secim kaydediliyor

---

### TEST-ADM-020: Create Product - Save Draft
- **URL:** `/admin/urunler/yeni`
- **Adimlar:**
  1. Formu doldur
  2. Durum: DRAFT
  3. Kaydet'e tikla
- **Kontrol Listesi:**
  - [ ] Urun kaydedildi
  - [ ] Liste sayfasina yonlendirme
  - [ ] DRAFT olarak gorunuyor

---

### TEST-ADM-021: Create Product - Save Active
- **URL:** `/admin/urunler/yeni`
- **Adimlar:**
  1. Formu doldur
  2. Durum: ACTIVE
  3. Kaydet'e tikla
- **Kontrol Listesi:**
  - [ ] Urun kaydedildi
  - [ ] Sitede gorunuyor

---

### TEST-ADM-022: Create Product - Validation Error
- **URL:** `/admin/urunler/yeni`
- **Adimlar:**
  1. Bos form gonder
- **Kontrol Listesi:**
  - [ ] Validation hatalari gorunuyor
  - [ ] Zorunlu alanlar isaretli

---

### TEST-ADM-023: Edit Product - Page Load
- **URL:** `/admin/urunler/[id]`
- **Kontrol Listesi:**
  - [ ] Form onceki verilerle dolu
  - [ ] Gorseller gorunuyor
  - [ ] Varyantlar gorunuyor

---

### TEST-ADM-024: Edit Product - Update Info
- **URL:** `/admin/urunler/[id]`
- **Adimlar:**
  1. Ismi degistir
  2. Kaydet'e tikla
- **Kontrol Listesi:**
  - [ ] Isim guncellendi
  - [ ] Basari mesaji

---

### TEST-ADM-025: Edit Product - Add More Images
- **URL:** `/admin/urunler/[id]`
- **Adimlar:**
  1. Yeni gorsel ekle
- **Kontrol Listesi:**
  - [ ] Gorsel eklendi
  - [ ] Siraya eklendi

---

### TEST-ADM-026: Edit Product - Remove Image
- **URL:** `/admin/urunler/[id]`
- **Adimlar:**
  1. Bir gorselin sil butonuna tikla
- **Kontrol Listesi:**
  - [ ] Gorsel silindi
  - [ ] Listeden kalkti

---

### TEST-ADM-027: Edit Product - Update Variant Stock
- **URL:** `/admin/urunler/[id]`
- **Adimlar:**
  1. Bir varyantin stok degerini degistir
  2. Kaydet
- **Kontrol Listesi:**
  - [ ] Stok guncellendi

---

### TEST-ADM-028: Delete Product
- **URL:** `/admin/urunler/[id]`
- **Adimlar:**
  1. "Sil" butonuna tikla
  2. Onayla
- **Kontrol Listesi:**
  - [ ] Onay dialog gorunuyor
  - [ ] Urun silindi
  - [ ] Listeden kalkti

---

### TEST-ADM-029: Products - Bulk Actions
- **URL:** `/admin/urunler`
- **Adimlar:**
  1. Birkac urun sec
  2. Toplu islem sec (ornek: Durumu degistir)
- **Kontrol Listesi:**
  - [ ] Toplu secim calisiyor
  - [ ] Toplu islem uygulanıyor

---

## 3. Kategoriler

### TEST-ADM-030: Categories List
- **URL:** `/admin/kategoriler`
- **Kontrol Listesi:**
  - [ ] Kategori listesi gorunuyor
  - [ ] Her kategoride urun sayisi var
  - [ ] Duzenle/Sil butonlari var

---

### TEST-ADM-031: Create Category
- **URL:** `/admin/kategoriler`
- **Adimlar:**
  1. "Yeni Kategori" butonuna tikla
  2. Isim gir: "Test Kategori"
  3. Slug gir: "test-kategori"
  4. Gender sec: KADIN
  5. Kaydet
- **Kontrol Listesi:**
  - [ ] Kategori olusturuldu
  - [ ] Listeye eklendi

---

### TEST-ADM-032: Create Category - Duplicate Slug+Gender
- **URL:** `/admin/kategoriler`
- **Onkosul:** Ayni slug+gender var
- **Adimlar:**
  1. Ayni bilgilerle kategori olustur
- **Kontrol Listesi:**
  - [ ] Hata mesaji gorunuyor
  - [ ] Unique constraint hatasi

---

### TEST-ADM-033: Edit Category
- **URL:** `/admin/kategoriler/[id]`
- **Adimlar:**
  1. Ismi degistir
  2. Kaydet
- **Kontrol Listesi:**
  - [ ] Kategori guncellendi

---

### TEST-ADM-034: Delete Category - Empty
- **URL:** `/admin/kategoriler`
- **Onkosul:** Kategoride urun yok
- **Adimlar:**
  1. Sil butonuna tikla
  2. Onayla
- **Kontrol Listesi:**
  - [ ] Kategori silindi

---

### TEST-ADM-035: Delete Category - With Products
- **URL:** `/admin/kategoriler`
- **Onkosul:** Kategoride urun var
- **Adimlar:**
  1. Sil butonuna tikla
- **Kontrol Listesi:**
  - [ ] Hata mesaji gorunuyor
  - [ ] Silinemiyor (urunler var)

---

## 4. Koleksiyonlar

### TEST-ADM-040: Collections List
- **URL:** `/admin/koleksiyonlar`
- **Kontrol Listesi:**
  - [ ] Koleksiyon listesi gorunuyor
  - [ ] Urun sayisi gorunuyor
  - [ ] Durum gorunuyor

---

### TEST-ADM-041: Create Collection
- **URL:** `/admin/koleksiyonlar`
- **Adimlar:**
  1. "Yeni Koleksiyon" butonuna tikla
  2. Bilgileri doldur
  3. Kaydet
- **Kontrol Listesi:**
  - [ ] Koleksiyon olusturuldu

---

### TEST-ADM-042: Edit Collection - Add Products
- **URL:** `/admin/koleksiyonlar/[id]`
- **Adimlar:**
  1. "Urun Ekle" butonuna tikla
  2. Urunleri sec
  3. Kaydet
- **Kontrol Listesi:**
  - [ ] Urunler koleksiyona eklendi

---

### TEST-ADM-043: Edit Collection - Remove Products
- **URL:** `/admin/koleksiyonlar/[id]`
- **Adimlar:**
  1. Bir urunun cikar butonuna tikla
- **Kontrol Listesi:**
  - [ ] Urun koleksiyondan cikarildi

---

### TEST-ADM-044: Delete Collection
- **URL:** `/admin/koleksiyonlar`
- **Adimlar:**
  1. Sil butonuna tikla
  2. Onayla
- **Kontrol Listesi:**
  - [ ] Koleksiyon silindi
  - [ ] Urunler silinmedi (sadece iliski)

---

## 5. Siparisler

### TEST-ADM-050: Orders List
- **URL:** `/admin/siparisler`
- **Kontrol Listesi:**
  - [ ] Siparis listesi gorunuyor
  - [ ] Kolonlar: Numara, Musteri, Toplam, Durum, Tarih
  - [ ] Durum badge renkleri dogru

---

### TEST-ADM-051: Orders - Filter by Status
- **URL:** `/admin/siparisler`
- **Adimlar:**
  1. Durum filtresini sec: "PENDING"
- **Kontrol Listesi:**
  - [ ] Sadece bekleyen siparisler

---

### TEST-ADM-052: Orders - Search
- **URL:** `/admin/siparisler`
- **Adimlar:**
  1. Siparis numarasi ile ara
- **Kontrol Listesi:**
  - [ ] Siparis bulunuyor

---

### TEST-ADM-053: Order Detail
- **URL:** `/admin/siparisler/[id]`
- **Kontrol Listesi:**
  - [ ] Siparis detayi gorunuyor
  - [ ] Musteri bilgileri
  - [ ] Urun listesi
  - [ ] Teslimat adresi
  - [ ] Durum timeline

---

### TEST-ADM-054: Update Order Status - CONFIRMED
- **URL:** `/admin/siparisler/[id]`
- **Onkosul:** Siparis PENDING durumda
- **Adimlar:**
  1. Durumu "CONFIRMED" olarak degistir
  2. Kaydet
- **Kontrol Listesi:**
  - [ ] Durum guncellendi
  - [ ] Timeline'a eklendi

---

### TEST-ADM-055: Update Order Status - SHIPPED
- **URL:** `/admin/siparisler/[id]`
- **Adimlar:**
  1. Durumu "SHIPPED" olarak degistir
  2. Kargo takip numarasi gir
  3. Kargo firmasi sec
  4. Kaydet
- **Kontrol Listesi:**
  - [ ] Durum guncellendi
  - [ ] Tracking number kaydedildi
  - [ ] shippedAt tarihi set edildi

---

### TEST-ADM-056: Update Order Status - DELIVERED
- **URL:** `/admin/siparisler/[id]`
- **Adimlar:**
  1. Durumu "DELIVERED" olarak degistir
  2. Kaydet
- **Kontrol Listesi:**
  - [ ] Durum guncellendi
  - [ ] deliveredAt tarihi set edildi

---

### TEST-ADM-057: Update Order Status - CANCELLED
- **URL:** `/admin/siparisler/[id]`
- **Adimlar:**
  1. Durumu "CANCELLED" olarak degistir
  2. Admin notu gir
  3. Kaydet
- **Kontrol Listesi:**
  - [ ] Durum guncellendi
  - [ ] Admin notu kaydedildi

---

### TEST-ADM-058: Order Timeline
- **URL:** `/admin/siparisler/[id]`
- **Onkosul:** Siparis birkac durum degisikligi gecirmis
- **Kontrol Listesi:**
  - [ ] Timeline gorunuyor
  - [ ] Her durum degisikligi tarihi ile
  - [ ] Kronolojik sira

---

### TEST-ADM-059: Order Invoice
- **URL:** `/admin/siparisler/[id]`
- **Adimlar:**
  1. "Fatura Olustur" butonuna tikla
- **Kontrol Listesi:**
  - [ ] Fatura PDF olusturuluyor veya goruntuluyor

---

## 6. Kullanicilar

### TEST-ADM-060: Users List
- **URL:** `/admin/kullanicilar`
- **Kontrol Listesi:**
  - [ ] Kullanici listesi gorunuyor
  - [ ] Kolonlar: Isim, Email, Rol, Kayit Tarihi
  - [ ] Arama calisiyor

---

### TEST-ADM-061: Users - Filter by Role
- **URL:** `/admin/kullanicilar`
- **Adimlar:**
  1. Rol filtresini sec: "ADMIN"
- **Kontrol Listesi:**
  - [ ] Sadece admin kullanicilar

---

### TEST-ADM-062: User Detail
- **URL:** `/admin/kullanicilar/[id]`
- **Kontrol Listesi:**
  - [ ] Kullanici bilgileri
  - [ ] Siparis gecmisi
  - [ ] Adresler
  - [ ] Hesap olusturma tarihi

---

### TEST-ADM-063: Update User Role
- **URL:** `/admin/kullanicilar/[id]`
- **Auth:** Super Admin session
- **Adimlar:**
  1. Rolu "ADMIN" olarak degistir
  2. Kaydet
- **Kontrol Listesi:**
  - [ ] Rol guncellendi
  - [ ] Kullanici artik admin

---

### TEST-ADM-064: Update User Role - Permission Check
- **URL:** `/admin/kullanicilar/[id]`
- **Auth:** Admin session (Super Admin degil)
- **Adimlar:**
  1. Rol degistirmeye calis
- **Kontrol Listesi:**
  - [ ] Islem engelliyor
  - [ ] Sadece Super Admin rol degistirebilir

---

## 7. Kuponlar

### TEST-ADM-070: Coupons List
- **URL:** `/admin/kuponlar`
- **Kontrol Listesi:**
  - [ ] Kupon listesi gorunuyor
  - [ ] Kolonlar: Kod, Indirim, Kullanim, Durum, Bitis

---

### TEST-ADM-071: Create Coupon - Percentage
- **URL:** `/admin/kuponlar`
- **Adimlar:**
  1. "Yeni Kupon" butonuna tikla
  2. Kod: YUZDE20
  3. Tip: PERCENTAGE
  4. Deger: 20
  5. Kaydet
- **Kontrol Listesi:**
  - [ ] Kupon olusturuldu
  - [ ] %20 indirim

---

### TEST-ADM-072: Create Coupon - Fixed Amount
- **URL:** `/admin/kuponlar`
- **Adimlar:**
  1. Kod: SABIT50
  2. Tip: FIXED_AMOUNT
  3. Deger: 50
  4. Kaydet
- **Kontrol Listesi:**
  - [ ] Kupon olusturuldu
  - [ ] 50 TL indirim

---

### TEST-ADM-073: Create Coupon - With Limits
- **URL:** `/admin/kuponlar`
- **Adimlar:**
  1. Min siparis tutari: 200
  2. Max indirim: 100
  3. Kullanim limiti: 50
  4. Bitis tarihi: Gelecek tarih
- **Kontrol Listesi:**
  - [ ] Tum limitler kaydedildi

---

### TEST-ADM-074: Edit Coupon
- **URL:** `/admin/kuponlar/[id]`
- **Adimlar:**
  1. Indirim degerini degistir
  2. Kaydet
- **Kontrol Listesi:**
  - [ ] Kupon guncellendi

---

### TEST-ADM-075: Deactivate Coupon
- **URL:** `/admin/kuponlar/[id]`
- **Adimlar:**
  1. isActive = false yap
  2. Kaydet
- **Kontrol Listesi:**
  - [ ] Kupon pasif oldu
  - [ ] Artik kullanilamiyor

---

### TEST-ADM-076: Delete Coupon
- **URL:** `/admin/kuponlar`
- **Adimlar:**
  1. Sil butonuna tikla
  2. Onayla
- **Kontrol Listesi:**
  - [ ] Kupon silindi

---

## 8. Bannerlar

### TEST-ADM-080: Banners List
- **URL:** `/admin/bannerlar`
- **Kontrol Listesi:**
  - [ ] Banner listesi gorunuyor
  - [ ] Siralama gorunuyor
  - [ ] Durum gorunuyor

---

### TEST-ADM-081: Create Banner
- **URL:** `/admin/bannerlar`
- **Adimlar:**
  1. "Yeni Banner" butonuna tikla
  2. Baslik gir
  3. Gorsel yukle
  4. Link gir
  5. Kaydet
- **Kontrol Listesi:**
  - [ ] Banner olusturuldu

---

### TEST-ADM-082: Edit Banner
- **URL:** `/admin/bannerlar/[id]`
- **Adimlar:**
  1. Basligi degistir
  2. Kaydet
- **Kontrol Listesi:**
  - [ ] Banner guncellendi

---

### TEST-ADM-083: Banner - Schedule
- **URL:** `/admin/bannerlar/[id]`
- **Adimlar:**
  1. Baslangic tarihi sec
  2. Bitis tarihi sec
  3. Kaydet
- **Kontrol Listesi:**
  - [ ] Tarih araliginda aktif olacak

---

### TEST-ADM-084: Delete Banner
- **URL:** `/admin/bannerlar`
- **Adimlar:**
  1. Sil butonuna tikla
  2. Onayla
- **Kontrol Listesi:**
  - [ ] Banner silindi

---

## 9. Sayfalar

### TEST-ADM-090: Pages List
- **URL:** `/admin/sayfalar`
- **Kontrol Listesi:**
  - [ ] Sayfa listesi gorunuyor
  - [ ] Baslik, slug, durum

---

### TEST-ADM-091: Create Page
- **URL:** `/admin/sayfalar`
- **Adimlar:**
  1. "Yeni Sayfa" butonuna tikla
  2. Baslik gir
  3. Slug gir
  4. Icerik gir (rich text)
  5. Kaydet
- **Kontrol Listesi:**
  - [ ] Sayfa olusturuldu

---

### TEST-ADM-092: Edit Page
- **URL:** `/admin/sayfalar/[id]`
- **Adimlar:**
  1. Icerigi degistir
  2. Kaydet
- **Kontrol Listesi:**
  - [ ] Sayfa guncellendi

---

### TEST-ADM-093: Page SEO Settings
- **URL:** `/admin/sayfalar/[id]`
- **Adimlar:**
  1. Meta title gir
  2. Meta description gir
  3. Kaydet
- **Kontrol Listesi:**
  - [ ] SEO bilgileri kaydedildi

---

### TEST-ADM-094: Delete Page
- **URL:** `/admin/sayfalar`
- **Adimlar:**
  1. Sil butonuna tikla
  2. Onayla
- **Kontrol Listesi:**
  - [ ] Sayfa silindi

---

## 10. Ayarlar

### TEST-ADM-100: Settings Page Load
- **URL:** `/admin/ayarlar`
- **Kontrol Listesi:**
  - [ ] Ayarlar sayfasi gorunuyor
  - [ ] Gruplar gorunuyor (Genel, Kargo, Email, vs.)

---

### TEST-ADM-101: Update General Settings
- **URL:** `/admin/ayarlar`
- **Adimlar:**
  1. Site adi degistir
  2. Kaydet
- **Kontrol Listesi:**
  - [ ] Ayar guncellendi

---

### TEST-ADM-102: Update Shipping Settings
- **URL:** `/admin/ayarlar`
- **Adimlar:**
  1. Ucretsiz kargo esigini degistir
  2. Kargo ucretini degistir
  3. Kaydet
- **Kontrol Listesi:**
  - [ ] Kargo ayarlari guncellendi

---

### TEST-ADM-103: Update Email Settings
- **URL:** `/admin/ayarlar`
- **Adimlar:**
  1. Email sablonlarini duzenle
  2. Kaydet
- **Kontrol Listesi:**
  - [ ] Email ayarlari guncellendi

---

## 11. Stok Yonetimi

### TEST-ADM-110: Stock List
- **URL:** `/admin/stok`
- **Kontrol Listesi:**
  - [ ] Varyant listesi gorunuyor
  - [ ] SKU, Urun, Renk, Beden, Stok
  - [ ] Dusuk stok vurgulu

---

### TEST-ADM-111: Stock - Filter Low
- **URL:** `/admin/stok`
- **Adimlar:**
  1. "Dusuk Stok" filtresini sec
- **Kontrol Listesi:**
  - [ ] Sadece 5 ve alti stoklu varyantlar

---

### TEST-ADM-112: Stock - Filter Out of Stock
- **URL:** `/admin/stok`
- **Adimlar:**
  1. "Stokta Yok" filtresini sec
- **Kontrol Listesi:**
  - [ ] Sadece 0 stoklu varyantlar

---

### TEST-ADM-113: Update Stock
- **URL:** `/admin/stok`
- **Adimlar:**
  1. Bir varyantin stok degerini degistir
  2. Kaydet
- **Kontrol Listesi:**
  - [ ] Stok guncellendi

---

### TEST-ADM-114: Bulk Stock Update
- **URL:** `/admin/stok`
- **Adimlar:**
  1. Birkac varyant sec
  2. Toplu stok guncelle
- **Kontrol Listesi:**
  - [ ] Secilen varyantlarin stoklari guncellendi

---

## Test Ozeti

| Kategori | Test Sayisi |
|----------|-------------|
| Dashboard | 8 |
| Urunler | 20 |
| Kategoriler | 6 |
| Koleksiyonlar | 5 |
| Siparisler | 10 |
| Kullanicilar | 5 |
| Kuponlar | 7 |
| Bannerlar | 5 |
| Sayfalar | 5 |
| Ayarlar | 4 |
| Stok Yonetimi | 5 |
| **TOPLAM** | **~80** |

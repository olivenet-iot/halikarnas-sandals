# E2E (End-to-End) Testleri

## Genel Bilgiler

- **Base URL:** `http://localhost:3000`
- **Test Tipi:** Uctan uca kullanici senaryolari
- **Toplam Senaryo:** 8

---

## Icerik

1. [E2E-001: Misafir Satin Alma](#e2e-001-misafir-satin-alma)
2. [E2E-002: Uye Satin Alma](#e2e-002-uye-satin-alma)
3. [E2E-003: Urun Kesfetme & Filtreleme](#e2e-003-urun-kesfetme--filtreleme)
4. [E2E-004: Favoriler Yonetimi](#e2e-004-favoriler-yonetimi)
5. [E2E-005: Hesap Yonetimi](#e2e-005-hesap-yonetimi)
6. [E2E-006: Arama & Navigasyon](#e2e-006-arama--navigasyon)
7. [E2E-007: Admin Siparis Yonetimi](#e2e-007-admin-siparis-yonetimi)
8. [E2E-008: Admin Urun Yonetimi](#e2e-008-admin-urun-yonetimi)

---

## E2E-001: Misafir Satin Alma

**Amac:** Kayit olmadan satin alma akisini test etmek

### Onkosullar:
- Stokta urun var
- Veritabani seed edilmis

### Adimlar:

| # | Adim | Beklenen Sonuc | Durum |
|---|------|----------------|-------|
| 1 | Ana sayfaya git (/) | Sayfa yukleniyor | [ ] |
| 2 | "KADIN" menusune tikla | Kadin sayfasi aciliyor | [ ] |
| 3 | Bir urun kartina tikla | Urun detay sayfasi aciliyor | [ ] |
| 4 | Beden sec: 38 | Beden secili olarak gorunuyor | [ ] |
| 5 | "Sepete Ekle" tikla | Toast: "Sepete eklendi" | [ ] |
| 6 | Header'daki sepet ikonuna tikla | Cart drawer aciliyor | [ ] |
| 7 | Cart drawer'da "Odemeye Git" tikla | /odeme sayfasina yonlendirme | [ ] |
| 8 | Teslimat formu doldur | Form doldu | [ ] |
| 8a | - Ad: Test | | [ ] |
| 8b | - Soyad: Kullanici | | [ ] |
| 8c | - Email: test@example.com | | [ ] |
| 8d | - Telefon: 5551234567 | | [ ] |
| 8e | - Sehir: Istanbul | Ilceler yuklendi | [ ] |
| 8f | - Ilce: Kadikoy | | [ ] |
| 8g | - Adres: Test Sokak No:1 | | [ ] |
| 9 | "Devam" butonuna tikla | Adim 2'ye geciyor | [ ] |
| 10 | Odeme yontemi sec: Kapida Odeme | Secili gorunuyor | [ ] |
| 11 | "Devam" butonuna tikla | Adim 3'e geciyor | [ ] |
| 12 | Siparis ozetini kontrol et | Tum bilgiler dogru | [ ] |
| 13 | Sozlesmeleri onayla | Checkbox'lar isaretli | [ ] |
| 14 | "Siparisi Tamamla" tikla | Loading state | [ ] |
| 15 | Siparis onay sayfasi | Siparis numarasi gorunuyor | [ ] |

### Dogrulama:
- [ ] Veritabaninda Order olusmus
- [ ] OrderItem'lar dogru
- [ ] Stok dusmus
- [ ] Siparis numarasi HS-XXXXXX-XXXX formatinda

---

## E2E-002: Uye Satin Alma

**Amac:** Kayitli kullanici ile satin alma akisini test etmek

### Onkosullar:
- Kayitli kullanici: test@example.com / Test123!
- Kayitli adres var
- Stokta urun var

### Adimlar:

| # | Adim | Beklenen Sonuc | Durum |
|---|------|----------------|-------|
| 1 | /giris sayfasina git | Login sayfasi aciliyor | [ ] |
| 2 | Email gir: test@example.com | | [ ] |
| 3 | Password gir: Test123! | | [ ] |
| 4 | "Giris Yap" tikla | Basarili giris, yonlendirme | [ ] |
| 5 | /kadin sayfasina git | Urunler listeleniyor | [ ] |
| 6 | Bir urun sec | Urun detay sayfasi | [ ] |
| 7 | Renk sec (varsa) | Gorsel guncellendi | [ ] |
| 8 | Beden sec | Beden secili | [ ] |
| 9 | Miktar: 2 yap | Miktar 2 oldu | [ ] |
| 10 | "Sepete Ekle" tikla | Sepete eklendi | [ ] |
| 11 | /sepet sayfasina git | Sepet gorunuyor | [ ] |
| 12 | Kupon kodu gir: INDIRIM10 | | [ ] |
| 13 | "Uygula" tikla | Indirim hesaplandi | [ ] |
| 14 | Toplami kontrol et | Indirim yansimis | [ ] |
| 15 | "Odemeye Git" tikla | /odeme sayfasi | [ ] |
| 16 | Kayitli adresi sec | Adres secili | [ ] |
| 17 | "Devam" tikla | Adim 2 | [ ] |
| 18 | Kredi karti sec | | [ ] |
| 19 | "Devam" tikla | Adim 3 | [ ] |
| 20 | Sozlesmeleri onayla ve siparis ver | Onay sayfasi | [ ] |

### Dogrulama:
- [ ] Order.userId dogru
- [ ] Kupon indirim uygulandi
- [ ] Sepet bosaldi

---

## E2E-003: Urun Kesfetme & Filtreleme

**Amac:** Urun arama ve filtreleme akisini test etmek

### Onkosullar:
- Farkli kategorilerde urunler var
- Farkli fiyat ve renklerde urunler var

### Adimlar:

| # | Adim | Beklenen Sonuc | Durum |
|---|------|----------------|-------|
| 1 | Ana sayfaya git | Homepage yuklu | [ ] |
| 2 | "En Cok Satan" bolumundeki urune tikla | Urun sayfasi | [ ] |
| 3 | Geri don | Homepage | [ ] |
| 4 | KADIN > Bodrum Sandalet'e git | Kategori sayfasi | [ ] |
| 5 | Sidebar'dan renk filtrele: Siyah | Siyah urunler | [ ] |
| 6 | Beden filtrele: 38 | 38 bedenli urunler | [ ] |
| 7 | Fiyat araligini ayarla: 500-1000 | Fiyat araliginda | [ ] |
| 8 | Aktif filtre sayisini kontrol et | 3 filtre aktif | [ ] |
| 9 | Siralama: Fiyat (Dusuk-Yuksek) | En ucuz basta | [ ] |
| 10 | "Filtreleri Temizle" tikla | Tum filtreler kalkar | [ ] |
| 11 | Bir urune tikla | Urun detay sayfasi | [ ] |
| 12 | "Benzer Urunler" kontrol et | Ilgili urunler gorunuyor | [ ] |

### Dogrulama:
- [ ] Filtreler dogru calisiyor
- [ ] Siralama dogru
- [ ] URL'de query parametreleri var

---

## E2E-004: Favoriler Yonetimi

**Amac:** Favorilere ekleme/cikarma akisini test etmek

### Onkosullar:
- Kayitli kullanici

### Adimlar:

| # | Adim | Beklenen Sonuc | Durum |
|---|------|----------------|-------|
| 1 | Giris yap | Basarili giris | [ ] |
| 2 | /kadin sayfasina git | Urun listesi | [ ] |
| 3 | Urun kartindaki kalp ikonuna tikla | Ikon dolu hale geldi | [ ] |
| 4 | Toast mesajini kontrol et | "Favorilere eklendi" | [ ] |
| 5 | Baska bir urunu favorilere ekle | Ikon dolu | [ ] |
| 6 | /hesabim/favorilerim sayfasina git | Favoriler listesi | [ ] |
| 7 | 2 urun gorunuyor mu? | 2 kart gorunuyor | [ ] |
| 8 | Urun kartina tikla | Urun sayfasina git | [ ] |
| 9 | URL formatini kontrol et | /kadin/kategori/sku | [ ] |
| 10 | Geri don, favorilerden bir urunu cikar | Ikon bos hale geldi | [ ] |
| 11 | Toast mesajini kontrol et | "Favorilerden cikarildi" | [ ] |
| 12 | Listeyi kontrol et | 1 urun kaldi | [ ] |

### Dogrulama:
- [ ] WishlistItem'lar dogru
- [ ] URL'ler yeni formatta (/kadin/kategori/sku)

---

## E2E-005: Hesap Yonetimi

**Amac:** Kullanici hesap islemlerini test etmek

### Onkosullar:
- Kayitli kullanici

### Adimlar:

| # | Adim | Beklenen Sonuc | Durum |
|---|------|----------------|-------|
| 1 | Giris yap | Basarili | [ ] |
| 2 | /hesabim sayfasina git | Dashboard | [ ] |
| 3 | "Bilgilerim" linkine tikla | Profil sayfasi | [ ] |
| 4 | Telefon numarasini guncelle | | [ ] |
| 5 | "Kaydet" tikla | Basari mesaji | [ ] |
| 6 | "Adreslerim" linkine tikla | Adres listesi | [ ] |
| 7 | "Yeni Adres Ekle" tikla | Adres formu | [ ] |
| 8 | Formu doldur ve kaydet | Adres eklendi | [ ] |
| 9 | Adresi varsayilan yap | Varsayilan badge | [ ] |
| 10 | "Sifre Degistir" linkine tikla | Sifre formu | [ ] |
| 11 | Mevcut sifre, yeni sifre gir | | [ ] |
| 12 | "Degistir" tikla | Basari mesaji | [ ] |
| 13 | Cikis yap | Ana sayfaya yonlendirme | [ ] |
| 14 | Yeni sifre ile giris yap | Basarili giris | [ ] |

### Dogrulama:
- [ ] Profil guncellendi
- [ ] Adres eklendi
- [ ] Sifre degisti

---

## E2E-006: Arama & Navigasyon

**Amac:** Arama ve site navigasyonunu test etmek

### Onkosullar:
- Veritabaninda urunler var

### Adimlar:

| # | Adim | Beklenen Sonuc | Durum |
|---|------|----------------|-------|
| 1 | Ana sayfaya git | Homepage | [ ] |
| 2 | Arama ikonuna tikla | Search dialog acildi | [ ] |
| 3 | "bodrum" yaz | Sonuclar gorunuyor | [ ] |
| 4 | Bir sonuca tikla | Urun sayfasina git | [ ] |
| 5 | Breadcrumb'dan "Kadin"a tikla | /kadin sayfasi | [ ] |
| 6 | Logo'ya tikla | Ana sayfaya don | [ ] |
| 7 | Footer'dan "Hakkimizda"ya tikla | /hakkimizda | [ ] |
| 8 | Footer'dan "SSS"ye tikla | /sss | [ ] |
| 9 | Bir soruya tikla | Accordion acildi | [ ] |
| 10 | Footer'dan "Iletisim"e tikla | /iletisim | [ ] |
| 11 | Formu doldur ve gonder | Basari mesaji | [ ] |

### Dogrulama:
- [ ] Tum linkler calisiyor
- [ ] Arama sonuclari dogru
- [ ] Iletisim formu calisiyor

---

## E2E-007: Admin Siparis Yonetimi

**Amac:** Admin panelden siparis yonetimini test etmek

### Onkosullar:
- Admin hesabi: admin@halikarnas.com / Admin123!
- Veritabaninda siparisler var

### Adimlar:

| # | Adim | Beklenen Sonuc | Durum |
|---|------|----------------|-------|
| 1 | /giris sayfasina git | Login sayfasi | [ ] |
| 2 | Admin credentials ile giris | | [ ] |
| 3 | /admin sayfasina git | Admin dashboard | [ ] |
| 4 | "Siparisler" linkine tikla | Siparis listesi | [ ] |
| 5 | Durumu "PENDING" olarak filtrele | Bekleyen siparisler | [ ] |
| 6 | Bir siparise tikla | Siparis detayi | [ ] |
| 7 | Durumu "CONFIRMED" yap | | [ ] |
| 8 | Kaydet | Durum guncellendi | [ ] |
| 9 | Durumu "SHIPPED" yap | | [ ] |
| 10 | Kargo takip no gir: TR123456 | | [ ] |
| 11 | Kargo firmasi sec: Yurtici | | [ ] |
| 12 | Kaydet | Durum guncellendi | [ ] |
| 13 | Timeline'i kontrol et | Tum gecisler gorunuyor | [ ] |
| 14 | Siparis listesine don | Liste sayfasi | [ ] |
| 15 | Guncellenen siparisi kontrol et | Durum SHIPPED | [ ] |

### Dogrulama:
- [ ] OrderStatusHistory kayitlari dogru
- [ ] shippedAt tarihi set edilmis
- [ ] Tracking number kaydedilmis

---

## E2E-008: Admin Urun Yonetimi

**Amac:** Admin panelden urun CRUD islemlerini test etmek

### Onkosullar:
- Admin hesabi
- Test gorselleri hazir

### Adimlar:

| # | Adim | Beklenen Sonuc | Durum |
|---|------|----------------|-------|
| 1 | Admin olarak giris yap | Dashboard | [ ] |
| 2 | "Urunler" linkine tikla | Urun listesi | [ ] |
| 3 | "Yeni Urun" butonuna tikla | Urun formu | [ ] |
| 4 | Temel bilgileri doldur: | | [ ] |
| 4a | - Isim: Test Sandalet | | [ ] |
| 4b | - SKU: TEST-001 | | [ ] |
| 4c | - Slug: test-sandalet | | [ ] |
| 4d | - Aciklama: Test aciklama | | [ ] |
| 5 | Fiyat gir: 999.99 | | [ ] |
| 6 | Kategori sec | | [ ] |
| 7 | Gender sec: KADIN | | [ ] |
| 8 | Gorsel yukle (drag-drop veya tikla) | Gorsel yuklendi | [ ] |
| 9 | Ikinci gorsel ekle | 2 gorsel var | [ ] |
| 10 | Gorsellerin sirasini degistir | Siralama guncellendi | [ ] |
| 11 | Varyant ekle: 37, Siyah, #000, stok: 5 | Varyant eklendi | [ ] |
| 12 | Varyant ekle: 38, Siyah, #000, stok: 10 | Varyant eklendi | [ ] |
| 13 | Varyant ekle: 37, Kahve, #8B4513, stok: 3 | Varyant eklendi | [ ] |
| 14 | Durum: ACTIVE sec | | [ ] |
| 15 | "Kaydet" tikla | Urun olusturuldu | [ ] |
| 16 | Urun listesine don | TEST-001 listede | [ ] |
| 17 | /kadin sayfasinda urunu kontrol et | Urun gorunuyor | [ ] |
| 18 | Admin'den urunu duzenle | Edit sayfasi | [ ] |
| 19 | Fiyati 1099.99 yap | | [ ] |
| 20 | Bir gorsel sil | Gorsel silindi | [ ] |
| 21 | Kaydet | Guncellendi | [ ] |
| 22 | Urunu sil | Onay dialog | [ ] |
| 23 | Onayla | Urun silindi | [ ] |

### Dogrulama:
- [ ] Product olusturuldu
- [ ] ProductVariant'lar dogru
- [ ] ProductImage'lar Cloudinary'de
- [ ] Silme cascade calisti

---

## Test Ozeti

| Senaryo | Adim Sayisi | Kritiklik |
|---------|-------------|-----------|
| E2E-001: Misafir Satin Alma | 15 | Yuksek |
| E2E-002: Uye Satin Alma | 20 | Yuksek |
| E2E-003: Urun Kesfetme | 12 | Orta |
| E2E-004: Favoriler | 12 | Orta |
| E2E-005: Hesap Yonetimi | 14 | Orta |
| E2E-006: Arama & Nav | 11 | Orta |
| E2E-007: Admin Siparis | 15 | Yuksek |
| E2E-008: Admin Urun | 23 | Yuksek |
| **TOPLAM** | **~122** | |

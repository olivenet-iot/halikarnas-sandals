# Database / Model Testleri

Bu dokuman Halikarnas e-ticaret platformunun veritabani ve Prisma model testlerini icerir.

**Toplam:** ~94 test
**Kategori Kodu:** DB
**Test ID Formati:** TEST-DB-XXX

---

## Icindekiler

1. [User & Auth Modelleri](#1-user--auth-modelleri)
2. [Product Modelleri](#2-product-modelleri)
3. [Category & Collection](#3-category--collection)
4. [Cart & Wishlist](#4-cart--wishlist)
5. [Order Modelleri](#5-order-modelleri)
6. [Address](#6-address)
7. [Coupon](#7-coupon)
8. [Content Modelleri](#8-content-modelleri)
9. [Settings & Logs](#9-settings--logs)
10. [Iliski Testleri](#10-iliski-testleri)
11. [Constraint Testleri](#11-constraint-testleri)

---

## Onkosuller

- PostgreSQL veritabani calisir durumda
- Prisma schema senkronize (`npx prisma db push`)
- Test verileri yuklu (`npx prisma db seed`)
- Prisma Studio erisimi (`npx prisma studio`)

---

## 1. User & Auth Modelleri

### TEST-DB-001: User Model - Zorunlu Alanlar
- **Model:** User
- **Test:** Zorunlu alanlarin kontrolu
- **Kontrol Listesi:**
  - [ ] `email` alani unique ve zorunlu
  - [ ] `password` alani zorunlu (credentials ile kayit icin)
  - [ ] `role` alani default CUSTOMER
  - [ ] `isActive` alani default true
  - [ ] `createdAt` otomatik set ediliyor
  - [ ] `updatedAt` otomatik guncelleniyor

### TEST-DB-002: User Model - Email Unique Constraint
- **Model:** User
- **Test:** Ayni email ile ikinci kullanici olusturulamaz
- **Adimlar:**
  1. Yeni kullanici olustur (email: test@test.com)
  2. Ayni email ile ikinci kullanici olusturmayi dene
- **Beklenen:** Unique constraint hatasi
- **Kontrol Listesi:**
  - [ ] Ilk kullanici basariyla olusturuldu
  - [ ] Ikinci olusturma hatasi verdi
  - [ ] Hata mesaji anlasilir

### TEST-DB-003: User Model - Role Enum
- **Model:** User
- **Test:** Role alani sadece gecerli degerleri kabul eder
- **Gecerli Degerler:** CUSTOMER, ADMIN, SUPER_ADMIN
- **Kontrol Listesi:**
  - [ ] CUSTOMER rolu atanabiliyor
  - [ ] ADMIN rolu atanabiliyor
  - [ ] SUPER_ADMIN rolu atanabiliyor
  - [ ] Gecersiz rol hatasi veriyor

### TEST-DB-004: User Model - Password Hashing
- **Model:** User
- **Test:** Sifre hash'lenerek kaydediliyor
- **Kontrol Listesi:**
  - [ ] Kaydedilen sifre plain text degil
  - [ ] bcryptjs hash formati ($2a$ veya $2b$)
  - [ ] Hash uzunlugu 60 karakter

### TEST-DB-005: Account Model - OAuth Provider
- **Model:** Account
- **Test:** OAuth hesap baglama
- **Kontrol Listesi:**
  - [ ] provider alani zorunlu
  - [ ] providerAccountId alani zorunlu
  - [ ] User ile iliski kurulabiliyor
  - [ ] Ayni provider+account ikinci kez eklenemiyor

### TEST-DB-006: Session Model - Token Yonetimi
- **Model:** Session
- **Test:** Oturum token yonetimi
- **Kontrol Listesi:**
  - [ ] sessionToken unique
  - [ ] expires alani zorunlu
  - [ ] User ile iliski var
  - [ ] Suresi dolmus session silinebiliyor

### TEST-DB-007: VerificationToken Model
- **Model:** VerificationToken
- **Test:** Email dogrulama token
- **Kontrol Listesi:**
  - [ ] identifier + token unique
  - [ ] expires alani zorunlu
  - [ ] Token suresi kontrol edilebiliyor

### TEST-DB-008: PasswordResetToken Model
- **Model:** PasswordResetToken
- **Test:** Sifre sifirlama token
- **Kontrol Listesi:**
  - [ ] email + token unique
  - [ ] expires alani zorunlu
  - [ ] Kullanildiktan sonra silinebiliyor

---

## 2. Product Modelleri

### TEST-DB-009: Product Model - Zorunlu Alanlar
- **Model:** Product
- **Test:** Urun zorunlu alanlari
- **Kontrol Listesi:**
  - [ ] `name` zorunlu ve min 2 karakter
  - [ ] `slug` zorunlu ve unique
  - [ ] `sku` zorunlu ve unique
  - [ ] `basePrice` zorunlu ve Decimal
  - [ ] `gender` zorunlu enum (KADIN, ERKEK, UNISEX)
  - [ ] `status` default DRAFT

### TEST-DB-010: Product Model - Slug Unique
- **Model:** Product
- **Test:** Ayni slug ile ikinci urun olusturulamaz
- **Kontrol Listesi:**
  - [ ] Ilk urun slug ile olusturuldu
  - [ ] Ayni slug ikinci urunde hata verdi

### TEST-DB-011: Product Model - SKU Unique
- **Model:** Product
- **Test:** SKU benzersizligi
- **Kontrol Listesi:**
  - [ ] SKU unique constraint calisiyor
  - [ ] Farkli kategorilerde bile ayni SKU kullanilamiyor

### TEST-DB-012: Product Model - Status Enum
- **Model:** Product
- **Test:** Status alani gecerli degerler
- **Gecerli Degerler:** DRAFT, ACTIVE, ARCHIVED
- **Kontrol Listesi:**
  - [ ] DRAFT statusu atanabiliyor
  - [ ] ACTIVE statusu atanabiliyor
  - [ ] ARCHIVED statusu atanabiliyor
  - [ ] Gecersiz status hatasi veriyor

### TEST-DB-013: Product Model - Gender Enum
- **Model:** Product
- **Test:** Gender alani gecerli degerler
- **Gecerli Degerler:** KADIN, ERKEK, UNISEX
- **Kontrol Listesi:**
  - [ ] Tum gecerli degerler kabul ediliyor
  - [ ] Gecersiz deger hatasi veriyor

### TEST-DB-014: Product Model - Price Decimal
- **Model:** Product
- **Test:** Fiyat alani Decimal tipi
- **Kontrol Listesi:**
  - [ ] Decimal(10, 2) formati destekleniyor
  - [ ] 0'dan buyuk deger kabul ediliyor
  - [ ] Negatif deger reddediliyor
  - [ ] Kurus hassasiyeti korunuyor (1299.99)

### TEST-DB-015: Product Model - Sale Price
- **Model:** Product
- **Test:** Indirimli fiyat kontrolu
- **Kontrol Listesi:**
  - [ ] salePrice null olabiliyor
  - [ ] salePrice < basePrice olmali
  - [ ] isOnSale flag'i ile senkron

### TEST-DB-016: ProductVariant Model - Zorunlu Alanlar
- **Model:** ProductVariant
- **Test:** Varyant zorunlu alanlari
- **Kontrol Listesi:**
  - [ ] `productId` zorunlu (FK)
  - [ ] `color` zorunlu
  - [ ] `size` zorunlu
  - [ ] `stock` default 0
  - [ ] `sku` unique

### TEST-DB-017: ProductVariant Model - Stock Kontrolu
- **Model:** ProductVariant
- **Test:** Stok degeri kontrolu
- **Kontrol Listesi:**
  - [ ] Stock integer ve >= 0
  - [ ] Negatif stok kabul edilmiyor
  - [ ] lowStockThreshold ile karsilastirma calisiyor

### TEST-DB-018: ProductVariant Model - SKU Unique
- **Model:** ProductVariant
- **Test:** Varyant SKU benzersizligi
- **Kontrol Listesi:**
  - [ ] Her varyantin kendine ozgu SKU'su var
  - [ ] Ayni SKU ikinci varyantta hata veriyor

### TEST-DB-019: ProductImage Model - Zorunlu Alanlar
- **Model:** ProductImage
- **Test:** Gorsel zorunlu alanlari
- **Kontrol Listesi:**
  - [ ] `productId` zorunlu (FK)
  - [ ] `url` zorunlu
  - [ ] `position` default 0
  - [ ] `isPrimary` default false

### TEST-DB-020: ProductImage Model - isPrimary Kontrolu
- **Model:** ProductImage
- **Test:** Ana gorsel kontrolu
- **Kontrol Listesi:**
  - [ ] Bir urunde sadece 1 isPrimary=true olmali
  - [ ] isPrimary degistirildiginde eski sifirlaniyor

---

## 3. Category & Collection

### TEST-DB-021: Category Model - Zorunlu Alanlar
- **Model:** Category
- **Test:** Kategori zorunlu alanlari
- **Kontrol Listesi:**
  - [ ] `name` zorunlu
  - [ ] `slug` zorunlu ve unique
  - [ ] `gender` zorunlu enum
  - [ ] `isActive` default true

### TEST-DB-022: Category Model - Hiyerarsi
- **Model:** Category
- **Test:** Parent-child iliskisi
- **Kontrol Listesi:**
  - [ ] parentId null olabiliyor (root kategori)
  - [ ] parentId gecerli Category'ye referans
  - [ ] children iliskisi dogru calisiyor
  - [ ] Kendisine parent olamaz

### TEST-DB-023: Category Model - Slug Unique
- **Model:** Category
- **Test:** Kategori slug benzersizligi
- **Kontrol Listesi:**
  - [ ] Ayni slug ikinci kategoride hata veriyor
  - [ ] Farkli gender'da bile ayni slug kullanilamiyor

### TEST-DB-024: Collection Model - Zorunlu Alanlar
- **Model:** Collection
- **Test:** Koleksiyon zorunlu alanlari
- **Kontrol Listesi:**
  - [ ] `name` zorunlu
  - [ ] `slug` zorunlu ve unique
  - [ ] `isActive` default true

### TEST-DB-025: CollectionProduct Model - N:N Iliski
- **Model:** CollectionProduct
- **Test:** Koleksiyon-Urun baglantisi
- **Kontrol Listesi:**
  - [ ] collectionId + productId unique (composite)
  - [ ] Ayni urun birden fazla koleksiyona eklenebilir
  - [ ] Ayni urun ayni koleksiyona tekrar eklenemez

---

## 4. Cart & Wishlist

### TEST-DB-026: Cart Model - Zorunlu Alanlar
- **Model:** Cart
- **Test:** Sepet zorunlu alanlari
- **Kontrol Listesi:**
  - [ ] userId veya sessionId olmali
  - [ ] sessionId misafir sepeti icin
  - [ ] Bir user'in tek aktif sepeti olmali

### TEST-DB-027: Cart Model - User Iliski
- **Model:** Cart
- **Test:** Kullanici-sepet iliskisi
- **Kontrol Listesi:**
  - [ ] userId unique (1 user = 1 cart)
  - [ ] User silinince cart da silinir (cascade)

### TEST-DB-028: CartItem Model - Zorunlu Alanlar
- **Model:** CartItem
- **Test:** Sepet kalemi zorunlu alanlari
- **Kontrol Listesi:**
  - [ ] `cartId` zorunlu (FK)
  - [ ] `productId` zorunlu (FK)
  - [ ] `variantId` zorunlu (FK)
  - [ ] `quantity` zorunlu ve >= 1

### TEST-DB-029: CartItem Model - Unique Constraint
- **Model:** CartItem
- **Test:** Ayni varyant bir kere eklenebilir
- **Kontrol Listesi:**
  - [ ] cartId + variantId unique
  - [ ] Ayni varyant eklenirse quantity guncellenmeli

### TEST-DB-030: WishlistItem Model - Zorunlu Alanlar
- **Model:** WishlistItem
- **Test:** Favori zorunlu alanlari
- **Kontrol Listesi:**
  - [ ] `userId` zorunlu (FK)
  - [ ] `productId` zorunlu (FK)
  - [ ] userId + productId unique

### TEST-DB-031: WishlistItem Model - Unique Constraint
- **Model:** WishlistItem
- **Test:** Ayni urun tekrar favoriye eklenemez
- **Kontrol Listesi:**
  - [ ] Ikinci ekleme hatasi veriyor
  - [ ] Farkli kullanici ayni urunu ekleyebiliyor

---

## 5. Order Modelleri

### TEST-DB-032: Order Model - Zorunlu Alanlar
- **Model:** Order
- **Test:** Siparis zorunlu alanlari
- **Kontrol Listesi:**
  - [ ] `orderNumber` zorunlu ve unique
  - [ ] `userId` zorunlu (FK) veya guest info
  - [ ] `status` default PENDING
  - [ ] `paymentStatus` default PENDING
  - [ ] `subtotal`, `total` zorunlu Decimal

### TEST-DB-033: Order Model - OrderNumber Unique
- **Model:** Order
- **Test:** Siparis numarasi benzersizligi
- **Kontrol Listesi:**
  - [ ] Otomatik uretilen orderNumber unique
  - [ ] Format: HAL-YYYYMMDD-XXXXX

### TEST-DB-034: Order Model - Status Enum
- **Model:** Order
- **Test:** Siparis durumu gecerli degerler
- **Gecerli Degerler:** PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
- **Kontrol Listesi:**
  - [ ] Tum gecerli degerler kabul ediliyor
  - [ ] Gecersiz status hatasi veriyor

### TEST-DB-035: Order Model - PaymentStatus Enum
- **Model:** Order
- **Test:** Odeme durumu gecerli degerler
- **Gecerli Degerler:** PENDING, PAID, FAILED, REFUNDED
- **Kontrol Listesi:**
  - [ ] Tum gecerli degerler kabul ediliyor
  - [ ] Gecersiz status hatasi veriyor

### TEST-DB-036: Order Model - Address Snapshot
- **Model:** Order
- **Test:** Adres bilgisi snapshot olarak kaydediliyor
- **Kontrol Listesi:**
  - [ ] shippingAddress JSON formatinda
  - [ ] billingAddress JSON formatinda
  - [ ] Orijinal adres degisse siparis adresi degismiyor

### TEST-DB-037: OrderItem Model - Zorunlu Alanlar
- **Model:** OrderItem
- **Test:** Siparis kalemi zorunlu alanlari
- **Kontrol Listesi:**
  - [ ] `orderId` zorunlu (FK)
  - [ ] `productId` zorunlu (FK)
  - [ ] `variantId` zorunlu (FK)
  - [ ] `quantity` zorunlu ve >= 1
  - [ ] `unitPrice`, `totalPrice` zorunlu Decimal

### TEST-DB-038: OrderItem Model - Product Snapshot
- **Model:** OrderItem
- **Test:** Urun bilgisi snapshot olarak kaydediliyor
- **Kontrol Listesi:**
  - [ ] productName kaydediliyor
  - [ ] productImage kaydediliyor
  - [ ] color, size kaydediliyor
  - [ ] Orijinal urun degisse siparis bilgisi degismiyor

### TEST-DB-039: OrderStatusHistory Model
- **Model:** OrderStatusHistory
- **Test:** Durum gecmisi kaydi
- **Kontrol Listesi:**
  - [ ] `orderId` zorunlu (FK)
  - [ ] `status` zorunlu
  - [ ] `createdAt` otomatik
  - [ ] `note` opsiyonel
  - [ ] Her durum degisikliginde yeni kayit olusturuluyor

---

## 6. Address

### TEST-DB-040: Address Model - Zorunlu Alanlar
- **Model:** Address
- **Test:** Adres zorunlu alanlari
- **Kontrol Listesi:**
  - [ ] `userId` zorunlu (FK)
  - [ ] `title` zorunlu (Ev, Is, vb.)
  - [ ] `fullName` zorunlu
  - [ ] `phone` zorunlu
  - [ ] `city` zorunlu
  - [ ] `district` zorunlu
  - [ ] `address` zorunlu
  - [ ] `isDefault` default false

### TEST-DB-041: Address Model - Default Address
- **Model:** Address
- **Test:** Varsayilan adres kontrolu
- **Kontrol Listesi:**
  - [ ] Bir kullanicinin tek isDefault=true adresi olmali
  - [ ] Yeni default secilince eski sifirlaniyor

### TEST-DB-042: Address Model - User Iliski
- **Model:** Address
- **Test:** Kullanici-adres iliskisi
- **Kontrol Listesi:**
  - [ ] User silinince adresleri de silinir (cascade)
  - [ ] Bir user birden fazla adres ekleyebilir

---

## 7. Coupon

### TEST-DB-043: Coupon Model - Zorunlu Alanlar
- **Model:** Coupon
- **Test:** Kupon zorunlu alanlari
- **Kontrol Listesi:**
  - [ ] `code` zorunlu ve unique
  - [ ] `discountType` zorunlu enum
  - [ ] `discountValue` zorunlu Decimal
  - [ ] `isActive` default true

### TEST-DB-044: Coupon Model - Code Unique
- **Model:** Coupon
- **Test:** Kupon kodu benzersizligi
- **Kontrol Listesi:**
  - [ ] Ayni kod ikinci kuponda hata veriyor
  - [ ] Case-insensitive kontrol (INDIRIM = indirim)

### TEST-DB-045: Coupon Model - DiscountType Enum
- **Model:** Coupon
- **Test:** Indirim tipi gecerli degerler
- **Gecerli Degerler:** PERCENTAGE, FIXED_AMOUNT
- **Kontrol Listesi:**
  - [ ] PERCENTAGE tipi kabul ediliyor
  - [ ] FIXED_AMOUNT tipi kabul ediliyor
  - [ ] Gecersiz tip hatasi veriyor

### TEST-DB-046: Coupon Model - Discount Value Kontrolu
- **Model:** Coupon
- **Test:** Indirim degeri validasyonu
- **Kontrol Listesi:**
  - [ ] PERCENTAGE icin 0-100 arasi
  - [ ] FIXED_AMOUNT icin > 0
  - [ ] Negatif deger reddediliyor

### TEST-DB-047: Coupon Model - Validity Period
- **Model:** Coupon
- **Test:** Gecerlilik suresi kontrolu
- **Kontrol Listesi:**
  - [ ] validFrom null olabiliyor
  - [ ] validUntil null olabiliyor
  - [ ] validFrom < validUntil olmali

### TEST-DB-048: Coupon Model - Usage Limits
- **Model:** Coupon
- **Test:** Kullanim limitleri
- **Kontrol Listesi:**
  - [ ] maxUses null olabiliyor (sinirsiz)
  - [ ] currentUses default 0
  - [ ] maxUses > 0 olmali (set edilmisse)
  - [ ] currentUses <= maxUses kontrolu

### TEST-DB-049: Coupon Model - Minimum Order
- **Model:** Coupon
- **Test:** Minimum siparis tutari
- **Kontrol Listesi:**
  - [ ] minimumOrderAmount null olabiliyor
  - [ ] minimumOrderAmount > 0 olmali (set edilmisse)

---

## 8. Content Modelleri

### TEST-DB-050: Banner Model - Zorunlu Alanlar
- **Model:** Banner
- **Test:** Banner zorunlu alanlari
- **Kontrol Listesi:**
  - [ ] `title` zorunlu
  - [ ] `imageUrl` zorunlu
  - [ ] `position` zorunlu (HERO, SECONDARY, etc.)
  - [ ] `isActive` default true

### TEST-DB-051: Banner Model - Position Enum
- **Model:** Banner
- **Test:** Banner pozisyon gecerli degerler
- **Kontrol Listesi:**
  - [ ] HERO pozisyonu kabul ediliyor
  - [ ] SECONDARY pozisyonu kabul ediliyor
  - [ ] Gecersiz pozisyon hatasi veriyor

### TEST-DB-052: Banner Model - Display Order
- **Model:** Banner
- **Test:** Gosterim sirasi
- **Kontrol Listesi:**
  - [ ] displayOrder default 0
  - [ ] Ayni pozisyonda birden fazla banner olabiliyor
  - [ ] displayOrder ile siralanabiliyor

### TEST-DB-053: Page Model - Zorunlu Alanlar
- **Model:** Page
- **Test:** Sayfa zorunlu alanlari
- **Kontrol Listesi:**
  - [ ] `title` zorunlu
  - [ ] `slug` zorunlu ve unique
  - [ ] `content` zorunlu (HTML/Markdown)
  - [ ] `isPublished` default false

### TEST-DB-054: Page Model - Slug Unique
- **Model:** Page
- **Test:** Sayfa slug benzersizligi
- **Kontrol Listesi:**
  - [ ] Ayni slug ikinci sayfada hata veriyor
  - [ ] Slug otomatik slugify ediliyor

### TEST-DB-055: FAQ Model - Zorunlu Alanlar
- **Model:** FAQ
- **Test:** SSS zorunlu alanlari
- **Kontrol Listesi:**
  - [ ] `question` zorunlu
  - [ ] `answer` zorunlu
  - [ ] `displayOrder` default 0
  - [ ] `isActive` default true

### TEST-DB-056: NewsletterSubscription Model
- **Model:** NewsletterSubscription
- **Test:** Bulten aboneligi
- **Kontrol Listesi:**
  - [ ] `email` zorunlu ve unique
  - [ ] `isActive` default true
  - [ ] `subscribedAt` otomatik
  - [ ] Ayni email tekrar abone olamaz

### TEST-DB-057: ContactMessage Model
- **Model:** ContactMessage
- **Test:** Iletisim mesaji
- **Kontrol Listesi:**
  - [ ] `name` zorunlu
  - [ ] `email` zorunlu
  - [ ] `subject` zorunlu
  - [ ] `message` zorunlu
  - [ ] `isRead` default false
  - [ ] `createdAt` otomatik

---

## 9. Settings & Logs

### TEST-DB-058: SiteSetting Model - Key-Value
- **Model:** SiteSetting
- **Test:** Site ayarlari key-value
- **Kontrol Listesi:**
  - [ ] `key` zorunlu ve unique
  - [ ] `value` zorunlu
  - [ ] Ayni key ikinci kayitta hata veriyor

### TEST-DB-059: SiteSetting Model - Tip Kontrolu
- **Model:** SiteSetting
- **Test:** Ayar tipi kontrolu
- **Kontrol Listesi:**
  - [ ] `type` alani var (STRING, NUMBER, BOOLEAN, JSON)
  - [ ] Deger tipe gore parse edilebilir

### TEST-DB-060: ActivityLog Model
- **Model:** ActivityLog
- **Test:** Aktivite loglari
- **Kontrol Listesi:**
  - [ ] `action` zorunlu
  - [ ] `entityType` zorunlu
  - [ ] `entityId` zorunlu
  - [ ] `userId` opsiyonel
  - [ ] `metadata` JSON opsiyonel
  - [ ] `createdAt` otomatik

---

## 10. Iliski Testleri

### TEST-DB-061: User -> Orders Iliskisi
- **Iliski:** User 1:N Order
- **Kontrol Listesi:**
  - [ ] Kullanici siparislerine user.orders ile erisilebiliyor
  - [ ] Siparisin sahibine order.user ile erisilebiliyor

### TEST-DB-062: User -> Cart Iliskisi
- **Iliski:** User 1:1 Cart
- **Kontrol Listesi:**
  - [ ] Kullanicinin tek sepeti var
  - [ ] user.cart ile erisim calisiyor

### TEST-DB-063: User -> Addresses Iliskisi
- **Iliski:** User 1:N Address
- **Kontrol Listesi:**
  - [ ] Kullanici birden fazla adres ekleyebilir
  - [ ] user.addresses ile liste aliniyor

### TEST-DB-064: User -> WishlistItems Iliskisi
- **Iliski:** User 1:N WishlistItem
- **Kontrol Listesi:**
  - [ ] user.wishlistItems ile favoriler aliniyor
  - [ ] Include ile product bilgisi geliyor

### TEST-DB-065: Product -> Category Iliskisi
- **Iliski:** Product N:1 Category
- **Kontrol Listesi:**
  - [ ] Urunun kategorisine product.category ile erisilebiliyor
  - [ ] Kategorinin urunlerine category.products ile erisilebiliyor

### TEST-DB-066: Product -> Variants Iliskisi
- **Iliski:** Product 1:N ProductVariant
- **Kontrol Listesi:**
  - [ ] product.variants ile varyantlar aliniyor
  - [ ] variant.product ile ana urune erisilebiliyor

### TEST-DB-067: Product -> Images Iliskisi
- **Iliski:** Product 1:N ProductImage
- **Kontrol Listesi:**
  - [ ] product.images ile gorseller aliniyor
  - [ ] Position sirasina gore siralanabiliyor
  - [ ] isPrimary filtresi calisiyor

### TEST-DB-068: Product -> Collections Iliskisi
- **Iliski:** Product N:N Collection (via CollectionProduct)
- **Kontrol Listesi:**
  - [ ] product.collections ile koleksiyonlar aliniyor
  - [ ] collection.products ile urunler aliniyor

### TEST-DB-069: Category -> Parent/Children Iliskisi
- **Iliski:** Category self-referencing
- **Kontrol Listesi:**
  - [ ] category.parent ile ust kategoriye erisilebiliyor
  - [ ] category.children ile alt kategoriler aliniyor
  - [ ] Recursive sorgu calisiyor

### TEST-DB-070: Cart -> CartItems Iliskisi
- **Iliski:** Cart 1:N CartItem
- **Kontrol Listesi:**
  - [ ] cart.items ile sepet kalemleri aliniyor
  - [ ] Include ile product ve variant bilgisi geliyor

### TEST-DB-071: Order -> OrderItems Iliskisi
- **Iliski:** Order 1:N OrderItem
- **Kontrol Listesi:**
  - [ ] order.items ile siparis kalemleri aliniyor
  - [ ] Snapshot bilgileri korunuyor

### TEST-DB-072: Order -> StatusHistory Iliskisi
- **Iliski:** Order 1:N OrderStatusHistory
- **Kontrol Listesi:**
  - [ ] order.statusHistory ile gecmis aliniyor
  - [ ] CreatedAt sirasina gore siralanabiliyor

### TEST-DB-073: Order -> Coupon Iliskisi
- **Iliski:** Order N:1 Coupon
- **Kontrol Listesi:**
  - [ ] order.coupon ile kupon bilgisi aliniyor
  - [ ] coupon.orders ile kullanan siparisler aliniyor

---

## 11. Constraint Testleri

### TEST-DB-074: Cascade Delete - User
- **Test:** Kullanici silinince iliskili veriler
- **Kontrol Listesi:**
  - [ ] User silinince Cart silinir
  - [ ] User silinince CartItems silinir
  - [ ] User silinince WishlistItems silinir
  - [ ] User silinince Addresses silinir
  - [ ] User silinince Sessions silinir
  - [ ] User silinince Orders SILINMEZ (archive)

### TEST-DB-075: Cascade Delete - Product
- **Test:** Urun silinince iliskili veriler
- **Kontrol Listesi:**
  - [ ] Product silinince Variants silinir
  - [ ] Product silinince Images silinir
  - [ ] Product silinince CollectionProducts silinir
  - [ ] Product silinince CartItems SILINIR (veya hata)
  - [ ] Product silinince WishlistItems silinir

### TEST-DB-076: Cascade Delete - Category
- **Test:** Kategori silinince iliskili veriler
- **Kontrol Listesi:**
  - [ ] Alt kategoriler ne olur? (orphan veya cascade)
  - [ ] Kategorideki urunler ne olur? (null veya hata)

### TEST-DB-077: Cascade Delete - Cart
- **Test:** Sepet silinince iliskili veriler
- **Kontrol Listesi:**
  - [ ] Cart silinince CartItems silinir

### TEST-DB-078: Cascade Delete - Order
- **Test:** Siparis silinince iliskili veriler
- **Kontrol Listesi:**
  - [ ] Order silinince OrderItems silinir
  - [ ] Order silinince StatusHistory silinir

### TEST-DB-079: Cascade Delete - Collection
- **Test:** Koleksiyon silinince iliskili veriler
- **Kontrol Listesi:**
  - [ ] Collection silinince CollectionProducts silinir
  - [ ] Urunler SILINMEZ

### TEST-DB-080: Foreign Key - Invalid Reference
- **Test:** Gecersiz FK referansi
- **Kontrol Listesi:**
  - [ ] Olmayan userId ile Order olusturulamaz
  - [ ] Olmayan productId ile CartItem olusturulamaz
  - [ ] Olmayan categoryId ile Product olusturulamaz

### TEST-DB-081: Index Performance - Email
- **Test:** Email index'i calisiyor
- **Kontrol Listesi:**
  - [ ] User.email sorgulari hizli
  - [ ] EXPLAIN ile index kullanimi goruluyor

### TEST-DB-082: Index Performance - Slug
- **Test:** Slug index'leri calisiyor
- **Kontrol Listesi:**
  - [ ] Product.slug sorgulari hizli
  - [ ] Category.slug sorgulari hizli
  - [ ] Collection.slug sorgulari hizli

### TEST-DB-083: Index Performance - SKU
- **Test:** SKU index'i calisiyor
- **Kontrol Listesi:**
  - [ ] Product.sku sorgulari hizli
  - [ ] ProductVariant.sku sorgulari hizli

### TEST-DB-084: Index Performance - OrderNumber
- **Test:** Order number index'i calisiyor
- **Kontrol Listesi:**
  - [ ] Order.orderNumber sorgulari hizli

### TEST-DB-085: Composite Index - CartItem
- **Test:** CartItem composite unique
- **Kontrol Listesi:**
  - [ ] cartId + variantId unique calisiyor
  - [ ] Index sorgularda kullaniliyor

### TEST-DB-086: Composite Index - WishlistItem
- **Test:** WishlistItem composite unique
- **Kontrol Listesi:**
  - [ ] userId + productId unique calisiyor

### TEST-DB-087: Composite Index - CollectionProduct
- **Test:** CollectionProduct composite unique
- **Kontrol Listesi:**
  - [ ] collectionId + productId unique calisiyor

### TEST-DB-088: Default Value - createdAt
- **Test:** createdAt otomatik set ediliyor
- **Kontrol Listesi:**
  - [ ] Yeni kayit olusturulunca createdAt doluyor
  - [ ] Manual set edilmezse current timestamp

### TEST-DB-089: Default Value - updatedAt
- **Test:** updatedAt otomatik guncelleniyor
- **Kontrol Listesi:**
  - [ ] Yeni kayit olusturulunca updatedAt doluyor
  - [ ] Guncelleme yapilinca updatedAt degisiyor

### TEST-DB-090: Default Value - Boolean Fields
- **Test:** Boolean alanlarin default degerleri
- **Kontrol Listesi:**
  - [ ] isActive default true (Product, Category, Coupon, etc.)
  - [ ] isDefault default false (Address)
  - [ ] isOnSale default false (Product)
  - [ ] isFeatured default false (Product)

### TEST-DB-091: Default Value - Numeric Fields
- **Test:** Numeric alanlarin default degerleri
- **Kontrol Listesi:**
  - [ ] stock default 0 (ProductVariant)
  - [ ] displayOrder default 0 (Banner, FAQ)
  - [ ] currentUses default 0 (Coupon)
  - [ ] position default 0 (ProductImage)

### TEST-DB-092: Null Constraint - Required Fields
- **Test:** Zorunlu alanlara null atanamaz
- **Kontrol Listesi:**
  - [ ] User.email null olamaz
  - [ ] Product.name null olamaz
  - [ ] Order.orderNumber null olamaz
  - [ ] Category.name null olamaz

### TEST-DB-093: String Length - Maximum
- **Test:** String alan maksimum uzunluklari
- **Kontrol Listesi:**
  - [ ] Email max 255 karakter
  - [ ] Product name max 255 karakter
  - [ ] Description max 65535 karakter (text)
  - [ ] URL max 2048 karakter

### TEST-DB-094: Transaction - Atomicity
- **Test:** Transaction atomic calisiyor
- **Kontrol Listesi:**
  - [ ] Order + OrderItems tek transaction'da olusturuluyor
  - [ ] Hata durumunda tum islem rollback oluyor
  - [ ] Partial commit olmuyor

---

## Test Yurutme Notlari

### Prisma Studio Kullanimi

```bash
npx prisma studio
```

- Browser'da veritabani icerigini goruntuler
- CRUD islemleri yapilabilir
- Iliskileri takip edebilirsiniz

### Direkt SQL Sorgulari

```sql
-- Unique constraint test
INSERT INTO "User" (email, ...) VALUES ('test@test.com', ...);
INSERT INTO "User" (email, ...) VALUES ('test@test.com', ...); -- Hata bekle

-- Foreign key test
INSERT INTO "Order" (userId, ...) VALUES ('non-existent-id', ...); -- Hata bekle

-- Index kullanimi kontrol
EXPLAIN ANALYZE SELECT * FROM "Product" WHERE slug = 'test-slug';
```

### Prisma Client Test

```typescript
import { db } from "@/lib/db";

// Unique constraint test
try {
  await db.user.create({ data: { email: "test@test.com", ... } });
  await db.user.create({ data: { email: "test@test.com", ... } }); // Hata bekle
} catch (error) {
  console.log("Unique constraint calisiyor:", error.code);
}

// Cascade delete test
const user = await db.user.create({ data: { ... } });
await db.cart.create({ data: { userId: user.id } });
await db.user.delete({ where: { id: user.id } }); // Cart da silinmeli
```

---

## Sonuc Raporu Sablonu

```markdown
# Database Test Sonuclari - [TARIH]

## Ozet
- Toplam: 94 test
- Basarili: X
- Basarisiz: X
- Atlanan: X

## Model Bazli Sonuclar

| Model | Toplam | Basarili | Basarisiz |
|-------|--------|----------|-----------|
| User | 8 | X | X |
| Product | 12 | X | X |
| ...

## Basarisiz Testler

### TEST-DB-XXX: [Test Adi]
- **Durum:** BASARISIZ
- **Beklenen:** [Beklenen sonuc]
- **Gerceklesen:** [Gercek sonuc]
- **Hata:** [Hata mesaji]
- **Not:** [Aciklama]
```

---

*Son Guncelleme: 27 Aralik 2025*

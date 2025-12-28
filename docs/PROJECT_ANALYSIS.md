# Halikarnas Sandals - Proje Analiz Raporu

**Tarih:** 28 Aralık 2025
**Analiz Eden:** Claude Code
**Proje Versiyonu:** 0.1.0

---

## 1. Özet

Halikarnas Sandals, Bodrum/Türkiye merkezli premium el yapımı deri sandalet markası için geliştirilmiş kapsamlı bir e-ticaret platformudur. Proje **Next.js 14 App Router**, **TypeScript**, **Prisma ORM** ve **PostgreSQL** üzerine inşa edilmiştir.

### Genel Durum
- **Tamamlanma Oranı:** ~85%
- **TypeScript Dosya Sayısı:** 253
- **API Route Sayısı:** 46
- **Prisma Model Sayısı:** 22
- **React Component Sayısı:** 90+
- **Zustand Store Sayısı:** 6

### Ana Özellikler
- Tam fonksiyonlu e-ticaret sistemi (ürün listeleme, sepet, checkout)
- Kapsamlı admin paneli (ürün/sipariş/kullanıcı yönetimi)
- NextAuth.js v5 ile kimlik doğrulama (Credentials + Google)
- Cloudinary ile görsel yönetimi
- Resend ile e-posta entegrasyonu
- SEO optimizasyonu (sitemap, robots.txt, JSON-LD)
- Responsive tasarım (mobile-first)

---

## 2. Teknik Altyapı

### 2.1 Tech Stack

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| **Framework** | Next.js (App Router) | 14.2.35 |
| **Language** | TypeScript | ^5 |
| **Runtime** | React | ^18 |
| **Database** | PostgreSQL + Prisma ORM | ^7.2.0 |
| **Auth** | NextAuth.js v5 | ^5.0.0-beta.30 |
| **State** | Zustand | ^5.0.9 |
| **Styling** | Tailwind CSS | ^3.4.1 |
| **UI Components** | Radix UI (shadcn/ui) | various |
| **Forms** | React Hook Form + Zod | ^7.69.0 / ^4.2.1 |
| **Animation** | Framer Motion | ^12.23.26 |
| **Icons** | Lucide React | ^0.562.0 |
| **Image Upload** | Cloudinary | ^2.8.0 |
| **Email** | Resend | ^6.6.0 |
| **Date** | date-fns | ^4.1.0 |
| **PDF** | jsPDF + AutoTable | ^3.0.4 |
| **CSV/Excel** | PapaParse + xlsx | ^5.5.3 / ^0.18.5 |

### 2.2 Proje Yapısı

```
halikarnas-sandals/
├── prisma/
│   ├── schema.prisma          # 643 satır, 22 model
│   ├── seed.ts                # Ana seed dosyası
│   └── seed-categories.ts     # Kategori seeding
├── src/
│   ├── app/
│   │   ├── (shop)/            # Public sayfalar (28 sayfa)
│   │   ├── (auth)/            # Auth sayfaları (5 sayfa)
│   │   ├── admin/             # Admin paneli (18 sayfa)
│   │   ├── api/               # API routes (46 endpoint)
│   │   ├── koleksiyonlar/     # Koleksiyon sayfaları
│   │   ├── layout.tsx         # Root layout
│   │   ├── sitemap.ts         # Dinamik sitemap
│   │   └── robots.ts          # robots.txt
│   ├── components/
│   │   ├── ui/                # 22 shadcn/ui componenti
│   │   ├── layout/            # 6 layout componenti
│   │   ├── home/              # 9 ana sayfa componenti
│   │   ├── shop/              # 14 mağaza componenti
│   │   ├── cart/              # 6 sepet componenti
│   │   ├── checkout/          # 7 checkout componenti
│   │   ├── account/           # 11 hesap componenti
│   │   ├── admin/             # 15 admin componenti
│   │   ├── auth/              # 5 auth componenti
│   │   ├── providers/         # 2 provider
│   │   └── seo/               # 1 SEO componenti
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── db.ts              # Prisma client
│   │   ├── utils.ts           # Utility fonksiyonlar
│   │   ├── constants.ts       # Sabitler
│   │   ├── email.ts           # Resend entegrasyonu
│   │   └── email-templates.ts # Email şablonları
│   ├── stores/                # 6 Zustand store
│   └── hooks/                 # 4 custom hook
├── middleware.ts              # Auth middleware (Edge)
├── tailwind.config.ts         # Tailwind konfigürasyonu
└── package.json
```

---

## 3. Database Schema

### 3.1 Model Özeti

| Model | Açıklama | İlişkiler |
|-------|----------|-----------|
| **User** | Kullanıcı hesabı | → Account, Session, Address, Order, Review, Cart, WishlistItem, ActivityLog |
| **Account** | OAuth hesapları | → User |
| **Session** | Oturumlar | → User |
| **VerificationToken** | Email doğrulama | - |
| **PasswordResetToken** | Şifre sıfırlama | - |
| **Address** | Kullanıcı adresleri | → User, Order (shipping/billing) |
| **Product** | Ürün bilgileri | → Category, ProductVariant, ProductImage, CollectionProduct, Review, CartItem, OrderItem, WishlistItem |
| **ProductVariant** | Beden/renk varyantları | → Product, CartItem, OrderItem |
| **ProductImage** | Ürün görselleri | → Product |
| **Category** | Kategoriler (hiyerarşik) | → Parent/Children (self), Product |
| **Collection** | Koleksiyonlar | → CollectionProduct |
| **CollectionProduct** | Ürün-Koleksiyon ilişkisi | → Collection, Product |
| **Cart** | Sepet | → User, CartItem |
| **CartItem** | Sepet öğeleri | → Cart, Product, ProductVariant |
| **WishlistItem** | Favoriler | → User, Product |
| **Order** | Siparişler | → User, Address (shipping/billing), Coupon, OrderItem, OrderStatusHistory |
| **OrderItem** | Sipariş öğeleri | → Order, Product, ProductVariant |
| **OrderStatusHistory** | Sipariş durum geçmişi | → Order |
| **Coupon** | İndirim kuponları | → Order |
| **Review** | Ürün değerlendirmeleri | → Product, User |
| **Banner** | Ana sayfa bannerları | - |
| **Page** | CMS sayfaları | - |
| **FAQ** | SSS içerikleri | - |
| **NewsletterSubscriber** | Newsletter aboneleri | - |
| **SiteSetting** | Site ayarları (key-value) | - |
| **ActivityLog** | Admin aktivite logları | → User |

### 3.2 Enum'lar

```prisma
enum UserRole { CUSTOMER, ADMIN, SUPER_ADMIN }
enum ProductStatus { DRAFT, ACTIVE, ARCHIVED }
enum Gender { ERKEK, KADIN, UNISEX }
enum OrderStatus { PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED }
enum PaymentStatus { PENDING, PAID, FAILED, REFUNDED }
enum DiscountType { PERCENTAGE, FIXED_AMOUNT }
```

### 3.3 Önemli İndeksler

- `Product`: categoryId, status, gender, slug, isFeatured, isNew, isBestSeller
- `ProductVariant`: productId, stock, unique(productId+size+color)
- `Order`: userId, status, orderNumber, createdAt
- `Category`: parentId, slug, gender, unique(slug+gender)

---

## 4. API Endpoints

### 4.1 Public API

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/search` | GET | Ürün arama (query, filters, sort) |
| `/api/contact` | POST | İletişim formu gönderimi |
| `/api/coupon/validate` | POST | Kupon doğrulama |
| `/api/newsletter` | POST | Newsletter aboneliği |
| `/api/locations/cities` | GET | Türkiye şehir listesi |
| `/api/locations/districts` | GET | İlçe listesi (city param) |

### 4.2 Auth API

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/auth/[...nextauth]` | * | NextAuth handlers |
| `/api/auth/register` | POST | Yeni kullanıcı kaydı |
| `/api/auth/forgot-password` | POST | Şifre sıfırlama emaili |
| `/api/auth/reset-password` | POST | Yeni şifre belirleme |

### 4.3 User API (Auth Required)

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/user/profile` | GET, PATCH | Profil bilgileri |
| `/api/user/change-password` | POST | Şifre değiştirme |
| `/api/user/delete` | DELETE | Hesap silme |
| `/api/addresses` | GET, POST | Adres listesi/ekleme |
| `/api/addresses/[id]` | PATCH, DELETE | Adres güncelleme/silme |
| `/api/wishlist` | GET, POST | Favoriler |
| `/api/wishlist/[productId]` | DELETE | Favoriden çıkarma |
| `/api/orders` | GET, POST | Sipariş listesi/oluşturma |
| `/api/cart` | GET, POST, DELETE | Sepet işlemleri |

### 4.4 Admin API (Admin Role Required)

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/admin/products` | GET, POST | Ürün listesi/ekleme |
| `/api/admin/products/[id]` | GET, PATCH, DELETE | Ürün detay/güncelleme/silme |
| `/api/admin/products/export` | GET | Ürün dışa aktarma (CSV/Excel) |
| `/api/admin/products/import` | POST | Ürün içe aktarma |
| `/api/admin/products/template` | GET | Import şablonu indirme |
| `/api/admin/categories` | GET, POST | Kategori yönetimi |
| `/api/admin/categories/[id]` | PATCH, DELETE | Kategori işlemleri |
| `/api/admin/collections` | GET, POST | Koleksiyon yönetimi |
| `/api/admin/collections/[id]` | PATCH, DELETE | Koleksiyon işlemleri |
| `/api/admin/orders` | GET | Sipariş listesi |
| `/api/admin/orders/[id]` | GET, PATCH | Sipariş detay/güncelleme |
| `/api/admin/orders/[id]/invoice` | GET | Fatura PDF oluşturma |
| `/api/admin/users` | GET | Kullanıcı listesi |
| `/api/admin/users/[id]` | GET, PATCH, DELETE | Kullanıcı işlemleri |
| `/api/admin/coupons` | GET, POST | Kupon yönetimi |
| `/api/admin/coupons/[id]` | PATCH, DELETE | Kupon işlemleri |
| `/api/admin/banners` | GET, POST | Banner yönetimi |
| `/api/admin/banners/[id]` | PATCH, DELETE | Banner işlemleri |
| `/api/admin/pages` | GET, POST | Sayfa yönetimi |
| `/api/admin/pages/[id]` | PATCH, DELETE | Sayfa işlemleri |
| `/api/admin/settings` | GET, POST | Site ayarları |
| `/api/admin/subscribers` | GET | Newsletter aboneleri |
| `/api/admin/inventory` | GET | Stok durumu |
| `/api/admin/inventory/bulk-update` | POST | Toplu stok güncelleme |
| `/api/admin/activity` | GET | Aktivite logları |
| `/api/admin/reports` | GET | Raporlar |
| `/api/upload` | POST | Cloudinary görsel yükleme |

---

## 5. Sayfa Haritası

### 5.1 Public Sayfalar (`/src/app/(shop)/`)

| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/` | `page.tsx` | Ana sayfa (Hero, BestSellers, Categories, Newsletter) |
| `/kadin` | `kadin/page.tsx` | Kadın kategorisi |
| `/kadin/[category]` | `kadin/[category]/page.tsx` | Alt kategori |
| `/kadin/[category]/[sku]` | `kadin/[category]/[sku]/page.tsx` | Ürün detay |
| `/erkek` | `erkek/page.tsx` | Erkek kategorisi |
| `/erkek/[category]` | `erkek/[category]/page.tsx` | Alt kategori |
| `/erkek/[category]/[sku]` | `erkek/[category]/[sku]/page.tsx` | Ürün detay |
| `/sepet` | `sepet/page.tsx` | Sepet sayfası |
| `/odeme` | `odeme/page.tsx` | Checkout (3 adım) |
| `/siparis-tamamlandi/[orderNumber]` | `siparis-tamamlandi/[orderNumber]/page.tsx` | Sipariş onay |
| `/arama` | `arama/page.tsx` | Arama sonuçları |
| `/hakkimizda` | `hakkimizda/page.tsx` | Hakkımızda |
| `/iletisim` | `iletisim/page.tsx` | İletişim formu |
| `/sss` | `sss/page.tsx` | SSS |
| `/beden-rehberi` | `beden-rehberi/page.tsx` | Beden tablosu |
| `/sayfa/[slug]` | `sayfa/[slug]/page.tsx` | Dinamik CMS sayfaları |
| `/hesabim` | `hesabim/page.tsx` | Hesap özeti |
| `/hesabim/bilgilerim` | `hesabim/bilgilerim/page.tsx` | Profil düzenleme |
| `/hesabim/siparislerim` | `hesabim/siparislerim/page.tsx` | Sipariş geçmişi |
| `/hesabim/siparislerim/[id]` | `hesabim/siparislerim/[id]/page.tsx` | Sipariş detayı |
| `/hesabim/adreslerim` | `hesabim/adreslerim/page.tsx` | Adres yönetimi |
| `/hesabim/favorilerim` | `hesabim/favorilerim/page.tsx` | Favoriler |
| `/hesabim/sifre-degistir` | `hesabim/sifre-degistir/page.tsx` | Şifre değiştirme |

### 5.2 Koleksiyonlar (`/src/app/koleksiyonlar/`)

| Route | Açıklama |
|-------|----------|
| `/koleksiyonlar` | Koleksiyon listesi (Cinematic scroll deneyimi) |
| `/koleksiyonlar/[slug]` | Koleksiyon detay |

### 5.3 Auth Sayfaları (`/src/app/(auth)/`)

| Route | Açıklama |
|-------|----------|
| `/giris` | Giriş formu |
| `/kayit` | Kayıt formu |
| `/sifremi-unuttum` | Şifre sıfırlama isteği |
| `/sifre-sifirla/[token]` | Yeni şifre belirleme |

### 5.4 Admin Paneli (`/src/app/admin/`)

| Route | Açıklama |
|-------|----------|
| `/admin` | Dashboard (istatistikler, grafikler) |
| `/admin/urunler` | Ürün listesi |
| `/admin/urunler/yeni` | Yeni ürün ekleme |
| `/admin/urunler/[id]` | Ürün düzenleme |
| `/admin/urunler/import` | Ürün içe aktarma |
| `/admin/kategoriler` | Kategori yönetimi |
| `/admin/koleksiyonlar` | Koleksiyon yönetimi |
| `/admin/siparisler` | Sipariş listesi |
| `/admin/siparisler/[id]` | Sipariş detayı |
| `/admin/kullanicilar` | Kullanıcı listesi |
| `/admin/kullanicilar/[id]` | Kullanıcı detayı |
| `/admin/kuponlar` | Kupon listesi |
| `/admin/kuponlar/[id]` | Kupon düzenleme |
| `/admin/bannerlar` | Banner listesi |
| `/admin/bannerlar/[id]` | Banner düzenleme |
| `/admin/sayfalar` | CMS sayfaları |
| `/admin/sayfalar/[id]` | Sayfa düzenleme |
| `/admin/aboneler` | Newsletter aboneleri |
| `/admin/stok` | Stok yönetimi |
| `/admin/raporlar` | Satış raporları |
| `/admin/aktivite` | Aktivite logları |
| `/admin/ayarlar` | Site ayarları |

---

## 6. Component Kütüphanesi

### 6.1 UI Components (`/src/components/ui/`)

shadcn/ui tabanlı 22 base component:

| Component | Açıklama |
|-----------|----------|
| `accordion.tsx` | Açılır-kapanır paneller |
| `alert.tsx` | Bildirim kutuları |
| `alert-dialog.tsx` | Onay diyalogları |
| `avatar.tsx` | Kullanıcı avatarları |
| `badge.tsx` | Etiketler |
| `button.tsx` | Butonlar (variants) |
| `card.tsx` | Kartlar |
| `checkbox.tsx` | Onay kutuları |
| `dialog.tsx` | Modal diyaloglar |
| `dropdown-menu.tsx` | Açılır menüler |
| `form.tsx` | Form kontrolleri (react-hook-form) |
| `input.tsx` | Text inputları |
| `label.tsx` | Form etiketleri |
| `popover.tsx` | Açılır paneller |
| `radio-group.tsx` | Radio butonları |
| `scroll-area.tsx` | Özel scroll alanları |
| `select.tsx` | Seçim kutuları |
| `separator.tsx` | Ayırıcılar |
| `sheet.tsx` | Yan paneller (drawer) |
| `skeleton.tsx` | Yükleme placeholder'ları |
| `slider.tsx` | Kaydırıcılar |
| `switch.tsx` | Toggle switch'ler |
| `table.tsx` | Tablolar |
| `tabs.tsx` | Sekmeler |
| `textarea.tsx` | Çok satırlı input |
| `toast.tsx` / `toaster.tsx` | Bildirimler |

### 6.2 Layout Components (`/src/components/layout/`)

| Component | Açıklama |
|-----------|----------|
| `Navbar.tsx` | Ana navigasyon (mega menu, arama, sepet) |
| `Footer.tsx` | Site footer'ı |
| `MobileMenu.tsx` | Mobil hamburger menü |
| `CartDrawer.tsx` | Sepet yan paneli |
| `SearchDialog.tsx` | Arama modal'ı |
| `UserMenu.tsx` | Kullanıcı dropdown menüsü |

### 6.3 Home Components (`/src/components/home/`)

| Component | Açıklama |
|-----------|----------|
| `HeroSection.tsx` | Full-screen hero banner |
| `BrandPromise.tsx` | Marka vaadi strip |
| `BestSellers.tsx` | En çok satanlar grid |
| `FeaturedCategories.tsx` | Öne çıkan kategoriler |
| `CraftsmanshipMini.tsx` | Zanaatkarlık hikayesi |
| `Newsletter.tsx` | Newsletter kayıt formu |
| `BrandStory.tsx` | Marka hikayesi |
| `Features.tsx` | Özellikler grid |
| `InstagramFeed.tsx` | Instagram feed'i |

### 6.4 Shop Components (`/src/components/shop/`)

| Component | Açıklama |
|-----------|----------|
| `ProductCard.tsx` | Ürün kartı (wishlist, quick view) |
| `ProductGrid.tsx` | Ürün grid layout |
| `ProductDetail.tsx` | Ürün detay sayfası |
| `ImageGallery.tsx` | Ürün görselleri galerisi |
| `ColorSelector.tsx` | Renk seçici |
| `SizeSelector.tsx` | Beden seçici |
| `FilterSidebar.tsx` | Filtre yan paneli |
| `SortSelect.tsx` | Sıralama seçici |
| `CategoryPage.tsx` | Kategori sayfası wrapper |
| `MobileAddToCartBar.tsx` | Mobil sepete ekle bar |
| `CinematicScroll.tsx` | Koleksiyon scroll deneyimi |
| `ScrollProgress.tsx` | Scroll progress bar |
| `frames/IntroFrame.tsx` | Koleksiyon intro |
| `frames/CollectionFrame.tsx` | Koleksiyon frame |
| `frames/OutroFrame.tsx` | Koleksiyon outro |

### 6.5 Cart Components (`/src/components/cart/`)

| Component | Açıklama |
|-----------|----------|
| `CartPage.tsx` | Sepet sayfası |
| `CartItem.tsx` | Sepet öğesi |
| `CartSummary.tsx` | Sepet özeti |
| `CouponInput.tsx` | Kupon girişi |
| `EmptyCart.tsx` | Boş sepet durumu |

### 6.6 Checkout Components (`/src/components/checkout/`)

| Component | Açıklama |
|-----------|----------|
| `CheckoutPage.tsx` | Checkout ana wrapper |
| `CheckoutSteps.tsx` | Adım göstergesi |
| `ShippingForm.tsx` | Teslimat bilgileri formu |
| `PaymentForm.tsx` | Ödeme seçimi |
| `OrderReview.tsx` | Sipariş inceleme |
| `CheckoutSummary.tsx` | Checkout özeti |

### 6.7 Account Components (`/src/components/account/`)

| Component | Açıklama |
|-----------|----------|
| `AccountSidebar.tsx` | Hesap navigasyonu |
| `AccountStats.tsx` | Hesap istatistikleri |
| `ProfileForm.tsx` | Profil düzenleme formu |
| `PasswordChangeForm.tsx` | Şifre değiştirme formu |
| `OrderCard.tsx` | Sipariş kartı |
| `OrderTimeline.tsx` | Sipariş durum zaman çizelgesi |
| `AddressCard.tsx` | Adres kartı |
| `AddressForm.tsx` | Adres ekleme/düzenleme formu |
| `WishlistCard.tsx` | Favori ürün kartı |
| `DeleteAccountDialog.tsx` | Hesap silme onayı |

### 6.8 Admin Components (`/src/components/admin/`)

| Component | Açıklama |
|-----------|----------|
| `AdminShell.tsx` | Admin layout wrapper |
| `AdminSidebar.tsx` | Admin navigasyonu |
| `AdminHeader.tsx` | Admin header |
| `ProductForm.tsx` | Ürün ekleme/düzenleme formu |
| `VariantMatrix.tsx` | Varyant yönetimi (beden×renk matrisi) |
| `ImageUpload.tsx` | Tekli görsel yükleme |
| `MultiImageUpload.tsx` | Çoklu görsel yükleme |
| `StagedImageUpload.tsx` | Aşamalı görsel yükleme |
| `SortableImageGrid.tsx` | Sürükle-bırak görsel sıralama |
| `DeleteProductButton.tsx` | Ürün silme butonu |
| `orders/OrderStatusBadge.tsx` | Sipariş durum badge'i |
| `orders/OrderStatusSelect.tsx` | Sipariş durum değiştirici |
| `orders/OrderTimeline.tsx` | Admin sipariş timeline |
| `coupons/DeleteCouponButton.tsx` | Kupon silme butonu |
| `banners/DeleteBannerButton.tsx` | Banner silme butonu |
| `pages/DeletePageButton.tsx` | Sayfa silme butonu |

### 6.9 Auth Components (`/src/components/auth/`)

| Component | Açıklama |
|-----------|----------|
| `LoginForm.tsx` | Giriş formu |
| `RegisterForm.tsx` | Kayıt formu |
| `ForgotPasswordForm.tsx` | Şifre sıfırlama formu |
| `ResetPasswordForm.tsx` | Yeni şifre belirleme formu |

---

## 7. State Management

### 7.1 Zustand Stores

#### cart-store.ts
```typescript
interface CartState {
  items: CartItem[]           // Sepet öğeleri
  isOpen: boolean             // Sepet drawer durumu
  coupon: AppliedCoupon | null

  // Actions
  addItem(item)
  removeItem(variantId)
  updateQuantity(variantId, quantity)
  clearCart()
  openCart() / closeCart() / toggleCart()
  applyCoupon(coupon) / removeCoupon()

  // Computed
  getTotalItems(): number
  getSubtotal(): number
  getShippingCost(): number   // 500 TL üstü ücretsiz
  getDiscount(): number
  getTotal(): number
}
```
- **Persist:** localStorage ("halikarnas-cart")
- **Kargo:** 49.90 TL, 500 TL üstü ücretsiz

#### wishlist-store.ts
```typescript
interface WishlistStore {
  items: WishlistItem[]
  isLoading: boolean

  addItem(productId): Promise<boolean>
  removeItem(productId): Promise<boolean>
  isInWishlist(productId): boolean
  syncWithServer(): Promise<void>
  clearWishlist()
}
```
- **Persist:** localStorage
- **Sync:** API ile senkronize

#### checkout-store.ts
```typescript
interface CheckoutState {
  currentStep: 1 | 2 | 3
  shippingInfo: ShippingInfo | null
  paymentMethod: "card" | "cash_on_delivery"
  acceptedTerms: boolean
  acceptedKvkk: boolean

  // Navigation
  setStep() / nextStep() / prevStep()

  // Validation
  canProceedToPayment(): boolean
  canProceedToReview(): boolean
  canPlaceOrder(): boolean
}
```

#### ui-store.ts
```typescript
interface UIState {
  // Modals & Drawers
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  isFilterOpen: boolean
  isSizeGuideOpen: boolean
  quickViewProductId: string | null

  // Lightbox
  lightboxImages: string[]
  lightboxIndex: number

  // Global
  isLoading: boolean

  closeAll()
}
```

#### filter-store.ts
```typescript
interface FilterState {
  categories: string[]
  sizes: string[]
  colors: string[]
  priceRange: [number, number]
  sort: SortOption
  search: string

  toggleCategory() / toggleSize() / toggleColor()
  setPriceRange() / setSort() / setSearch()
  clearFilters()
  hasActiveFilters(): boolean
  getActiveFilterCount(): number
}
```

#### scroll-store.ts
```typescript
interface ScrollState {
  scrollY: number
  setScrollY(y: number)
}
```
- Koleksiyon sayfası scroll takibi için

---

## 8. Admin Paneli Detayları

### 8.1 Dashboard (`/admin`)
- **İstatistikler:** Toplam gelir, siparişler, ürünler, kullanıcılar
- **Grafikler:** Son 7 günlük satış grafiği
- **Hızlı Erişim:** Bekleyen siparişler, son siparişler tablosu

### 8.2 Ürün Yönetimi (`/admin/urunler`)
- **Liste:** Sayfalama, arama, durum filtresi
- **Ekleme/Düzenleme:**
  - Temel bilgiler (ad, slug, açıklama, fiyat)
  - Kategori ve cinsiyet seçimi
  - Varyant matrisi (beden × renk)
  - Çoklu görsel yükleme (drag-drop sıralama)
  - SEO alanları
  - Koleksiyon ataması
- **Import/Export:** CSV ve Excel desteği

### 8.3 Sipariş Yönetimi (`/admin/siparisler`)
- **Liste:** Durum filtresi, tarih aralığı, arama
- **Detay:**
  - Müşteri bilgileri
  - Ürün listesi
  - Adres bilgileri
  - Durum değiştirme (timeline)
  - Fatura PDF oluşturma
  - Kargo takip numarası ekleme

### 8.4 Kullanıcı Yönetimi (`/admin/kullanicilar`)
- Kullanıcı listesi ve detay
- Rol değiştirme (CUSTOMER, ADMIN)
- Sipariş geçmişi görüntüleme

### 8.5 Kupon Yönetimi (`/admin/kuponlar`)
- Kupon oluşturma/düzenleme
- Tip: Yüzde veya sabit tutar
- Kullanım limitleri ve geçerlilik tarihleri

### 8.6 Banner Yönetimi (`/admin/bannerlar`)
- Ana sayfa banner'ları
- Mobil ve desktop görsel desteği
- Tarih bazlı aktiflik

### 8.7 CMS Sayfaları (`/admin/sayfalar`)
- Dinamik sayfa oluşturma
- SEO meta bilgileri

### 8.8 Stok Yönetimi (`/admin/stok`)
- Varyant bazlı stok görüntüleme
- Toplu stok güncelleme

### 8.9 Raporlar (`/admin/raporlar`)
- Satış raporları
- Dönem karşılaştırmaları

---

## 9. E-Ticaret Akışları

### 9.1 Ürün Akışı
```
Ana Sayfa → Kategori Sayfası → Ürün Detay → Sepete Ekle
     ↓           ↓                ↓
  BestSellers   Filter        - Renk seçimi
  Categories    Sort          - Beden seçimi
                              - Miktar seçimi
                              - Stok kontrolü
```

### 9.2 Sepet Akışı
- **Sepet Drawer:** Hızlı görüntüleme ve düzenleme
- **Sepet Sayfası:** Detaylı inceleme
- **Kupon:** Kod girişi ve doğrulama
- **Kargo:** 500 TL üzeri ücretsiz

### 9.3 Checkout Akışı (3 Adım)
```
Adım 1: Teslimat Bilgileri
  - Ad, Soyad, Email, Telefon
  - Şehir, İlçe, Adres
  - Dinamik ilçe listesi

Adım 2: Ödeme Yöntemi
  - Kapıda Ödeme ✓
  - Kredi Kartı (placeholder)

Adım 3: Sipariş İnceleme
  - Ürün listesi
  - Teslimat adresi
  - Fiyat özeti
  - KVKK ve koşullar onayı
  - Sipariş oluşturma
```

### 9.4 Sipariş Sonrası
- Sipariş onay sayfası
- Sipariş onay emaili (Resend)
- Sipariş takibi (/hesabim/siparislerim)

### 9.5 Kullanıcı Akışı
```
Kayıt → Email ile giriş / Google OAuth
         ↓
      Profil Yönetimi
      - Bilgilerimi düzenle
      - Şifre değiştir
      - Adres defteri
      - Favorilerim
      - Siparişlerim
      - Hesabımı sil
```

---

## 10. Entegrasyonlar

### 10.1 Cloudinary (Görsel Yönetimi)
- **Konfigürasyon:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **Özellikler:**
  - Otomatik format ve kalite optimizasyonu
  - Organize klasör yapısı: `halikarnas/products/[gender]/[category]/`
  - SKU bazlı isimlendirme
  - Max 5MB dosya boyutu
- **Upload endpoint:** `/api/upload`

### 10.2 Resend (Email)
- **Konfigürasyon:** `RESEND_API_KEY`
- **Gönderilen Emailler:**
  - Sipariş onayı
  - Şifre sıfırlama
- **Development:** Console log (gerçek email gönderilmez)

### 10.3 NextAuth.js v5
- **Providers:**
  - Credentials (email/password)
  - Google OAuth
- **Session:** JWT strategy
- **Adapter:** Prisma
- **Custom pages:** `/giris`, `/kayit`

### 10.4 PostgreSQL + Prisma
- **Adapter:** `@prisma/adapter-pg` (Edge compatible)
- **Connection:** Pool-based connection
- **Logging:** Development'ta query, error, warn

---

## 11. SEO ve Performans

### 11.1 SEO Özellikleri
- **Sitemap:** Dinamik (`/sitemap.xml`)
  - Statik sayfalar
  - Tüm aktif ürünler
  - Kategoriler
  - Koleksiyonlar
  - CMS sayfaları
- **robots.txt:** Admin, hesap, API, sepet, checkout engelli
- **Metadata:**
  - Title template
  - Description
  - Keywords
  - Open Graph
  - Twitter Card
- **JSON-LD:** Organization, Website schema

### 11.2 Performans
- **Fontlar:** Google Fonts (swap display)
  - DM Sans (body)
  - Cormorant Garamond (headings)
  - Cinzel (accent)
- **Görseller:** next/image, Cloudinary optimizasyonu
- **State:** Zustand persist (localStorage)

---

## 12. Eksikler ve TODO'lar

### 12.1 Koddaki TODO Yorumları

| Dosya | Satır | Açıklama |
|-------|-------|----------|
| `src/app/api/orders/route.ts` | 282 | Authenticated user order list implementasyonu |
| `src/app/api/cart/route.ts` | 8, 98 | userId auth session'dan alınmalı |
| `src/app/api/auth/reset-password/route.ts` | 76 | Şifre değişikliği onay emaili |
| `src/components/layout/SearchDialog.tsx` | 61 | Gerçek API çağrısı implementasyonu |

### 12.2 Tamamlanmamış Özellikler

1. **Ödeme Entegrasyonu**
   - Kredi kartı ödeme (iyzico/PayTR) henüz yok
   - Sadece kapıda ödeme aktif

2. **Review/Değerlendirme Sistemi**
   - Model mevcut ama UI/API implementasyonu yok

3. **Gerçek Arama**
   - SearchDialog placeholder implementasyonu
   - Full-text search gerekli

4. **Authenticated Cart Sync**
   - Giriş yapmış kullanıcılar için DB senkronizasyonu eksik

5. **Email Tamamlama**
   - Sipariş durumu değişiklik emaili
   - Stok bildirimi

6. **PWA**
   - Service worker yok

7. **Çoklu Dil (i18n)**
   - Sadece Türkçe

8. **Gelişmiş Analytics**
   - Google Analytics entegrasyonu yok

---

## 13. Öneriler

### 13.1 Kısa Vadeli (1-2 Sprint)
1. ✅ İyzico/PayTR ödeme entegrasyonu
2. ✅ Gerçek arama API implementasyonu
3. ✅ Authenticated cart DB sync
4. ✅ Email template'lerinin tamamlanması

### 13.2 Orta Vadeli (3-4 Sprint)
1. Review/değerlendirme sistemi
2. Stok bildirim sistemi
3. Google Analytics 4 entegrasyonu
4. PWA desteği

### 13.3 Uzun Vadeli
1. Çoklu dil desteği (i18n)
2. Blog/Magazine bölümü
3. Gelişmiş raporlama
4. B2B portal

### 13.4 Teknik İyileştirmeler
1. **Caching:** Redis/Upstash ile API caching
2. **Search:** Algolia/Meilisearch entegrasyonu
3. **Monitoring:** Sentry error tracking
4. **CI/CD:** GitHub Actions pipeline
5. **Testing:** Jest + React Testing Library

---

## 14. Güvenlik Notları

### 14.1 Mevcut Güvenlik Önlemleri
- JWT tabanlı session
- Bcrypt password hashing
- Role-based access control (CUSTOMER, ADMIN, SUPER_ADMIN)
- Admin API route protection
- Zod input validation
- File type/size validation (upload)

### 14.2 Önerilen Güvenlik İyileştirmeleri
1. Rate limiting (API routes)
2. CSRF protection
3. Input sanitization (XSS prevention)
4. Security headers (CSP, HSTS)
5. Audit logging tamamlama

---

## 15. Deployment Notları

### 15.1 Environment Variables
```env
# Database
DATABASE_URL=

# NextAuth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Resend
RESEND_API_KEY=
ADMIN_EMAIL=
```

### 15.2 Build Commands
```bash
npm run db:generate    # Prisma client generate
npm run db:migrate     # Production migration
npm run build          # Next.js build
npm start              # Production server
```

---

*Bu rapor Claude Code tarafından 28 Aralık 2025 tarihinde oluşturulmuştur.*

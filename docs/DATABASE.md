# Database Semasi

## ER Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER & AUTH                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                   │
│  │    User     │────<│   Account   │     │   Session   │                   │
│  │             │     │  (OAuth)    │     │             │                   │
│  └──────┬──────┘     └─────────────┘     └─────────────┘                   │
│         │                                                                    │
│         │ 1:N                                                                │
│         ▼                                                                    │
│  ┌─────────────┐                                                            │
│  │   Address   │                                                            │
│  └─────────────┘                                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRODUCTS                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐     ┌─────────────────┐     ┌───────────────────┐         │
│  │  Category   │────<│    Product      │────<│  ProductVariant   │         │
│  │  (parent/   │     │                 │     │  (size/color/sku) │         │
│  │   child)    │     └────────┬────────┘     └───────────────────┘         │
│  └─────────────┘              │                                             │
│                               │ 1:N                                          │
│                               ▼                                              │
│                        ┌─────────────┐                                      │
│                        │ProductImage │                                      │
│                        └─────────────┘                                      │
│                                                                              │
│  ┌─────────────┐     ┌───────────────────┐                                 │
│  │ Collection  │────<│CollectionProduct  │────> Product                     │
│  └─────────────┘     │    (N:N join)     │                                 │
│                      └───────────────────┘                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              ORDERS                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User ───1:N───> ┌─────────────┐ <───N:1─── Coupon                         │
│                  │    Order    │                                            │
│                  └──────┬──────┘                                            │
│                         │                                                    │
│            ┌────────────┼────────────┐                                      │
│            │ 1:N        │ 1:N        │                                      │
│            ▼            ▼            ▼                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌───────────────────┐                     │
│  │  OrderItem  │ │OrderStatus  │ │ Address (snapshot)│                     │
│  │             │ │  History    │ │                   │                     │
│  └─────────────┘ └─────────────┘ └───────────────────┘                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           CART & WISHLIST                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User ───1:1───> ┌─────────────┐ ───1:N───> ┌─────────────┐                │
│                  │    Cart     │            │  CartItem   │                 │
│                  └─────────────┘            └─────────────┘                 │
│                                                    │                         │
│                                                    ▼                         │
│                                             ProductVariant                   │
│                                                                              │
│  User ───1:N───> ┌─────────────┐ ───N:1───> Product                        │
│                  │WishlistItem │                                            │
│                  └─────────────┘                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              CMS & SETTINGS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Banner    │  │    Page     │  │     FAQ     │  │ SiteSetting │        │
│  │             │  │             │  │             │  │  (key/val)  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                              │
│  ┌─────────────────────┐                                                    │
│  │NewsletterSubscriber │                                                    │
│  └─────────────────────┘                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Model Detaylari

### User

| Alan | Tip | Zorunlu | Aciklama |
|------|-----|---------|----------|
| id | String | Evet | CUID primary key |
| name | String | - | Kullanici adi |
| email | String | Evet | Unique, indexed |
| emailVerified | DateTime | - | Email dogrulama tarihi |
| image | String | - | Profil resmi URL |
| password | String | - | Hashed (bcrypt), OAuth icin null |
| phone | String | - | Telefon numarasi |
| role | UserRole | Evet | CUSTOMER (default), ADMIN, SUPER_ADMIN |
| createdAt | DateTime | Evet | Olusturulma tarihi |
| updatedAt | DateTime | Evet | Son guncelleme |

**Iliskiler:**
- accounts: Account[] (OAuth)
- sessions: Session[]
- addresses: Address[]
- orders: Order[]
- reviews: Review[]
- cart: Cart? (1:1)
- wishlist: WishlistItem[]

---

### Product

| Alan | Tip | Zorunlu | Aciklama |
|------|-----|---------|----------|
| id | String | Evet | CUID |
| name | String | Evet | Urun adi |
| slug | String | Evet | URL-friendly, unique |
| description | String | Evet | Detayli aciklama (Text) |
| shortDescription | String | - | Kisa aciklama |
| basePrice | Decimal | Evet | Ana fiyat |
| compareAtPrice | Decimal | - | Karsilastirma fiyati (indirim gosterimi) |
| costPrice | Decimal | - | Maliyet fiyati |
| sku | String | - | Stok kodu, unique |
| material | String | - | Malzeme (Hakiki Deri, Dana Derisi, vb.) |
| heelHeight | String | - | Topuk yuksekligi |
| soleType | String | - | Taban tipi |
| madeIn | String | - | Uretim yeri (default: Turkiye) |
| careInstructions | String | - | Bakim talimatlari |
| metaTitle | String | - | SEO title |
| metaDescription | String | - | SEO description |
| status | ProductStatus | Evet | DRAFT, ACTIVE, ARCHIVED |
| isFeatured | Boolean | Evet | One cikan (default: false) |
| isNew | Boolean | Evet | Yeni urun (default: false) |
| isBestSeller | Boolean | Evet | Cok satan (default: false) |
| categoryId | String | Evet | Kategori FK |
| gender | Gender | - | ERKEK, KADIN, UNISEX |
| viewCount | Int | Evet | Goruntulenme (default: 0) |
| soldCount | Int | Evet | Satilan adet (default: 0) |
| createdAt | DateTime | Evet | |
| updatedAt | DateTime | Evet | |
| publishedAt | DateTime | - | Yayinlanma tarihi |

**Indexes:**
- categoryId
- status
- gender
- slug
- isFeatured
- isNew
- isBestSeller

---

### ProductVariant

| Alan | Tip | Zorunlu | Aciklama |
|------|-----|---------|----------|
| id | String | Evet | CUID |
| productId | String | Evet | Product FK |
| size | String | Evet | Beden ("36", "37", vb.) |
| color | String | - | Renk adi |
| colorHex | String | - | Renk hex kodu |
| sku | String | Evet | Varyant SKU, unique |
| price | Decimal | - | Farkli fiyat (override) |
| stock | Int | Evet | Stok adedi (default: 0) |

**Unique:** [productId, size, color]

---

### Category

| Alan | Tip | Zorunlu | Aciklama |
|------|-----|---------|----------|
| id | String | Evet | CUID |
| name | String | Evet | Kategori adi |
| slug | String | Evet | URL slug, unique |
| description | String | - | Aciklama |
| image | String | - | Gorsel URL |
| parentId | String | - | Ust kategori FK |
| position | Int | Evet | Siralama (default: 0) |
| gender | Gender | - | ERKEK, KADIN, UNISEX |
| isActive | Boolean | Evet | Aktif mi (default: true) |
| metaTitle | String | - | SEO |
| metaDescription | String | - | SEO |

**Self-relation:** parent/children (hiyerarsik)

---

### Order

| Alan | Tip | Zorunlu | Aciklama |
|------|-----|---------|----------|
| id | String | Evet | CUID |
| orderNumber | String | Evet | Siparis no (HS-2024-000123), unique |
| userId | String | - | Kullanici FK (guest icin null) |
| guestEmail | String | - | Misafir email |
| guestPhone | String | - | Misafir telefon |
| status | OrderStatus | Evet | Siparis durumu |
| paymentStatus | PaymentStatus | Evet | Odeme durumu |
| paymentMethod | String | - | Odeme yontemi |
| shippingAddressId | String | - | Teslimat adres FK |
| billingAddressId | String | - | Fatura adres FK |
| shippingName | String | Evet | Teslimat adi (snapshot) |
| shippingPhone | String | Evet | Teslimat tel (snapshot) |
| shippingAddress | String | Evet | Teslimat adres (snapshot) |
| shippingCity | String | Evet | |
| shippingDistrict | String | Evet | |
| shippingPostalCode | String | - | |
| subtotal | Decimal | Evet | Ara toplam |
| shippingCost | Decimal | Evet | Kargo ucreti |
| discount | Decimal | Evet | Indirim tutari |
| tax | Decimal | Evet | KDV |
| total | Decimal | Evet | Genel toplam |
| couponId | String | - | Kupon FK |
| couponCode | String | - | Kupon kodu (snapshot) |
| customerNote | String | - | Musteri notu |
| adminNote | String | - | Admin notu |
| trackingNumber | String | - | Kargo takip no |
| carrier | String | - | Kargo firmasi |
| createdAt | DateTime | Evet | |
| paidAt | DateTime | - | Odeme tarihi |
| shippedAt | DateTime | - | Kargoya verilme |
| deliveredAt | DateTime | - | Teslim tarihi |

---

### Coupon

| Alan | Tip | Zorunlu | Aciklama |
|------|-----|---------|----------|
| id | String | Evet | CUID |
| code | String | Evet | Kupon kodu, unique |
| description | String | - | Aciklama |
| discountType | DiscountType | Evet | PERCENTAGE veya FIXED_AMOUNT |
| discountValue | Decimal | Evet | Indirim degeri |
| minOrderAmount | Decimal | - | Minimum siparis tutari |
| maxDiscount | Decimal | - | Maksimum indirim tutari |
| usageLimit | Int | - | Toplam kullanim limiti |
| usageCount | Int | Evet | Kullanilma sayisi |
| perUserLimit | Int | - | Kullanici basi limit |
| startsAt | DateTime | - | Baslangic tarihi |
| expiresAt | DateTime | - | Bitis tarihi |
| isActive | Boolean | Evet | Aktif mi |

---

## Enum Degerleri

### UserRole

```prisma
enum UserRole {
  CUSTOMER      // Normal kullanici
  ADMIN         // Admin
  SUPER_ADMIN   // Super admin
}
```

### ProductStatus

```prisma
enum ProductStatus {
  DRAFT     // Taslak
  ACTIVE    // Aktif
  ARCHIVED  // Arsivlenmis
}
```

### Gender

```prisma
enum Gender {
  ERKEK    // Erkek
  KADIN    // Kadin
  UNISEX   // Unisex
}
```

### OrderStatus

```prisma
enum OrderStatus {
  PENDING      // Beklemede
  CONFIRMED    // Onaylandi
  PROCESSING   // Hazirlaniyor
  SHIPPED      // Kargoya verildi
  DELIVERED    // Teslim edildi
  CANCELLED    // Iptal edildi
  REFUNDED     // Iade edildi
}
```

### PaymentStatus

```prisma
enum PaymentStatus {
  PENDING   // Beklemede
  PAID      // Odendi
  FAILED    // Basarisiz
  REFUNDED  // Iade edildi
}
```

### DiscountType

```prisma
enum DiscountType {
  PERCENTAGE    // Yuzde indirim
  FIXED_AMOUNT  // Sabit tutar
}
```

---

## Sik Kullanilan Sorgular

### Urun Listesi (Filtreleme)

```typescript
const products = await db.product.findMany({
  where: {
    status: "ACTIVE",
    gender: "KADIN",
    category: { slug: "bodrum-sandalet" },
    basePrice: { gte: 500, lte: 2000 },
  },
  include: {
    images: { orderBy: { position: "asc" }, take: 2 },
    variants: { select: { color: true, colorHex: true }, distinct: ["color"] },
    category: { select: { name: true, slug: true } },
  },
  orderBy: { createdAt: "desc" },
  skip: 0,
  take: 20,
});
```

### Siparis Detayi

```typescript
const order = await db.order.findUnique({
  where: { orderNumber: "HS-2024-000123" },
  include: {
    items: {
      include: {
        product: { include: { images: { take: 1 } } },
        variant: true,
      },
    },
    user: { select: { name: true, email: true } },
    statusHistory: { orderBy: { createdAt: "desc" } },
  },
});
```

### Kullanici Siparisleri

```typescript
const orders = await db.order.findMany({
  where: { userId: session.user.id },
  include: {
    items: { include: { product: { include: { images: { take: 1 } } } } },
  },
  orderBy: { createdAt: "desc" },
  take: 10,
});
```

---

## Migration Komutlari

```bash
# Yeni migration olustur
npx prisma migrate dev --name migration_name

# Production'a uygula
npx prisma migrate deploy

# Schema sync (dev only)
npx prisma db push

# Veritabani sifirla
npx prisma migrate reset

# Seed data yukle
npx prisma db seed
```

---

## Indexler

Performans icin olusturulmus indexler:

| Model | Alanlar | Aciklama |
|-------|---------|----------|
| Product | categoryId | Kategori filtreleme |
| Product | status | Durum filtreleme |
| Product | gender | Cinsiyet filtreleme |
| Product | slug | URL lookup |
| Product | isFeatured | One cikanlar |
| ProductVariant | productId | Urun varyantlari |
| ProductVariant | stock | Stok kontrolu |
| Order | userId | Kullanici siparisleri |
| Order | status | Durum filtreleme |
| Order | orderNumber | Siparis arama |
| Order | createdAt | Tarih siralama |
| Coupon | code | Kupon arama |
| Category | slug | URL lookup |
| Category | gender | Cinsiyet filtreleme |

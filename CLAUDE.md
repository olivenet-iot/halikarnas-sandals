# Halikarnas Sandals - Claude Reference Guide

## Proje Ozeti

Halikarnas Sandals, Bodrum/Turkiye merkezli bir el yapimi hakiki deri sandalet markasinin e-ticaret platformudur. Next.js 14 App Router, TypeScript, Prisma ORM ve PostgreSQL kullanilarak gelistirilmistir. Hedef kitle: premium sandalet arayan Turkiye'deki tuketiciler.

---

## Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| **Framework** | Next.js 14.2+ (App Router) |
| **Language** | TypeScript (strict mode) |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | NextAuth.js v5 (Auth.js) |
| **State** | Zustand (persist middleware) |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Forms** | React Hook Form + Zod |
| **Icons** | Lucide React |
| **Date** | date-fns |
| **Animation** | Framer Motion |

---

## Proje Yapisi

```
halikarnas-sandals/
├── prisma/
│   ├── schema.prisma          # Database schema (20+ modeller)
│   ├── seed.ts                # Seed data (kategoriler, urunler, sayfalar)
│   └── migrations/            # Migration gecmisi
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (shop)/            # Public sayfalar (Navbar/Footer layout)
│   │   │   ├── kadin/         # Kadin kategorisi
│   │   │   ├── erkek/         # Erkek kategorisi
│   │   │   ├── urun/[slug]/   # Urun detay
│   │   │   ├── sepet/         # Sepet
│   │   │   ├── odeme/         # Checkout
│   │   │   ├── hesabim/       # Kullanici paneli
│   │   │   ├── koleksiyonlar/ # Koleksiyonlar
│   │   │   ├── arama/         # Arama sonuclari
│   │   │   ├── hakkimizda/    # Hakkimizda
│   │   │   ├── iletisim/      # Iletisim formu
│   │   │   ├── sss/           # SSS
│   │   │   ├── beden-rehberi/ # Beden tablosu
│   │   │   └── sayfa/[slug]/  # Dinamik sayfalar
│   │   ├── (auth)/            # Auth sayfalari (minimal layout)
│   │   │   ├── giris/         # Login
│   │   │   ├── kayit/         # Register
│   │   │   └── sifremi-unuttum/
│   │   ├── admin/             # Admin paneli
│   │   │   ├── urunler/       # Urun CRUD
│   │   │   ├── kategoriler/   # Kategori yonetimi
│   │   │   ├── koleksiyonlar/ # Koleksiyon yonetimi
│   │   │   ├── siparisler/    # Siparis yonetimi
│   │   │   ├── kullanicilar/  # Kullanici yonetimi
│   │   │   ├── kuponlar/      # Kupon CRUD
│   │   │   ├── bannerlar/     # Banner CRUD
│   │   │   ├── sayfalar/      # Sayfa CRUD
│   │   │   └── ayarlar/       # Site ayarlari
│   │   └── api/               # API Routes
│   │       ├── auth/          # NextAuth endpoints
│   │       ├── admin/         # Admin API'leri
│   │       ├── cart/          # Sepet API
│   │       ├── orders/        # Siparis API
│   │       ├── wishlist/      # Favoriler
│   │       ├── addresses/     # Adresler
│   │       ├── search/        # Arama
│   │       ├── contact/       # Iletisim formu
│   │       ├── coupon/        # Kupon dogrulama
│   │       └── user/          # Profil islemleri
│   ├── components/
│   │   ├── ui/                # shadcn/ui (40+ component)
│   │   ├── layout/            # Navbar, Footer, SearchDialog
│   │   ├── home/              # Hero, FeaturedProducts, Newsletter
│   │   ├── shop/              # ProductCard, ProductGrid, Filters
│   │   ├── cart/              # CartSheet, CartItem
│   │   ├── checkout/          # CheckoutForm, AddressSelector
│   │   ├── account/           # Sidebar, OrderCard
│   │   ├── admin/             # AdminSidebar, DataTables
│   │   └── auth/              # LoginForm, RegisterForm
│   ├── lib/
│   │   ├── db.ts              # Prisma client (pg adapter)
│   │   ├── auth.ts            # NextAuth config
│   │   ├── utils.ts           # cn(), formatPrice(), slugify()
│   │   ├── constants.ts       # Site config, navigation, options
│   │   ├── turkey-locations.ts # Sehir/ilce listesi
│   │   └── validations/       # Zod schemalari
│   ├── stores/
│   │   ├── cart-store.ts      # Sepet state (localStorage persist)
│   │   ├── wishlist-store.ts  # Favoriler
│   │   ├── filter-store.ts    # Filtreleme state
│   │   ├── checkout-store.ts  # Checkout adim state
│   │   └── ui-store.ts        # UI state (mobile menu, cart sheet)
│   └── hooks/
│       ├── use-toast.ts       # Toast notifications
│       └── useCurrentUser.ts  # Auth hook
├── public/                    # Static assets
├── middleware.ts              # Auth middleware (Edge)
└── next.config.mjs            # Next.js config
```

---

## Database Schema

### Ana Modeller

| Model | Aciklama |
|-------|----------|
| `User` | Kullanici (CUSTOMER, ADMIN, SUPER_ADMIN) |
| `Product` | Urun bilgileri, SEO, durum (DRAFT/ACTIVE/ARCHIVED) |
| `ProductVariant` | Renk/beden kombinasyonlari, stok, SKU |
| `ProductImage` | Urun gorselleri (position, isPrimary) |
| `Category` | Hiyerarsik kategoriler (parent/children) |
| `Collection` | Koleksiyonlar (N:N with Product) |
| `Order` | Siparisler (durum takibi, adres snapshot) |
| `OrderItem` | Siparis kalemleri (urun snapshot) |
| `Cart` / `CartItem` | Sepet (user veya session bazli) |
| `WishlistItem` | Favoriler |
| `Address` | Kullanici adresleri |
| `Coupon` | Indirim kuponlari (PERCENTAGE/FIXED) |
| `Banner` | Anasayfa banner'lari |
| `Page` | CMS sayfalari (legal, bilgi) |
| `FAQ` | SSS icerikleri |
| `SiteSetting` | Key-value site ayarlari |

### Onemli Enum'lar

```prisma
enum Gender { ERKEK, KADIN, UNISEX }
enum ProductStatus { DRAFT, ACTIVE, ARCHIVED }
enum UserRole { CUSTOMER, ADMIN, SUPER_ADMIN }
enum OrderStatus { PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED }
enum PaymentStatus { PENDING, PAID, FAILED, REFUNDED }
enum DiscountType { PERCENTAGE, FIXED_AMOUNT }
```

### Onemli Iliskiler

```
User ──1:N── Order ──1:N── OrderItem
User ──1:N── Address
User ──1:1── Cart ──1:N── CartItem
User ──1:N── WishlistItem ──N:1── Product

Product ──N:1── Category (parent/children)
Product ──1:N── ProductVariant
Product ──1:N── ProductImage
Product ──N:N── Collection (via CollectionProduct)

Order ──N:1── Coupon
Order ──1:N── OrderStatusHistory
```

---

## API Routes

### Public API

| Endpoint | Method | Aciklama |
|----------|--------|----------|
| `/api/search` | GET | Urun arama (q, category, gender, price, sort) |
| `/api/contact` | POST | Iletisim formu (rate limit, honeypot) |
| `/api/coupon/validate` | POST | Kupon dogrulama |
| `/api/locations/cities` | GET | Sehir listesi |
| `/api/locations/districts` | GET | Ilce listesi (?city=) |

### Auth API

| Endpoint | Method | Aciklama |
|----------|--------|----------|
| `/api/auth/[...nextauth]` | * | NextAuth handlers |
| `/api/auth/register` | POST | Yeni kayit |
| `/api/auth/forgot-password` | POST | Sifre sifirlama email |
| `/api/auth/reset-password` | POST | Yeni sifre belirleme |

### User API (Auth Required)

| Endpoint | Method | Aciklama |
|----------|--------|----------|
| `/api/user/profile` | GET, PATCH | Profil bilgileri |
| `/api/user/change-password` | POST | Sifre degistirme |
| `/api/user/delete` | DELETE | Hesap silme |
| `/api/addresses` | GET, POST | Adres listesi/ekleme |
| `/api/addresses/[id]` | PATCH, DELETE | Adres guncelleme/silme |
| `/api/wishlist` | GET, POST | Favoriler |
| `/api/wishlist/[productId]` | DELETE | Favoriden cikarma |
| `/api/orders` | GET, POST | Siparis listesi/olusturma |
| `/api/cart` | GET, POST, DELETE | Sepet islemleri |

### Admin API (Admin Required)

| Endpoint | Method | Aciklama |
|----------|--------|----------|
| `/api/admin/products` | GET, POST | Urun listesi/ekleme |
| `/api/admin/products/[id]` | GET, PATCH, DELETE | Urun detay/guncelleme/silme |
| `/api/admin/categories` | GET, POST | Kategoriler |
| `/api/admin/categories/[id]` | PATCH, DELETE | Kategori islemleri |
| `/api/admin/collections` | GET, POST | Koleksiyonlar |
| `/api/admin/orders/[id]` | GET, PATCH | Siparis detay/durum guncelle |
| `/api/admin/users/[id]` | GET, PATCH, DELETE | Kullanici islemleri |
| `/api/admin/coupons` | GET, POST | Kuponlar |
| `/api/admin/coupons/[id]` | PATCH, DELETE | Kupon islemleri |
| `/api/admin/banners` | GET, POST | Banner'lar |
| `/api/admin/pages` | GET, POST | Sayfalar |
| `/api/admin/settings` | GET, POST | Site ayarlari |

---

## State Management (Zustand)

### cart-store.ts

```typescript
interface CartStore {
  items: CartItem[]              // { product, variant, quantity }
  coupon: CouponData | null      // { code, discountType, discountValue }

  addItem(product, variant, quantity)
  removeItem(variantId)
  updateQuantity(variantId, quantity)
  applyCoupon(code): Promise<boolean>
  removeCoupon()
  clearCart()

  getSubtotal(): number
  getDiscount(): number
  getShippingCost(): number      // 500TL ustu ucretsiz
  getTotal(): number
}
```

### wishlist-store.ts

```typescript
interface WishlistStore {
  items: WishlistProduct[]

  addItem(product)
  removeItem(productId)
  isInWishlist(productId): boolean
  clearWishlist()
}
```

### filter-store.ts

```typescript
interface FilterStore {
  category: string | null
  colors: string[]
  sizes: string[]
  priceRange: [number, number]
  sortBy: string

  setFilter(key, value)
  resetFilters()
}
```

### ui-store.ts

```typescript
interface UIStore {
  isMobileMenuOpen: boolean
  isCartOpen: boolean
  isSearchOpen: boolean

  openMobileMenu() / closeMobileMenu()
  openCart() / closeCart()
  openSearch() / closeSearch()
}
```

---

## Design System

### Renkler (Tailwind)

```
sand:       #D4B896  (Ana renk - kum tonu)
aegean:     #1E5F74  (Accent - Ege mavisi)
terracotta: #C17E61  (Secondary - toprak)
leather:    #4A3728  (Text - deri kahve)
```

Tailwind class ornekleri:
- `bg-sand-100`, `text-sand-600`
- `bg-aegean-500`, `hover:bg-aegean-600`
- `text-leather-900`, `text-leather-600`
- `bg-terracotta-500`

### Typography

```css
--font-cormorant: Cormorant Garamond (serif) -> font-heading
--font-inter: Inter (sans-serif) -> font-body
--font-cinzel: Cinzel (display) -> font-accent
```

### Component Patterns

```tsx
// Primary Button
<Button className="bg-aegean-500 hover:bg-aegean-600 text-white">

// Secondary Button
<Button variant="outline" className="border-leather-300">

// Card
<Card className="bg-white rounded-lg shadow-soft border">

// Section Container
<section className="container py-16 md:py-24">

// Page Title
<h1 className="text-3xl md:text-4xl font-bold text-leather-900">
```

---

## Onemli Konfigurasyon Notlari

### Prisma (Edge-compatible)

```typescript
// src/lib/db.ts
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const db = new PrismaClient({ adapter });
```

### NextAuth v5

```typescript
// src/lib/auth.ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/giris",
    error: "/giris",
  },
  providers: [
    Credentials({ ... }),
    Google({ ... }),  // optional
  ],
});
```

### Middleware (Edge Runtime)

```typescript
// middleware.ts
// DIKKAT: Prisma/pg kullanilamaz, sadece getToken() kullan!
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  // Admin route kontrolu
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect("/giris");
    }
  }
}
```

---

## Sik Kullanilan Komutlar

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Database
npx prisma migrate dev          # Migration olustur
npx prisma db push              # Schema sync (dev)
npx prisma db seed              # Seed data yukle
npx prisma studio               # DB GUI

# Prisma client generate
npx prisma generate
```

---

## Bilinen Sorunlar & Dikkat Edilecekler

### Edge Runtime

- **Middleware'de Prisma kullanma!** - `getToken()` kullan
- Auth kontrolu icin `auth()` fonksiyonu kullan (server component/route)

### Decimal Handling

```typescript
// Prisma Decimal -> Number donusumu
const price = Number(product.basePrice);
// veya
const price = product.basePrice.toNumber();
```

### Image Configuration

```javascript
// next.config.mjs
images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "res.cloudinary.com" },
  ],
}
```

### Turkish Characters

- Gender enum: `KADIN`, `ERKEK`, `UNISEX` (Turkce)
- URL slug'lari: `slugify()` ile olustur (bkz: utils.ts)
- Dil: Tum UI metinleri Turkce

### useSearchParams Suspense

```tsx
// Client component'lerde useSearchParams kullanirken:
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchContent />
    </Suspense>
  );
}
```

---

## Gelistirme Kurallari

### Dosya Isimlendirme

- Components: `PascalCase.tsx` (ProductCard.tsx)
- Pages: `kebab-case` klasorler (hesabim/siparislerim)
- Utils/Hooks: `camelCase.ts` (formatPrice.ts, useCart.ts)

### Component Yapisi

```tsx
"use client"; // Gerekirse

import { ... } from "react";
import { ... } from "@/components/ui";
import { ... } from "@/lib/utils";

interface ComponentProps {
  // Props
}

export function Component({ prop }: ComponentProps) {
  // Hooks
  // State
  // Effects
  // Handlers

  return (
    // JSX
  );
}
```

### API Route Yapisi

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({ ... });

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate request
    const body = await request.json();
    const validated = schema.parse(body);

    // 3. Database operation
    const result = await db.model.create({ data: validated });

    // 4. Return response
    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
```

---

## TODO / Bekleyen Gelistirmeler

- [ ] Payment integration (iyzico/PayTR)
- [ ] Email sending (Resend/Nodemailer)
- [ ] Image upload (Uploadthing/Cloudinary)
- [ ] Real-time notifications
- [ ] PWA support
- [ ] Multi-language (i18n)
- [ ] Advanced analytics
- [ ] Review system implementation
- [ ] Blog/Magazine section

---

## Proje Istatistikleri

| Metrik | Deger |
|--------|-------|
| TypeScript dosyalari | 198 |
| React components | 81 |
| API routes | 33 |
| Pages | 43 |
| Zustand stores | 5 |
| Prisma models | 20+ |
| shadcn/ui components | 40+ |

---

## Hizli Referans

### Fiyat Formatlama

```typescript
import { formatPrice } from "@/lib/utils";
formatPrice(1299.99); // "1.299,99 TL"
```

### Class Birlestime

```typescript
import { cn } from "@/lib/utils";
cn("base-class", isActive && "active-class", className);
```

### Auth Kontrolu (Server)

```typescript
import { auth } from "@/lib/auth";
const session = await auth();
if (!session) redirect("/giris");
```

### Toast Kullanimi

```typescript
import { useToast } from "@/hooks/use-toast";
const { toast } = useToast();
toast({ title: "Basarili!", description: "Islem tamamlandi." });
```

---

*Bu dosya Claude Code tarafindan olusturulmustur ve projeyle calismak icin referans olarak kullanilmalidir.*

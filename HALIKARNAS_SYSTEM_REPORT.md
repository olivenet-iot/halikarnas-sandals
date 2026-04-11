# HALIKARNAS SANDALS - Kapsamli Sistem Raporu

> Bu rapor, Halikarnas Sandals e-ticaret platformunun tum codebase'ini, mimarisini, is mantigini ve teknik detaylarini belgelemektedir. Baska bir LLM instance'inin sistemi tamamen kavrayabilmesi icin hazirlanmistir.
> 
> **Rapor Tarihi:** 2026-04-11  
> **Rapor Kapsami:** Tum kaynak kodu, veritabani semasi, API katmani, frontend, admin paneli, is mantigi  
> **Son Guncelleme:** V2 tasarim sistemi migrasyonu tamamlandi (anasayfa, listeleme, urun detay, cart drawer, checkout, yardimci sayfalar, hikayemiz, navbar, footer). Yeni Gelenler ve Koleksiyonlar feature'lari silindi. Prisma schema guncellendi.

---

## Icindekiler

1. [Executive Summary](#1-executive-summary)
2. [Dizin Yapisi](#2-dizin-yapisi)
3. [Tech Stack & Bagimliliklar](#3-tech-stack--bagimliliklar)
4. [Environment & Configuration](#4-environment--configuration)
5. [Frontend (Website)](#5-frontend-website)
6. [Design System & Assets](#6-design-system--assets)
7. [Backend / API](#7-backend--api)
8. [Database & Data Layer](#8-database--data-layer)
9. [E-Ticaret Is Mantigi](#9-e-ticaret-is-mantigi)
10. [Admin Paneli](#10-admin-paneli)
11. [Entegrasyonlar](#11-entegrasyonlar)
12. [Jobs / Background Tasks / Cron](#12-jobs--background-tasks--cron)
13. [Testing](#13-testing)
14. [Build & Deployment](#14-build--deployment)
15. [Bilinen Sorunlar / TODO / FIXME](#15-bilinen-sorunlar--todo--fixme)
16. [Kod Kalitesi Gozlemleri](#16-kod-kalitesi-gozlemleri)
17. [Ek Olarak Dikkat Ceken Her Sey](#17-ek-olarak-dikkat-ceken-her-sey)
18. [V2 Tasarim Sistemine Gecis Durumu](#18-v2-tasarim-sistemine-gecis-durumu)
19. [Son Refactor Ozeti (Nisan 2026)](#19-son-refactor-ozeti-nisan-2026)

---

## 1. Executive Summary

**Halikarnas Sandals**, Bodrum/Turkiye merkezli bir el yapimi hakiki deri sandalet markasinin tam islevsel e-ticaret platformudur. Next.js 14 App Router, TypeScript, Prisma ORM ve PostgreSQL kullanilarak tek bir monolitik repo icinde gelistirilmistir. Platform; urun katalogu, sepet (drawer bazli), odeme (su an sadece kapida odeme), siparis takibi, kullanici hesaplari, favori listesi, kupon sistemi, admin paneli (urun/siparis/kullanici/kategori/banner/sayfa/kupon yonetimi), PDF fatura uretimi, email bildirimleri (Resend), gorsel yonetimi (Cloudinary) ve tam Turkce lokalizasyon icermektedir. V2 tasarim sistemi ile anasayfa, listeleme, urun detay, cart drawer, checkout, yardimci sayfalar ve hikayemiz tamamlanmistir.

### Tek Cumle
Turkiye pazarina yonelik, luks tasarimli, tam islevsel bir el yapimi sandalet e-ticaret platformu.

### Tech Stack Ozeti

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 14.2.35 (App Router) |
| Dil | TypeScript (strict mode) |
| Veritabani | PostgreSQL + Prisma ORM 7.2.0 |
| Auth | NextAuth.js v5 (beta.30) |
| State | Zustand 5.0.9 (persist middleware) |
| Styling | Tailwind CSS 3.4.1 + shadcn/ui (Radix UI) |
| Animasyon | Framer Motion 12.23.26 |
| Email | Resend 6.6.0 |
| Gorsel CDN | Cloudinary 2.8.0 |
| Form | React Hook Form 7.69.0 + Zod 4.2.1 |

### Mimari
- **Tek repo (monorepo degil)** — tum frontend, backend ve admin ayni Next.js uygulamasi icinde
- **Full-stack** — API route'lari ayni projede, ayri backend yok
- **Edge-compatible** — Prisma PrismaPg adapter ile Edge Runtime destegi
- **Client-side state** — Zustand ile sepet/filtre/UI state'i localStorage'da persist ediliyor
- **Server-side rendering** — Next.js App Router ile SSR + server components

---

## 2. Dizin Yapisi

```
halikarnas-sandals/
├── prisma/                         # Veritabani katmani
│   ├── schema.prisma               # 603 satir, 18 model, tum enum'lar (Collection/CollectionProduct/isNew silindi)
│   ├── seed.ts                     # 722 satir, demo veri (admin, urunler, kategoriler, sayfalar, FAQ'lar)
│   ├── prisma.config.ts            # Prisma yapilandirmasi
│   └── migrations/                 # Migration gecmisi
├── src/                            # Kaynak kod
│   ├── app/                        # Next.js App Router (tum sayfa ve API route'lari)
│   │   ├── (shop)/                 # Public magaza sayfalari (Navbar+Footer layout)
│   │   │   ├── page.tsx            # Anasayfa
│   │   │   ├── layout.tsx          # Navbar, MobileMenu, SearchDialog, CartDrawer, Footer
│   │   │   ├── kadin/              # Kadin sandalet kategorisi
│   │   │   ├── erkek/              # Erkek sandalet kategorisi
│   │   │   ├── arama/              # Arama sonuclari
│   │   │   ├── odeme/              # Checkout/odeme (V2)
│   │   │   ├── siparis/[token]/    # Siparis onay
│   │   │   ├── siparis-tamamlandi/[token]/  # Siparis basarili
│   │   │   ├── siparis-takip/      # Siparis takip
│   │   │   ├── hesabim/            # Kullanici hesap paneli (nested routes)
│   │   │   │   ├── layout.tsx      # AccountSidebar ile layout
│   │   │   │   ├── siparislerim/   # Siparislerim
│   │   │   │   ├── adreslerim/     # Adreslerim
│   │   │   │   ├── favorilerim/    # Favoriler
│   │   │   │   ├── bilgilerim/     # Profil bilgileri
│   │   │   │   └── sifre-degistir/ # Sifre degistir
│   │   │   ├── hikayemiz/          # Marka hikayesi sayfasi (V2)
│   │   │   ├── iletisim/           # Iletisim formu (V2)
│   │   │   ├── sss/               # Sikca sorulan sorular (V2)
│   │   │   ├── beden-rehberi/      # Beden tablosu (V2)
│   │   │   └── sayfa/[slug]/       # Dinamik CMS sayfalari
│   │   ├── (auth)/                 # Auth sayfalari (minimal layout, logo + form)
│   │   │   ├── layout.tsx          # Minimal auth layout (no navbar/footer)
│   │   │   ├── giris/              # Login
│   │   │   ├── kayit/              # Register
│   │   │   ├── sifremi-unuttum/    # Sifremi unuttum
│   │   │   └── sifre-sifirla/[token]/ # Sifre sifirlama
│   │   ├── admin/                  # Admin paneli
│   │   │   ├── layout.tsx          # AdminShell (sidebar+header), auth kontrol
│   │   │   ├── page.tsx            # Dashboard
│   │   │   ├── urunler/            # Urun yonetimi (list, create, edit, import)
│   │   │   ├── kategoriler/        # Kategori yonetimi
│   │   │   ├── siparisler/         # Siparis yonetimi
│   │   │   ├── kullanicilar/       # Kullanici yonetimi
│   │   │   ├── kuponlar/           # Kupon yonetimi
│   │   │   ├── bannerlar/          # Banner yonetimi
│   │   │   ├── sayfalar/           # CMS sayfa yonetimi
│   │   │   ├── stok/               # Stok yonetimi
│   │   │   ├── aboneler/           # Newsletter aboneleri
│   │   │   ├── aktivite/           # Aktivite loglari
│   │   │   ├── raporlar/           # Raporlar/analitik
│   │   │   └── ayarlar/            # Site ayarlari
│   │   ├── api/                    # API Route'lari
│   │   │   ├── auth/               # NextAuth + register/forgot/reset
│   │   │   ├── admin/              # Admin CRUD API'leri
│   │   │   ├── cart/               # Sepet API
│   │   │   ├── orders/             # Siparis olusturma ve takip
│   │   │   ├── wishlist/           # Favoriler API
│   │   │   ├── search/             # Arama API
│   │   │   ├── user/               # Profil, sifre, hesap silme
│   │   │   ├── addresses/          # Adres CRUD
│   │   │   ├── contact/            # Iletisim formu
│   │   │   ├── coupon/             # Kupon dogrulama
│   │   │   ├── newsletter/         # Bulten abonelik
│   │   │   ├── locations/          # Sehir/ilce verileri
│   │   │   └── upload/             # Gorsel yukleme (Cloudinary)
│   │   ├── error.tsx               # Global hata sayfasi
│   │   ├── not-found.tsx           # 404 sayfasi
│   │   └── layout.tsx              # Root layout (fontlar, AuthProvider, Toaster, metadata)
│   ├── components/                 # React componentleri (102 dosya)
│   │   ├── ui/                     # shadcn/ui base componentleri (27 dosya)
│   │   │   └── luxury/             # Ozel luks animasyon componentleri (8 dosya)
│   │   ├── layout/                 # Navbar, Footer, MobileMenu, CartDrawer, SearchDialog, UserMenu
│   │   ├── home/                   # Anasayfa sectionlari (V2: 7 aktif + InstagramFeed)
│   │   ├── shop/                   # Urun listeleme, detay, filtre (V2: 9 aktif + 5 legacy [category])
│   │   ├── checkout/               # Odeme adim componentleri — V2 (7 dosya)
│   │   ├── account/                # Hesap yonetimi componentleri (10 dosya)
│   │   ├── admin/                  # Admin panel componentleri (10+ dosya)
│   │   │   ├── banners/            # DeleteBannerButton
│   │   │   ├── coupons/            # DeleteCouponButton
│   │   │   ├── orders/             # OrderStatusBadge, OrderStatusSelect, OrderTimeline
│   │   │   └── pages/              # DeletePageButton
│   │   ├── auth/                   # Login, Register, Forgot/Reset password formlari
│   │   ├── seo/                    # JSON-LD structured data componentleri
│   │   ├── faq/                    # LuxuryFAQAccordion
│   │   └── providers/              # AuthProvider, ShippingConfigProvider
│   ├── lib/                        # Utility ve servis katmani
│   │   ├── db.ts                   # 37 satir - Prisma client (Edge-compatible, PrismaPg adapter)
│   │   ├── auth.ts                 # 85 satir - NextAuth v5 config (JWT, Credentials+Google)
│   │   ├── product-queries.ts      # 149 satir - V2 paylasilan Prisma query'leri (getProduct, getRelatedProducts, transformProductData)
│   │   ├── utils.ts                # 205 satir - cn(), formatPrice(), slugify(), generateOrderNumber()
│   │   ├── constants.ts            # 293 satir - Site config, navigation, urun opsiyonlari, shipping
│   │   ├── animations.ts           # 540 satir - Framer Motion presets ve variants
│   │   ├── turkey-locations.ts     # 1278 satir - 81 il, tum ilceler
│   │   ├── cloudinary.ts           # 92 satir - Gorsel optimizasyon utilityleri
│   │   ├── email.ts                # 65 satir - Resend entegrasyonu
│   │   ├── invoice-generator.ts    # 187 satir - jsPDF fatura uretimi
│   │   ├── activity-logger.ts      # 92 satir - Admin aktivite loglama
│   │   ├── metadata.ts             # 124 satir - SEO metadata uretimi
│   │   ├── uploadImages.ts         # 87 satir - Gorsel yukleme islemleri
│   │   └── email-templates/        # 7 dosya - HTML email sablonlari
│   │       ├── index.ts            # Template export'lari
│   │       ├── welcome.ts          # Hosgeldin emaili
│   │       ├── order-confirmation.ts  # Siparis onay emaili
│   │       ├── shipping-notification.ts  # Kargo bildirim emaili
│   │       ├── password-reset.ts   # Sifre sifirlama emaili
│   │       ├── contact-notification.ts  # Iletisim formu admin bildirimi
│   │       └── newsletter-welcome.ts   # Bulten hosgeldin emaili
│   ├── stores/                     # Zustand state yonetimi (5 store)
│   │   ├── cart-store.ts           # 187 satir - Sepet state, localStorage persist
│   │   ├── checkout-store.ts       # 142 satir - Checkout adim state, localStorage persist
│   │   ├── filter-store.ts         # 128 satir - Urun filtreleme state (persist yok)
│   │   ├── wishlist-store.ts       # 109 satir - Favoriler, server sync
│   │   └── ui-store.ts             # 101 satir - Modal/menu state (persist yok)
│   ├── hooks/                      # Custom React hook'lari (5 dosya + index)
│   │   ├── index.ts                # 3 satir - Re-export
│   │   ├── useCurrentUser.ts       # 16 satir - Auth session hook
│   │   ├── useHydrated.ts          # 22 satir - Client hydration hook
│   │   ├── use-toast.ts            # 195 satir - Toast notification sistemi
│   │   ├── use-in-view-animation.ts # 212 satir - Scroll-triggered animasyon hooklari
│   │   └── use-parallax.ts         # 154 satir - Parallax efekt hooklari
│   └── types/                      # TypeScript tip tanimlamalari
├── docs/                           # Proje dokumantasyonu (9 dosya)
│   ├── API.md                      # API endpoint dokumantasyonu
│   ├── ARCHITECTURE.md             # Sistem mimarisi
│   ├── COLLECTION_DESIGN_ANALYSIS.md  # Koleksiyon sayfa tasarim analizi (artik irrelevant — koleksiyonlar silindi)
│   ├── COMPONENTS.md               # Component katalogu
│   ├── DATABASE.md                 # Veritabani dokumantasyonu
│   ├── DEPLOYMENT.md               # Deployment stratejileri
│   ├── DESIGN_REVIEW.md            # Tasarim analizi
│   ├── ECOMMERCE_STATUS.md         # Proje tamamlanma durumu
│   └── PROJECT_ANALYSIS.md         # Genel proje analizi
├── .claude/                        # Claude Code yapilandirmasi
│   └── skills/                     # Claude skill tanimlamalari (6 dosya)
│       ├── halikarnas-design-system.md  # Tasarim sistemi referansi (679 satir)
│       ├── halikarnas-checkout.md       # Checkout pattern'leri
│       ├── halikarnas-api.md            # API gelistirme pattern'leri
│       ├── halikarnas-frontend.md       # Frontend pattern'leri
│       ├── halikarnas-product.md        # Urun yonetimi
│       └── halikarnas-order.md          # Siparis yonetimi
├── middleware.ts                    # 43 satir - Auth middleware (Edge Runtime)
├── next.config.mjs                 # Next.js yapilandirmasi
├── tailwind.config.ts              # Tailwind CSS yapilandirmasi
├── tsconfig.json                   # TypeScript yapilandirmasi
├── postcss.config.mjs              # PostCSS yapilandirmasi
├── package.json                    # Bagimliliklar ve scriptler
├── .env.example                    # Ortam degiskenleri sablonu
├── CLAUDE.md                       # Claude Code referans rehberi
└── README.md                       # Proje README (Turkce)
```

**Not:** `public/` klasoru mevcut degil — tum gorseller Cloudinary CDN ve Unsplash URL'leri uzerinden sunuluyor. Statik asset'ler veritabaninda URL olarak tutuluyor.

---

## 3. Tech Stack & Bagimliliklar

### 3.1 Production Bagimliliklari (45 paket)

| Paket | Versiyon | Amac |
|-------|----------|------|
| `next` | 14.2.35 | React full-stack framework (App Router) |
| `react` | ^18 | UI kutuphanesi |
| `react-dom` | ^18 | React DOM renderer |
| `typescript` | ^5 | Tip guvenli JavaScript |
| `@prisma/client` | ^7.2.0 | Veritabani ORM client |
| `@prisma/adapter-pg` | ^7.2.0 | PostgreSQL adapter (Edge-compat) |
| `prisma` | ^7.2.0 | Veritabani ORM arac |
| `pg` | ^8.16.3 | PostgreSQL baglanti havuzu |
| `next-auth` | ^5.0.0-beta.30 | Auth framework (v5, beta) |
| `@auth/prisma-adapter` | ^2.11.1 | NextAuth Prisma entegrasyonu |
| `bcryptjs` | ^3.0.3 | Sifre hashleme (12 round) |
| `zustand` | ^5.0.9 | Client-side state yonetimi |
| `react-hook-form` | ^7.69.0 | Form yonetimi |
| `@hookform/resolvers` | ^5.2.2 | Form validation resolver (Zod) |
| `zod` | ^4.2.1 | Schema validation |
| `tailwind-merge` | ^3.4.0 | Tailwind class birlestime |
| `tailwindcss-animate` | ^1.0.7 | Tailwind animasyon plugin |
| `class-variance-authority` | ^0.7.1 | Component variant yonetimi (cva) |
| `clsx` | ^2.1.1 | Conditional className |
| `framer-motion` | ^12.23.26 | Animasyon kutuphanesi |
| `lucide-react` | ^0.562.0 | Ikon kutuphanesi |
| `date-fns` | ^4.1.0 | Tarih islemleri |
| `cloudinary` | ^2.8.0 | Cloudinary SDK (server-side) |
| `next-cloudinary` | ^6.17.5 | Next.js Cloudinary entegrasyonu |
| `sharp` | ^0.34.5 | Gorsel isleme (Next.js image optimization) |
| `react-dropzone` | ^14.3.8 | Drag & drop dosya yukleme |
| `resend` | ^6.6.0 | Email gonderim servisi |
| `react-email` | ^5.1.0 | React email template engine |
| `@react-email/components` | ^1.0.2 | Email component kutuphanesi |
| `jspdf` | ^3.0.4 | PDF uretimi (fatura) |
| `jspdf-autotable` | ^5.0.2 | jsPDF tablo eklentisi |
| `papaparse` | ^5.5.3 | CSV parse/unparse |
| `xlsx` | ^0.18.5 | Excel dosya isleme |
| `nanoid` | ^5.1.6 | Benzersiz ID uretimi |
| `slugify` | ^1.6.6 | URL-friendly slug uretimi (Turkce destekli) |
| `@dnd-kit/core` | ^6.3.1 | Drag & drop temel kutuphanesi |
| `@dnd-kit/sortable` | ^10.0.0 | Siralanabilir DnD |
| `@dnd-kit/utilities` | ^3.2.2 | DnD yardimci fonksiyonlari |
| `@radix-ui/react-accordion` | ^1.2.12 | shadcn accordion |
| `@radix-ui/react-alert-dialog` | ^1.1.15 | shadcn alert dialog |
| `@radix-ui/react-avatar` | ^1.1.11 | shadcn avatar |
| `@radix-ui/react-checkbox` | ^1.3.3 | shadcn checkbox |
| `@radix-ui/react-dialog` | ^1.1.15 | shadcn dialog |
| `@radix-ui/react-dropdown-menu` | ^2.1.16 | shadcn dropdown menu |
| `@radix-ui/react-label` | ^2.1.8 | shadcn label |
| `@radix-ui/react-popover` | ^1.1.15 | shadcn popover |
| `@radix-ui/react-radio-group` | ^1.3.8 | shadcn radio group |
| `@radix-ui/react-scroll-area` | ^1.2.10 | shadcn scroll area |
| `@radix-ui/react-select` | ^2.2.6 | shadcn select |
| `@radix-ui/react-separator` | ^1.1.8 | shadcn separator |
| `@radix-ui/react-slider` | ^1.3.6 | shadcn slider |
| `@radix-ui/react-slot` | ^1.2.4 | shadcn slot (composition) |
| `@radix-ui/react-switch` | ^1.2.6 | shadcn switch |
| `@radix-ui/react-tabs` | ^1.1.13 | shadcn tabs |
| `@radix-ui/react-toast` | ^1.2.15 | shadcn toast |
| `@types/pg` | ^8.16.0 | PostgreSQL tip tanimlari |

### 3.2 Development Bagimliliklari (11 paket)

| Paket | Versiyon | Amac |
|-------|----------|------|
| `@types/bcryptjs` | ^2.4.6 | bcryptjs tip tanimlari |
| `@types/node` | ^20 | Node.js tip tanimlari |
| `@types/papaparse` | ^5.5.2 | PapaParse tip tanimlari |
| `@types/react` | ^18 | React tip tanimlari |
| `@types/react-dom` | ^18 | React DOM tip tanimlari |
| `autoprefixer` | ^10.4.23 | CSS vendor prefix |
| `eslint` | ^8 | Kod linter |
| `eslint-config-next` | 14.2.35 | Next.js ESLint kurallari |
| `postcss` | ^8 | CSS post-processing |
| `tailwindcss` | ^3.4.1 | CSS framework |
| `tsx` | ^4.21.0 | TypeScript runner (seed.ts icin) |

### 3.3 Build Araclari
- **Bundler:** Next.js dahili (SWC-based, Turbopack degil)
- **Linter:** ESLint 8 + eslint-config-next
- **Formatter:** Yapilandirilmis bir Prettier yok (eslint ile yonetiliyor)
- **Test Framework:** Yapilandirilmis bir test framework'u yok
- **Node.js:** 18+ gerekli (package.json'da acikca belirtilmemis)

---

## 4. Environment & Configuration

### 4.1 Ortam Degiskenleri (`.env.example`)

| Degisken | Amac | Ornek Deger |
|----------|------|-------------|
| `DATABASE_URL` | PostgreSQL baglanti string'i | `postgresql://postgres:postgres@localhost:5432/halikarnas?schema=public` |
| `NEXTAUTH_SECRET` | NextAuth JWT sifreleme anahtari | `your-super-secret-key-change-this-in-production` |
| `NEXTAUTH_URL` | Uygulama base URL'i | `http://localhost:3000` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud ismi | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API anahtari | `your-api-key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API sirri | `your-api-secret` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Client-side Cloudinary ismi | `your-cloud-name` |
| `RESEND_API_KEY` | Resend email API anahtari | `re_xxxxxxxxxx` |
| `ADMIN_EMAIL` | Admin bildirim email adresi | `info@halikarnassandals.com` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `your-google-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `your-google-client-secret` |

### 4.2 `next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
};
```

### 4.3 `tailwind.config.ts`

**Dark mode:** class-based (kullanilmiyor — tum site light mode)

**Content paths:**
- `./src/pages/**/*.{js,ts,jsx,tsx,mdx}`
- `./src/components/**/*.{js,ts,jsx,tsx,mdx}`
- `./src/app/**/*.{js,ts,jsx,tsx,mdx}`

**Extended Theme (Onemli Kisimlar):**

**Renkler:**
```
luxury-primary: #1e3a3a       luxury-gold: #c9a962
luxury-primary-light: #2d5555  luxury-gold-light: #d4b87a
luxury-primary-dark: #152a2a   luxury-terracotta: #e07d4c
luxury-cream: #faf9f6          luxury-ivory: #f5f4f0
luxury-stone: #e8e6e1          luxury-charcoal: #2d2d2d
```

**Legacy renk scale'leri (DEPRECATED):** sand (50-900), aegean (50-900), terracotta (50-900), leather (50-900), olive.gold (#A68B5B), sea.foam (#A8C4C4)

**Font aileleri:**
```
font-serif: ['Cormorant Garamond', serif]   // Basliklar
font-sans: ['DM Sans', sans-serif]           // Body text
font-display: ['Cinzel', serif]              // Luks etiketler
```

**Ozel boyutlar:** section (6rem), section-lg (8rem)

**Box shadows:** soft, medium, strong

**Animasyonlar:** accordion-down/up, fade-in, slide-up, slide-down, scale-in

**Plugins:** `tailwindcss-animate`

### 4.4 `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "bundler",
    "allowJs": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "incremental": true,
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 4.5 `prisma.config.ts`
- Schema dosyasi: `prisma/schema.prisma`
- Migrations: `prisma/migrations`
- Seed komutu: `npx tsx prisma/seed.ts`
- Datasource: `DATABASE_URL` env degiskeninden

### 4.6 Feature Flag / Environment-Based Branching
- Acikca tanimlanmis feature flag sistemi yok
- Email gonderimleri development modda console'a yazilir, production'da Resend API kullanilir (`src/lib/email.ts`)
- Prisma logging: development'ta `query, error, warn`; production'da sadece `error`

---

## 5. Frontend (Website)

### 5.1 Routing Yapisi (Tum Sayfalar)

#### Public Magaza Sayfalari (`(shop)` route grubu)

| URL | Dosya | Amac |
|-----|-------|------|
| `/` | `src/app/(shop)/page.tsx` | Anasayfa (Hero, Featured, Categories, Newsletter) |
| `/kadin` | `src/app/(shop)/kadin/page.tsx` | Kadin sandalet katalogu |
| `/kadin/[category]` | `src/app/(shop)/kadin/[category]/page.tsx` | Kadin kategori sayfasi |
| `/kadin/[category]/[sku]` | `src/app/(shop)/kadin/[category]/[sku]/page.tsx` | Kadin urun detay |
| `/erkek` | `src/app/(shop)/erkek/page.tsx` | Erkek sandalet katalogu |
| `/erkek/[category]` | `src/app/(shop)/erkek/[category]/page.tsx` | Erkek kategori sayfasi |
| `/erkek/[category]/[sku]` | `src/app/(shop)/erkek/[category]/[sku]/page.tsx` | Erkek urun detay |
| `/arama` | `src/app/(shop)/arama/page.tsx` | Arama sonuclari sayfasi |
| `/odeme` | `src/app/(shop)/odeme/page.tsx` | Odeme sayfasi (V2, 3 adimli checkout) |
| `/siparis/[token]` | `src/app/(shop)/siparis/[token]/page.tsx` | Siparis detay (onay oncesi) |
| `/siparis-tamamlandi/[token]` | `src/app/(shop)/siparis-tamamlandi/[token]/page.tsx` | Siparis basarili sayfasi |
| `/siparis-takip` | `src/app/(shop)/siparis-takip/page.tsx` | Siparis takip formu (V2) |
| `/hikayemiz` | `src/app/(shop)/hikayemiz/page.tsx` | Marka hikayesi (V2, 3 section: Tez/Zanaat/CTA) |
| `/iletisim` | `src/app/(shop)/iletisim/page.tsx` | Iletisim formu (V2) |
| `/sss` | `src/app/(shop)/sss/page.tsx` | Sikca sorulan sorular (V2) |
| `/beden-rehberi` | `src/app/(shop)/beden-rehberi/page.tsx` | Beden tablosu (V2) |
| `/sayfa/[slug]` | `src/app/(shop)/sayfa/[slug]/page.tsx` | Dinamik CMS sayfalari |

#### Hesap Sayfalari (Auth gerekli, `hesabim/` nested routes)

| URL | Dosya | Amac |
|-----|-------|------|
| `/hesabim` | `src/app/(shop)/hesabim/page.tsx` | Hesap ozeti/dashboard |
| `/hesabim/siparislerim` | `src/app/(shop)/hesabim/siparislerim/page.tsx` | Siparis listesi |
| `/hesabim/siparislerim/[id]` | `src/app/(shop)/hesabim/siparislerim/[id]/page.tsx` | Siparis detay |
| `/hesabim/adreslerim` | `src/app/(shop)/hesabim/adreslerim/page.tsx` | Adres yonetimi |
| `/hesabim/favorilerim` | `src/app/(shop)/hesabim/favorilerim/page.tsx` | Favori urunler |
| `/hesabim/bilgilerim` | `src/app/(shop)/hesabim/bilgilerim/page.tsx` | Profil duzenleme |
| `/hesabim/sifre-degistir` | `src/app/(shop)/hesabim/sifre-degistir/page.tsx` | Sifre degistirme |

#### Auth Sayfalari (`(auth)` route grubu)

| URL | Dosya | Amac |
|-----|-------|------|
| `/giris` | `src/app/(auth)/giris/page.tsx` | Giris yapma |
| `/kayit` | `src/app/(auth)/kayit/page.tsx` | Yeni hesap olusturma |
| `/sifremi-unuttum` | `src/app/(auth)/sifremi-unuttum/page.tsx` | Sifre sifirlama istegi |
| `/sifre-sifirla/[token]` | `src/app/(auth)/sifre-sifirla/[token]/page.tsx` | Yeni sifre belirleme |

#### Admin Sayfalari (Admin auth gerekli)

| URL | Dosya | Amac |
|-----|-------|------|
| `/admin` | `src/app/admin/page.tsx` | Admin dashboard |
| `/admin/urunler` | `src/app/admin/urunler/page.tsx` | Urun listesi |
| `/admin/urunler/yeni` | `src/app/admin/urunler/yeni/page.tsx` | Yeni urun olustur |
| `/admin/urunler/import` | `src/app/admin/urunler/import/page.tsx` | Toplu urun import (CSV) |
| `/admin/urunler/[id]` | `src/app/admin/urunler/[id]/page.tsx` | Urun duzenle |
| `/admin/kategoriler` | `src/app/admin/kategoriler/page.tsx` | Kategori yonetimi |
| `/admin/siparisler` | `src/app/admin/siparisler/page.tsx` | Siparis listesi |
| `/admin/siparisler/[id]` | `src/app/admin/siparisler/[id]/page.tsx` | Siparis detay |
| `/admin/kullanicilar` | `src/app/admin/kullanicilar/page.tsx` | Kullanici listesi |
| `/admin/kullanicilar/[id]` | `src/app/admin/kullanicilar/[id]/page.tsx` | Kullanici detay |
| `/admin/kuponlar` | `src/app/admin/kuponlar/page.tsx` | Kupon listesi |
| `/admin/kuponlar/[id]` | `src/app/admin/kuponlar/[id]/page.tsx` | Kupon duzenle |
| `/admin/bannerlar` | `src/app/admin/bannerlar/page.tsx` | Banner listesi |
| `/admin/bannerlar/[id]` | `src/app/admin/bannerlar/[id]/page.tsx` | Banner duzenle |
| `/admin/sayfalar` | `src/app/admin/sayfalar/page.tsx` | CMS sayfa listesi |
| `/admin/sayfalar/[id]` | `src/app/admin/sayfalar/[id]/page.tsx` | CMS sayfa duzenle |
| `/admin/stok` | `src/app/admin/stok/page.tsx` | Stok/envanter yonetimi |
| `/admin/aboneler` | `src/app/admin/aboneler/page.tsx` | Newsletter aboneleri |
| `/admin/aktivite` | `src/app/admin/aktivite/page.tsx` | Aktivite loglari |
| `/admin/raporlar` | `src/app/admin/raporlar/page.tsx` | Satis/urun/musteri raporlari |
| `/admin/ayarlar` | `src/app/admin/ayarlar/page.tsx` | Site ayarlari |

#### Ozel Sayfalar

| URL | Dosya | Amac |
|-----|-------|------|
| (tumu) | `src/app/error.tsx` | Global hata sayfasi |
| (tumu) | `src/app/not-found.tsx` | 404 sayfasi |

**Toplam:** 49 sayfa dosyasi (page.tsx), 5 layout dosyasi, 1 loading.tsx, 1 error.tsx, 1 not-found.tsx

### 5.2 Layout Hiyerarsisi

```
Root Layout (src/app/layout.tsx)
├── Fontlar: Inter (V2 body), Cormorant Garamond (V2 serif headings), DM Sans (legacy), Cinzel (legacy)
├── AuthProvider (NextAuth SessionProvider)
├── Toaster (Toast bildirimleri)
├── OrganizationJsonLd + WebsiteJsonLd (SEO)
│
├── (shop) Layout (src/app/(shop)/layout.tsx)
│   ├── Navbar (V2: bg-v2-bg-primary, 2 link KADIN/ERKEK, font-inter uppercase)
│   ├── MobileMenu (V2: full-screen overlay bg-v2-bg-primary, buyuk serif linkler)
│   ├── SearchDialog (tam ekran arama)
│   ├── CartDrawer (sag taraftan slide-in sepet)
│   ├── <main> (pt-16 md:pt-20 — navbar yuksekligi icin padding)
│   ├── Footer (V2: bg-v2-bg-dark #2A2A26, entegre newsletter, 3 sutun)
│   │
│   └── hesabim/ Layout (src/app/(shop)/hesabim/layout.tsx)
│       ├── AccountSidebar (sol taraf menu)
│       └── Icerik alani
│
├── (auth) Layout (src/app/(auth)/layout.tsx)
│   ├── Minimal tasarim — Navbar/Footer yok
│   ├── Merkezi logo ("HALIKARNAS" text)
│   ├── max-w-md form container
│   └── Copyright footer
│
└── admin/ Layout (src/app/admin/layout.tsx)
    ├── Auth kontrolu (ADMIN/SUPER_ADMIN)
    ├── Bekleyen siparis sayisi hesaplama
    └── AdminShell (sidebar + header)
```

### 5.3 Component Yapisi

Component'ler **feature-based** (ozellik bazli) yapilandirilmis:

#### `src/components/layout/` (6 dosya) — Sayfa iskeleti

| Component | Dosya | Amac |
|-----------|-------|------|
| `Navbar` | `Navbar.tsx` | V2 navigasyon — bg-v2-bg-primary, 2 link (KADIN/ERKEK), font-inter uppercase, logo Cormorant tracking-[0.25em]. Cinematic variant silindi. |
| `Footer` | `Footer.tsx` | V2 footer — bg-v2-bg-dark (#2A2A26), entegre newsletter formu, 3 sutun linkler (Alisveris/Yardim/Kurumsal), section header'lari text-v2-accent, sosyal ikonlar outline stroke |
| `MobileMenu` | `MobileMenu.tsx` | V2 mobil menu — full-screen overlay bg-v2-bg-primary, buyuk serif linkler (font-serif font-light text-4xl), body scroll lock |
| `CartDrawer` | `CartDrawer.tsx` | Kayan sepet paneli — urun listesi, miktar kontrolu, silme |
| `SearchDialog` | `SearchDialog.tsx` | Tam ekran arama — debounced arama, populer aramalar |
| `UserMenu` | `UserMenu.tsx` | Kullanici dropdown — giris/cikis, admin link, hesap linkleri |

#### `src/components/home/` (8 dosya) — Anasayfa sectionlari

**V2 AKTIF (anasayfada kullaniliyor):**

| Component | Dosya | Amac |
|-----------|-------|------|
| `HeroV2` | `HeroV2.tsx` | Asimetrik 40/60 hero — sol metin, sag full-bleed gorsel/video |
| `EditorialCategoryBlock` | `EditorialCategoryBlock.tsx` | Asimetrik kadin/erkek editoryal blok (65/35 split) |
| `SecimProductGrid` | `SecimProductGrid.tsx` | "Atolyeden Secmeler" 4-urun esit grid (ISR revalidate, server component) |
| `SecimProductGridClient` | `SecimProductGridClient.tsx` | SecimProductGrid client helper (4 sutun ProductCardV2 grid) |
| `FullBleedEditorial` | `FullBleedEditorial.tsx` | Tam genislik atmosfer gorsel section'i |
| `BrandStoryTeaser` | `BrandStoryTeaser.tsx` | Sola yasli sade metin, marka hikayesi teaseri |
| `InstagramFeed` | `InstagramFeed.tsx` | Instagram feed section'i |

**Not:** Tur 3 refactorda 14 legacy home component fiziksel olarak silindi. Sadece V2 component'ler kaldi.

**Anasayfa V2 section sirasi (page.tsx) — bg-v2-bg-primary wrapper:**
1. HeroV2 (asimetrik, video-ready)
2. EditorialCategoryBlock (kadin/erkek editoryal split)
3. SecimProductGrid ("Atolyeden Secmeler", 4-urun esit grid)
4. FullBleedEditorial (atmosfer gorseli)
5. BrandStoryTeaser (sade tipografi)

#### `src/components/shop/` (15 dosya) — Urun listeleme ve detay

**V2 AKTIF:**

| Component | Dosya | Amac |
|-----------|-------|------|
| `ProductCardV2` | `ProductCardV2.tsx` | V2 urun karti — aspect-[3/4], hover image swap, minimal tipografi |
| `ProductGridV2` | `ProductGridV2.tsx` | V2 urun grid — 1/2/3 sutun, gap-v2-gap-sm |
| `CategoryPageV2` | `CategoryPageV2.tsx` | V2 kategori sayfasi — pill tag alt kategori, inline filtreler |
| `FilterToolbarV2` | `FilterToolbarV2.tsx` | V2 filtre toolbar — inline renk swatch, beden/siralama dropdown |
| `ProductDetailV2` | `ProductDetailV2.tsx` | V2 urun detay — ardisik section'lar, tab yok, sticky sag kolon |
| `ImageGalleryV2` | `ImageGalleryV2.tsx` | V2 gorsel galerisi — aspect-[3/4], max-h-[85vh], yatay thumbnail, zoom yok |
| `ColorSelectorV2` | `ColorSelectorV2.tsx` | V2 renk secimi — kare swatch, ring-v2-text-primary |
| `SizeSelectorV2` | `SizeSelectorV2.tsx` | V2 beden secimi — outline stili, v2-accent low stock |
| `MobileAddToCartBarV2` | `MobileAddToCartBarV2.tsx` | V2 mobil bar — bg-v2-bg-dark, md:hidden |

**LEGACY — HALA KULLANIMDA (dynamic [category] route'lari tarafindan):**

| Component | Dosya | Not |
|-----------|-------|-----|
| `ProductCard` | `ProductCard.tsx` | /kadin/[category] ve /erkek/[category]'de kullaniliyor |
| `ProductGrid` | `ProductGrid.tsx` | /kadin/[category] ve /erkek/[category]'de kullaniliyor |
| `CategoryPage` | `CategoryPage.tsx` | Dynamic [category] route'larinda aktif |
| `FilterSidebar` | `FilterSidebar.tsx` | Dynamic [category] route'larinda aktif |
| `SortSelect` | `SortSelect.tsx` | Dynamic [category] route'larinda aktif |

**Not:** Cinematic koleksiyon component'leri (CinematicScroll, ScrollProgress, frames/) Tur 3'te fiziksel olarak silindi. Legacy shop component'lerin cogu da temizlendi — sadece dynamic [category] route'larinin kullandigi 5 legacy component kaldi.

**Not:** `src/components/cart/` dizini Tur 3'te silindi (CartPage, CartItem, CartSummary, CouponInput, EmptyCart). Sepet islevseligi tamamen CartDrawer (layout/ icinde) uzerinden calismaktadir.

#### `src/components/checkout/` (7 dosya) — Odeme akisi (V2)

| Component | Dosya | Amac |
|-----------|-------|------|
| `CheckoutPage` | `CheckoutPage.tsx` | V2 checkout — 12-col grid (7/5 split), card wrapper yok, HALIKARNAS header silindi |
| `CheckoutSteps` | `CheckoutSteps.tsx` | V2 text stepper (Teslimat · Odeme · Onay) — aktif adimda bronz underline, tamamlananlarda inline check |
| `CheckoutSummary` | `CheckoutSummary.tsx` | V2 siparis ozeti — card wrapper yok, mobile accordion, yesil renkler → bronz accent |
| `ShippingForm` | `ShippingForm.tsx` | V2 teslimat formu — V2Input/V2Select/V2Textarea underline wrappers (forwardRef korundu) |
| `PaymentForm` | `PaymentForm.tsx` | V2 odeme — border-b list items (card-style radio yerine), kredi karti gizli (iyzico geldiginde eklenecek) |
| `OrderReview` | `OrderReview.tsx` | V2 siparis onay — border-b section'lar + "Duzenle" linkleri, native checkbox, SSL yesil bandi silindi, final buton dolu siyah |

#### `src/components/account/` (10 dosya) — Kullanici hesabi

| Component | Dosya | Amac |
|-----------|-------|------|
| `AccountSidebar` | `AccountSidebar.tsx` | Hesap menu sidebar'i |
| `AccountStats` | `AccountStats.tsx` | Kullanici istatistik kartlari |
| `ProfileForm` | `ProfileForm.tsx` | Profil duzenleme formu (ad, telefon, email) |
| `PasswordChangeForm` | `PasswordChangeForm.tsx` | Sifre degistirme formu |
| `AddressForm` | `AddressForm.tsx` | Adres ekleme/duzenleme formu |
| `AddressCard` | `AddressCard.tsx` | Adres karti — duzenle/sil butonlari |
| `OrderCard` | `OrderCard.tsx` | Siparis ozet karti |
| `OrderTimeline` | `OrderTimeline.tsx` | Siparis durum zaman cizelgesi |
| `WishlistCard` | `WishlistCard.tsx` | Favori urun karti |
| `DeleteAccountDialog` | `DeleteAccountDialog.tsx` | Hesap silme onay dialogu |

#### `src/components/admin/` (16+ dosya) — Admin paneli

| Component | Dosya | Amac |
|-----------|-------|------|
| `AdminShell` | `AdminShell.tsx` | Admin layout sarmalayicisi (sidebar + header) |
| `AdminSidebar` | `AdminSidebar.tsx` | Admin navigasyon sidebar'i (collapsible) |
| `AdminHeader` | `AdminHeader.tsx` | Admin ust bar — kullanici menu |
| `ProductForm` | `ProductForm.tsx` | Urun olustur/duzenle formu — varyantlar, gorseller, dogrulama |
| `ImageUpload` | `ImageUpload.tsx` | Tekil gorsel yukleme |
| `MultiImageUpload` | `MultiImageUpload.tsx` | Coklu gorsel yukleme |
| `StagedImageUpload` | `StagedImageUpload.tsx` | Asamali gorsel yukleme (form gonderiminden once) |
| `SortableImageGrid` | `SortableImageGrid.tsx` | Suruklenerek siralanan gorsel grid'i (dnd-kit) |
| `VariantMatrix` | `VariantMatrix.tsx` | Beden/renk varyant matrisi editoru |
| `DeleteProductButton` | `DeleteProductButton.tsx` | Urun silme onay butonu |
| `DeleteBannerButton` | `banners/DeleteBannerButton.tsx` | Banner silme butonu |
| `DeleteCouponButton` | `coupons/DeleteCouponButton.tsx` | Kupon silme butonu |
| `DeletePageButton` | `pages/DeletePageButton.tsx` | CMS sayfa silme butonu |
| `OrderStatusBadge` | `orders/OrderStatusBadge.tsx` | Siparis durum badge'i |
| `OrderStatusSelect` | `orders/OrderStatusSelect.tsx` | Siparis durum degistirme select'i |
| `OrderTimeline` | `orders/OrderTimeline.tsx` | Siparis durum gecmisi zaman cizelgesi |

#### `src/components/auth/` (4 dosya) — Kimlik dogrulama

| Component | Dosya | Amac |
|-----------|-------|------|
| `LoginForm` | `LoginForm.tsx` | Giris formu — email, sifre, beni hatirlama, sosyal giris |
| `RegisterForm` | `RegisterForm.tsx` | Kayit formu — dogrulama ile |
| `ForgotPasswordForm` | `ForgotPasswordForm.tsx` | Sifre sifirlama istegi formu |
| `ResetPasswordForm` | `ResetPasswordForm.tsx` | Token ile sifre sifirlama formu |

#### `src/components/ui/` (27 dosya) — shadcn/ui base componentleri

| Component | Dosya |
|-----------|-------|
| `Accordion` | `accordion.tsx` |
| `Alert` | `alert.tsx` |
| `AlertDialog` | `alert-dialog.tsx` |
| `Avatar` | `avatar.tsx` |
| `Badge` | `badge.tsx` |
| `Button` | `button.tsx` |
| `Card` | `card.tsx` |
| `Checkbox` | `checkbox.tsx` |
| `Dialog` | `dialog.tsx` |
| `DropdownMenu` | `dropdown-menu.tsx` |
| `Form` | `form.tsx` |
| `Input` | `input.tsx` |
| `Label` | `label.tsx` |
| `Popover` | `popover.tsx` |
| `RadioGroup` | `radio-group.tsx` |
| `ScrollArea` | `scroll-area.tsx` |
| `Select` | `select.tsx` |
| `Separator` | `separator.tsx` |
| `Sheet` | `sheet.tsx` |
| `Skeleton` | `skeleton.tsx` |
| `Slider` | `slider.tsx` |
| `Switch` | `switch.tsx` |
| `Table` | `table.tsx` |
| `Tabs` | `tabs.tsx` |
| `Textarea` | `textarea.tsx` |
| `Toast` | `toast.tsx` |
| `Toaster` | `toaster.tsx` |

#### `src/components/ui/luxury/` (8 dosya) — Luks animasyon componentleri

| Component | Export'lar | Amac |
|-----------|-----------|------|
| `GoldDivider` | `GoldDivider` | Dekoratif altin cizgi bolucusu |
| `TextReveal` | `TextReveal`, `TextFadeIn`, `LetterSpacingReveal` | Metin ortaya cikma animasyonlari |
| `ParallaxImage` | `ParallaxImage`, `ParallaxLayeredImage` | Parallax gorsel efekti |
| `MagneticButton` | `MagneticButton`, `ArrowIcon` | Manyetik hover efektli buton |
| `VideoBackground` | `VideoBackground`, `AnimatedGradientBackground` | Video arkaplan ve gradient overlay |
| `EditorialQuote` | `EditorialQuote`, `EditorialText` | Editoryal alinti gorunumu |
| `ScrollIndicator` | `ScrollIndicator`, `ChevronBounce` | Scroll ilerleme gostergesi |
| `ProductShowcase` | `ProductCardLuxury`, `ProductGridLuxury` | Luks urun kartlari |

#### Diger Componentler

| Component | Dosya | Amac |
|-----------|-------|------|
| `LuxuryFAQAccordion` | `src/components/faq/LuxuryFAQAccordion.tsx` | Luks stilize FAQ accordion |
| `JsonLd` | `src/components/seo/JsonLd.tsx` | SEO structured data (6 schema tipi) |
| `AuthProvider` | `src/components/providers/AuthProvider.tsx` | NextAuth SessionProvider sarmalayicisi |
| `ShippingConfigProvider` | `src/components/providers/ShippingConfigProvider.tsx` | React Context — DB'den kargo config (free threshold, cost) yukler |

### 5.4 State Management (Zustand)

5 Zustand store mevcut. 3'u localStorage'da persist ediliyor:

#### `cart-store.ts` (187 satir) — Sepet Yonetimi [PERSIST]

```typescript
interface CartItem {
  id: string                    // Benzersiz kart item ID
  productId: string             // Urun ID
  variantId: string             // Varyant ID
  name: string                  // Urun adi
  slug: string                  // URL slug
  sku: string                   // Stok birimi kodu
  gender: "ERKEK" | "KADIN" | "UNISEX" | null
  categorySlug: string | null   // Kategori slug (URL icin)
  color: string                 // Renk hex kodu
  colorName: string             // Renk adi (Turkce)
  size: string                  // Beden (orn: "38")
  price: number                 // Birim fiyat
  compareAtPrice?: number       // Karsilastirma fiyati (indirim oncesi)
  image: string                 // Gorsel URL
  quantity: number              // Miktar
  maxQuantity: number           // Maksimum stok adedi
}

interface AppliedCoupon {
  code: string                  // Kupon kodu
  discountType: "percentage" | "fixed"
  discountValue: number         // Indirim degeri
  maxDiscount?: number          // Maks indirim tavani
}

interface CartState {
  items: CartItem[]
  isOpen: boolean               // CartDrawer acik mi
  coupon: AppliedCoupon | null

  addItem(item: CartItem): void
  removeItem(variantId: string): void
  updateQuantity(variantId: string, quantity: number): void
  clearCart(): void
  openCart(): void
  closeCart(): void
  toggleCart(): void
  applyCoupon(coupon: AppliedCoupon): void
  removeCoupon(): void
  getTotalItems(): number
  getSubtotal(): number
  getShippingCost(): number     // 500 TL ustu: 0, alti: 49.90 TL
  getDiscount(): number         // Kupon indirim hesaplama
  getTotal(): number            // subtotal - discount + shippingCost
  getItemByVariantId(variantId: string): CartItem | undefined
}
```
- **localStorage key:** `halikarnas-cart`
- **FREE_SHIPPING_THRESHOLD:** 500 TRY
- **SHIPPING_COST:** 49.90 TRY

#### `checkout-store.ts` (142 satir) — Checkout Adim Yonetimi [PERSIST]

```typescript
interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string                 // 5XX XXX XX XX formatinda
  city: string                  // Sehir ID
  cityName: string              // Sehir adi
  district: string              // Ilce ID
  districtName: string          // Ilce adi
  neighborhood?: string         // Mahalle
  address: string               // Tam adres
  postalCode?: string           // Posta kodu
}

type PaymentMethod = "card" | "cash_on_delivery"
type CheckoutStep = 1 | 2 | 3

interface CheckoutState {
  currentStep: CheckoutStep     // Aktif adim
  shippingInfo: ShippingInfo | null
  paymentMethod: PaymentMethod
  acceptedTerms: boolean        // Satis sozlesmesi onay
  acceptedKvkk: boolean         // KVKK (GDPR) onay
  isOrderCompleted: boolean

  setStep(step: CheckoutStep): void
  nextStep(): void
  prevStep(): void
  setShippingInfo(info: ShippingInfo): void
  setPaymentMethod(method: PaymentMethod): void
  setAcceptedTerms(accepted: boolean): void
  setAcceptedKvkk(accepted: boolean): void
  setOrderCompleted(completed: boolean): void
  reset(): void
  canProceedToPayment(): boolean   // shippingInfo dolu mu
  canProceedToReview(): boolean    // paymentMethod secildi mi
  canPlaceOrder(): boolean         // terms + kvkk kabul edildi mi
}
```
- **localStorage key:** `halikarnas-checkout`

#### `wishlist-store.ts` (109 satir) — Favoriler [PERSIST]

```typescript
interface WishlistItem {
  productId: string
  addedAt: Date
}

interface WishlistStore {
  items: WishlistItem[]
  isLoading: boolean

  addItem(productId: string): Promise<boolean>    // POST /api/wishlist
  removeItem(productId: string): Promise<boolean>  // DELETE /api/wishlist/[productId]
  isInWishlist(productId: string): boolean
  syncWithServer(): Promise<void>                   // Server ile senkronize et
  clearWishlist(): void
}
```
- **localStorage key:** `wishlist-storage`
- Server ve local arasinda senkronizasyon

#### `filter-store.ts` (128 satir) — Urun Filtreleme [PERSIST YOK]

```typescript
type SortOption = "newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc" | "popular"

interface FilterState {
  categories: string[]          // Secili kategori slug'lari
  sizes: string[]               // Secili beden'ler (orn: ["38", "39"])
  colors: string[]              // Secili renkler
  priceRange: [number, number]  // [0, 10000] varsayilan
  sort: SortOption
  search: string                // Arama metni

  setCategories(categories: string[]): void
  toggleCategory(category: string): void
  setSizes(sizes: string[]): void
  toggleSize(size: string): void
  setColors(colors: string[]): void
  toggleColor(color: string): void
  setPriceRange(range: [number, number]): void
  setSort(sort: SortOption): void
  setSearch(search: string): void
  clearFilters(): void
  hasActiveFilters(): boolean
  getActiveFilterCount(): number
}
```

#### `ui-store.ts` (101 satir) — UI Modal/Menu State [PERSIST YOK]

```typescript
interface UIState {
  // Mobil menu
  isMobileMenuOpen: boolean
  openMobileMenu(): void
  closeMobileMenu(): void
  toggleMobileMenu(): void

  // Arama
  isSearchOpen: boolean
  openSearch(): void
  closeSearch(): void
  toggleSearch(): void

  // Filtre sidebar (mobil)
  isFilterOpen: boolean
  openFilter(): void
  closeFilter(): void
  toggleFilter(): void

  // Beden rehberi modal
  isSizeGuideOpen: boolean
  openSizeGuide(): void
  closeSizeGuide(): void

  // Hizli goruntuleme modal
  quickViewProductId: string | null
  openQuickView(productId: string): void
  closeQuickView(): void

  // Gorsel lightbox
  lightboxImages: string[]
  lightboxIndex: number
  openLightbox(images: string[], index?: number): void
  closeLightbox(): void
  setLightboxIndex(index: number): void

  // Global yukleme
  isLoading: boolean
  setLoading(loading: boolean): void

  // Hepsini kapat
  closeAll(): void
}
```

### 5.5 Styling Sistemi

- **Framework:** Tailwind CSS 3.4.1
- **Component Library:** shadcn/ui (Radix UI bazli, 27 component)
- **Design Approach:** Utility-first + luks ozel componentler
- **Responsive:** Mobile-first (sm, md, lg, xl breakpoint'leri)

**Tailwind Breakpoint'leri (varsayilan):**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### 5.6 Form Handling

- **Kutuphane:** React Hook Form 7.69.0 + Zod 4.2.1
- **Resolver:** `@hookform/resolvers/zod`
- **Pattern:** shadcn `Form` component'i ile entegre
- Inline Zod schema tanimlamalari (ayri validations dizini yok)
- Checkout'ta cascading dropdown'lar (sehir secimi → ilce listesi)
- Turkce telefon validasyonu: `5XX XXX XX XX` formati
- KVKK (GDPR) onay checkbox'lari checkout'ta zorunlu

### 5.7 SEO Yaklasimi

**Metadata:** Root layout'ta kapsamli Open Graph ve Twitter Card metadata
- Sayfa bazli dinamik baslik ve aciklama
- `robots: { index: true, follow: true }`
- `metadataBase` ayari

**JSON-LD Structured Data** (`src/components/seo/JsonLd.tsx`, 240 satir):

| Schema Tipi | Component | Kullanim Yeri |
|-------------|-----------|---------------|
| Organization | `OrganizationJsonLd` | Root layout |
| Website | `WebsiteJsonLd` | Root layout |
| Product | `ProductJsonLd` | Urun detay sayfasi |
| BreadcrumbList | `BreadcrumbJsonLd` | Kategori ve urun sayfalari |
| FAQPage | `FAQJsonLd` | SSS sayfasi |
| LocalBusiness (ShoeStore) | `LocalBusinessJsonLd` | Hikayemiz sayfasi |

**LocalBusiness detaylari:**
- Tur: ShoeStore
- Adres: Kumbahce Mah., Bodrum, Mugla, Turkiye
- Telefon: +90-252-316-1234
- Koordinatlar: 37.0344, 27.4305
- Calisma saatleri: Pzt-Cum 09:00-19:00, Cts 10:00-18:00
- Fiyat araligi: ₺₺

### 5.8 i18n (Cok Dil Destegi)
- **Mevcut durum:** Tek dil — Turkce
- Tum UI metinleri Turkce (hardcoded)
- i18n framework'u entegre edilmemis
- TODO listesinde "Multi-language (i18n)" mevcut

---

## 6. Design System & Assets

### 6.1 Brand Renkleri (Hex Kodlari ile)

#### V2 Renk Paleti (AKTIF — tum V2 sayfalarda kullaniliyor)

| Token | Hex | Kullanim |
|-------|-----|----------|
| `v2-bg-primary` | `#FAF7F2` | Sicak krem sayfa arkaplan |
| `v2-bg-dark` | `#2A2A26` | Koyu arka plan (footer, mobil bar) |
| `v2-text-primary` | `#1C1917` | Ana metin rengi (basliklar, vurgu) |
| `v2-text-muted` | `#6B6560` | Ikincil metin (aciklamalar, label'lar) |
| `v2-accent` | `#8B6F47` | Sicak bronz aksesuar (low stock, wishlist) |
| `v2-border-subtle` | `#E8E2D8` | Ince sicak kenarlik |

#### Legacy Luxury Palette (@DEPRECATED — V2 sayfalarinda KULLANILMAMALI)

| Token | Hex | Durum |
|-------|-----|-------|
| `luxury-primary` | `#1e3a3a` | Deprecated — sadece legacy sayfalarda (admin, auth, hesabim) |
| `luxury-gold` | `#c9a962` | Deprecated — v2-accent kullanin |
| `luxury-terracotta` | `#e07d4c` | Deprecated |
| `luxury-cream` | `#faf9f6` | Deprecated — v2-bg-primary kullanin |
| `luxury-ivory/stone/charcoal` | cesitli | Deprecated |

#### Legacy Renk Scale'leri (@DEPRECATED — tailwind.config'de tanimli ama V2'de kullanilmamali)

| Scale | Durum |
|-------|-------|
| `sand-50` - `sand-900` | Deprecated — sadece legacy sayfalarda kalabilir |
| `aegean-50` - `aegean-900` | Deprecated |
| `terracotta-50` - `terracotta-900` | Deprecated |
| `leather-50` - `leather-900` | Deprecated |

### 6.2 Typography

#### V2 Font Kullanimi (AKTIF)

| Token | Font Ailesi | Weight'ler | Kullanim |
|-------|-------------|-----------|----------|
| `font-serif` / `font-heading` | Cormorant Garamond | 300, 400, 600 + italic | V2 basliklar, urun adlari (genelde font-light / 300) |
| `font-inter` | Inter | 400, 500 | V2 body text, label'lar, butonlar, UI elementleri |

#### Legacy Fontlar (yuklu ama V2'de kullanilmiyor)

| Token | Font Ailesi | Durum |
|-------|-------------|-------|
| `font-sans` / `font-body` | DM Sans | Legacy — font-inter kullanin |
| `font-accent` / `font-display` | Cinzel | Legacy/Deprecated — font-serif kullanin |

#### V2 Font Boyut Token'lari (tailwind.config.ts)

| Token | Boyut | Line Height | Letter Spacing |
|-------|-------|-------------|----------------|
| `v2-hero` | 7rem | 1.05 | -0.01em |
| `v2-hero-md` | 5rem | 1.05 | -0.01em |
| `v2-hero-sm` | 2.5rem | 1.1 | -0.01em |
| `v2-section` | 3.5rem | 1.15 | -0.01em |
| `v2-section-sm` | 2rem | 1.2 | — |
| `v2-body` | 1rem | 1.7 | — |
| `v2-label` | 0.6875rem (11px) | 1.4 | 0.2em |
| `v2-caps` | 0.625rem (10px) | 1.4 | 0.1em |

#### V2 Spacing Token'lari (tailwind.config.ts)

| Token | Deger | Kullanim |
|-------|-------|----------|
| `v2-section` | 10rem (160px) | Section dikey padding (desktop) |
| `v2-section-mobile` | 6.25rem (100px) | Section dikey padding (mobil) |
| `v2-gap` | 5rem (80px) | Buyuk bosluk |
| `v2-gap-sm` | 3rem (48px) | Kucuk bosluk |

#### V2 CSS Utility Class'lari (globals.css)

| Class | Tanimlama | Kullanim |
|-------|-----------|----------|
| `.container-v2` | `px-6 md:px-12 lg:px-24 mx-auto max-w-[1440px]` | V2 sayfa container'i |
| `.section-v2` | `py-v2-section-mobile md:py-v2-section` | Responsive section padding |
| `.link-underline-v2` | Hover'da 0→100% genislik underline animasyonu (400ms) | CTA linkleri |

#### V2 Global Stiller (globals.css)

- **Scrollbar:** Track `#FAF7F2`, thumb `#8B6F47`, 4px genislik
- **Selection:** `bg-v2-accent/20 text-v2-text-primary`
- **HTML:** `scroll-behavior: smooth`
- **Reduced motion:** `[data-v2-animate]` elementlerinde animasyon devre disi

**V2 Etiket Pattern'i (eski Cinzel pattern'in yerini aldi):**
```css
font-inter text-v2-label uppercase tracking-[0.2em] text-v2-text-muted
```

### 6.3 Asset Envanteri

**Onemli Not:** Projede `public/` dizini bulunmamaktadir. Tum gorseller disaridan sunulmaktadir:

| Asset Tipi | Kaynak | Detay |
|------------|--------|-------|
| Urun gorselleri | Cloudinary CDN | `res.cloudinary.com` uzerinden |
| Demo gorseller | Unsplash | Seed data'da sabit URL'ler |
| Placeholder gorseller | Placehold.co | Yukleme durumlari icin |
| Ikonlar | Lucide React | SVG ikon kutuphanesi (komponentler) |
| Fontlar | Google Fonts (self-hosted) | DM Sans, Cormorant Garamond, Cinzel |
| Logo | Yok (metin bazli) | "HALIKARNAS" text logo — `font-display` ile |

**Gorsel Boyut Sabitleri** (`src/lib/constants.ts`):
- thumbnail: 100x100
- card: 400x533
- product: 800x1067
- banner: 1920x823
- hero: 1920x1080

### 6.4 UI Pattern'leri

**Buton Stilleri:**
```tsx
// Birincil (Luxury)
<MagneticButton variant="primary">Kesfet</MagneticButton>

// Standart
<Button className="bg-luxury-primary hover:bg-luxury-primary-light text-white">

// Ghost
<Button variant="ghost">

// Outline
<Button variant="outline">
```

**Kart Stili:**
```tsx
<Card className="bg-luxury-ivory border-luxury-stone rounded-lg shadow-soft">
```

**Section Container:**
```tsx
<section className="bg-luxury-cream py-16 md:py-24">
  <div className="container mx-auto px-4">
```

**Sayfa Basligi:**
```tsx
<h1 className="font-serif text-3xl md:text-4xl text-luxury-charcoal">
```

**Altin Bolucu:**
```tsx
<GoldDivider />
```

### 6.5 Animasyon Sistemi (`src/lib/animations.ts`, 510 satir)

**Zamanlama Sabitleri (TIMING):**
| Isim | Sure |
|------|------|
| `instant` | 0.15s |
| `fast` | 0.3s |
| `medium` | 0.5s |
| `slow` | 0.7s |
| `slower` | 1.0s |
| `cinematic` | 1.5s |

**Easing Presetleri (EASE):**
| Isim | Deger |
|------|-------|
| `luxury` | `[0.4, 0, 0.2, 1]` |
| `smooth` | `[0.25, 0.1, 0.25, 1]` |
| `bounce` | `[0.68, -0.55, 0.265, 1.55]` |
| `out` | `[0, 0, 0.2, 1]` |
| `inOut` | `[0.4, 0, 0.6, 1]` |
| `spring` | `{ stiffness: 100, damping: 15 }` |

**V2 Animasyon Variant'lari (yeni):**
- `sectionRevealV2` — opacity 0→1, y 20→0 (500ms, luxury ease) — V2 sayfa section'lari icin
- `staggerV2` — staggerChildren 0.1 — grid item'lari icin
- `viewportV2` — once: true, amount: 0.15, margin: "-50px" — scroll tetikleme

**Legacy Onceden Tanimli Variant'lar (korunuyor):**
- `goldLine`, `goldLineWide` — Dekoratif cizgi animasyonlari
- `letterSpacingReveal` — Baslik harf araligi animasyonu
- `textRevealLine` — Metin giris animasyonu
- `splitRevealLeft`, `splitRevealRight` — Bolunen ekran animasyonu
- `masonryItem` — Grid item animasyonu
- `kenBurns` — Yavas zoom animasyonu
- `scrollIndicatorPulse` — Ziplayan scroll gostergesi
- `counterReveal` — Sayac animasyonu
- `imageHoverZoom` — Gorsel hover efekti
- `quickViewOverlay` — Hizli goruntuleme overlay
- `magneticButton` — Buton manyetik efekti

### 6.6 Anti-Pattern'ler ve Yasak Listesi

**Teknik Anti-Pattern'ler:**
1. Parallax Y > ±3% kullanma (frame gap yaratir)
2. `min-h-screen` + padding ile scroll-snap bozulur
3. `SheetFooter` yerine manuel div kullan
4. Form input'larda `forwardRef` zorunlu (react-hook-form uyumlulugu icin)
5. Legacy renk token'larini (`sand-*`, `leather-*`, `aegean-*`, `terracotta-*`, `luxury-*`) V2 sayfalarda kullanma

**V2 Tasarim Yasak Listesi:**
- Yesil/teal renkler
- Altin #B8860B / #c9a962 (legacy luxury-gold)
- Gradient arkaplanlar
- Trust bar (kargo/iade/guvenli odeme ikon bari)
- Card border'li form input
- Rounded pill butonlar
- Numarali circle progress stepper
- All-caps urun isimleri
- Full-width dolgu siyah CTA
- Yesil success banner
- Box-border form input (underline kullan)

---

## 7. Backend / API

### 7.1 Framework ve Mimarisi

- **Framework:** Next.js API Routes (App Router `route.ts` dosyalari)
- **Mimari:** REST API
- **ORM:** Prisma 7.2.0
- **Validation:** Zod 4.2.1 (inline schema tanimlamalari)
- **Auth:** NextAuth.js v5 (JWT strateji)

### 7.2 Tum API Endpoint'leri

#### Auth Endpoint'leri

| Method | Path | Auth | Amac | Request Body | Response |
|--------|------|------|------|-------------|----------|
| `*` | `/api/auth/[...nextauth]` | - | NextAuth handler'lari (giris, cikis, session) | - | NextAuth standart |
| `POST` | `/api/auth/register` | Yok | Yeni kullanici kaydi | `{name, email, password, acceptNewsletter?}` | `{id, name, email}` (201) |
| `POST` | `/api/auth/forgot-password` | Yok | Sifre sifirlama emaili gonder | `{email}` | `{message}` (her zaman 200 — email enumeration korunmasi) |
| `POST` | `/api/auth/reset-password` | Yok | Token ile yeni sifre belirle | `{token, password}` | `{message}` (200) |

#### Kullanici Endpoint'leri (Auth Gerekli)

| Method | Path | Auth | Amac | Request Body | Response |
|--------|------|------|------|-------------|----------|
| `GET` | `/api/user/profile` | Evet | Profil bilgilerini getir | - | `{id, name, email, phone, image, createdAt}` |
| `PATCH` | `/api/user/profile` | Evet | Profil guncelle | `{name, phone?}` | Guncellenmis profil |
| `POST` | `/api/user/change-password` | Evet | Sifre degistir | `{currentPassword, newPassword, confirmPassword}` | `{message}` |
| `DELETE` | `/api/user/delete` | Evet | Hesabi sil | `{password, confirmation: "DELETE"}` | `{success: true}` |

#### Adres Endpoint'leri (Auth Gerekli)

| Method | Path | Auth | Amac | Request Body | Response |
|--------|------|------|------|-------------|----------|
| `GET` | `/api/addresses` | Evet | Adres listesi | - | Address[] (varsayilan ilk) |
| `POST` | `/api/addresses` | Evet | Yeni adres ekle (maks 5) | `{title, firstName, lastName, phone, address, city, district, postalCode?, isDefault?}` | Address (201) |
| `PATCH` | `/api/addresses/[id]` | Evet | Adres guncelle | Tum alanlar opsiyonel | Guncellenmis Address |
| `DELETE` | `/api/addresses/[id]` | Evet | Adres sil | - | `{message}` |

#### Sepet Endpoint'leri

| Method | Path | Auth | Amac | Request Body | Response |
|--------|------|------|------|-------------|----------|
| `GET` | `/api/cart` | Hayir* | Sepet icerigini getir | - | `{items: CartItem[], total}` |
| `POST` | `/api/cart` | Hayir* | Sepete urun ekle | `{productId, variantId, quantity}` | CartItem |
| `PATCH` | `/api/cart` | Hayir* | Miktar guncelle | `{variantId, quantity}` | Guncellenmis CartItem |
| `DELETE` | `/api/cart` | Hayir* | Urunu kaldir | query: `variantId` | `{message}` |

\* sessionId cookie veya userId ile calisir

#### Siparis Endpoint'leri

| Method | Path | Auth | Amac | Request Body | Response |
|--------|------|------|------|-------------|----------|
| `POST` | `/api/orders` | Hayir (guest veya auth) | Siparis olustur | `{items, shippingInfo, paymentMethod, couponCode?, subtotal, shippingCost, discount, total}` | `{success, orderNumber, trackingToken, orderId}` |
| `GET` | `/api/orders` | Hayir | Guest siparis sorgula | query: `orderNumber, email` | Order detay |
| `POST` | `/api/orders/track` | Hayir | Siparis takip | `{email, orderNumber}` | Order detay + statusHistory |

#### Favoriler Endpoint'leri (Auth Gerekli)

| Method | Path | Auth | Amac | Request Body | Response |
|--------|------|------|------|-------------|----------|
| `GET` | `/api/wishlist` | Evet | Favori listesi | - | WishlistItem[] (urun detaylariyale) |
| `POST` | `/api/wishlist` | Evet | Favoriye ekle | `{productId}` | WishlistItem (201) |
| `DELETE` | `/api/wishlist/[productId]` | Evet | Favoriden cikar | - | `{message}` |

#### Arama ve Icerik Endpoint'leri

| Method | Path | Auth | Amac | Request Body / Query | Response |
|--------|------|------|------|---------------------|----------|
| `GET` | `/api/search` | Hayir | Urun arama ve filtreleme | query: `q, category, gender, minPrice, maxPrice, sort, page, limit` | `{products, total, totalPages}` |
| `POST` | `/api/contact` | Hayir | Iletisim formu gonder | `{name, email, subject, message, honeypot}` | `{success}` (201) |
| `POST` | `/api/newsletter` | Hayir | Bultene abone ol | `{email}` | `{success, message}` |
| `POST` | `/api/coupon/validate` | Hayir | Kupon dogrula | `{code, subtotal}` | `{valid, code, discountType, discountValue, discount, description}` |
| `GET` | `/api/locations/cities` | Hayir | Turkiye sehir listesi | - | `[{id, name, plateCode}]` |
| `GET` | `/api/locations/districts` | Hayir | Ilce listesi | query: `cityId` | `[{id, cityId, name}]` |
| `POST` | `/api/upload` | Admin | Gorsel yukle (Cloudinary) | FormData: `file, folder?, gender?, category?, productSlug?, sku?, color?, imageIndex?` | `{success, url, publicId, folder, fileName, width, height}` |
| `GET` | `/api/settings` | Hayir | Public shipping config | - | `{freeShippingThreshold, shippingCost}` |

#### Admin Endpoint'leri (ADMIN/SUPER_ADMIN Auth Gerekli)

**Urunler:**

| Method | Path | Auth | Amac | Detay |
|--------|------|------|------|-------|
| `GET` | `/api/admin/products` | Admin | Urun listesi | query: page, limit(20), status, search. Paginated. |
| `POST` | `/api/admin/products` | Admin | Urun olustur | Varyantlar + gorseller ile. Slug ve SKU benzersizlik kontrolu. |
| `GET` | `/api/admin/products/[id]` | Admin | Urun detay | Varyantlar ve gorseller dahil |
| `PATCH` | `/api/admin/products/[id]` | Admin | Urun guncelle | Transaction ile varyant/gorsel/koleksiyon yonetimi |
| `DELETE` | `/api/admin/products/[id]` | Admin | Urun sil | Sipariste varsa: ARCHIVED, yoksa: hard delete |
| `GET` | `/api/admin/products/export` | Admin | CSV export | PapaParse ile flatten edilmis urun-varyant verisi |
| `POST` | `/api/admin/products/import` | Admin | CSV import | Turkce/Ingilizce alan isimleri destegi, upsert |
| `GET` | `/api/admin/products/template` | Admin | CSV sablon indir | UTF-8 BOM ile Excel uyumlu |

**Kategoriler:**

| Method | Path | Auth | Amac |
|--------|------|------|------|
| `GET` | `/api/admin/categories` | Admin | Kategori listesi (_count.products ile) |
| `POST` | `/api/admin/categories` | Admin | Kategori olustur (slug+gender benzersiz) |
| `PATCH` | `/api/admin/categories/[id]` | Admin | Kategori guncelle |
| `DELETE` | `/api/admin/categories/[id]` | Admin | Kategori sil (urun varsa engel) |

**Siparisler:**

| Method | Path | Auth | Amac |
|--------|------|------|------|
| `GET` | `/api/admin/orders` | Admin | Siparis listesi (page, limit, status, search) |
| `GET` | `/api/admin/orders/[id]` | Admin | Siparis tam detay (items, statusHistory, user) |
| `PATCH` | `/api/admin/orders/[id]` | Admin | Durum guncelle (status, tracking, carrier, note). SHIPPED'da email gonderir. |
| `GET` | `/api/admin/orders/[id]/invoice` | Admin | PDF fatura uret ve indir |

**Kuponlar:**

| Method | Path | Auth | Amac |
|--------|------|------|------|
| `GET` | `/api/admin/coupons` | Admin | Kupon listesi |
| `POST` | `/api/admin/coupons` | Admin | Kupon olustur (code benzersiz, auto-uppercase) |
| `GET` | `/api/admin/coupons/[id]` | Admin | Kupon detay |
| `PATCH` | `/api/admin/coupons/[id]` | Admin | Kupon guncelle |
| `DELETE` | `/api/admin/coupons/[id]` | Admin | Kupon sil (sipariste kullanildiysa engel) |

**Banner'lar:**

| Method | Path | Auth | Amac |
|--------|------|------|------|
| `GET` | `/api/admin/banners` | Admin | Banner listesi (position, sortOrder siralamasi) |
| `POST` | `/api/admin/banners` | Admin | Banner olustur |
| `GET` | `/api/admin/banners/[id]` | Admin | Banner detay |
| `PATCH` | `/api/admin/banners/[id]` | Admin | Banner guncelle |
| `DELETE` | `/api/admin/banners/[id]` | Admin | Banner sil |

**Sayfalar (CMS):**

| Method | Path | Auth | Amac |
|--------|------|------|------|
| `GET` | `/api/admin/pages` | Admin | Sayfa listesi |
| `POST` | `/api/admin/pages` | Admin | Sayfa olustur (slug: `^[a-z0-9-]+$` regex) |
| `GET` | `/api/admin/pages/[id]` | Admin | Sayfa detay |
| `PATCH` | `/api/admin/pages/[id]` | Admin | Sayfa guncelle |
| `DELETE` | `/api/admin/pages/[id]` | Admin | Sayfa sil |

**Stok/Envanter:**

| Method | Path | Auth | Amac |
|--------|------|------|------|
| `GET` | `/api/admin/inventory` | Admin | Varyant stok listesi (filter: all/low/out, search: SKU/urun adi) |
| `POST` | `/api/admin/inventory/bulk-update` | Admin | Toplu stok guncelle (`{updates: [{id, stock}]}`) — transaction ile |

**Kullanicilar:**

| Method | Path | Auth | Amac |
|--------|------|------|------|
| `GET` | `/api/admin/users` | Admin | Kullanici listesi (page, limit, role, search) |
| `GET` | `/api/admin/users/[id]` | Admin | Kullanici detay (adresler, son 10 siparis, sayimlar) |
| `PATCH` | `/api/admin/users/[id]` | SUPER_ADMIN | Rol guncelle (kendi rolunu degistiremez) |

**Raporlar:**

| Method | Path | Auth | Amac |
|--------|------|------|------|
| `GET` | `/api/admin/reports` | Admin | Rapor uret (type: sales/products/customers/inventory, range: 7d/30d/90d/1y) |

**Ayarlar:**

| Method | Path | Auth | Amac |
|--------|------|------|------|
| `GET` | `/api/admin/settings` | Admin | Tum site ayarlarini getir |
| `PUT` | `/api/admin/settings` | Admin | Toplu ayar guncelle (`[{key, value, group?}]`) |

**Newsletter Aboneleri:**

| Method | Path | Auth | Amac |
|--------|------|------|------|
| `GET` | `/api/admin/subscribers` | Admin | Abone listesi (search, status, CSV export) |
| `PATCH` | `/api/admin/subscribers` | Admin | Abone aktif/pasif toggle |
| `DELETE` | `/api/admin/subscribers` | Admin | Abone sil |

**Aktivite Loglari:**

| Method | Path | Auth | Amac |
|--------|------|------|------|
| `GET` | `/api/admin/activity` | Admin | Aktivite log listesi (filter, page, limit=50) |

**Toplam:** 46 route dosyasi, 80+ HTTP handler

### 7.3 Middleware Zinciri

**`middleware.ts` (43 satir) — Edge Runtime:**

```typescript
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // Admin route korunmasi
  if (pathname.startsWith("/admin")) {
    if (!token || (token.role !== "ADMIN" && token.role !== "SUPER_ADMIN")) {
      return redirect("/giris");
    }
  }

  // Hesap route korunmasi
  if (pathname.startsWith("/hesabim")) {
    if (!token) {
      return redirect(`/giris?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }

  // Giris yapmis kullanicilari auth sayfalarindan yonlendir
  if (pathname === "/giris" || pathname === "/kayit") {
    if (token) {
      return redirect("/");
    }
  }
}

export const config = {
  matcher: ["/admin/:path*", "/hesabim/:path*", "/giris", "/kayit"],
};
```

**Onemli:** Middleware Edge Runtime'da calistigi icin Prisma/pg kullanilamaz — sadece `getToken()` ile JWT dogrulamasi yapilir.

### 7.4 Auth Mekanizmasi

**Teknoloji:** NextAuth.js v5 (beta.30)
**Strateji:** JWT (session-based degil)
**Adapter:** PrismaAdapter (veritabaninda Account, Session tablolari)

**Saglayicilar:**
1. **Credentials** — Email + sifre ile giris (bcrypt dogrulama, 12 round)
2. **Google OAuth** — Opsiyonel (env degiskenleri ile etkinlestirilir)

**Token Akisi:**
1. Kullanici `/giris` sayfasinda email+sifre girer
2. NextAuth Credentials provider sifre dogrular (bcrypt)
3. JWT token olusturulur — icinde `id`, `email`, `role` bilgisi
4. Client tarafinda `SessionProvider` ile session context
5. API route'larinda `auth()` fonksiyonu ile sunucu tarafinda dogrulama
6. Middleware'de `getToken()` ile Edge Runtime'da dogrulama

**JWT Callback'leri:**
```typescript
jwt({ token, user }) {
  if (user) {
    token.role = user.role;
    token.id = user.id;
  }
  return token;
}

session({ session, token }) {
  session.user.role = token.role;
  session.user.id = token.id;
  return session;
}
```

**Roller:**
| Rol | Erisim |
|-----|--------|
| `CUSTOMER` | Public sayfalar + hesap paneli |
| `ADMIN` | Tum admin islemleri (kullanici rol degistirme haric) |
| `SUPER_ADMIN` | Tum islemler + kullanici rol degistirme |

### 7.5 Validation Layer

- **Kutuphane:** Zod 4.2.1
- **Yaklasim:** Her API route'unda inline schema tanimlamasi
- **Pattern:** `const schema = z.object({...}); const validated = schema.parse(body);`
- **Hata yonetimi:** ZodError yakalanip `{error: error.errors}` ile 400 donuluyor
- Ayri bir `src/lib/validations/` dizini yok — schema'lar her route dosyasinda tanimli

### 7.6 Error Handling Stratejisi

```typescript
try {
  // 1. Auth kontrolu
  // 2. Request dogrulama (Zod)
  // 3. Veritabani islemleri
  // 4. Response donusu
} catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.errors }, { status: 400 });
  }
  if (error.code === "P2002") { // Prisma unique constraint violation
    return NextResponse.json({ error: "Duplicate..." }, { status: 400 });
  }
  console.error("Error:", error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
```

### 7.7 Rate Limiting

**Yaklasim:** In-memory Map (tek process)

| Endpoint | Limit | Periyot |
|----------|-------|---------|
| `/api/orders/track` | 5 istek | Saat basina, IP bazli |
| `/api/contact` | 5 istek | Saat basina, IP bazli |
| `/api/newsletter` | 5 istek | Saat basina, IP bazli |

**Uyari:** In-memory Map production'da birden fazla instance ile calismaz. Redis'e gecis gerekli (TODO).

### 7.8 Guvenlik Onlemleri

| Onlem | Uygulama |
|-------|----------|
| Sifre Hashleme | bcrypt, 12 round |
| CSRF Korumasi | NextAuth dahili |
| XSS Korunma | `X-XSS-Protection: 1; mode=block` header |
| Clickjacking | `X-Frame-Options: DENY` header |
| MIME Sniffing | `X-Content-Type-Options: nosniff` header |
| Referrer Policy | `strict-origin-when-cross-origin` |
| Permissions Policy | `camera=(), microphone=(), geolocation=()` |
| Spam Korunma | Honeypot alani (iletisim formu) |
| Email Enumeration | Forgot password her zaman 200 doner |
| Token Guvenligi | 32-byte crypto random, 1 saat expiration |
| Siparis Guvenligi | trackingToken (UUID) — tahmin edilemez |

---

## 8. Database & Data Layer

### 8.1 Veritabani Bilgisi

- **DB Turu:** PostgreSQL
- **ORM:** Prisma 7.2.0
- **Adapter:** `@prisma/adapter-pg` (PrismaPg) — Edge Runtime uyumlu
- **Baglanti:** `pg` 8.16.3 ile connection pool
- **Schema dosyasi:** `prisma/schema.prisma` (603 satir)

### 8.2 Prisma Client Yapilandirmasi (`src/lib/db.ts`)

```typescript
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const db = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development"
    ? ["query", "error", "warn"]
    : ["error"],
});
// Global singleton pattern (dev hot reload icin)
```

### 8.3 Tum Modeller (Detayli)

#### User (Kullanici)

| Alan | Tip | Kisitlamalar | Aciklama |
|------|-----|-------------|----------|
| `id` | String | PK, cuid() | Benzersiz kullanici ID |
| `name` | String? | - | Kullanici adi |
| `email` | String | unique | Email adresi |
| `emailVerified` | DateTime? | - | Email dogrulama tarihi |
| `image` | String? | - | Profil gorseli URL |
| `password` | String? | - | bcrypt hashli sifre (OAuth kullanicilari icin null) |
| `phone` | String? | - | Telefon numarasi |
| `role` | UserRole | default: CUSTOMER | CUSTOMER, ADMIN, SUPER_ADMIN |
| `createdAt` | DateTime | default: now() | Olusturma tarihi |
| `updatedAt` | DateTime | @updatedAt | Guncelleme tarihi |

**Iliskiler:** accounts[], sessions[], addresses[], orders[], reviews[], cart?, wishlist[], activityLogs[]

#### Account (OAuth Hesabi)

| Alan | Tip | Kisitlamalar | Aciklama |
|------|-----|-------------|----------|
| `id` | String | PK, cuid() | ID |
| `userId` | String | FK → User | Kullanici ID |
| `type` | String | - | Hesap tipi |
| `provider` | String | - | OAuth saglayici (google) |
| `providerAccountId` | String | - | Saglayici hesap ID |
| `refresh_token` | String? | @db.Text | Yenileme token'i |
| `access_token` | String? | @db.Text | Erisim token'i |
| `expires_at` | Int? | - | Token son kullanma |
| `token_type` | String? | - | Token tipi |
| `scope` | String? | - | Yetki kapsami |
| `id_token` | String? | @db.Text | Kimlik token'i |
| `session_state` | String? | - | Oturum durumu |

**Benzersizlik:** `@@unique([provider, providerAccountId])`
**Iliskiler:** user (onDelete: Cascade)

#### Session (Oturum)

| Alan | Tip | Kisitlamalar |
|------|-----|-------------|
| `id` | String | PK, cuid() |
| `sessionToken` | String | unique |
| `userId` | String | FK → User |
| `expires` | DateTime | - |

**Iliskiler:** user (onDelete: Cascade)

#### VerificationToken (Dogrulama Token'i)

| Alan | Tip | Kisitlamalar |
|------|-----|-------------|
| `identifier` | String | - |
| `token` | String | unique |
| `expires` | DateTime | - |

**Benzersizlik:** `@@unique([identifier, token])`

#### PasswordResetToken (Sifre Sifirlama Token'i)

| Alan | Tip | Kisitlamalar |
|------|-----|-------------|
| `id` | String | PK, cuid() |
| `email` | String | @@index |
| `token` | String | unique |
| `expires` | DateTime | - |
| `createdAt` | DateTime | default: now() |

**Benzersizlik:** `@@unique([email, token])`

#### Address (Adres)

| Alan | Tip | Kisitlamalar | Aciklama |
|------|-----|-------------|----------|
| `id` | String | PK, cuid() | ID |
| `userId` | String | FK → User, @@index | Kullanici ID |
| `title` | String | - | Etiket: "Ev", "Is" |
| `firstName` | String | - | Ad |
| `lastName` | String | - | Soyad |
| `phone` | String | - | Telefon |
| `address` | String | - | Acik adres |
| `city` | String | - | Sehir |
| `district` | String | - | Ilce |
| `postalCode` | String? | - | Posta kodu |
| `country` | String | default: "Turkiye" | Ulke |
| `isDefault` | Boolean | default: false | Varsayilan adres mi |
| `createdAt` | DateTime | default: now() | - |
| `updatedAt` | DateTime | @updatedAt | - |

**Iliskiler:** user (onDelete: Cascade), shippingOrders[], billingOrders[]

#### Product (Urun)

| Alan | Tip | Kisitlamalar | Aciklama |
|------|-----|-------------|----------|
| `id` | String | PK, cuid() | Urun ID |
| `name` | String | - | Urun adi |
| `slug` | String | unique, @@index | URL slug |
| `description` | String | @db.Text | Detayli aciklama |
| `shortDescription` | String? | - | Kisa aciklama |
| `basePrice` | Decimal | @db.Decimal(10,2) | Taban fiyat |
| `compareAtPrice` | Decimal? | @db.Decimal(10,2) | Karsilastirma fiyati (indirim oncesi) |
| `costPrice` | Decimal? | @db.Decimal(10,2) | Maliyet fiyati (dahili) |
| `sku` | String? | unique | Ana stok birimi kodu |
| `material` | String? | - | Malzeme (orn: "Hakiki Dana Derisi") |
| `heelHeight` | String? | - | Topuk yuksekligi (orn: "Duz", "5-6 cm") |
| `soleType` | String? | - | Taban tipi (orn: "Kosele", "Kaucuk") |
| `madeIn` | String? | default: "Turkiye" | Uretim yeri |
| `careInstructions` | String? | @db.Text | Bakim talimatlari |
| `metaTitle` | String? | - | SEO baslik |
| `metaDescription` | String? | - | SEO aciklama |
| `status` | ProductStatus | default: DRAFT | DRAFT, ACTIVE, ARCHIVED |
| `isFeatured` | Boolean | default: false, @@index | One cikan mi |
| `isBestSeller` | Boolean | default: false, @@index | Cok satan mi |
| `categoryId` | String | FK → Category, @@index | Kategori ID |
| `gender` | Gender? | @@index | ERKEK, KADIN, UNISEX |
| `viewCount` | Int | default: 0 | Goruntulenme sayisi |
| `soldCount` | Int | default: 0 | Satilan adet |
| `createdAt` | DateTime | default: now() | Olusturma tarihi |
| `updatedAt` | DateTime | @updatedAt | Guncelleme tarihi |
| `publishedAt` | DateTime? | - | Yayinlanma tarihi |

**Iliskiler:** category, variants[], images[], reviews[], cartItems[], orderItems[], wishlistItems[]

**Not:** `isNew` alani ve `collections` iliskisi Tur 3 refactorda silindi (migration: `remove_isNew_and_collections`).

#### ProductVariant (Urun Varyanti)

| Alan | Tip | Kisitlamalar | Aciklama |
|------|-----|-------------|----------|
| `id` | String | PK, cuid() | Varyant ID |
| `productId` | String | FK → Product, @@index | Urun ID |
| `size` | String | - | Beden (orn: "36", "37", "38"...) |
| `color` | String? | - | Renk adi (orn: "Taba", "Siyah") |
| `colorHex` | String? | - | Renk hex kodu (orn: "#C17E61") |
| `sku` | String | unique | Varyant SKU (orn: "HS-W-AEG-001-TAB-38") |
| `price` | Decimal? | @db.Decimal(10,2) | Fiyat override (basePrice'den farkliysa) |
| `stock` | Int | default: 0, @@index | Stok adedi |
| `createdAt` | DateTime | default: now() | - |
| `updatedAt` | DateTime | @updatedAt | - |

**Benzersizlik:** `@@unique([productId, size, color])`
**Iliskiler:** product (onDelete: Cascade), cartItems[], orderItems[]

#### ProductImage (Urun Gorseli)

| Alan | Tip | Kisitlamalar | Aciklama |
|------|-----|-------------|----------|
| `id` | String | PK, cuid() | ID |
| `productId` | String | FK → Product, @@index | Urun ID |
| `url` | String | - | Gorsel URL |
| `publicId` | String? | - | Cloudinary public ID |
| `alt` | String? | - | Alternatif metin |
| `color` | String? | @@index | Iliskili varyant rengi |
| `position` | Int | default: 0 | Gosterim sirasi |
| `isPrimary` | Boolean | default: false | Birincil gorsel mi |
| `createdAt` | DateTime | default: now() | - |

**Iliskiler:** product (onDelete: Cascade)

#### Category (Kategori)

| Alan | Tip | Kisitlamalar | Aciklama |
|------|-----|-------------|----------|
| `id` | String | PK, cuid() | ID |
| `name` | String | - | Kategori adi (orn: "Bodrum Sandalet") |
| `slug` | String | @@index | URL slug |
| `description` | String? | @db.Text | Aciklama |
| `image` | String? | - | Kategori gorsel URL |
| `parentId` | String? | @@index | Ust kategori ID (hiyerarsi) |
| `position` | Int | default: 0 | Siralama |
| `gender` | Gender? | @@index | Cinsiyet filtresi |
| `isActive` | Boolean | default: true | Aktif mi |
| `metaTitle` | String? | - | SEO baslik |
| `metaDescription` | String? | - | SEO aciklama |
| `createdAt` | DateTime | default: now() | - |
| `updatedAt` | DateTime | @updatedAt | - |

**Benzersizlik:** `@@unique([slug, gender])` — ayni slug farkli cinsiyetler icin var olabilir
**Iliskiler:** parent (self-reference), children (self-reference), products[]

**Not:** `Collection` ve `CollectionProduct` modelleri Tur 3 refactorda tamamen silindi (migration: `20260411000000_remove_isNew_and_collections`).

#### Cart (Sepet)

| Alan | Tip | Kisitlamalar |
|------|-----|-------------|
| `id` | String | PK, cuid() |
| `userId` | String? | unique |
| `sessionId` | String? | unique |
| `createdAt` | DateTime | default: now() |
| `updatedAt` | DateTime | @updatedAt |

**Iliskiler:** user (onDelete: Cascade), items[]

#### CartItem (Sepet Kalemi)

| Alan | Tip | Kisitlamalar |
|------|-----|-------------|
| `id` | String | PK, cuid() |
| `cartId` | String | FK → Cart, @@index |
| `productId` | String | FK → Product |
| `variantId` | String | FK → ProductVariant |
| `quantity` | Int | default: 1 |
| `createdAt` | DateTime | default: now() |
| `updatedAt` | DateTime | @updatedAt |

**Benzersizlik:** `@@unique([cartId, variantId])`
**Iliskiler:** cart (onDelete: Cascade), product (onDelete: Cascade), variant (onDelete: Cascade)

#### WishlistItem (Favori)

| Alan | Tip | Kisitlamalar |
|------|-----|-------------|
| `id` | String | PK, cuid() |
| `userId` | String | FK → User, @@index |
| `productId` | String | FK → Product |
| `createdAt` | DateTime | default: now() |

**Benzersizlik:** `@@unique([userId, productId])`
**Iliskiler:** user (onDelete: Cascade), product (onDelete: Cascade)

#### Order (Siparis)

| Alan | Tip | Kisitlamalar | Aciklama |
|------|-----|-------------|----------|
| `id` | String | PK, cuid() | ID |
| `orderNumber` | String | unique, @@index | Siparis no (orn: "HS-20250103-1234") |
| `userId` | String? | FK → User, @@index | Kullanici (guest icin null) |
| `guestEmail` | String? | - | Misafir email |
| `guestPhone` | String? | - | Misafir telefon |
| `status` | OrderStatus | default: PENDING, @@index | PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED |
| `paymentStatus` | PaymentStatus | default: PENDING | PENDING, PAID, FAILED, REFUNDED |
| `paymentMethod` | String? | - | "card" veya "cash_on_delivery" |
| `shippingAddressId` | String? | FK → Address | Teslimat adresi referansi |
| `billingAddressId` | String? | FK → Address | Fatura adresi referansi |
| `shippingName` | String | - | Teslimat adi (snapshot) |
| `shippingPhone` | String | - | Teslimat telefon (snapshot) |
| `shippingAddress` | String | @db.Text | Teslimat adres (snapshot) |
| `shippingCity` | String | - | Teslimat sehir (snapshot) |
| `shippingDistrict` | String | - | Teslimat ilce (snapshot) |
| `shippingPostalCode` | String? | - | Posta kodu (snapshot) |
| `billingName` | String? | - | Fatura adi (snapshot) |
| `billingPhone` | String? | - | Fatura telefon (snapshot) |
| `billingAddress` | String? | @db.Text | Fatura adres (snapshot) |
| `billingCity` | String? | - | Fatura sehir (snapshot) |
| `billingDistrict` | String? | - | Fatura ilce (snapshot) |
| `subtotal` | Decimal | @db.Decimal(10,2) | Ara toplam |
| `shippingCost` | Decimal | @db.Decimal(10,2), default: 0 | Kargo ucreti |
| `discount` | Decimal | @db.Decimal(10,2), default: 0 | Indirim tutari |
| `tax` | Decimal | @db.Decimal(10,2), default: 0 | KDV |
| `total` | Decimal | @db.Decimal(10,2) | Genel toplam |
| `couponId` | String? | FK → Coupon | Kupon referansi |
| `couponCode` | String? | - | Kupon kodu (denormalize) |
| `customerNote` | String? | @db.Text | Musteri notu |
| `adminNote` | String? | @db.Text | Admin notu |
| `trackingNumber` | String? | - | Kargo takip no |
| `carrier` | String? | - | Kargo firmasi |
| `trackingToken` | String? | unique, default: uuid(), @@index | Public takip token'i (tahmin edilemez) |
| `createdAt` | DateTime | default: now(), @@index | Olusturma |
| `updatedAt` | DateTime | @updatedAt | Guncelleme |
| `paidAt` | DateTime? | - | Odeme tarihi |
| `shippedAt` | DateTime? | - | Kargoya verilme tarihi |
| `deliveredAt` | DateTime? | - | Teslim tarihi |

**Iliskiler:** user, shippingAddr, billingAddr, coupon, items[], statusHistory[]

#### OrderItem (Siparis Kalemi)

| Alan | Tip | Kisitlamalar | Aciklama |
|------|-----|-------------|----------|
| `id` | String | PK, cuid() | ID |
| `orderId` | String | FK → Order, @@index | Siparis ID |
| `productId` | String | FK → Product | Urun ID |
| `variantId` | String | FK → ProductVariant | Varyant ID |
| `productName` | String | - | Urun adi (snapshot) |
| `variantSize` | String | - | Beden (snapshot) |
| `variantColor` | String? | - | Renk (snapshot) |
| `sku` | String | - | SKU (snapshot) |
| `unitPrice` | Decimal | @db.Decimal(10,2) | Birim fiyat (siparis anindaki) |
| `quantity` | Int | - | Miktar |
| `total` | Decimal | @db.Decimal(10,2) | unitPrice * quantity |

**Iliskiler:** order (onDelete: Cascade), product, variant

#### OrderStatusHistory (Siparis Durum Gecmisi)

| Alan | Tip | Kisitlamalar |
|------|-----|-------------|
| `id` | String | PK, cuid() |
| `orderId` | String | FK → Order, @@index |
| `status` | OrderStatus | - |
| `note` | String? | - |
| `createdBy` | String? | - |
| `createdAt` | DateTime | default: now() |

**Iliskiler:** order (onDelete: Cascade)

#### Coupon (Kupon)

| Alan | Tip | Kisitlamalar | Aciklama |
|------|-----|-------------|----------|
| `id` | String | PK, cuid() | ID |
| `code` | String | unique, @@index | Kupon kodu (orn: "SUMMER20") |
| `description` | String? | - | Aciklama |
| `discountType` | DiscountType | - | PERCENTAGE veya FIXED_AMOUNT |
| `discountValue` | Decimal | @db.Decimal(10,2) | Indirim degeri |
| `minOrderAmount` | Decimal? | @db.Decimal(10,2) | Minimum siparis tutari |
| `maxDiscount` | Decimal? | @db.Decimal(10,2) | Maksimum indirim tavani (yuzde icin) |
| `usageLimit` | Int? | - | Toplam kullanim limiti |
| `usageCount` | Int | default: 0 | Mevcut kullanim sayisi |
| `perUserLimit` | Int? | default: 1 | Kullanici basina limit |
| `startsAt` | DateTime? | - | Baslangic tarihi |
| `expiresAt` | DateTime? | - | Bitis tarihi |
| `isActive` | Boolean | default: true, @@index | Aktif mi |
| `createdAt` | DateTime | default: now() | - |
| `updatedAt` | DateTime | @updatedAt | - |

**Iliskiler:** orders[]

#### Review (Yorum)

| Alan | Tip | Kisitlamalar |
|------|-----|-------------|
| `id` | String | PK, cuid() |
| `productId` | String | FK → Product, @@index |
| `userId` | String | FK → User |
| `rating` | Int | - (1-5) |
| `title` | String? | - |
| `comment` | String? | @db.Text |
| `isVerified` | Boolean | default: false |
| `isApproved` | Boolean | default: false, @@index |
| `createdAt` | DateTime | default: now() |
| `updatedAt` | DateTime | @updatedAt |

**Benzersizlik:** `@@unique([productId, userId])`
**Iliskiler:** product (onDelete: Cascade), user (onDelete: Cascade)
**Not:** Model tanimli ama API endpoint'i henuz yok

#### Banner

| Alan | Tip | Kisitlamalar | Aciklama |
|------|-----|-------------|----------|
| `id` | String | PK, cuid() | ID |
| `title` | String | - | Banner basligi |
| `subtitle` | String? | - | Alt baslik |
| `imageUrl` | String | - | Desktop gorsel URL |
| `mobileImageUrl` | String? | - | Mobil gorsel URL |
| `linkUrl` | String? | - | CTA link |
| `linkText` | String? | - | CTA metin |
| `position` | String | @@index | Pozisyon: hero, category, promo |
| `sortOrder` | Int | default: 0 | Siralama |
| `startsAt` | DateTime? | - | Gosterim baslangici |
| `endsAt` | DateTime? | - | Gosterim bitisi |
| `isActive` | Boolean | default: true, @@index | Aktif mi |
| `createdAt` | DateTime | default: now() | - |
| `updatedAt` | DateTime | @updatedAt | - |

#### Page (CMS Sayfasi)

| Alan | Tip | Kisitlamalar |
|------|-----|-------------|
| `id` | String | PK, cuid() |
| `title` | String | - |
| `slug` | String | unique, @@index |
| `content` | String | @db.Text |
| `isActive` | Boolean | default: true |
| `metaTitle` | String? | - |
| `metaDescription` | String? | - |
| `createdAt` | DateTime | default: now() |
| `updatedAt` | DateTime | @updatedAt |

#### FAQ (Sikca Sorulan Sorular)

| Alan | Tip | Kisitlamalar |
|------|-----|-------------|
| `id` | String | PK, cuid() |
| `question` | String | - |
| `answer` | String | @db.Text |
| `category` | String? | @@index (shipping, returns, products, payment) |
| `sortOrder` | Int | default: 0 |
| `isActive` | Boolean | default: true, @@index |
| `createdAt` | DateTime | default: now() |
| `updatedAt` | DateTime | @updatedAt |

#### NewsletterSubscriber (Bulten Abonesi)

| Alan | Tip | Kisitlamalar |
|------|-----|-------------|
| `id` | String | PK, cuid() |
| `email` | String | unique |
| `name` | String? | - |
| `isActive` | Boolean | default: true, @@index |
| `source` | String? | - (website, checkout, popup) |
| `createdAt` | DateTime | default: now() |

#### SiteSetting (Site Ayari)

| Alan | Tip | Kisitlamalar |
|------|-----|-------------|
| `id` | String | PK, cuid() |
| `key` | String | unique |
| `value` | String | @db.Text |
| `type` | String | default: "string" (string, number, boolean, json) |
| `group` | String | default: "general", @@index (general, shipping, payment, email) |
| `updatedAt` | DateTime | @updatedAt |

#### ActivityLog (Aktivite Logu)

| Alan | Tip | Kisitlamalar | Aciklama |
|------|-----|-------------|----------|
| `id` | String | PK, cuid() | ID |
| `userId` | String | FK → User, @@index | Aksiyonu yapan kullanici |
| `action` | String | @@index | Aksiyon kodu (orn: PRODUCT_CREATE) |
| `entity` | String? | - | Varlik tipi (Product, Order) |
| `entityId` | String? | - | Varlik ID |
| `details` | String? | @db.Text | Ek detaylar |
| `ipAddress` | String? | - | Istek IP adresi |
| `userAgent` | String? | - | Tarayici bilgisi |
| `createdAt` | DateTime | default: now(), @@index | Zaman damgasi |

**Iliskiler:** user (onDelete: Cascade)

### 8.4 Enum'lar

```prisma
enum UserRole { CUSTOMER, ADMIN, SUPER_ADMIN }
enum ProductStatus { DRAFT, ACTIVE, ARCHIVED }
enum Gender { ERKEK, KADIN, UNISEX }
enum OrderStatus { PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED }
enum PaymentStatus { PENDING, PAID, FAILED, REFUNDED }
enum DiscountType { PERCENTAGE, FIXED_AMOUNT }
```

### 8.5 ER Diyagrami

```mermaid
erDiagram
    User ||--o{ Account : has
    User ||--o{ Session : has
    User ||--o{ Address : has
    User ||--o{ Order : places
    User ||--o{ Review : writes
    User ||--o| Cart : has
    User ||--o{ WishlistItem : favorites
    User ||--o{ ActivityLog : generates

    Product }o--|| Category : belongs_to
    Product ||--o{ ProductVariant : has
    Product ||--o{ ProductImage : has
    Product ||--o{ Review : reviewed_in
    Product ||--o{ CartItem : in_cart
    Product ||--o{ OrderItem : ordered_in
    Product ||--o{ WishlistItem : wishlisted

    Category ||--o{ Category : parent_child

    Cart ||--o{ CartItem : contains
    CartItem }o--|| ProductVariant : references

    Order ||--o{ OrderItem : contains
    Order ||--o{ OrderStatusHistory : tracks
    Order }o--o| Coupon : uses
    Order }o--o| Address : ships_to
    Order }o--o| Address : bills_to

    OrderItem }o--|| Product : references
    OrderItem }o--|| ProductVariant : references

    ProductVariant ||--o{ CartItem : in_cart
    ProductVariant ||--o{ OrderItem : ordered
```

### 8.6 Migrations

Migration dosyalari `prisma/migrations/` altinda tutulmaktadir. Schema degisiklikleri `npx prisma migrate dev` ile uygulanir.

### 8.7 Seed Data (`prisma/seed.ts`, 722 satir)

Seed script'i su verileri olusturur:

**1. Admin Kullanici:**
- Email: `admin@halikarnassandals.com`
- Sifre: `Admin123!` (bcrypt hashli)
- Rol: `SUPER_ADMIN`

**2. Kategoriler (5 adet):**
- Bodrum Sandalet (KADIN, slug: `bodrum-sandalet`)
- Bodrum Sandalet (ERKEK, slug: `bodrum-sandalet`)
- Bodrum Terlik (KADIN, slug: `bodrum-terlik`)
- Takunyalar (KADIN, slug: `takunyalar`)
- Bodrum Terlik (ERKEK, slug: `bodrum-terlik`)

**3. Urunler (5 adet):**

| Urun | Cinsiyet | Fiyat | Renkler |
|------|----------|-------|---------|
| Aegean Sandalet | KADIN | basePrice TRY | Taba, Siyah |
| Bodrum Classic | KADIN | basePrice TRY | Natural, Kahverengi |
| Mediterranean Thong | KADIN | basePrice TRY | Gold |
| Halikarnas Erkek | ERKEK | basePrice TRY | Taba, Siyah |
| Aegean Erkek | ERKEK | basePrice TRY | Kahverengi |

Her urun icin: 3+ Unsplash gorseli, coklu renk x beden varyantlari (rastgele 5-25 stok)

**4. FAQ'lar (6 adet):** Kargo, iade, urunler, odeme kategorilerinde

**5. CMS Sayfalari (8 adet):**
- Gizlilik Politikasi (gizlilik-politikasi)
- Kullanim Kosullari (kullanim-kosullari)
- Cerez Politikasi (cerez-politikasi)
- KVKK Aydinlatma Metni (kvkk)
- Kargo ve Teslimat (kargo-ve-teslimat)
- Iade ve Degisim (iade-ve-degisim)
- Odeme Secenekleri (odeme-secenekleri)
- Kariyer (kariyer)

**6. Site Ayarlari (7 adet):**
- `free_shipping_threshold`: "500"
- `standard_shipping_cost`: "29.90"
- `express_shipping_cost`: "49.90"
- `tax_rate`: "0.20"
- `contact_email`: "info@halikarnassandals.com"
- `contact_phone`: "+90 252 316 1234"
- `site_name`: "Halikarnas Sandals"

---

## 9. E-Ticaret Is Mantigi

### 9.1 Urun Modeli

**Hiyerarsi:** Product → ProductVariant → ProductImage

- Her urun bir kategoriye ait (`categoryId` zorunlu)
- Varyantlar beden x renk kombinasyonlarini temsil eder
- Her varyant icin ayri stok takibi
- Varyant seviyesinde fiyat override mumkun (`variant.price`)
- Urun durumu: DRAFT (taslak) → ACTIVE (aktif) → ARCHIVED (arsivlenmis)
- Ozellikler: isFeatured, isBestSeller flag'leri ile vitrin yonetimi (isNew silindi)
- Istatistikler: viewCount, soldCount alanlarinda sayim

**Fiyatlandirma:**
- `basePrice`: Ana fiyat (TRY)
- `compareAtPrice`: Eski fiyat (indirim gosterimi icin)
- `costPrice`: Maliyet fiyati (dahili kullanim)
- `variant.price`: Varyant bazli fiyat override

### 9.2 Sepet Mantigi

**Dual-layer sepet sistemi:**

1. **Client-side (Zustand + localStorage):**
   - Tum sepet islemleri once Zustand store'da yapilir
   - `halikarnas-cart` key'i ile localStorage'da persist
   - Guest ve auth kullanicilari ayni sekilde calisir
   - Miktar kontrolu: minimum 1, maksimum varyant stok adedi

2. **Server-side (Prisma Cart/CartItem):**
   - Cart modeli veritabaninda mevcut
   - `userId` (auth) veya `sessionId` (guest) ile eslestirme
   - API endpoint'leri mevcut (`/api/cart`)
   - **Not:** Cart API'de userId atamasi su an TODO — tam implementasyon bekliyor

**Sepet hesaplamalari (client-side):**
```
subtotal = sum(item.price * item.quantity)
discount = coupon uygulamasi (yuzde veya sabit tutar)
shippingCost = (subtotal - discount) >= 500 ? 0 : 49.90
total = subtotal - discount + shippingCost
```

### 9.3 Checkout Akisi (V2 — 3 Adim)

**Sepet → Checkout gecisi:** `/sepet` sayfasi silindi. Kullanici CartDrawer'dan direkt `/odeme`'ye yonlendirilir.

**V2 Checkout Tasarimi:**
- 12-kolon grid (7/5 split, desktop), card wrapper yok
- Text stepper: "Teslimat · Odeme · Onay" (numarali circle yerine)
- Aktif adimda bronz underline, tamamlananlarda inline check
- Mobile accordion siparis ozeti
- Underline form input'lari (V2Input, V2Select, V2Textarea wrapper'lari)

**Adim 1: Teslimat Bilgileri (`ShippingForm`)**
- Ad, soyad, email, telefon (5XX XXX XX XX)
- Sehir secimi (81 il — cascading dropdown)
- Ilce secimi (secilen sehrin ilceleri)
- Tam adres, posta kodu
- Zod ile dogrulama
- Outline "Devam Et" butonu

**Adim 2: Odeme Yontemi (`PaymentForm`)**
- Kapida Odeme (aktif ve calisiyor)
- Kredi karti secenegi gizli (iyzico entegrasyonu geldiginde aktif edilecek)
- Satis sozlesmesi onay checkbox'u
- KVKK onay checkbox'u
- Border-b list items (card-style radio yerine)

**Adim 3: Siparis Inceleme (`OrderReview`)**
- Border-b section'lar (3 card yerine)
- Her section'da "Duzenle" linkleri
- Native checkbox (Radix yerine)
- SSL yesil bandi silindi
- "Siparisi Tamamla" dolu siyah buton

**Siparis olusturma akisi (`POST /api/orders`):**
1. Urun stok kontrolu (her variant icin)
2. Kupon dogrulama (varsa)
3. `generateOrderNumber()` ile siparis numarasi uretimi (HS-YYYYMMDD-XXXX)
4. Transaction icinde:
   a. Order olustur (adres bilgileri snapshot olarak kaydedilir)
   b. OrderItem'lar olustur (urun/varyant bilgileri snapshot olarak)
   c. Varyant stoklarini dusur (`stock -= quantity`)
   d. Urun `soldCount` artir
   e. OrderStatusHistory ile PENDING kaydi olustur
5. Siparis onay emaili gonder (orderConfirmationEmail)
6. Response: `{orderNumber, trackingToken}`

### 9.4 Odeme Entegrasyonu

**Mevcut Durum:** Odeme gateway entegrasyonu **HENUZ YAPILMAMISTIR**

- Kredi karti secenegi V2'de gizlendi (iyzico entegrasyonu geldiginde PaymentForm'da aktif edilecek)
- Sadece "Kapida Odeme" (`cash_on_delivery`) calisiyor
- Tum siparisler `paymentStatus: PENDING` ile olusturulur
- Planlanan entegrasyon: iyzico veya PayTR
- TODO listesinde birincil oncelik olarak isaretli

### 9.5 Kargo/Shipping Hesaplama

**Kaynak:** Shipping degerleri artik DB-driven — `SiteSetting` tablosundan `GET /api/settings` ile alinir ve `ShippingConfigProvider` React Context ile component'lere dagitilir.

**Varsayilan degerler (`src/lib/constants.ts`):**
- Ucretsiz kargo esigi: 500 TRY
- Standart kargo: 29.90 TRY
- Express kargo: 49.90 TRY

**Cart store hesaplamasi:** ShippingConfigProvider context'inden alinan degerler kullanilir. CartDrawer bu context'i tuketir.

**Kargo firmalari (email template'inde tanimlanan):**
- MNG Kargo
- Yurtici Kargo
- Aras Kargo
- PTT Kargo
- UPS
- DHL

Her kargo firmasi icin takip URL'leri email template'inde dinamik olarak uretilir.

### 9.6 Siparis Durum Makinesi

```mermaid
stateDiagram-v2
    [*] --> PENDING: Siparis olusturuldu
    PENDING --> CONFIRMED: Admin onayladi
    CONFIRMED --> PROCESSING: Hazirlaniyor
    PROCESSING --> SHIPPED: Kargoya verildi
    SHIPPED --> DELIVERED: Teslim edildi
    DELIVERED --> [*]
    
    PENDING --> CANCELLED: Iptal edildi
    CONFIRMED --> CANCELLED: Iptal edildi
    PROCESSING --> CANCELLED: Iptal edildi
    
    DELIVERED --> REFUNDED: Iade edildi
    SHIPPED --> REFUNDED: Iade edildi
```

**Durum gecisleri (`PATCH /api/admin/orders/[id]`):**
- Her durum degisikliginde `OrderStatusHistory` kaydedilir
- `SHIPPED` durumunda: `shippedAt` set edilir + kargo bildirim emaili gonderilir
- `DELIVERED` durumunda: `deliveredAt` set edilir
- Takip numarasi ve kargo firmasi `SHIPPED` durumunda eklenir

### 9.7 Kupon/Indirim Sistemi

**Kupon Tipleri:**
- `PERCENTAGE`: Yuzde indirim (orn: %20)
- `FIXED_AMOUNT`: Sabit tutar indirim (orn: 50 TRY)

**Dogrulama kontrolleri (`POST /api/coupon/validate`):**
1. Kupon kodu var mi (buyuk harfe cevirilir)
2. `isActive` mi
3. `startsAt` ve `expiresAt` tarih araligi icinde mi
4. `usageLimit` asildi mi
5. `minOrderAmount` karsilaniyor mu

**Indirim hesaplama:**
```
PERCENTAGE: discount = (subtotal * discountValue / 100)
  - maxDiscount varsa: discount = min(discount, maxDiscount)
FIXED_AMOUNT: discount = discountValue
  - discount asla subtotal'i gecemez
```

**Seed kuponlari (email template'lerinde referans):**
- `HOSGELDIN`: %10 hosgeldin indirimi (kayit emailinde)
- `BULTEN10`: %10 bulten abonelik indirimi (newsletter emailinde)

### 9.8 Vergi Hesaplama (KDV)

- **KDV orani:** %20 (`TAX_RATE = 0.20` — `src/lib/constants.ts`)
- Order modeli `tax` alani mevcuttur (Decimal(10,2))
- **Not:** Mevcut checkout akisinda KDV ayri hesaplanip gosterilmiyor — fiyatlar KDV dahil olarak kabul ediliyor

### 9.9 Fatura Uretimi

**Dosya:** `src/lib/invoice-generator.ts` (187 satir)
**Kutuphane:** jsPDF + jspdf-autotable

**Icerik:**
- Sirket bilgileri baslik alani
- Fatura numarasi ve tarih
- Musteri teslimat adresi
- Urun tablosu: Ad, Renk, Beden, Miktar, Birim Fiyat, Toplam
- Alt kisim: Ara Toplam, Kargo, Indirim, KDV, Genel Toplam
- Tasarim: Aegean renkleri (#1e5f74)

**Erisim:** `GET /api/admin/orders/[id]/invoice` → `fatura-{orderNumber}.pdf` dosyasi

### 9.10 Stok Yonetimi

**Stok takibi:** Varyant bazinda (`ProductVariant.stock`)

**Stok dusurme:** Siparis olusturma sirasinda transaction icinde:
```typescript
await db.productVariant.update({
  where: { id: variantId },
  data: { stock: { decrement: quantity } }
});
```

**Stok kontrolleri:**
- Sepete ekleme: Varyant stoku kontrol edilir
- Miktar guncelleme: Stok siniri asimi engellenir
- Siparis olusturma: Tekrar stok kontrolu (race condition korunmasi)

**Admin stok yonetimi:**
- `GET /api/admin/inventory` — Stok listesi (tum/dusuk/bitmis filtresi)
- `POST /api/admin/inventory/bulk-update` — Toplu stok guncelleme (transaction ile)
- Dusuk stok uyarisi: `stock < 10` oldugunda SizeSelector'da gorsel uyari

---

## 10. Admin Paneli

### 10.1 Erisim ve Auth

- **URL:** `/admin`
- **Erisim:** `ADMIN` veya `SUPER_ADMIN` rolu gerekli
- **Koruma:** Middleware (Edge Runtime) + layout seviyesinde session kontrolu
- **Giris sayfasi:** `/giris` (standart kullanici girisi)

### 10.2 Admin Sayfalari ve Islevleri

| Sayfa | URL | Islev |
|-------|-----|-------|
| **Dashboard** | `/admin` | Genel bakis — bekleyen siparis sayisi, ozet istatistikler |
| **Urunler** | `/admin/urunler` | Urun listesi — arama, filtreleme, siralama, durum badge'leri |
| **Yeni Urun** | `/admin/urunler/yeni` | Urun olusturma — ProductForm ile kapsamli form |
| **Urun Duzenle** | `/admin/urunler/[id]` | Urun guncelleme — varyant, gorsel yonetimi |
| **Urun Import** | `/admin/urunler/import` | CSV'den toplu urun import |
| **Kategoriler** | `/admin/kategoriler` | Kategori CRUD — inline duzenleme |
| **Siparisler** | `/admin/siparisler` | Siparis listesi — durum filtresi, arama |
| **Siparis Detay** | `/admin/siparisler/[id]` | Siparis detay — durum degistirme, fatura, kargo, notlar |
| **Kullanicilar** | `/admin/kullanicilar` | Kullanici listesi — rol filtresi, arama |
| **Kullanici Detay** | `/admin/kullanicilar/[id]` | Kullanici profili — adresler, siparisler, istatistikler |
| **Kuponlar** | `/admin/kuponlar` | Kupon CRUD — kod, tip, deger, limitleri |
| **Kupon Duzenle** | `/admin/kuponlar/[id]` | Kupon guncelleme |
| **Banner'lar** | `/admin/bannerlar` | Banner CRUD — pozisyon, tarih araligi |
| **Banner Duzenle** | `/admin/bannerlar/[id]` | Banner guncelleme |
| **CMS Sayfalar** | `/admin/sayfalar` | Dinamik sayfa CRUD |
| **Sayfa Duzenle** | `/admin/sayfalar/[id]` | Sayfa icerik duzenleme |
| **Stok** | `/admin/stok` | Envanter yonetimi — dusuk/bitmis stok filtresi, toplu guncelleme |
| **Aboneler** | `/admin/aboneler` | Newsletter abone yonetimi — CSV export |
| **Aktivite** | `/admin/aktivite` | Admin aktivite loglari — aksiyon filtresi |
| **Raporlar** | `/admin/raporlar` | Satis, urun, musteri, envanter raporlari |
| **Ayarlar** | `/admin/ayarlar` | Site ayarlari — kargo, odeme, email, genel |

### 10.3 CRUD Entity'leri

| Entity | Olustur | Oku | Guncelle | Sil |
|--------|---------|-----|----------|-----|
| Product | Evet (+ varyant/gorsel) | Evet | Evet | Evet (soft/hard) |
| Category | Evet | Evet | Evet | Evet (urun kontrolu ile) |
| Order | Hayir (musteri tarafindan) | Evet | Evet (durum) | Hayir |
| User | Hayir (kayit ile) | Evet | Evet (rol) | Hayir |
| Coupon | Evet | Evet | Evet | Evet (kullanim kontrolu ile) |
| Banner | Evet | Evet | Evet | Evet |
| Page | Evet | Evet | Evet | Evet |
| SiteSetting | Evet (upsert) | Evet | Evet | Hayir |
| NewsletterSubscriber | Hayir (musteri tarafindan) | Evet | Evet (toggle) | Evet |

### 10.4 Rapor Tipleri (`GET /api/admin/reports`)

**Satis Raporu (type=sales):**
- Toplam gelir, siparis sayisi, ortalama siparis degeri
- Gelir buyumesi (onceki donem ile karsilastirma)
- Donusme orani (sabit %3.2 — analitik entegrasyonu bekliyor)
- Gunluk satis trendi
- En cok satan 10 urun (gelir bazinda)
- Durum dagilimi (siparis durumlarina gore)

**Urun Raporu (type=products):**
- En cok satan 20 urun (soldCount bazinda)
- Her urun: satilan adet, goruntulenme, yorum sayisi, stok, gelir
- Kategori dagilimi (urun ve satis sayisi)
- Toplam aktif urun sayisi

**Musteri Raporu (type=customers):**
- Yeni musteri sayisi (donem icinde)
- Toplam musteri, siparis veren, tekrar eden musteri
- Tekrar orani yuzde hesaplama
- En degerli 10 musteri (toplam harcama)

**Envanter Raporu (type=inventory):**
- Toplam urun, varyant sayisi
- Tukenmis stok, dusuk stok sayisi
- Toplam stok birimi
- Dusuk stok detaylari: SKU, urun adi, renk, beden, stok

### 10.5 Rol/Yetki Sistemi

| Islem | CUSTOMER | ADMIN | SUPER_ADMIN |
|-------|----------|-------|-------------|
| Magaza erisimi | Evet | Evet | Evet |
| Hesap yonetimi | Evet | Evet | Evet |
| Admin panel erisimi | Hayir | Evet | Evet |
| Urun/Kategori CRUD | Hayir | Evet | Evet |
| Siparis yonetimi | Hayir | Evet | Evet |
| Kupon/Banner/Sayfa yonetimi | Hayir | Evet | Evet |
| Stok yonetimi | Hayir | Evet | Evet |
| Rapor goruntuleme | Hayir | Evet | Evet |
| Kullanici rol degistirme | Hayir | Hayir | Evet |
| Kendi rolunu degistirme | Hayir | Hayir | Hayir |

### 10.6 Dosya Upload Yonetimi

**Endpoint:** `POST /api/upload`
- Sadece gorsel dosyalari kabul edilir
- Maksimum boyut: 5MB
- Hedef: Cloudinary
- Klasor yapisi: `{folder}/{gender}/{slugify(category)}`
- Dosya adi: `{sku}-{slugify(productSlug)}-{slugify(color)}-{imageIndex}`
- Otomatik optimizasyon: auto quality, auto format (WebP/AVIF)

**Admin Component'leri:**
- `ImageUpload` — Tekil gorsel yukleme
- `MultiImageUpload` — Coklu gorsel yukleme
- `StagedImageUpload` — Asamali yukleme (form gonderiminden once)
- `SortableImageGrid` — dnd-kit ile suruklenerek siralama

### 10.7 Aktivite Loglama (`src/lib/activity-logger.ts`)

**Loglanan Aksiyon Tipleri:**

| Grup | Aksiyonlar |
|------|-----------|
| Urunler | PRODUCT_CREATE, PRODUCT_UPDATE, PRODUCT_DELETE, PRODUCT_BULK_IMPORT, PRODUCT_EXPORT |
| Siparisler | ORDER_CREATE, ORDER_UPDATE, ORDER_STATUS_CHANGE, ORDER_CANCEL |
| Envanter | STOCK_UPDATE, BULK_STOCK_UPDATE |
| Kullanicilar | USER_CREATE, USER_UPDATE, USER_DELETE |
| Kategoriler | CATEGORY_CREATE, CATEGORY_UPDATE, CATEGORY_DELETE |
| Kuponlar | COUPON_CREATE, COUPON_UPDATE, COUPON_DELETE |
| Ayarlar | SETTINGS_UPDATE |
| Banner'lar | BANNER_CREATE, BANNER_UPDATE, BANNER_DELETE |
| Sayfalar | PAGE_CREATE, PAGE_UPDATE, PAGE_DELETE |
| Auth | ADMIN_LOGIN, ADMIN_LOGOUT |

---

## 11. Entegrasyonlar

### 11.1 Cloudinary (Gorsel CDN)

| Bilgi | Deger |
|-------|-------|
| **Amac** | Gorsel yukleme, depolama, optimizasyon ve CDN uzerinden dagitim |
| **Init dosyasi** | `src/lib/cloudinary.ts` (92 satir) |
| **Upload dosyasi** | `src/lib/uploadImages.ts` (87 satir) |
| **API route** | `src/app/api/upload/route.ts` |
| **Gerekli env vars** | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` |

**Optimizasyon fonksiyonlari:**
```typescript
optimizeCloudinaryUrl(url, options)  // Genel transformasyon
getThumbnailUrl(url)                  // 100x100 thumbnail
getProductImageUrl(url)               // 800x1000 urun gorseli
```

**Varsayilan ayarlar:** quality: auto:good, format: auto (WebP/AVIF otomatik)

### 11.2 Resend (Email Servisi)

| Bilgi | Deger |
|-------|-------|
| **Amac** | Transactional email gonderimi |
| **Init dosyasi** | `src/lib/email.ts` (65 satir) |
| **Template dizini** | `src/lib/email-templates/` (7 dosya) |
| **Gerekli env vars** | `RESEND_API_KEY`, `ADMIN_EMAIL` |
| **Gonderici** | `Halikarnas Sandals <info@halikarnassandals.com>` |

**Email Template'leri (6 adet):**

| Template | Dosya | Tetikleyici | Alici |
|----------|-------|-------------|-------|
| Hosgeldin | `welcome.ts` | Kullanici kaydi | Yeni kullanici |
| Siparis Onay | `order-confirmation.ts` | Siparis olusturma | Musteri |
| Kargo Bildirim | `shipping-notification.ts` | Siparis durumu SHIPPED | Musteri |
| Sifre Sifirlama | `password-reset.ts` | Sifre sifirlama istegi | Kullanici |
| Iletisim Bildirimi | `contact-notification.ts` | Iletisim formu gonderimi | Admin |
| Bulten Hosgeldin | `newsletter-welcome.ts` | Bultene abonelik | Abone |

**Development modu:** Email gonderilmez, console'a yazilir.

### 11.3 Google OAuth

| Bilgi | Deger |
|-------|-------|
| **Amac** | Google hesabi ile giris/kayit |
| **Init dosyasi** | `src/lib/auth.ts` |
| **Gerekli env vars** | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| **Provider** | NextAuth.js Google provider |
| **Callback** | `linkAccount` event'inde `emailVerified` otomatik set edilir |

### 11.4 Entegrasyon Durumu Ozeti

| Entegrasyon | Durum | Detay |
|-------------|-------|-------|
| Cloudinary | Aktif | Gorsel yukleme ve optimizasyon tam calisiyor |
| Resend | Aktif | Email gonderimi calisiyor (development'ta console) |
| Google OAuth | Yapilandirilmis | Env vars gerekli |
| Odeme (iyzico/PayTR) | Yok | Henuz entegre edilmemis |
| Kargo API | Yok | Manuel kargo takip numarasi girisi |
| Analytics | Yok | Henuz entegre edilmemis |
| Arama (Algolia/Meilisearch) | Yok | Veritabani bazli arama kullaniliyor |
| SMS | Yok | Henuz entegre edilmemis |

---

## 12. Jobs / Background Tasks / Cron

**Mevcut Durum:** Queue sistemi, scheduled job veya cron task **BULUNMAMAKTADIR**.

- Bull, BullMQ, node-cron veya benzeri kutuphane yok
- Tum islemler senkron veya async olarak request-response dongusu icinde yapilir
- Email gonderimleri API route handler'inda asenkron olarak yapilir (basarisizlik siparis olusturmayi engellemez)

**Rate limiting** (in-memory Map) teknik olarak bir background mekanizmasi gibi calisir — IP bazli istek sayisini saat bazinda tutar. Ancak sunucu yeniden basladiginda sifirlanir.

---

## 13. Testing

**Mevcut Durum:** Test framework'u **YAPILANDIRILMAMISTIR**.

- package.json'da test script'i yok
- Jest, Vitest, Playwright, Cypress veya herhangi bir test kutuphanesi bagimliliklarda yok
- Test dosyasi (`*.test.ts`, `*.spec.ts`) bulunmamaktadir
- Coverage raporu yok

---

## 14. Build & Deployment

### 14.1 Build Komutlari

```bash
# Development sunucusu
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint

# Veritabani islemleri
npm run db:generate    # npx prisma generate
npm run db:migrate     # npx prisma migrate dev
npm run db:push        # npx prisma db push
npm run db:seed        # npx tsx prisma/seed.ts
npm run db:studio      # npx prisma studio
```

### 14.2 Docker / CI/CD

- **Dockerfile:** Mevcut degil
- **docker-compose.yml:** Mevcut degil
- **.github/workflows/:** Mevcut degil
- **CI/CD pipeline:** Yapilandirilmamis

### 14.3 Deployment Hedef Ipuclari

- Next.js 14 App Router + Edge Runtime uyumlulugu → Vercel ideal hedef
- PostgreSQL bagimliligi → harici veritabani servisi gerekli (Supabase, Neon, Railway)
- Cloudinary CDN → ayri servis hesabi gerekli
- Resend email → ayri servis hesabi gerekli
- `NEXTAUTH_URL` env degiskeni → production URL'e set edilmeli
- `NEXTAUTH_SECRET` → guclu, rastgele deger olmali

**`docs/DEPLOYMENT.md` dosyasi** deployment stratejileri icin ek bilgi icermektedir.

---

## 15. Bilinen Sorunlar / TODO / FIXME

### 15.1 Kodda Bulunan TODO/FIXME/HACK Yorumlari

| Dosya | Satir | Yorum | Oncelik |
|-------|-------|-------|---------|
| `src/components/layout/SearchDialog.tsx` | 61 | `TODO: Implement actual API call` | Orta — Arama simdilik API cagrisi yapmiyot |
| `src/app/api/auth/reset-password/route.ts` | 76 | `TODO: Send password changed confirmation email` | Dusuk — Sifre degisiklik onay emaili gonderimiyor |
| `src/app/api/cart/route.ts` | 8 | `TODO: Get userId from auth session when implemented` | Yuksek — Auth session entegrasyonu cart API'de eksik |
| `src/app/api/cart/route.ts` | 98 | `TODO: Get from auth` | Yuksek — Ayni sorun, userId null |
| `src/app/api/orders/route.ts` | 296 | `TODO: Implement authenticated user order list` | Yuksek — Auth kullanici siparis listesi yok |

### 15.2 CLAUDE.md'de Belirtilen Bekleyen Gelistirmeler

| Gelistirme | Durum |
|------------|-------|
| Odeme entegrasyonu (iyzico/PayTR) | Henuz baslanmamis |
| Email gonderimi (Resend/Nodemailer) | Kismi tamamlanmis (template'ler hazir, gonderim calisiyor) |
| Gorsel yukleme (Uploadthing/Cloudinary) | Kismi tamamlanmis (Cloudinary entegre, upload API mevcut) |
| Gercek zamanli bildirimler | Henuz baslanmamis |
| PWA destegi | Henuz baslanmamis |
| Cok dil destegi (i18n) | Henuz baslanmamis |
| Gelismis analitik | Henuz baslanmamis |
| Yorum sistemi implementasyonu | Model mevcut, API/UI yok |
| Blog/Dergi bolumu | Henuz baslanmamis |

### 15.3 Bilinen Teknik Sorunlar

1. **Cart API userId null:** Auth session'dan userId alinmiyor — sepet API'si guest modu gibi calisiyor
2. **In-memory rate limiting:** Tek process icin calisir, coklu instance'da paylasilan durum yok (Redis gerekli)
3. **Conversion rate hardcoded:** Rapor API'sinde donusme orani sabit %3.2 — analitik entegrasyonu gerekli
4. **Review API yok:** Review modeli veritabaninda tanimli ama API endpoint'i veya UI'i mevcut degil
5. **SearchDialog API call:** Arama dialogu gercek API cagrisi yapmiyot (TODO)

### 15.4 V2 Migrasyonu Sonrasi Teknik Borclar

**COZULENLER (Tur 1-4'te kapandi):**
- ~~Legacy component temizligi~~ — 50+ orphan component fiziksel olarak silindi
- ~~Hakkimizda sayfasi V2~~ → `/hikayemiz` olarak yeniden tasarlandi
- ~~Koleksiyonlar V2 uyarlamasi~~ → Feature komple silindi
- ~~Sepet/Checkout V2 redesign~~ → CartDrawer V2, Checkout V2 tamamlandi
- ~~Root layout bg-luxury-cream~~ → V2 token'larina gecirildi
- ~~Shipping cost hardcoded~~ → DB-driven, ShippingConfigProvider context

**HALA ACIK:**
1. **Dynamic category pages V2 migrasyonu:** `/kadin/[category]` ve `/erkek/[category]` hala legacy CategoryPage, ProductCard, ProductGrid, FilterSidebar, SortSelect kullaniyor — V2'ye gecirilmeli
2. **Auth sayfalari V2 redesign:** Giris, kayit, sifremi-unuttum, sifre-sifirla — eski tasarimda
3. **Hesabim sayfalari V2 redesign:** Tum hesap alt sayfalari — eski tasarimda
4. **Admin paneli LEGACY:** V2 kapsam disinda — launch sonrasi refactor edilebilir
5. **Deprecated renk token'lari temizligi:** Tum sayfalar V2'ye gectikten sonra tailwind.config.ts'deki eski token'lar silinmeli
6. **Gercek urun fotografciligi:** Su an Unsplash/Cloudinary placeholder gorseller kullaniliyor — profesyonel cekimler gerekli
7. **iyzico/PayTR odeme entegrasyonu:** Hala %0 — **LAUNCH ONCESI KRITIK** (kredi karti odemesi yok, sadece Kapida Odeme)
8. **Kargo API entegrasyonu:** Su an manuel — MNG/Yurtici API entegrasyonu gerekli
9. **Test coverage:** Hala %0 — hicbir test yok
10. **CI/CD pipeline:** Hala %0 — pipeline yok
11. **Cart API userId TODO:** Auth session entegrasyonu cart API'de hala eksik — gelecek auth turu icin

---

## 16. Kod Kalitesi Gozlemleri

### 16.1 Tekrar Eden Pattern'ler

**API Route Yapisi (Tutarli):**
Tum API route'lari ayni pattern'i takip eder:
1. Auth kontrolu (`auth()` veya `getToken()`)
2. Zod ile request validation
3. Prisma ile veritabani islemleri
4. try/catch ile hata yonetimi
5. `NextResponse.json()` ile response

**Component Yapisi (Tutarli):**
- `"use client"` direktifi gerektiginde
- Import siralama: React → UI → Lib → Types
- Interface tanimlamasi
- Hook'lar → State → Effects → Handlers → Return JSX

### 16.2 Guclu Yonler

1. **TypeScript strict mode** — Tip guvenligi tum projede saglanmis
2. **Snapshot pattern** — Siparis olusturmada urun/adres bilgileri snapshot olarak kaydediliyor (veri butunlugu)
3. **Soft delete** — Sipariste kullanilan urunler arsivleniyor, hard delete edilmiyor
4. **Audit trail** — Admin islemleri ActivityLog ile kayit altinda
5. **Rate limiting** — Public endpoint'lerde temel koruma mevcut
6. **Guvenlik header'lari** — XSS, clickjacking, MIME sniffing korunmalari
7. **Email enumeration korunmasi** — Forgot password her zaman 200 donuyor
8. **Transaction kullanimi** — Siparis olusturma ve stok guncelleme atomik

### 16.3 Potansiyel Iyilestirme Alanlari

1. **Test eksikligi:** Hicbir test dosyasi yok — kritik is mantigi (sepet, siparis, stok) test edilmeli
2. **Cart API auth:** userId atamasi TODO olarak birakılmis — auth entegrasyonu tamamlanmali
3. **Validation merkezi yok:** Her route'ta inline Zod schema — paylasilabilir schema'lar cikarilabilir
4. **Rate limiting dayanikliligi:** In-memory Map yerine Redis kullanilmali (production icin)
5. **Error monitoring yok:** Sentry veya benzeri hata izleme servisi entegre edilmemis
6. **Logging yetersiz:** Sadece `console.error` kullaniliyor — structured logging (pino, winston) olabilir
7. **Image optimization:** Cloudinary URL transformasyonlari calisıyor ama Next.js Image component'i daha tutarli kullanilabilir
8. **API response tipi tutarsizligi:** Bazi endpoint'ler `{success: true}`, bazilari dogrudan veriyi donuyor

### 16.4 Tutarsizliklar

1. **Legacy vs V2 renk token'lari:** V2 sayfalari `v2-*` token kullanirken, legacy sayfalar (admin, auth, hesabim, dynamic [category]) hala `luxury-*`, `sand-*`, `aegean-*` kullaniyor. Codebase'de iki farkli tasarim dili var.
2. **Guest vs Auth cart:** Client-side Zustand store ve server-side Cart modeli arasinda tam senkronizasyon yok
3. **Shipping cost DB vs constants:** `constants.ts`'de varsayilan degerler var, ama runtime'da `ShippingConfigProvider` DB'den aliyor. Tutarsizlik riski azaldi ama constants.ts'deki degerler fallback olarak korunuyor.

### 16.5 V2 ve Legacy Koexistence Stratejisi

V2 migrasyonu asagidaki stratejiyi takip ediyor:
1. Her component icin V2 versiyonu olusturulur (ornek: `ProductCard.tsx` → `ProductCardV2.tsx`)
2. Route dosyalarinda import V2'ye cevirilir
3. Legacy dosyalar kullanimlari bittikce fiziksel olarak silinir (Tur 3'te 50+ dosya silindi)
4. Tum sayfalar V2'ye gecene kadar legacy token'lar tailwind.config'de kalir
5. Son asama: legacy dosya ve token temizligi

**Kalan riskler:**
- Legacy token'lar hala tailwind.config'de oldugu icin yanlis component'te kullanilma riski var
- V2 ve legacy sayfa arasinda geciste gorsel uyumsuzluk kullaniciya hissedilir (navbar/footer V2, ama auth/hesabim legacy)

---

## 17. Ek Olarak Dikkat Ceken Her Sey

### 17.1 Custom Hook'lar

| Hook | Dosya | Satirlar | Amac |
|------|-------|----------|------|
| `useCurrentUser` | `src/hooks/useCurrentUser.ts` | 16 | Auth session'dan user, isLoading, isAuthenticated, isAdmin doner |
| `useHydrated` | `src/hooks/useHydrated.ts` | 22 | Client hydration tamamlandi mi (localStorage erisimi icin) |
| `useToast` | `src/hooks/use-toast.ts` | 195 | Toast bildirim sistemi (max 1 goruntuleme) |
| `useInViewAnimation` | `src/hooks/use-in-view-animation.ts` | 212 | Scroll-triggered animasyonlar (once, threshold, margin, delay) |
| `useStaggeredAnimation` | `src/hooks/use-in-view-animation.ts` | (ayni dosya) | Kademe kademe animasyon (itemCount, staggerDelay) |
| `useCountAnimation` | `src/hooks/use-in-view-animation.ts` | (ayni dosya) | Sayac animasyonu (0'dan hedefe) |
| `useParallax` | `src/hooks/use-parallax.ts` | 154 | Parallax scroll efekti (rate, direction, offset) |
| `useParallaxTransform` | `src/hooks/use-parallax.ts` | (ayni dosya) | Scroll progress transformasyonu |
| `useParallaxCustom` | `src/hooks/use-parallax.ts` | (ayni dosya) | Ozel input/output araliklari |
| `useParallaxLayers3` | `src/hooks/use-parallax.ts` | (ayni dosya) | 3 katmanli parallax (farkli hizlar) |

### 17.2 Utility Fonksiyonlar (`src/lib/utils.ts`, 205 satir)

| Fonksiyon | Amac | Ornek Giris → Cikis |
|-----------|------|---------------------|
| `cn(...inputs)` | Tailwind class birlestime | `cn("base", isActive && "active")` → "base active" |
| `formatPrice(price, currency?, notation?)` | Turkce fiyat formati | `formatPrice(1299.99)` → "1.299,99 TL" |
| `formatDate(date, options?)` | Turkce tarih formati | `formatDate(new Date())` → "10 Nisan 2026" |
| `formatRelativeTime(date)` | Goreli zaman | `formatRelativeTime(2gunOnce)` → "2 gun once" |
| `slugify(text)` | Turkce-uyumlu slug | `slugify("Bodrum Sandalet")` → "bodrum-sandalet" |
| `generateOrderNumber()` | Siparis numarasi | → "HS-20260410-A3B7" |
| `truncate(text, maxLength)` | Metin kirpma | `truncate("Uzun metin...", 20)` → "Uzun metin..." |
| `calculateDiscount(original, sale)` | Indirim yuzde | `calculateDiscount(200, 150)` → 25 |
| `isPast(date)` | Tarih gecti mi | `isPast(dun)` → true |
| `isFuture(date)` | Tarih gelecekte mi | `isFuture(yarin)` → true |
| `wait(ms)` | Bekleme | `await wait(1000)` — 1 saniye bekle |
| `getInitials(name)` | Ad baslangic | `getInitials("Kemal Ataturk")` → "KA" |
| `isValidTurkishPhone(phone)` | Telefon dogrulama | `isValidTurkishPhone("5321234567")` → true |
| `formatPhone(phone)` | Telefon formati | `formatPhone("5321234567")` → "0532 123 45 67" |
| `absoluteUrl(path)` | Tam URL | `absoluteUrl("/urun/sandalet")` → "https://site.com/urun/sandalet" |
| `getProductUrl(product)` | Urun URL'i | → `/kadin/bodrum-sandalet/HS-W-AEG-001` |

### 17.3 Turkiye Konum Verileri (`src/lib/turkey-locations.ts`, 1278 satir)

- Turkiye'nin 81 ilinin tam listesi (plaka kodlari ile)
- Her il icin ilce listesi
- `getCitiesSorted()` — Alfabetik siralanmis sehirler
- `getDistrictsSorted(cityId)` — Secilen sehrin ilceleri
- Checkout formunda cascading dropdown olarak kullanilir

### 17.4 PDF Fatura Uretimi (`src/lib/invoice-generator.ts`, 187 satir)

- jsPDF + jspdf-autotable kullanilarak sunucu tarafinda PDF uretimi
- Sirket basligi (logo yerine metin)
- Fatura numarasi ve tarih
- Musteri bilgileri
- Urun tablosu (autoTable formatinda)
- Fiyat kirilimi (ara toplam, kargo, indirim, KDV, toplam)
- ArrayBuffer olarak donuyor (client-side download icin)

### 17.5 Olagan Disi Mimari Kararlar

1. **Edge-compatible Prisma:** `@prisma/adapter-pg` ile PrismaPg kullanimi — standart Prisma yerine PostgreSQL native adapter. Bu, middleware'de ve Edge Runtime ortamlarinda veritabani erisimi saglar.

2. **Client-side sepet onceligi:** Sepet state'i oncelikli olarak client-side Zustand + localStorage'da tutuluyor. Server-side Cart modeli mevcut ama tam entegre degil. Bu, offline-first yaklasimi sagliyor ama server-client senkronizasyonu sorunlari yaratabilir.

3. **Adres snapshot pattern:** Siparisler olusturulurken teslimat/fatura adresleri dogrudan Order tablosuna kopyalaniyor (normalize edilmis Address referansi yerine). Bu, adres degisikliklerinin gecmis siparisleri etkilememesini sagliyor.

4. **Turkce URL yapisi:** Tum route'lar Turkce (orn: `/kadin`, `/erkek`, `/odeme`, `/hesabim`). Bu, SEO ve kullanici deneyimi icin tutarli bir karar.

5. **Gender-based routing:** Urunler cinsiyet bazli URL yapisi kullanir (`/kadin/[category]/[sku]`, `/erkek/[category]/[sku]`). Bu, geleneksel e-ticaret pattern'i.

6. **No public/ directory:** Statik asset'ler yerel dosya sistemi yerine tamamen Cloudinary CDN ve harici URL'ler uzerinden sunuluyor. Logo bile metin bazli.

### 17.6 Email Template Detaylari

Tum email template'leri HTML formatinda, inline CSS ile stilize edilmis:

**Ortak tasarim ogeleri:**
- Teal renk paleti (#1E5F74)
- Altin aksesuar renkleri (#C9A962)
- Responsive email layout (max-width: 600px)
- Sirket logo: "HALIKARNAS" text
- Alt bilgi: Sirket adresi, sosyal medya linkleri

**Kupon kodlari (template'lerde referans):**
- `HOSGELDIN` — Hosgeldin emailinde %10 indirim
- `BULTEN10` — Newsletter emailinde %10 indirim

**Kargo takip URL'leri (shipping-notification template):**
- MNG: `https://www.mngkargo.com.tr/gonderi-takip?code={trackingNumber}`
- Yurtici: `https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code={trackingNumber}`
- Aras: `https://www.araskargo.com.tr/gonderi-takip?code={trackingNumber}`
- PTT: `https://gonderitakip.ptt.gov.tr/Track/Verify?q={trackingNumber}`
- UPS: `https://www.ups.com/track?tracknum={trackingNumber}`
- DHL: `https://www.dhl.com/tr-tr/home/tracking.html?tracking-id={trackingNumber}`

### 17.7 Proje Istatistikleri

| Metrik | Deger |
|--------|-------|
| Toplam TypeScript/TSX dosyasi | 254 |
| React component'leri | 102 |
| V2 component (aktif) | 25+ (home: 7, shop: 9, checkout: 6, layout: 6, helper pages: 5+) |
| Legacy component (hala kullanimda) | 5 (shop: dynamic [category] route'lari icin) |
| API route dosyasi | 46 |
| HTTP handler (method) | 80+ |
| Sayfa dosyasi (page.tsx) | 49 |
| Layout dosyasi | 5 |
| Zustand store | 5 |
| Custom hook | 10 |
| Prisma modeli | 18 |
| Prisma enum | 6 |
| shadcn/ui component | 27 |
| Luxury component | 8 (16 export) |
| Email template | 6 |
| Utility fonksiyon | 15+ |
| Dokumantasyon dosyasi | 9 (docs/) + CLAUDE.md + README.md |
| Store dosyasi toplam satir | 667 |
| Hook dosyasi toplam satir | 602 |
| Schema dosyasi satir | 603 |
| Seed dosyasi satir | 722 |

### 17.8 Genel Tamamlanma Durumu

| Alan | Tamamlanma | Not |
|------|------------|-----|
| Kullanici Auth | %100 | Credentials + Google OAuth |
| Urun Katalogu | %100 | Listeleme, filtreleme, arama |
| Sepet Sistemi | %95 | Client-side tam, server sync kismen eksik |
| Checkout | %90 | V2 tamamlandi. Kapida odeme calisiyor, kart odeme bekliyor (iyzico) |
| Siparis Yonetimi | %90 | Olusturma, takip, durum yonetimi calisiyor |
| Admin Paneli | %95 | Tam CRUD, raporlar, aktivite loglari |
| Kupon Sistemi | %100 | Dogrulama, uygulama, limitleme |
| Email Bildirimleri | %90 | Template'ler hazir, gonderim calisiyor |
| Gorsel Yonetimi | %80 | Cloudinary entegre, upload calisiyor |
| Favori Listesi | %100 | API + UI + server sync |
| SEO | %90 | Metadata, JSON-LD, structured data |
| V2 Tasarim Migrasyonu | %85 | Anasayfa, listeleme (root), urun detay, cart drawer, checkout, yardimci sayfalar, hikayemiz, navbar, footer tamamlandi; auth, hesabim, dynamic [category] bekleniyor |
| **Odeme Entegrasyonu** | **%0** | **KRITIK — Henuz baslanmamis** |
| Test | %0 | Hicbir test yok |
| CI/CD | %0 | Pipeline yok |

---

---

## 18. V2 Tasarim Sistemine Gecis Durumu

> V2 tasarim sistemi, luks moda markalarini referans alarak (Khaite, The Row, Hereu, Manu Atelier) minimal, editorial bir estetik olusturmayi hedefler. Migrasyon tur tur yapilmaktadir.

### 18.1 Sayfa Gecis Durumu

| Sayfa / Bilesen | Durum | Notlar |
|-------|-------|--------|
| Anasayfa (`/`) | **V2 TAMAMLANDI** | HeroV2, EditorialCategoryBlock, SecimProductGrid (4-urun esit grid), FullBleedEditorial, BrandStoryTeaser |
| `/kadin` (root) | **V2 TAMAMLANDI** | CategoryPageV2, ProductCardV2, ProductGridV2, FilterToolbarV2 |
| `/erkek` (root) | **V2 TAMAMLANDI** | CategoryPageV2, ProductCardV2, ProductGridV2, FilterToolbarV2 |
| `/kadin/[category]` | LEGACY | V2 migrasyonu bekleniyor — CategoryPage, ProductCard, ProductGrid, FilterSidebar, SortSelect |
| `/erkek/[category]` | LEGACY | V2 migrasyonu bekleniyor — ayni legacy component'ler |
| Urun Detay (`/*/[category]/[sku]`) | **V2 TAMAMLANDI** | ProductDetailV2, ImageGalleryV2, ColorSelectorV2 (kare swatch), SizeSelectorV2 (outline), MobileAddToCartBarV2 |
| `/sss` | **V2 TAMAMLANDI** | Merkez hizali tek kolon, minimal form |
| `/iletisim` | **V2 TAMAMLANDI** | Merkez hizali tek kolon, minimal form |
| `/siparis-takip` | **V2 TAMAMLANDI** | Merkez hizali tek kolon, minimal form |
| `/beden-rehberi` | **V2 TAMAMLANDI** | Merkez hizali tek kolon, tablo |
| `/hikayemiz` (eski `/hakkimizda`) | **V2 YENI TASARIM** | 3 section: Tez, Zanaat, CTA |
| Navbar (default) | **V2 TAMAMLANDI** | Cinematic variant silindi |
| Footer | **V2 TAMAMLANDI** | bg-v2-bg-dark (#2A2A26), section label'lari text-white/50 |
| MobileMenu | **V2 TAMAMLANDI** | Full-screen overlay, serif linkler |
| CartDrawer | **V2 TAMAMLANDI** | ShippingConfigProvider context kullanir |
| **Checkout (`/odeme`)** | **V2 TAMAMLANDI** | Text stepper, underline form, no cards, mobile accordion summary |
| `/sepet` | **SILINDI** | Drawer kullaniliyor |
| `/koleksiyonlar`, `/yeni-gelenler`, `/hakkimizda` | **SILINDI** | Feature'lar komple kaldirildi |
| Auth (giris, kayit, sifremi-unuttum, sifre-sifirla) | LEGACY | V2 migrasyonu bekleniyor |
| Hesabim/* (siparislerim, adreslerim, favorilerim, bilgilerim, sifre-degistir) | LEGACY | V2 migrasyonu bekleniyor |
| Admin Paneli | LEGACY | V2 kapsam disinda — launch sonrasi refactor edilebilir |

### 18.2 Component Ciftleri (Eski / Yeni)

| Legacy Component | V2 Component | Durum |
|-----------------|-------------|-------|
| `ProductCard.tsx` | `ProductCardV2.tsx` | V2 aktif, legacy hala [category] route'larinda kullaniliyor |
| `ProductGrid.tsx` | `ProductGridV2.tsx` | V2 aktif, legacy hala [category] route'larinda kullaniliyor |
| `CategoryPage.tsx` | `CategoryPageV2.tsx` | V2 root'ta aktif, legacy [category] route'larinda |
| `FilterSidebar.tsx` | `FilterToolbarV2.tsx` | V2 aktif, legacy [category] route'larinda |
| `SortSelect.tsx` | (FilterToolbarV2'ye dahil) | Legacy [category] route'larinda |

**Silinen legacy component'ler (artik codebase'de yok):**
HeroSection, FeaturedProducts, FeaturedProductsCarousel, NewArrivals, NewArrivalsCarousel, CategoryCards, FeaturedCollection, FeaturedCategories, BestSellers, CraftsmanshipMini, BrandPromise, BrandStory, Features, Newsletter, ProductDetail, ImageGallery, ColorSelector, SizeSelector, MobileAddToCartBar, CinematicScroll, ScrollProgress, IntroFrame, CollectionFrame, OutroFrame, CartPage, CartItem, CartSummary, CouponInput, EmptyCart

### 18.3 Urun Detay V2 — Kaldirilan Ogeler

Urun detay sayfasi V2 migrasyonunda su ogeler kaldirildi:
- Breadcrumb navigasyonu
- Collection label ("Test Collection" gibi ust etiketler)
- Rating/yildiz gosterimi
- Trust bar (500TL kargo / 15 gun iade / guvenli odeme 3'lu ikon bari)
- Paylas butonu
- Tab navigation (Urun Detaylari / Kargo & Iade / Degerlendirmeler → ardisik section'lar)
- Quantity selector (+/- butonlari → her zaman qty=1, sepette degistirilebilir)
- "Ilk Degerlendirmeyi Yap" butonu
- Galeri badge'leri (Yeni, %indirim, Cok Satan)
- Galeri ok butonlari (← →)
- Hover zoom (ana gorselde zoom efekti)

### 18.4 Checkout V2 Detay

**Son refactor turunda (Tur 4) uygulanan degisiklikler:**

| Component | Eski | V2 |
|-----------|------|-----|
| `CheckoutSteps` | Numarali altin circle progress | Text stepper ("Teslimat · Odeme · Onay"), aktif adimda bronz underline, tamamlananlarda inline check |
| `CheckoutPage` | Card wrapper, HALIKARNAS header + trust footer | Grid 12-col (7/5 split), card wrapper yok, header/footer silindi |
| `CheckoutSummary` | Card wrapper, yesil renkler, guvenlik badge | Card yok, mobile accordion, yesil → bronz accent, badge silindi |
| `PaymentForm` | Card-style radio, MagneticButton | Border-b list items, kredi karti gizlendi (iyzico geldiginde), outline/underline butonlar |
| `ShippingForm` | LuxuryInput/Select/Textarea | V2Input/V2Select/V2Textarea underline wrappers (forwardRef korundu), altin asterisk → bronz |
| `OrderReview` | 3 card, Radix Checkbox, SSL yesil bandi | Border-b section'lar + "Duzenle" linkleri, native checkbox, SSL silindi, final buton dolu siyah |

### 18.5 Sonraki Turlarda Beklenenler

1. Dynamic category pages V2 migrasyonu (`/kadin/[category]`, `/erkek/[category]`)
2. Auth sayfalari (giris, kayit, sifremi-unuttum, sifre-sifirla) V2 redesign
3. Hesabim sayfalari V2 redesign
4. Deprecated renk token'larinin tailwind.config.ts'den kaldirilmasi
5. Kalan legacy shop component temizligi (5 dosya — dynamic [category] V2'ye gectikten sonra)

### 18.6 V2 Tasarim Prensipleri

- Minimal, editorial estetik (referans: Khaite, The Row, Hereu, Manu Atelier)
- Sicak, notr palet (krem + taupe + bronz)
- Serif tipografi (Cormorant light) + temiz sans-serif (Inter)
- Kisitli animasyonlar — `prefers-reduced-motion` destegi
- Sharp edge'ler (`rounded-none`) — yuvarlatilmis koseler yok
- Hover efektleri: opacity veya scale 1.02 (800ms ease-out)
- Sayfada en fazla 1 CTA butonu (sepete ekle), geri kalan link stili
- Tab navigation yerine ardisik section'lar
- Trust bar, share butonu, badge'ler gibi e-ticaret kliselerinden kacinma
- Tum metin Turkce, ozel karakter destegi

---

---

## 19. Son Refactor Ozeti (Nisan 2026)

Bu rapor guncellemesi dort buyuk refactor turunu kapsar:

**Tur 1 — V2 Design System Pass (commit 4e9c77e)**
- 51 dosya degisti, 450 ekleme, 3614 silme
- Home/Listing/PDP/Cart Drawer V2'ye gecti
- /sepet sayfasi silindi, shipping cost DB-driven oldu
- Root layout ve footer V2 token'lari uygulandi

**Tur 2 — Hotfix (commit 0bfdd51 + f7a286d)**
- Atolyeden grid layout duzeltildi (final: 4-urun esit grid)
- Listeleme gap'leri buyutuldu
- Cart toast bug'i cozuldu
- Brand story image duzeltildi

**Tur 3 — Feature Removal + Helper Pages + Hikayemiz (commit 50d9130)**
- Yeni Gelenler ve Koleksiyonlar feature'lari komple silindi (~25 dosya)
- Prisma schema'dan Collection, CollectionProduct, isNew kaldirildi (migration: `20260411000000_remove_isNew_and_collections`)
- SSS, Siparis Takip, Beden Rehberi, Iletisim V2'ye gecti
- Hakkimizda → Hikayemiz route tasimasi + komple redesign (3 section: Tez, Zanaat, CTA)
- NavbarCinematic variant silindi
- 50+ legacy component fiziksel olarak silindi (home: 14, shop: 9+, cart: 5, cinematic: 5+)
- Admin panel'den koleksiyonlar link/sayfa/API kaldirildi
- Urun formundan koleksiyon dropdown + isNew checkbox silindi

**Tur 4 — Checkout V2 (commit 6086c43)**
- 6 dosya refactor (CheckoutSteps, CheckoutPage, CheckoutSummary, PaymentForm, ShippingForm, OrderReview)
- Numarali circle progress → text stepper
- Card wrapper'lar kaldirildi (form + summary + 3 onay card'i)
- Underline form input'lari (V2Input, V2Select, V2Textarea wrapper'lari forwardRef korunarak)
- Yesil SSL bandi, trust bar, guvenlik badge'leri kaldirildi
- Kredi karti secenegi gizlendi (iyzico geldiginde aktif edilecek)
- Mobile accordion siparis ozeti

**Toplam etki:** 150+ dosya degisti/silindi, codebase'de 50+ legacy component fiziksel olarak kaldirildi, 1 Prisma migration uygulandi. V2 tasarim sistemi anasayfa, listeleme, urun detay, cart, checkout, yardimci sayfalar ve hikayemiz icin tamamlandi. Kalan legacy alanlar: auth, hesabim, admin paneli, dynamic category route'lari.

**Launch oncesi kritik path:** iyzico entegrasyonu (kredi karti odeme). Diger legacy alanlar (auth, hesabim, admin) islevsel ama V2 disinda — launch sonrasi refactor edilebilir.

---

*Bu rapor, Halikarnas Sandals codebase'inin kapsamli bir analizini icermektedir. 254 dosya incelenmis, tum modeller, API endpoint'leri, componentler, state yonetimi, is mantigi ve konfigurasyonlar detayli olarak belgelenmistir. Son guncelleme: 2026-04-11, V2 tasarim sistemi migrasyonu (4 tur tamamlandi).*

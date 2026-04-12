# Halikarnas Sandals — Typography Audit

**Generated:** 2026-04-12
**Scope:** `src/**/*.{tsx,css}` + `tailwind.config.ts`
**Files scanned with font-\* classes:** 58
**Total occurrences of font-\* utilities:** 347

This is a read-only inventory. Nothing has been edited.

---

## 1. Font Sources

### 1.1 next/font loader — `src/app/layout.tsx`

Four font families are loaded via `next/font/google` and exposed as CSS variables attached to `<body>`:

| Family | Weights loaded | Styles | CSS variable | Subsets |
|---|---|---|---|---|
| **Inter** | 400, 500 | normal | `--font-inter` | latin, latin-ext |
| **DM Sans** | 400, 500, 600, 700 | normal | `--font-dm-sans` | latin, latin-ext |
| **Cormorant Garamond** | 300, 400, 600 | normal + italic | `--font-cormorant` | latin, latin-ext |
| **Cinzel** | 400, 500, 600, 700 | normal | `--font-cinzel` | latin, latin-ext |

All use `display: "swap"`. The `<body>` element gets `${inter.variable} ${dmSans.variable} ${cormorant.variable} ${cinzel.variable} font-body antialiased bg-v2-bg-primary`.

> ⚠️ `font-body` on `<body>` means **DM Sans is the document-wide default** for any element without an explicit `font-*` utility.

### 1.2 Tailwind `fontFamily` tokens — `tailwind.config.ts` (lines 153–166)

| Tailwind class | Resolves to | Status |
|---|---|---|
| `font-inter` | Inter | V2 — primary UI font |
| `font-serif` | Cormorant Garamond | V2 — display/heading |
| `font-sans` | DM Sans | Legacy — body alias |
| `font-display` | Cinzel | **@deprecated in config** — mapped but referenced nowhere |
| `font-heading` | Cormorant Garamond | Legacy alias for `font-serif` |
| `font-body` | DM Sans | Legacy alias for `font-sans` |
| `font-accent` | Cinzel | **@deprecated in config** — still used in auth/admin/InstagramFeed |

No `font-cormorant` or `font-cinzel` classes are defined — they won't compile to CSS.

### 1.3 globals.css base rules — `src/app/globals.css`

Three cascade rules silently set fonts on every document:

```css
/* line 95–97 */
body {
  @apply bg-luxury-cream text-luxury-charcoal font-body;
  /* → DM Sans default everywhere */
}

/* line 99–106 — ⚠️ AFFECTS EVERY h1-h6 */
h1, h2, h3, h4, h5, h6 {
  @apply font-serif font-normal text-luxury-primary;
  /* → Cormorant + #1e3a3a legacy color */
}

/* line 289–291 — legacy .price class */
.price {
  @apply font-heading font-semibold;
  /* → Cormorant 600 */
}
```

**The h1–h6 base rule is load-bearing and invisible.** Any heading in a V2 context that does *not* explicitly say `font-inter` inherits Cormorant **and** `text-luxury-primary` (the dark petrol from the legacy palette, not `text-v2-text-primary`).

No `@font-face` blocks — all font delivery is via next/font.

---

## 2. Usage Map

Classification legend:
- **V2** = `font-inter` or `font-serif` with V2 color tokens
- **Legacy** = `font-accent`/`font-display`/`font-heading`, or V2 class with `text-luxury-*` / `text-stone-*` / `text-leather-*` colors
- **Inherited** = no explicit font class, picks up `font-body` (DM Sans) or base h# rule

### 2.1 Layout & Chrome

| File | Element | Class | Render | Status |
|---|---|---|---|---|
| `layout/Navbar.tsx:76` | Wordmark `HALIKARNAS` | `font-serif font-medium tracking-[0.25em] text-lg` | Cormorant 500 | V2 |
| `layout/Navbar.tsx:93` | Nav links (Kadın/Erkek/Hikayemiz) | `font-inter text-xs tracking-[0.15em] uppercase` | Inter 400 | V2 |
| `layout/Footer.tsx:85` | Wordmark `HALIKARNAS` | `font-serif font-normal tracking-[0.25em] text-lg` | Cormorant 400 | V2 — **weight differs from Navbar (normal vs medium)** |
| `layout/Footer.tsx:40` | Newsletter h3 | `font-serif font-light text-xl md:text-2xl text-white` | Cormorant 300 | V2 |
| `layout/Footer.tsx:45,59,64,89,97...` | Body links, labels, copy | `font-inter text-sm/xs text-white/*` (×21) | Inter 400 | V2 |
| `layout/Footer.tsx:155,174,198` | Column headings | `font-inter font-medium text-xs tracking-[0.2em] uppercase` | Inter 500 | V2 |
| `layout/MobileMenu.tsx:89` | Large nav labels (Kadın/Erkek) | `font-serif font-light text-4xl md:text-5xl` | Cormorant 300 | V2 |
| `layout/MobileMenu.tsx:108,119` | Secondary action labels | `font-inter text-sm text-v2-text-muted` | Inter 400 | V2 |
| `layout/CartDrawer.tsx:138` | Sheet title `Sepetim` | `font-serif text-xl text-v2-text-primary` | Cormorant 400 | V2 — **no `font-light`** |
| `layout/CartDrawer.tsx:234` | Empty state heading | `font-serif text-lg text-v2-text-primary` | Cormorant 400 | V2 — no `font-light` |
| `layout/CartDrawer.tsx:142,151,219,240` | Item counts, remove, CTA | `font-inter text-xs/sm` | Inter | V2 |

### 2.2 Home Page

| File | Element | Class | Render | Status |
|---|---|---|---|---|
| `home/HeroV2.tsx:55` | `h1` hero headline | `font-serif font-light text-[2.5rem] md:text-[4rem] lg:text-[5.5rem]` | Cormorant 300 | V2 |
| `home/HeroV2.tsx:61` | Lead paragraph | `font-inter text-v2-body text-v2-text-muted` | Inter 400 | V2 |
| `home/HeroV2.tsx:68` | CTA `Koleksiyonu Gör` | `font-inter text-xs tracking-[0.15em] uppercase` | Inter 400 | V2 |
| `home/EditorialCategoryBlock.tsx:46` | Overlay heading `Farklı Yollar...` | `font-serif font-light text-2xl md:text-3xl lg:text-4xl` | Cormorant 300 | V2 |
| `home/EditorialCategoryBlock.tsx:20,39` | Category labels | `font-inter text-v2-label uppercase` | Inter 400 | V2 |
| `home/SecimProductGridClient.tsx:30` | Section heading `Atölyeden` | `font-serif font-light text-v2-section-sm md:text-v2-section` | Cormorant 300 | V2 |
| `home/SecimProductGridClient.tsx:35` | `Tümünü Gör →` link | `font-inter text-xs tracking-[0.15em] uppercase` | Inter 400 | V2 |
| `home/SecimProductGridClient.tsx:83` | Card product name h3 | `font-inter font-normal text-[15px] lg:text-base` | Inter 400 | V2 (recently fixed) |
| `home/SecimProductGridClient.tsx:87,92` | Card price + compare | `font-inter text-sm text-v2-text-muted` | Inter 400 | V2 |
| `home/FullBleedEditorial.tsx:15` | Overlay quote | `font-serif italic font-light text-3xl md:text-5xl lg:text-6xl text-white/90` | Cormorant 300 italic | V2 |
| `home/BrandStoryTeaser.tsx:10` | Eyebrow label | `font-inter text-v2-label uppercase text-v2-accent` | Inter 400 | V2 |
| `home/BrandStoryTeaser.tsx:15` | h2 brand story title | `font-serif font-light text-2xl md:text-3xl` | Cormorant 300 | V2 |
| `home/BrandStoryTeaser.tsx:20` | Body prose | `font-inter text-v2-body text-v2-text-muted` | Inter 400 | V2 |
| `home/InstagramFeed.tsx:30` | h2 heading | **`font-accent text-3xl md:text-4xl text-leather-900`** | **Cinzel 400** | **Legacy — breaks V2 palette** |

### 2.3 Shop (Category & Product)

| File | Element | Class | Render | Status |
|---|---|---|---|---|
| `shop/CategoryPageV2.tsx:209` | Category h1 | `font-serif font-light text-4xl md:text-5xl lg:text-[4rem]` | Cormorant 300 | V2 |
| `shop/CategoryPageV2.tsx:213` | Category description | `font-inter text-v2-body text-v2-text-muted` | Inter 400 | V2 |
| `shop/CategoryPageV2.tsx:228,257,270,287` | Tabs, pills, chips, CTAs | `font-inter text-xs/sm` | Inter 400 | V2 |
| `shop/ProductCardV2.tsx:110` | Card product name h3 | `font-inter font-normal text-[15px] lg:text-base` | Inter 400 | V2 (recently fixed) |
| `shop/ProductCardV2.tsx:114,118` | Card price + compare | `font-inter text-sm text-v2-text-muted` / `text-xs text-v2-text-muted/70` | Inter 400 | V2 |
| `shop/ProductGridV2.tsx:18` | Empty-state copy | `font-inter text-v2-text-muted text-sm` | Inter 400 | V2 |
| `shop/ProductDetailV2.tsx:301` | Product detail h1 | `font-serif font-light text-3xl md:text-4xl lg:text-[2.75rem]` | Cormorant 300 | V2 |
| `shop/ProductDetailV2.tsx:307` | SKU / category label | `font-inter text-v2-label uppercase tracking-[0.2em]` | Inter 400 | V2 |
| `shop/ProductDetailV2.tsx:314` | **Price display** | `font-inter text-lg text-v2-text-primary` | Inter 400 | V2 — **primary color (bold hierarchy) — opposite of card** |
| `shop/ProductDetailV2.tsx:319` | Compare-at strikethrough | `font-inter text-sm text-v2-text-muted line-through` | Inter 400 | V2 |
| `shop/ProductDetailV2.tsx:327` | Lead description | `font-inter text-v2-body text-v2-text-muted max-w-[45ch]` | Inter 400 | V2 |
| `shop/ProductDetailV2.tsx:359` | Add-to-cart CTA | `font-inter text-sm` | Inter 400 | V2 |
| `shop/ProductDetailV2.tsx:376,393` | Size-guide link, stock note | `font-inter text-xs` | Inter 400 | V2 |
| `shop/ProductDetailV2.tsx:412,461,487` | Spec section labels | `font-inter text-v2-label uppercase tracking-[0.2em]` | Inter 400 | V2 |
| `shop/ProductDetailV2.tsx:416,426,429,436,439,446,449,464,490` | Spec values, prose | `font-inter text-sm` | Inter 400 | V2 |
| `shop/ProductDetailV2.tsx:509` | Related products h2 | `font-serif font-light text-v2-section-sm md:text-v2-section` | Cormorant 300 | V2 |
| `shop/ImageGalleryV2.tsx` | (none) | — | — | No text — N/A |
| `shop/ColorSelectorV2.tsx:28,31` | Label + selected-value | `font-inter text-v2-label` | Inter 400 | V2 |
| `shop/SizeSelectorV2.tsx:26,29,35,54,73` | Labels, size buttons, warning | `font-inter text-v2-label / text-sm` | Inter 400 | V2 |
| `shop/FilterToolbarV2.tsx:32,52,69,83` | Toolbar buttons, popovers | `font-inter text-xs` | Inter 400 | V2 |
| `shop/MobileAddToCartBarV2.tsx:25` | Sticky button | `font-inter text-sm text-white` | Inter 400 | V2 |
| `shop/CategoryPage.tsx:217` | **Legacy h1** | `font-serif text-4xl md:text-5xl lg:text-6xl text-luxury-primary tracking-wide mb-4` | Cormorant 400 | **Legacy — stale v1 file, superseded by CategoryPageV2** |
| `shop/ProductCard.tsx:225` | **Legacy h3** product name | `font-serif text-lg text-luxury-primary hover:text-luxury-gold` | Cormorant 400 | **Legacy — stale v1 file, superseded by ProductCardV2** |

### 2.4 Checkout Flow

| File | Element | Class | Render | Status |
|---|---|---|---|---|
| `checkout/CheckoutSteps.tsx:24` | Step labels | `font-inter font-medium text-xs tracking-[0.15em] uppercase` | Inter 500 | V2 |
| `checkout/ShippingForm.tsx:122` | Step h2 | `font-serif font-light text-2xl md:text-3xl text-v2-text-primary` | Cormorant 300 | V2 |
| `checkout/PaymentForm.tsx:32` | Step h2 | `font-serif font-light text-2xl md:text-3xl text-v2-text-primary` | Cormorant 300 | V2 |
| `checkout/OrderReview.tsx:105` | Step h2 | `font-serif font-light text-2xl md:text-3xl text-v2-text-primary` | Cormorant 300 | V2 |
| `checkout/OrderReview.tsx:113,146,166` | Section labels | `font-inter text-xs uppercase tracking-[0.15em] text-v2-text-muted` | Inter 400 | V2 |
| `checkout/CheckoutSummary.tsx:96` | Section title | `font-serif text-xl text-v2-text-primary` | Cormorant 400 | V2 — **no `font-light`** |
| `checkout/CheckoutSummary.tsx:112` | Grand-total value | `font-serif font-light text-lg text-v2-text-primary` | Cormorant 300 | V2 — **serif on a number** |
| `checkout/CheckoutSummary.tsx:139` | Coupon heading | `font-serif font-light text-2xl text-v2-text-primary` | Cormorant 300 | V2 |

### 2.5 Account / Hesabım

| File | Element | Class | Render | Status |
|---|---|---|---|---|
| `account/AccountSidebar.tsx:69,83,106` | Sidebar nav links | `font-inter text-sm text-v2-text-muted` | Inter 400 | V2 |
| `account/AccountSidebar.tsx:115` | Sheet title | `font-serif font-light text-2xl text-v2-text-primary` | Cormorant 300 | V2 |
| `account/ProfileForm.tsx:89,98,120` | Labels, helper, submit | `font-inter text-xs/sm` | Inter 400 | V2 |
| `account/AddressForm.tsx:168` | Dialog title | `font-serif font-light text-2xl text-v2-text-primary` | Cormorant 300 | V2 |
| `account/AddressForm.tsx:283,295,302` | Checkbox label, cancel, submit | `font-inter text-sm/xs` | Inter 400 | V2 |
| `account/PasswordChangeForm.tsx:141,184` | Strength meter, submit | `font-inter text-xs` | Inter 400 | V2 |
| `account/DeleteAccountDialog.tsx:74,80,83,92,106,119,125` | Trigger, title, labels, actions | mix of `font-serif font-light` (title) and `font-inter` (others) | Cormorant 300 / Inter 400 | V2 |
| `app/(shop)/hesabim/page.tsx:65` | Dashboard h1 | `font-serif font-light text-3xl md:text-4xl text-v2-text-primary` | Cormorant 300 | V2 |
| `app/(shop)/hesabim/page.tsx:76,99,108,120,126,132,144,150,176,181` | Section labels + body (×14) | `font-inter text-xs/sm` | Inter 400 | V2 |
| `app/(shop)/hesabim/siparislerim/page.tsx:39` | h1 | `font-serif font-light text-3xl md:text-4xl text-v2-text-primary` | Cormorant 300 | V2 |
| `app/(shop)/hesabim/siparislerim/page.tsx:43,64,67,74,77,80,90,95` | Labels, order meta | `font-inter text-xs/sm` | Inter 400 | V2 |
| `app/(shop)/hesabim/siparislerim/[id]/page.tsx:78` | Order detail h1 | `font-serif font-light text-3xl md:text-4xl text-v2-text-primary` | Cormorant 300 | V2 |
| `app/(shop)/hesabim/siparislerim/[id]/page.tsx:74,82,85,93...240` (×22) | Section labels, item info, totals | `font-inter text-xs/sm` | Inter 400 | V2 |
| `app/(shop)/hesabim/favorilerim/page.tsx:79` | Favorites h1 | `font-serif font-light text-3xl md:text-4xl text-v2-text-primary` | Cormorant 300 | V2 |
| `app/(shop)/hesabim/favorilerim/page.tsx:117` | **Favorites card product name** | **`font-serif text-sm text-v2-text-muted`** | **Cormorant 400 muted** | **⚠️ Inconsistent** — ProductCardV2 uses Inter primary |
| `app/(shop)/hesabim/favorilerim/page.tsx:121` | Favorites card price | `font-inter text-sm text-v2-text-primary` | Inter 400 | **⚠️ Inconsistent** — ProductCardV2 uses text-v2-text-muted |
| `app/(shop)/hesabim/favorilerim/page.tsx:125,131,141,146` | Compare/stock/empty | `font-inter text-xs/sm` | Inter 400 | V2 |
| `app/(shop)/hesabim/adreslerim/page.tsx:100` | h1 | `font-serif font-light text-3xl md:text-4xl text-v2-text-primary` | Cormorant 300 | V2 |
| `app/(shop)/hesabim/adreslerim/page.tsx:103,110,128,132,135,138,141,148,155,162,173,178` (×12) | Body, labels, CTAs | `font-inter text-xs/sm` | Inter 400 | V2 |
| `app/(shop)/hesabim/bilgilerim/page.tsx:35` | h1 | `font-serif font-light text-3xl md:text-4xl text-v2-text-primary` | Cormorant 300 | V2 |
| `app/(shop)/hesabim/sifre-degistir/page.tsx:24,27,38` | h1 + helper | `font-serif font-light` / `font-inter text-sm` | Cormorant 300 / Inter 400 | V2 |

### 2.6 Static / Content Pages

| File | Element | Class | Render | Status |
|---|---|---|---|---|
| `(shop)/hikayemiz/page.tsx:16,47` | Eyebrow labels | `text-[#8B6F47] tracking-widest text-xs font-inter uppercase` | Inter 400 | V2 (but hard-coded hex for accent color) |
| `(shop)/hikayemiz/page.tsx:19` | Hero h1 | `font-serif font-light text-5xl md:text-7xl text-v2-text-primary` | Cormorant 300 | V2 |
| `(shop)/hikayemiz/page.tsx:50` | Section h2 | `font-serif font-light text-4xl md:text-5xl` | Cormorant 300 | V2 |
| `(shop)/hikayemiz/page.tsx:22,53,57,62` | Lead + body paragraphs | `font-inter text-sm/base/lg` | Inter 400 | V2 |
| `(shop)/sss/page.tsx:132` | h1 | `font-serif font-light text-4xl md:text-5xl text-v2-text-primary` | Cormorant 300 | V2 |
| `(shop)/sss/page.tsx:148` | **FAQ accordion trigger** | `font-serif text-lg hover:no-underline` | Cormorant 400 | V2 — **no `font-light`** |
| `(shop)/sss/page.tsx:151` | FAQ answer | `font-inter text-sm text-v2-text-muted leading-relaxed` | Inter 400 | V2 |
| `(shop)/iletisim/page.tsx:89` | Eyebrow | `text-[#8B6F47] tracking-widest text-xs font-inter uppercase` | Inter 400 | V2 (hard-coded hex) |
| `(shop)/iletisim/page.tsx:92` | h1 | `font-serif font-light text-4xl md:text-5xl text-v2-text-primary` | Cormorant 300 | V2 |
| `(shop)/iletisim/page.tsx:95,113,122,133,143,154,163,190,200,217,234` (×11) | Lead, labels, inputs, submit | `font-inter text-sm/xs` | Inter 400 | V2 |
| `(shop)/beden-rehberi/page.tsx:40,131` | Section h2 | `font-serif text-2xl text-v2-text-primary` | Cormorant 400 | V2 — **no `font-light`** |
| `(shop)/beden-rehberi/page.tsx:99` | h1 | `font-serif font-light text-4xl md:text-5xl text-v2-text-primary` | Cormorant 300 | V2 |
| `(shop)/beden-rehberi/page.tsx:46,49,52,55,70,73,76,79,96,102,110,114,118,122,134` (×15) | Table cells, labels | `font-inter text-xs/sm` | Inter 400 | V2 |
| `(shop)/siparis-takip/page.tsx:171,183,204,265,376,449,467` | Eyebrows, labels | `font-inter text-xs tracking-wide uppercase` | Inter 400 | V2 |
| `(shop)/siparis-takip/page.tsx:174` | h1 | `font-serif font-light text-4xl md:text-5xl text-v2-text-primary` | Cormorant 300 | V2 |
| `(shop)/siparis-takip/page.tsx:268` | Order number h2 | `font-serif text-2xl text-v2-text-primary` | Cormorant 400 | V2 — **no `font-light`** |
| `(shop)/kvkk/page.tsx:30,36,44` | Eyebrow, lead, prose container | `font-inter text-xs/sm/base` | Inter 400 | V2 |
| `(shop)/kvkk/page.tsx:33` | h1 | `font-serif font-light text-3xl md:text-4xl text-v2-text-primary` | Cormorant 300 | V2 |
| `(shop)/kvkk/page.tsx:54,81,125,167,197,246,256,297,326,342` (×10) | Section h2 | `font-serif text-xl text-v2-text-primary` | Cormorant 400 | V2 — **no `font-light`** |
| `(shop)/mesafeli-satis-sozlesmesi/page.tsx:29,35,43` | Eyebrow, lead, container | `font-inter text-xs/sm/base` | Inter 400 | V2 |
| `(shop)/mesafeli-satis-sozlesmesi/page.tsx:32` | h1 | `font-serif font-light text-3xl md:text-4xl text-v2-text-primary` | Cormorant 300 | V2 |
| `(shop)/mesafeli-satis-sozlesmesi/page.tsx:53,96,109,125,175,221,247,260,279,293,304` (×11) | Section h2 | `font-serif text-xl text-v2-text-primary` | Cormorant 400 | V2 — **no `font-light`** |
| `(shop)/mesafeli-satis-sozlesmesi/page.tsx:56,86,204` | Sub-heading h3 | `font-serif text-base text-v2-text-primary` | Cormorant 400 | V2 |
| `(shop)/cerezler/page.tsx:23,29,37` | Eyebrow, lead, container | `font-inter text-xs/sm/base` | Inter 400 | V2 |
| `(shop)/cerezler/page.tsx:26` | h1 | `font-serif font-light text-3xl md:text-4xl text-v2-text-primary` | Cormorant 300 | V2 |
| `(shop)/cerezler/page.tsx:46,56,87,97` | Section h2 | `font-serif text-xl text-v2-text-primary` | Cormorant 400 | V2 — **no `font-light`** |
| `(shop)/cerezler/page.tsx:59,69,78` | h3 | `font-serif text-base text-v2-text-primary` | Cormorant 400 | V2 |

### 2.7 Order Success & Tracking

| File | Element | Class | Render | Status |
|---|---|---|---|---|
| `(shop)/siparis-tamamlandi/[token]/page.tsx:66` | Eyebrow | `font-inter text-xs tracking-[0.2em] uppercase text-v2-accent` | Inter 400 | V2 |
| `(shop)/siparis-tamamlandi/[token]/page.tsx:69` | h1 | `font-serif font-light text-3xl md:text-4xl text-v2-text-primary mt-6` | Cormorant 300 | V2 |
| `(shop)/siparis-tamamlandi/[token]/page.tsx:73,87,97,100,114,117,124,127,134,171,174,178,189,192,226,229,241,247,254` (×18) | Body, labels, items, totals | `font-inter text-sm/xs` + **`font-serif font-light text-lg` for grand totals (lines 226, 229)** | Mixed | V2 — **totals in serif** |
| `(shop)/siparis/[token]/page.tsx:121` | **Legacy order page h1** | `font-serif text-3xl md:text-4xl text-stone-800 mb-2` | Cormorant 400 | **Legacy colour — `text-stone-800` not v2** |
| `(shop)/siparis/[token]/page.tsx:134,236,307,323` | Section h2/h3 | `font-serif text-xl/lg text-stone-800` | Cormorant 400 | **Legacy colour** |

### 2.8 Auth (`(auth)` route group)

| File | Element | Class | Render | Status |
|---|---|---|---|---|
| `app/(auth)/layout.tsx:15` | Wordmark | **`text-heading-3 font-accent text-leather-800 tracking-wider`** | **Cinzel 400** | **Legacy — full v1 treatment** |
| `auth/LoginForm.tsx:108` | h1 | **`text-heading-4 font-accent text-leather-800 mb-2`** | **Cinzel 400** | **Legacy** |
| `auth/RegisterForm.tsx:199` | h1 | **`text-heading-4 font-accent text-leather-800 mb-2`** | **Cinzel 400** | **Legacy** |
| `auth/ForgotPasswordForm.tsx:80,104` | h1 (×2 states) | **`text-heading-4 font-accent text-leather-800 mb-2`** | **Cinzel 400** | **Legacy** |
| `auth/ResetPasswordForm.tsx:108,128,144` | h1 (×3 states) | **`text-heading-4 font-accent text-leather-800 mb-2`** | **Cinzel 400** | **Legacy** |

### 2.9 Admin Panel

| File | Element | Class | Render | Status |
|---|---|---|---|---|
| `admin/AdminSidebar.tsx:126,131` | Wordmark + mobile H | **`font-accent text-xl text-leather-800`** | **Cinzel 400** | **Legacy** |

### 2.10 Shared UI

| File | Element | Class | Render | Status |
|---|---|---|---|---|
| `ui/v2-form.tsx:17,49,88` | Form labels (3 variants) | `font-inter text-xs uppercase tracking-[0.15em] text-v2-text-muted` | Inter 400 | V2 |
| `ui/luxury/EditorialQuote.tsx:65,78` | Quote glyph + quote text | `font-serif` + `font-serif italic` | Cormorant 400/italic | Legacy luxury component (`text-[#B8860B]`, `text-stone-*`) |
| `ui/luxury/ProductShowcase.tsx:129` | Product name h3 | `font-serif text-base md:text-lg text-stone-800` | Cormorant 400 | Legacy luxury component |

---

## 3. Inconsistencies

The most important findings, roughly ordered by user-visible impact.

### 3.1 🔥 Product name & price treatment across the site

The recently merged fix (commit `468bcd9`) made the card treatment `font-inter` primary-name + `font-inter` muted-price. **Favorilerim still uses the old rule**:

| Surface | Product name | Price |
|---|---|---|
| `ProductCardV2` | `font-inter font-normal text-[15px] lg:text-base tracking-normal text-v2-text-primary` | `font-inter text-sm text-v2-text-muted` |
| `SecimProductGridClient` | (same) | (same) |
| `hesabim/favorilerim/page.tsx:117,121` | **`font-serif text-sm text-v2-text-muted`** | **`font-inter text-sm text-v2-text-primary`** |
| `ProductDetailV2:301,314` | `font-serif font-light` (h1, different role — OK) | **`font-inter text-lg text-v2-text-primary`** (primary — legitimate because it's the hero price, but inverts card rule) |
| `ProductCard.tsx` (legacy v1) | `font-serif text-lg text-luxury-primary` | — |

Favorilerim is directly inconsistent with the card. Product detail price is primary while card price is muted — that might be a deliberate hierarchical distinction (detail hero vs list item), but it should be a documented decision, not an accident.

### 3.2 🔥 Section headings — `font-light` missing in ~28 places

V2 convention is `font-serif font-light` for section headings (home, checkout, product detail, hesabim h1s all use it). But most **legal**, **FAQ**, **beden rehberi**, **siparis-takip order number**, and **CheckoutSummary section title** headings forget `font-light` and render **Cormorant 400** instead of **300**.

Affected:
- `sss/page.tsx:148` — AccordionTrigger
- `beden-rehberi/page.tsx:40,131` — inner section h2s
- `siparis-takip/page.tsx:268` — order number h2
- `kvkk/page.tsx:54,81,125,167,197,246,256,297,326,342` — 10 section h2s
- `mesafeli-satis-sozlesmesi/page.tsx:53,96,109,125,175,221,247,260,279,293,304` — 11 section h2s + h3s on 56,86,204
- `cerezler/page.tsx:46,56,59,69,78,87,97` — 7 headings
- `CheckoutSummary.tsx:96` — section title
- `CartDrawer.tsx:138,234` — sheet title + empty-state heading

Visually this is a **weight shift** between otherwise-identical headings depending on which template the page uses. On display-size text the difference between Cormorant Light (300) and Cormorant Regular (400) is obvious.

### 3.3 🔥 Auth + Admin + InstagramFeed still on Cinzel (`font-accent`)

All auth forms, the auth layout wordmark, the admin sidebar wordmark, and `InstagramFeed.tsx` render in **Cinzel** (`font-accent`) with legacy `text-leather-800` / `text-leather-900`. These are the last things tying the `font-accent` token and the Cinzel font load to the build.

Files:
- `app/(auth)/layout.tsx:15`
- `auth/LoginForm.tsx:108`
- `auth/RegisterForm.tsx:199`
- `auth/ForgotPasswordForm.tsx:80,104`
- `auth/ResetPasswordForm.tsx:108,128,144`
- `admin/AdminSidebar.tsx:126,131`
- `home/InstagramFeed.tsx:30`

### 3.4 Wordmark weight differs between Navbar and Footer

Same brand wordmark, different weights:
- `Navbar.tsx:76` — `font-serif font-medium tracking-[0.25em] text-lg` (Cormorant **500**)
- `Footer.tsx:85` — `font-serif font-normal tracking-[0.25em] text-lg` (Cormorant **400**)

Cormorant 500 is not even loaded — only 300/400/600 are — so Navbar's `font-medium` falls back to the nearest loaded weight and renders 400 anyway (or synthesizes). Either way, the intent diverges.

### 3.5 Order totals in Cormorant

`siparis-tamamlandi/[token]/page.tsx:226,229` and `CheckoutSummary.tsx:112` render monetary grand totals with `font-serif font-light text-lg`. Numerals in Cormorant display italic-adjacent shapes with proportional widths — legible but off-brand for numeric alignment. Inline prices on cards and product detail are `font-inter`, so totals diverge.

### 3.6 Hard-coded `#8B6F47` instead of `text-v2-accent`

Not a font issue strictly but orbits the typography cascade:
- `hikayemiz/page.tsx:16,47`
- `iletisim/page.tsx:89,234`
- `beden-rehberi/page.tsx:96`
- `siparis-takip/page.tsx:171`

These eyebrow labels use the raw hex of the V2 accent color. Works visually but bypasses the design token.

### 3.7 Legacy file presence

`CategoryPage.tsx`, `ProductCard.tsx`, `siparis/[token]/page.tsx`, `ui/luxury/EditorialQuote.tsx`, `ui/luxury/ProductShowcase.tsx` still use `text-luxury-*` / `text-stone-*` / `text-leather-*`. If they're routed (the first three likely are), they will drop users into a visibly different typographic palette.

---

## 4. Dead / Conflicting Tokens

### Font-family tokens defined but unused (or nearly)

| Token | Resolves to | Actual references | Verdict |
|---|---|---|---|
| `font-display` | Cinzel | **0** | **Dead** — delete from `tailwind.config.ts:160`. |
| `font-accent` | Cinzel | 10 (all in legacy auth/admin/InstagramFeed) | Migrate callers, then delete. |
| `font-heading` | Cormorant | 1 (`globals.css:290` `.price` class only) | Alias of `font-serif`. Delete and inline. |
| `font-body` | DM Sans | 2 (`layout.tsx:98` body, `globals.css:96` body rule) | Alias of `font-sans`. Keep OR consolidate. |
| `font-sans` | DM Sans | 3 (`globals.css` `.btn-luxury-*` classes only) | No .tsx references. |
| `font-inter` | Inter | 238 (41 files) | **Primary** — keep. |
| `font-serif` | Cormorant | ~90 | **Primary** — keep. |

### Font weights loaded but unused

| Font | Loaded | Evidence of use | Verdict |
|---|---|---|---|
| Inter | 400, 500 | Both used (400 default, 500 in Footer column headings + CheckoutSteps) | Keep |
| DM Sans | 400, 500, 600, 700 | Only inherited via body; `.btn-luxury-*` uses `font-medium` (500) | **600, 700 unused** — drop |
| Cormorant | 300, 400, 600 + italic | 300 (`font-light`), 400 (bare `font-serif`), italic (`FullBleedEditorial`, `EditorialQuote`) | **600 (`font-semibold`) referenced only by legacy `.price`** — drop if `.price` is removed |
| Cinzel | 400, 500, 600, 700 | Only 400 via `font-accent` | **500, 600, 700 unused**; **entire family disposable after auth/admin migration** |

### Fonts fully removable after migration

**Cinzel** can be deleted from `layout.tsx` once auth forms, AdminSidebar, InstagramFeed, and `(auth)/layout` stop using `font-accent`. It's loading ~60KB of woff2 for ~10 references.

**DM Sans** is only live because `<body className="font-body">`. If `body` switches to `font-inter`, DM Sans is zero-referenced (apart from `.btn-luxury-*` in globals.css, which is legacy). DM Sans loading 4 weights adds ~70–100KB — significant.

### Potential cascade landmines

- `globals.css:99–106` forces `font-serif font-normal text-luxury-primary` on **every** `h1–h6`. V2 pages that forget to set `font-inter` or `text-v2-*` inherit Cormorant **plus** a legacy dark-petrol color. This has probably masked bugs where a developer thought they removed an explicit class and the element still looked "fine" because the base rule took over.
- `globals.css:113–115` forces `tracking-normal` on `h2, h3`, overriding the negative letter-spacing of `text-v2-section` / `text-v2-hero*` tokens. Intended V2 metrics are `-0.01em`; base rule re-sets to 0.

---

## 5. Recommendations

### 5.1 Role → font rules (canonical)

| Role | Font | Size token(s) | Weight | Color |
|---|---|---|---|---|
| Hero display | `font-serif` | `text-v2-hero`/`v2-hero-md`/`v2-hero-sm` | `font-light` | `text-v2-text-primary` |
| Section heading (all depths ≥ h1 ≤ h2) | `font-serif` | `text-v2-section` / `text-v2-section-sm` | `font-light` | `text-v2-text-primary` |
| Sub-heading (h3 inside long-form prose) | `font-serif` | `text-xl` / `text-base` | `font-normal` | `text-v2-text-primary` |
| Eyebrow / label | `font-inter` | `text-v2-label` / `text-xs` | `font-normal` (or 500 where hierarchy demands) | `text-v2-text-muted` or `text-v2-accent` |
| Product name (card) | `font-inter` | `text-[15px] lg:text-base` | `font-normal` | `text-v2-text-primary` |
| Product name (detail h1) | `font-serif` | `text-3xl … text-[2.75rem]` | `font-light` | `text-v2-text-primary` |
| Price (card) | `font-inter` | `text-sm` | `font-normal` | `text-v2-text-muted` |
| Price (detail, primary CTA zone) | `font-inter` | `text-lg` | `font-normal` | `text-v2-text-primary` |
| Order totals / summary values | `font-inter` | `text-base`/`text-lg` | `font-medium` | `text-v2-text-primary` |
| Buttons | `font-inter` | `text-xs` (uppercase) / `text-sm` | `font-normal` or `font-medium` | context |
| Body prose | `font-inter` | `text-v2-body` / `text-sm` | `font-normal` | `text-v2-text-muted` |

### 5.2 Concrete cleanups (no architecture change required)

1. **Migrate `font-accent` → `font-serif`** in `auth/*Form.tsx`, `(auth)/layout.tsx`, `admin/AdminSidebar.tsx`, `home/InstagramFeed.tsx`. Swap `text-leather-*` for `text-v2-text-primary`.
2. **Delete** `font-display` and `font-accent` from `tailwind.config.ts`.
3. **Remove Cinzel** from `layout.tsx` after step 1 — saves one font download.
4. **Trim DM Sans weights** to `400, 500` (or remove entirely if body is switched to `font-inter`).
5. **Add `font-light`** to every `font-serif` heading in legal pages, FAQ accordion trigger, `siparis-takip` order number, `beden-rehberi` inner h2s, `CheckoutSummary` section title, `CartDrawer` titles. (~28 occurrences listed in §3.2.)
6. **Fix favorilerim card typography** (`hesabim/favorilerim/page.tsx:117,121`) to match ProductCardV2: Inter primary for name, Inter muted for price.
7. **Update `globals.css:99–106`** base rule — either (a) scope it to legacy surfaces via a class, or (b) change it to `font-inter font-normal text-v2-text-primary` so V2 pages that omit a font class don't silently inherit Cormorant + luxury-primary color.
8. **Unify wordmark**: pick one of `font-medium` (Cormorant 500 — needs adding 500 to the `next/font` weights!) or `font-normal` for both Navbar and Footer. If `font-medium` is intended, add `500` to the Cormorant loader weights.
9. **Order totals**: migrate `CheckoutSummary.tsx:112` and `siparis-tamamlandi/[token]/page.tsx:226,229` from `font-serif font-light` to `font-inter font-medium`. Numerals deserve Inter's tabular rhythm.
10. **Replace hard-coded `#8B6F47`** with `text-v2-accent` in hikayemiz, iletisim, beden-rehberi, siparis-takip eyebrow labels.
11. **Retire or explicitly delete** the legacy `.tsx` files: `ProductCard.tsx`, `CategoryPage.tsx`, `ui/luxury/ProductShowcase.tsx`, `ui/luxury/EditorialQuote.tsx`, `(shop)/siparis/[token]/page.tsx`. Grep for routes/imports first.
12. **`.price` class in globals.css** — delete or migrate to v2 tokens; it's the only remaining `font-heading` reference.

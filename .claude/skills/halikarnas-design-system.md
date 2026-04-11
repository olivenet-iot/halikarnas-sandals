# Skill: Halikarnas Design System

## Bu Skill Ne Zaman Kullanilir

- V2 styling ve renk kararlari
- V2 pattern kullanimi
- Animasyon ekleme
- Typography kararlari
- UI tutarliligi saglama
- Yeni sayfa olusturma
- Yasak pattern kontrolu

---

## V2 Color System (PRIMARY)

Tum yeni sayfalar ve V2 component'leri bu tokenlari kullanmalidir.

| Token | Hex | Kullanim |
|-------|-----|----------|
| `v2-bg-primary` | #FAF7F2 | Sicak krem sayfa arkaplan |
| `v2-bg-dark` | #2A2A26 | Koyu arkaplan (footer, mobil bar) |
| `v2-text-primary` | #1C1917 | Ana metin, basliklar |
| `v2-text-muted` | #6B6560 | Ikincil metin, label'lar |
| `v2-accent` | #8B6F47 | Bronz aksesuar, aktif gostergeler |
| `v2-border-subtle` | #E8E2D8 | Ince kenarlik, input alt cizgi |

### Kullanim Ornekleri

```tsx
// Page background
<div className="bg-v2-bg-primary min-h-screen">

// Dark section (footer, mobile bar)
<div className="bg-v2-bg-dark text-white">

// Heading
<h1 className="text-v2-text-primary font-serif font-light">

// Body text
<p className="text-v2-text-muted font-inter">

// Accent label
<span className="font-inter text-v2-label uppercase tracking-[0.2em] text-v2-accent">

// Subtle border
<div className="border-b border-v2-border-subtle">

// Link with underline animation
<a className="link-underline-v2 text-v2-text-primary">
```

---

## V2 Typography System

### Font Families

| Class | Font | Agirliklar | Kullanim |
|-------|------|-----------|----------|
| `font-serif` / `font-heading` | Cormorant Garamond | 300, 400 + italic | Basliklar, urun adlari |
| `font-inter` | Inter | 400, 500 | Body text, label'lar, butonlar, UI elementleri |

### Font Size Tokens

| Token | Boyut | Line Height | Letter Spacing | Kullanim |
|-------|-------|-------------|----------------|----------|
| `v2-hero` | 7rem | 1.05 | -0.01em | Desktop hero |
| `v2-hero-md` | 5rem | 1.05 | -0.01em | Tablet hero |
| `v2-hero-sm` | 2.5rem | 1.1 | -0.01em | Mobil hero |
| `v2-section` | 3.5rem | 1.15 | -0.01em | Section baslik |
| `v2-section-sm` | 2rem | 1.2 | -- | Mobil section baslik |
| `v2-body` | 1rem | 1.7 | -- | Govde metin |
| `v2-label` | 0.6875rem | 1.4 | 0.2em | Etiket, kategori |
| `v2-caps` | 0.625rem | 1.4 | 0.1em | Kucuk etiket |

### Heading Hierarchy

```tsx
// Hero title
<h1 className="font-serif font-light text-[2.5rem] md:text-[4rem] lg:text-[5.5rem] text-v2-text-primary">

// Section title
<h2 className="font-serif font-light text-2xl md:text-3xl text-v2-text-primary">

// Eyebrow/label
<span className="font-inter text-v2-label uppercase tracking-[0.2em] text-v2-accent">

// Product name (card)
<h3 className="font-serif font-normal text-sm text-v2-text-primary">

// Body text
<p className="font-inter text-v2-body text-v2-text-muted leading-relaxed">

// Price
<span className="font-inter text-sm text-v2-text-primary">

// Form label
<label className="font-inter text-xs uppercase tracking-[0.15em] text-v2-text-muted">
```

---

## V2 CSS Utility Classes

Bu class'lar `globals.css` icinde `@layer utilities` altinda tanimlidir.

| Class | Tanimlama | Kullanim |
|-------|-----------|----------|
| `.container-v2` | `px-6 md:px-12 lg:px-24 mx-auto max-w-[1440px]` | V2 sayfa container |
| `.section-v2` | `py-v2-section-mobile md:py-v2-section` | Responsive section padding |
| `.link-underline-v2` | Hover'da 0 -> 100% genislik underline animasyonu (400ms) | CTA linkleri |

---

## V2 Spacing System

| Token | Deger | Kullanim |
|-------|-------|----------|
| `v2-section` | 10rem (160px) | Section dikey padding (desktop) |
| `v2-section-mobile` | 6.25rem (100px) | Section dikey padding (mobil) |
| `v2-gap` | 5rem (80px) | Buyuk bosluk |
| `v2-gap-sm` | 3rem (48px) | Kucuk bosluk |

---

## V2 Component Patterns

### V2 Section

```tsx
<section className="section-v2 container-v2">
  <h2 className="font-serif font-light text-2xl md:text-3xl text-v2-text-primary mb-8">
    Section Basligi
  </h2>
  {/* Section icerigi */}
</section>
```

### V2 Product Card

```tsx
<div className="group relative">
  {/* Image — no border, no rounded */}
  <div className="relative aspect-[3/4] overflow-hidden bg-v2-bg-primary">
    <Image
      src={product.image}
      alt={product.name}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-105"
    />
  </div>
  {/* Info */}
  <div className="mt-3 space-y-1">
    <h3 className="font-serif font-normal text-sm text-v2-text-primary">
      {product.name}
    </h3>
    <span className="font-inter text-sm text-v2-text-primary">
      {formatPrice(product.price)}
    </span>
  </div>
</div>
```

### V2 Input (Underline Style)

```tsx
<input
  className="w-full py-2 bg-transparent border-0 border-b border-v2-border-subtle
             focus:border-v2-text-primary focus:outline-none focus:ring-0
             font-inter text-v2-body text-v2-text-primary
             placeholder:text-v2-text-muted/50
             transition-colors duration-300"
  placeholder="Adiniz"
/>
```

### V2 Button (Primary)

```tsx
<button className="bg-v2-text-primary text-white hover:opacity-90
                   rounded-none px-8 py-3
                   font-inter text-sm uppercase tracking-[0.1em]
                   transition-opacity duration-300">
  Sepete Ekle
</button>
```

### V2 Button (Outline)

```tsx
<button className="border border-v2-text-primary text-v2-text-primary
                   hover:bg-v2-text-primary hover:text-white
                   rounded-none px-8 py-3
                   font-inter text-sm uppercase tracking-[0.1em]
                   transition-colors duration-300">
  Devam Et
</button>
```

---

## YASAK LIST (V2 Sayfalarinda Kullanilmamasi Gerekenler)

Asagidaki pattern'ler V2 sayfalarinda KESINLIKLE yasaktir:

| Yasak | Aciklama |
|-------|----------|
| Yesil/teal renkler | `luxury-primary` (#1e3a3a) dahil tum yesil tonlari |
| Altin #B8860B veya #c9a962 | `v2-accent` (#8B6F47) kullan |
| Gradient arkaplanlar | Duz renk arkaplanlar kullan |
| Trust bar | Kargo/iade/guvenli odeme ikon bari yasak |
| Card border'li form input | Underline stil kullan |
| Rounded pill butonlar | `rounded-none` kullan |
| Numarali circle progress stepper | Text stepper kullan |
| All-caps urun isimleri | Normal case kullan |
| Full-width dolgu siyah CTA | Contained buton kullan |
| Yesil success banner | Notr tonlarda bildirim kullan |
| `GoldDivider` | V2 sayfalarda kullanma |
| `MagneticButton` | V2 sayfalarda kullanma |
| `font-display` / Cinzel | V2 sayfalarda kullanma |
| `font-sans` / DM Sans | `font-inter` kullan |

---

## Animation System

### Import

```tsx
import {
  TIMING,
  EASE,
  fadeInUp,
  fadeIn,
  staggerContainer,
  sectionRevealV2,
  staggerV2,
  viewportV2,
  cardHover,
  imageHoverZoom,
  imageReveal,
} from "@/lib/animations";
```

### Timing Constants

| Name | Duration | Kullanim |
|------|----------|----------|
| `TIMING.instant` | 0.15s | Micro-interactions, toggles |
| `TIMING.fast` | 0.3s | Button hovers, tooltips |
| `TIMING.medium` | 0.5s | Cards, overlays |
| `TIMING.slow` | 0.7s | Page sections |
| `TIMING.slower` | 1.0s | Hero elements |
| `TIMING.cinematic` | 1.5s | Full-screen transitions |

### Easing Curves

| Name | Curve | Kullanim |
|------|-------|----------|
| `EASE.luxury` | [0.4, 0, 0.2, 1] | Premium feel (DEFAULT) |
| `EASE.smooth` | [0.25, 0.1, 0.25, 1] | General purpose |
| `EASE.bounce` | [0.68, -0.55, 0.265, 1.55] | Playful elements |
| `EASE.spring` | spring config | Physical interactions |

### V2 Animation Variants

```tsx
// V2 Section Reveal
<motion.div
  variants={sectionRevealV2}
  initial="hidden"
  whileInView="visible"
  viewport={viewportV2}
>
  Section icerigi
</motion.div>

// V2 Stagger Container
<motion.div
  variants={staggerV2}
  initial="hidden"
  whileInView="visible"
  viewport={viewportV2}
>
  {items.map(item => (
    <motion.div key={item.id} variants={fadeInUp}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

V2 viewport ayarlari:

```tsx
const viewportV2 = { once: true, amount: 0.15, margin: "-50px" }
```

### Genel Reveal Animasyonlari

```tsx
// Fade in with upward motion
<motion.div
  variants={fadeInUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  Content
</motion.div>

// Image clip reveal
<motion.div variants={imageReveal}>
  <Image src="..." />
</motion.div>
```

### Hover Effects

```tsx
// Card hover with lift
<motion.div variants={cardHover} initial="rest" whileHover="hover">
  Card content
</motion.div>

// Image zoom on hover
<motion.div variants={imageHoverZoom}>
  <Image src="..." />
</motion.div>
```

### Stagger Containers

```tsx
// Standard stagger (0.1s delay between items)
<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div key={item.id} variants={fadeInUp}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### LEGACY Animasyonlar (sadece admin/auth sayfalari)

Asagidaki animasyonlar V2 sayfalarda KULLANILMAZ, sadece admin/auth/hesabim gibi eski sayfalarda kalir:

- `goldLine` / `goldLineWide` -- GoldDivider animasyonu
- `letterSpacingReveal` -- Hero letter spacing efekti
- `staggerContainerCinematic` -- Yavas cinematic stagger

### Viewport Ayarlari

```tsx
// V2 (onerilen)
viewport={viewportV2}  // { once: true, amount: 0.15, margin: "-50px" }

// Standard (eski sayfalar)
viewport={{ once: true, amount: 0.3, margin: "-100px" }}

// Eager (above-fold content)
viewport={{ once: true, amount: 0.1, margin: "-50px" }}
```

---

## Legacy Components (SADECE admin/auth/hesabim)

**UYARI:** Asagidaki component'ler V2 sayfalarda KESINLIKLE kullanilmaz. Sadece admin paneli, auth sayfalari ve hesabim bolumunde kalirlar.

```tsx
import {
  GoldDivider,
  MagneticButton, ArrowIcon,
  TextReveal, TextFadeIn, LetterSpacingReveal,
  ParallaxImage, ParallaxLayeredImage,
  ScrollIndicator, ChevronBounce,
  EditorialQuote, EditorialText,
  VideoBackground, AnimatedGradientBackground,
  ProductCardLuxury, ProductGridLuxury,
} from "@/components/ui/luxury";
```

| Component | Aciklama | V2 Durumu |
|-----------|----------|-----------|
| `GoldDivider` | Altin cizgi ayirici | YASAK -- V2'de border-v2-border-subtle kullan |
| `MagneticButton` | Magnetik buton efekti | YASAK -- V2 buton pattern'i kullan |
| `TextReveal` / `LetterSpacingReveal` | Metin reveal animasyonu | YASAK -- fadeInUp kullan |
| `ParallaxImage` / `ParallaxLayeredImage` | Parallax gorsel | YASAK -- standard Image kullan |
| `ScrollIndicator` / `ChevronBounce` | Scroll gosterge | YASAK |
| `EditorialQuote` / `EditorialText` | Editorial metin | YASAK |
| `ProductCardLuxury` / `ProductGridLuxury` | Luxury urun kartlari | YASAK -- V2 product card kullan |

---

## Legacy Color Tokens (@DEPRECATED)

Bu tokenlar hala tailwind.config.ts icinde tanimlidir ama yakinlasik bir temizlik pass'inde kaldirilacaktir. Yeni kodda **kesinlikle kullanma**.

### Gecis Tablosu

| Legacy Token | Hex | V2 Karsiligi |
|-------------|-----|-------------|
| `luxury-primary` | #1e3a3a | V2'de karsiligi yok -- kullanma |
| `luxury-primary-light` | #2d5555 | V2'de karsiligi yok -- kullanma |
| `luxury-primary-dark` | #152a2a | V2'de karsiligi yok -- kullanma |
| `luxury-gold` | #c9a962 | `v2-accent` (#8B6F47) |
| `luxury-gold-light` | #d4b87a | `v2-accent` (#8B6F47) |
| `luxury-terracotta` | #e07d4c | `v2-accent` (#8B6F47) |
| `luxury-cream` | #faf9f6 | `v2-bg-primary` (#FAF7F2) |
| `luxury-ivory` | #f5f4f0 | `v2-bg-primary` (#FAF7F2) |
| `luxury-stone` | #e8e6e1 | `v2-border-subtle` (#E8E2D8) |
| `luxury-charcoal` | #2d2d2d | `v2-text-primary` (#1C1917) |

### Eski Palette Tokenlari (KULLANMA)

| Token Ailesi | Durum |
|-------------|-------|
| `sand-*` (50-900) | DEPRECATED -- kullanma |
| `aegean-*` (50-900) | DEPRECATED -- kullanma |
| `terracotta-*` (50-900) | DEPRECATED -- kullanma |
| `leather-*` (50-900) | DEPRECATED -- kullanma |
| `olive-gold` | DEPRECATED -- kullanma |
| `sea-foam` | DEPRECATED -- kullanma |

### Eski Font Tokenlari

| Legacy Token | V2 Karsiligi |
|-------------|-------------|
| `font-display` / Cinzel | Kullanma, `font-serif` kullan |
| `font-accent` / Cinzel | Kullanma, `font-serif` kullan |
| `font-sans` / DM Sans | `font-inter` kullan |
| `font-body` / DM Sans | `font-inter` kullan |

---

## Anti-Patterns

### 1. forwardRef Zorunlu (react-hook-form)

```tsx
// YANLIS
function CustomInput(props) {
  return <input {...props} />
}

// DOGRU
const CustomInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return <input ref={ref} {...props} />
  }
)
CustomInput.displayName = "CustomInput"
```

react-hook-form input'lara ref atar. `forwardRef` kullanmazsan form validation calismaz.

### 2. SheetFooter Kullanma

```tsx
// YANLIS
<SheetFooter>
  <Button>Checkout</Button>
</SheetFooter>

// DOGRU
<div className="border-t border-v2-border-subtle p-4 mt-auto">
  <Button className="w-full">Checkout</Button>
</div>
```

`SheetFooter` component'i CartDrawer'da layout sorunlari yaratir. Manuel div ile flex layout kullan.

### 3. V2 Sayfalarda luxury-* Token Kullanma

```tsx
// YANLIS
<div className="bg-luxury-cream text-luxury-charcoal">
<Button className="bg-luxury-primary hover:bg-luxury-primary-light">

// DOGRU
<div className="bg-v2-bg-primary text-v2-text-primary">
<button className="bg-v2-text-primary text-white hover:opacity-90 rounded-none">
```

### 4. V2 Sayfalarda GoldDivider/MagneticButton Kullanma

```tsx
// YANLIS
<GoldDivider />
<MagneticButton variant="primary">Kesfet</MagneticButton>

// DOGRU
<div className="border-b border-v2-border-subtle" />
<button className="bg-v2-text-primary text-white rounded-none px-8 py-3">Kesfet</button>
```

### 5. Parallax Y Movement > +/-3%

```tsx
// YANLIS -- frame gap (siyah bant) yaratir
useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

// DOGRU -- max +/-3%
useTransform(scrollYProgress, [0, 1], ["-3%", "3%"])
```

---

*Bu skill Halikarnas Sandals projesinin V2 design system'i icin tek kaynak (source of truth) olarak kullanilmalidir.*

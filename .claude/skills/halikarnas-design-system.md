# Skill: Halikarnas Design System

## Bu Skill Ne Zaman Kullanilir

- Styling ve renk kararlari
- Animasyon ekleme
- Luxury component kullanimi
- Typography kararlari
- UI tutarliligi saglama
- Yeni sayfa olusturma

---

## Luxury Color System

### Primary Palette (Tailwind Classes)

| Token | Hex | Kullanim |
|-------|-----|----------|
| `luxury-primary` | #1e3a3a | Primary actions, headings, dark backgrounds |
| `luxury-primary-light` | #2d5555 | Hover states |
| `luxury-primary-dark` | #152a2a | Active states |
| `luxury-gold` | #c9a962 | Premium CTAs, dividers, accents |
| `luxury-gold-light` | #d4b87a | Gold hover states |
| `luxury-terracotta` | #e07d4c | Accent, sale badges |

### Neutral Palette

| Token | Hex | Kullanim |
|-------|-----|----------|
| `luxury-cream` | #faf9f6 | Page backgrounds |
| `luxury-ivory` | #f5f4f0 | Section backgrounds |
| `luxury-stone` | #e8e6e1 | Borders, subtle backgrounds |
| `luxury-charcoal` | #2d2d2d | Text, dark elements |

### Kullanim Ornekleri

```tsx
// Page background
<div className="bg-luxury-cream min-h-screen">

// Primary button
<Button className="bg-luxury-primary hover:bg-luxury-primary-light text-white">

// Gold CTA (luxury)
<MagneticButton variant="primary">Kesfet</MagneticButton>

// Heading
<h1 className="text-luxury-charcoal font-serif text-4xl">

// Body text
<p className="text-luxury-charcoal/80">

// Muted text
<span className="text-luxury-charcoal/60">

// Link
<a className="text-luxury-primary hover:text-luxury-gold">

// Card
<div className="bg-luxury-ivory border border-luxury-stone rounded-lg">

// Gold accent line
<GoldDivider />

// Sale badge
<Badge className="bg-luxury-terracotta text-white">INDIRIM</Badge>
```

---

## Typography System

### Font Families

| Class | Font | Kullanim |
|-------|------|----------|
| `font-serif` / `font-heading` | Cormorant Garamond | Headings, display text |
| `font-sans` / `font-body` | Inter / DM Sans | Body text, UI elements |
| `font-accent` / `font-display` | Cinzel | Luxury labels, editorial quotes |

### Heading Hierarchy

```tsx
// Hero title (Collection pages, full-screen)
<h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-luxury-charcoal tracking-tight">

// Page title (Standard pages)
<h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-luxury-charcoal">

// Section title
<h2 className="font-serif text-2xl md:text-3xl text-luxury-charcoal">

// Subsection
<h3 className="font-serif text-xl md:text-2xl text-luxury-charcoal">

// Card title
<h4 className="font-serif text-lg text-luxury-charcoal">

// Luxury label (gold, uppercase)
<span className="font-display text-xs tracking-[0.3em] uppercase text-luxury-gold">
  KOLEKSIYON
</span>

// Body text
<p className="text-luxury-charcoal/80 leading-relaxed">

// Small/muted text
<span className="text-sm text-luxury-charcoal/60">
```

---

## Animation System

### Import

```tsx
import {
  TIMING,
  EASE,
  fadeInUp,
  goldLine,
  staggerContainer,
  letterSpacingReveal,
  // ... etc
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

### Pre-built Variants

#### Reveal Animations

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

// Gold line reveal
<motion.div variants={goldLine}>
  <GoldDivider />
</motion.div>

// Text letter spacing reveal (for hero titles)
<motion.h1 variants={letterSpacingReveal}>
  AEGEAN
</motion.h1>

// Image clip reveal
<motion.div variants={imageReveal}>
  <Image src="..." />
</motion.div>
```

#### Hover Effects

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

#### Stagger Containers

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

// Cinematic stagger (slower, 0.15s delay)
<motion.div variants={staggerContainerCinematic}>
  {/* ... */}
</motion.div>
```

### Viewport Settings

```tsx
// Standard (triggers at 30% visibility)
viewport={{ once: true, amount: 0.3, margin: "-100px" }}

// Eager (triggers earlier, for above-fold content)
viewport={{ once: true, amount: 0.1, margin: "-50px" }}
```

---

## Luxury Components

### Import

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

### GoldDivider

```tsx
// Default (4rem width, animated)
<GoldDivider />

// Wide variant (6rem)
<GoldDivider variant="wide" />

// Full width
<GoldDivider variant="full" />

// Without animation
<GoldDivider animated={false} />

// With delay
<GoldDivider delay={0.3} />

// Centered
<GoldDivider className="mx-auto" />
```

### MagneticButton

```tsx
// Primary (gold background, magnetic effect)
<MagneticButton variant="primary">Kesfet</MagneticButton>

// Outline
<MagneticButton variant="outline">Detaylar</MagneticButton>

// Ghost
<MagneticButton variant="ghost">Daha Fazla</MagneticButton>

// With icon
<MagneticButton icon={<ArrowIcon />}>Devam Et</MagneticButton>

// As link
<MagneticButton href="/koleksiyonlar">Koleksiyonlar</MagneticButton>

// Large size
<MagneticButton size="lg">Satin Al</MagneticButton>

// Extra large
<MagneticButton size="xl">Hero CTA</MagneticButton>
```

### TextReveal

```tsx
// Split text reveal (word by word)
<TextReveal text="Premium El Yapimi Sandaletler" />

// Fade in paragraph
<TextFadeIn>
  Uzun paragraf metni burada yer alir...
</TextFadeIn>

// Letter spacing reveal (for hero titles)
<LetterSpacingReveal>KOLEKSIYON</LetterSpacingReveal>
```

### ParallaxImage

```tsx
// Basic parallax
<ParallaxImage
  src="/images/hero.jpg"
  alt="Hero image"
  parallaxAmount={0.3}  // 0.1 to 1.0
/>

// With Ken Burns effect
<ParallaxImage
  src="/images/hero.jpg"
  alt="Hero"
  kenBurns={true}
/>

// With overlay
<ParallaxImage
  src="/images/hero.jpg"
  alt="Hero"
  overlay="gradient"  // "none" | "bottom" | "full" | "vignette" | "gradient"
/>

// Layered parallax (foreground + background)
<ParallaxLayeredImage
  backgroundSrc="/bg.jpg"
  foregroundSrc="/product.png"
/>
```

### ScrollIndicator

```tsx
// For scroll-snap pages
<ScrollIndicator
  currentFrame={activeFrame}
  totalFrames={7}
/>

// Simple bouncing chevron
<ChevronBounce />

// Different variants
<ScrollIndicator variant="arrow" />
<ScrollIndicator variant="mouse" />
<ScrollIndicator variant="line" />
```

### EditorialQuote

```tsx
<EditorialQuote
  quote="Luxury is in each detail."
  author="Hubert de Givenchy"
/>

<EditorialText>
  Editorial paragraf metni...
  Birden fazla satir olabilir.
</EditorialText>
```

### ProductShowcase

```tsx
// Single luxury product card
<ProductCardLuxury
  product={product}
  size="medium"  // "small" | "medium" | "large"
/>

// Grid layout
<ProductGridLuxury
  products={products}
  layout="masonry"  // "masonry" | "uniform" | "featured"
/>
```

---

## Page Patterns

### Hero Section (Premium)

```tsx
<section className="relative h-screen overflow-hidden bg-luxury-charcoal">
  {/* Parallax Background */}
  <ParallaxImage
    src="/hero.jpg"
    className="absolute inset-0"
    parallaxAmount={0.3}
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
    <motion.span
      className="font-display text-xs tracking-[0.3em] uppercase text-luxury-gold mb-4"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      2026 Koleksiyonu
    </motion.span>

    <motion.h1
      className="font-serif text-5xl md:text-7xl mb-6"
      variants={letterSpacingReveal}
      initial="hidden"
      animate="visible"
    >
      AEGEAN
    </motion.h1>

    <GoldDivider className="mb-8" />

    <MagneticButton variant="primary" icon={<ArrowIcon />}>
      Kesfet
    </MagneticButton>
  </div>

  {/* Scroll indicator */}
  <ChevronBounce className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white" />
</section>
```

### Section with Animation

```tsx
<section className="py-24 bg-luxury-cream">
  <div className="container max-w-7xl mx-auto px-4">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="text-center mb-16"
    >
      {/* Eyebrow */}
      <motion.span
        variants={fadeInUp}
        className="font-display text-xs tracking-[0.3em] uppercase text-luxury-gold mb-4 block"
      >
        Koleksiyonlar
      </motion.span>

      {/* Title */}
      <motion.h2
        variants={fadeInUp}
        className="font-serif text-3xl md:text-4xl text-luxury-charcoal mb-4"
      >
        Kesfedilmeyi Bekliyor
      </motion.h2>

      {/* Divider */}
      <GoldDivider className="mx-auto" />
    </motion.div>

    {/* Content grid */}
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={fadeInUp}>
          {/* Card content */}
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>
```

### Scroll-Snap Frame

```tsx
<div
  className="snap-start snap-always relative overflow-hidden"
  style={{
    height: '100dvh',
    minHeight: '100dvh',
    maxHeight: '100dvh',
    flexShrink: 0
  }}
>
  {/* Frame content */}
</div>
```

---

## ANTI-PATTERNS (Yapilmamasi Gerekenler)

### 1. Parallax Y Movement > ±3%

**YANLIS:**
```tsx
// Bu FRAME GAP (siyah bant) yaratir!
useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])
```

**DOGRU:**
```tsx
// Max ±3% kullan, frame gap olmaz
useTransform(scrollYProgress, [0, 1], ["-3%", "3%"])
```

**Aciklama:** Parallax Y hareketi fazla olursa, scroll-snap frame'leri arasinda siyah bantlar (gap) olusur.

---

### 2. min-h-screen + padding = Scroll-snap Bozulur

**YANLIS:**
```tsx
<div className="min-h-screen py-16">
  {/* Scroll-snap BOZULUR! */}
</div>
```

**DOGRU:**
```tsx
<div style={{
  height: '100dvh',
  minHeight: '100dvh',
  maxHeight: '100dvh'
}}>
  {/* Icerigi flex ile yerlesim */}
</div>
```

**Aciklama:** `min-h-screen` + padding, frame'in boyutunu 100vh'den buyuk yapar ve scroll-snap davranisini bozar. `100dvh` (dynamic viewport height) kullan.

---

### 3. SheetFooter Layout Sorunu

**YANLIS:**
```tsx
<Sheet>
  <SheetContent>
    {/* ... */}
    <SheetFooter>
      <Button>Checkout</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

**DOGRU:**
```tsx
<Sheet>
  <SheetContent className="flex flex-col">
    <SheetHeader>...</SheetHeader>
    <div className="flex-1 overflow-auto">
      {/* Content */}
    </div>
    <div className="border-t border-luxury-stone p-4 mt-auto">
      <Button className="w-full">Checkout</Button>
    </div>
  </SheetContent>
</Sheet>
```

**Aciklama:** `SheetFooter` component'i CartDrawer'da layout sorunlari yaratir. Manuel `div` ile flex layout kullan.

---

### 4. forwardRef Gerekli (react-hook-form)

**YANLIS:**
```tsx
function CustomInput(props) {
  return <input {...props} />
}

// react-hook-form ile CALISMAZ!
<FormControl>
  <CustomInput />
</FormControl>
```

**DOGRU:**
```tsx
const CustomInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return <input ref={ref} {...props} />
  }
)
CustomInput.displayName = "CustomInput"

// react-hook-form ile CALISIR
<FormControl>
  <CustomInput />
</FormControl>
```

**Aciklama:** react-hook-form, input'lara ref atar. `forwardRef` kullanmazsan form validation calismaz.

---

### 5. Legacy Token Kullanimi

**YANLIS:**
```tsx
<div className="bg-sand-50 text-leather-900">
<Button className="bg-aegean-500 hover:bg-aegean-600">
```

**DOGRU:**
```tsx
<div className="bg-luxury-cream text-luxury-charcoal">
<Button className="bg-luxury-primary hover:bg-luxury-primary-light">
```

**Aciklama:** Legacy tokenlar (`sand-*`, `leather-*`, `aegean-*`) deprecated. Her zaman `luxury-*` tokenlarini kullan.

---

### 6. Image Scale < 1.02

**YANLIS:**
```tsx
// Parallax'ta scale:1 kullanma - edge gorunur
<motion.div style={{ scale: 1 }}>
  <Image fill />
</motion.div>
```

**DOGRU:**
```tsx
// Minimum 1.02 scale kullan
<motion.div style={{ scale: 1.05 }}>
  <Image fill className="object-cover" />
</motion.div>
```

**Aciklama:** Parallax image'larda scale 1.0 olursa, hareket sirasinda kenarlar gorunur. Minimum 1.02-1.05 scale kullan.

---

## Deprecation Notice

### Legacy Tokens (KULLANMA)

Bu tokenlar deprecated ve `luxury-*` sistemine migrate edilmeli:

| Deprecated | Yerine Kullan |
|------------|---------------|
| `sand-50` | `luxury-cream` |
| `sand-100` | `luxury-ivory` |
| `sand-200` | `luxury-stone` |
| `leather-900` | `luxury-charcoal` |
| `leather-600` | `luxury-charcoal/80` |
| `leather-500` | `luxury-charcoal/60` |
| `leather-400` | `luxury-charcoal/40` |
| `aegean-500` | `luxury-primary` |
| `aegean-600` | `luxury-primary-dark` |
| `terracotta-500` | `luxury-terracotta` |

Mevcut kodda bu tokenlari gorursen, `luxury-*` sistemine cevir.

---

*Bu skill Halikarnas Sandals projesinin design system'i icin tek kaynak (source of truth) olarak kullanilmalidir.*

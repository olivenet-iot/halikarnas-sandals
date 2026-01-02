# Component Katalogu

## Layout Components

### Navbar

**Path:** `src/components/layout/Navbar.tsx`
**Type:** Server Component

Ana navigasyon bar'i. Logo, menu linkleri, arama, sepet ve kullanici ikonlari icerir.

```tsx
// Layout'ta kullanim
import { Navbar } from "@/components/layout/Navbar";

<Navbar />
```

---

### Footer

**Path:** `src/components/layout/Footer.tsx`
**Type:** Client Component

Site footer'i. Linkler, iletisim bilgileri, sosyal medya ikonlari ve odeme yontemleri.

```tsx
import { Footer } from "@/components/layout/Footer";

<Footer />
```

---

### SearchDialog

**Path:** `src/components/layout/SearchDialog.tsx`
**Type:** Client Component

Modal arama dialog'u. Anlık arama onerileri gosterir.

```tsx
import { SearchDialog } from "@/components/layout/SearchDialog";

<SearchDialog />
```

---

## Home Components

### HeroSection

**Path:** `src/components/home/HeroSection.tsx`
**Type:** Server Component

Anasayfa hero banner'i. Dinamik banner verileri veritabanından gelir.

```tsx
import { HeroSection } from "@/components/home/HeroSection";

<HeroSection />
```

---

### FeaturedProducts

**Path:** `src/components/home/FeaturedProducts.tsx`
**Type:** Server Component

One cikan urunler section'i. isFeatured: true olan urunleri gosterir.

```tsx
import { FeaturedProducts } from "@/components/home/FeaturedProducts";

<FeaturedProducts />
```

---

### CategoryShowcase

**Path:** `src/components/home/CategoryShowcase.tsx`
**Type:** Server Component

Kategori vitrin bolumu. Ana kategorileri gorsel kartlarla gosterir.

---

### Newsletter

**Path:** `src/components/home/Newsletter.tsx`
**Type:** Client Component

Email abonelik formu.

```tsx
import { Newsletter } from "@/components/home/Newsletter";

<Newsletter />
```

---

## Shop Components

### ProductCard

**Path:** `src/components/shop/ProductCard.tsx`
**Type:** Client Component

Urun kart componenti. Gorsel, isim, fiyat, renkler ve favoriler butonu.

**Props:**

```typescript
interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  images: { url: string; alt: string }[];
  colors?: { name: string; hex: string }[];
  isNew?: boolean;
  isSale?: boolean;
  isBestseller?: boolean;
  category?: { name: string; slug: string };
}
```

**Kullanim:**

```tsx
import { ProductCard, ProductCardProps } from "@/components/shop/ProductCard";

<ProductCard
  id="cuid..."
  name="Aegean Sandalet"
  slug="aegean-sandalet"
  price={1299}
  compareAtPrice={1599}
  images={[{ url: "https://...", alt: "Aegean" }]}
  colors={[{ name: "Taba", hex: "#C17E61" }]}
  isNew
  isSale
/>
```

---

### ProductGrid

**Path:** `src/components/shop/ProductGrid.tsx`
**Type:** Client Component

Urun grid layout'u.

**Props:**

```typescript
interface ProductGridProps {
  products: ProductCardProps[];
  columns?: 3 | 4;  // default: 4
}
```

**Kullanim:**

```tsx
import { ProductGrid } from "@/components/shop/ProductGrid";

<ProductGrid products={products} columns={4} />
```

---

### FilterSidebar

**Path:** `src/components/shop/FilterSidebar.tsx`
**Type:** Client Component

Kategori sayfalarinda filtreleme sidebar'i. Renk, beden, fiyat filtreleri.

---

### SortSelect

**Path:** `src/components/shop/SortSelect.tsx`
**Type:** Client Component

Siralama dropdown'u.

---

## Cart Components

### CartSheet

**Path:** `src/components/cart/CartSheet.tsx`
**Type:** Client Component

Slide-over sepet paneli. Zustand cart-store kullanir.

```tsx
import { CartSheet } from "@/components/cart/CartSheet";

<CartSheet />
```

---

### CartItem

**Path:** `src/components/cart/CartItem.tsx`
**Type:** Client Component

Sepetteki tek urun satiri. Miktar degistirme ve silme islemleri.

---

## Checkout Components

### CheckoutForm

**Path:** `src/components/checkout/CheckoutForm.tsx`
**Type:** Client Component

Cok adimli checkout formu. Adres, kargo, odeme adimlari.

---

### AddressSelector

**Path:** `src/components/checkout/AddressSelector.tsx`
**Type:** Client Component

Kayitli adres secimi veya yeni adres ekleme.

---

### OrderSummary

**Path:** `src/components/checkout/OrderSummary.tsx`
**Type:** Client Component

Siparis ozeti sidebar'i. Urunler, ara toplam, kargo, indirim, toplam.

---

## Account Components

### AccountSidebar

**Path:** `src/components/account/AccountSidebar.tsx`
**Type:** Client Component

Hesabim sayfasi yan menu.

```tsx
import { AccountSidebar } from "@/components/account/AccountSidebar";

<AccountSidebar />
```

---

### OrderCard

**Path:** `src/components/account/OrderCard.tsx`
**Type:** Client Component

Siparis kart componenti. Durum badge'i, urunler, toplam.

---

### AddressCard

**Path:** `src/components/account/AddressCard.tsx`
**Type:** Client Component

Adres kart componenti. Duzenle/sil butonlari.

---

## Admin Components

### AdminSidebar

**Path:** `src/components/admin/AdminSidebar.tsx`
**Type:** Client Component

Admin paneli yan menu. Navigasyon linkleri ve cikis butonu.

---

### AdminHeader

**Path:** `src/components/admin/AdminHeader.tsx`
**Type:** Client Component

Admin sayfa baslik componenti. Breadcrumb ve action butonlari.

---

### DataTable

**Path:** `src/components/admin/DataTable.tsx`
**Type:** Client Component

Genel amacli data table. Pagination, search, sort ozellikleri.

---

### StatsCard

**Path:** `src/components/admin/StatsCard.tsx`
**Type:** Client Component

Dashboard istatistik karti.

---

## Auth Components

### LoginForm

**Path:** `src/components/auth/LoginForm.tsx`
**Type:** Client Component

Giris formu. Email, sifre, "beni hatirla" ve sosyal login.

---

### RegisterForm

**Path:** `src/components/auth/RegisterForm.tsx`
**Type:** Client Component

Kayit formu. Ad, email, sifre, sifre onay.

---

## UI Components (shadcn/ui)

Tum shadcn/ui componentleri `src/components/ui/` altindadir.

### Temel Componentler

| Component | Dosya | Aciklama |
|-----------|-------|----------|
| Button | button.tsx | Cesitli varyantlarla buton |
| Input | input.tsx | Text input |
| Label | label.tsx | Form label |
| Textarea | textarea.tsx | Cok satirli input |
| Select | select.tsx | Dropdown secim |
| Checkbox | checkbox.tsx | Checkbox |
| Switch | switch.tsx | Toggle switch |
| Radio | radio-group.tsx | Radio button grubu |

### Layout Componentleri

| Component | Dosya | Aciklama |
|-----------|-------|----------|
| Card | card.tsx | Kart container |
| Dialog | dialog.tsx | Modal dialog |
| Sheet | sheet.tsx | Slide-over panel |
| Tabs | tabs.tsx | Tab navigation |
| Accordion | accordion.tsx | Acilir-kapanir liste |
| Separator | separator.tsx | Ayirici cizgi |

### Feedback Componentleri

| Component | Dosya | Aciklama |
|-----------|-------|----------|
| Toast | toast.tsx + toaster.tsx | Bildirim mesajlari |
| Alert | alert.tsx | Uyari mesaji |
| Badge | badge.tsx | Durum badge'i |
| Skeleton | skeleton.tsx | Loading placeholder |

### Navigasyon

| Component | Dosya | Aciklama |
|-----------|-------|----------|
| Breadcrumb | breadcrumb.tsx | Breadcrumb navigation |
| Dropdown Menu | dropdown-menu.tsx | Dropdown menu |
| Navigation Menu | navigation-menu.tsx | Navbar menu |

### Tablo

| Component | Dosya | Aciklama |
|-----------|-------|----------|
| Table | table.tsx | Data table |

### Form

| Component | Dosya | Aciklama |
|-----------|-------|----------|
| Form | form.tsx | React Hook Form wrapper |

---

## Luxury Components

**Detayli bilgi:** `.claude/skills/halikarnas-design-system.md`

Premium animasyon iceren componentler. Collection ve brand sayfalari icin.

**Path:** `src/components/ui/luxury/`

### GoldDivider

Animasyonlu altin dekoratif cizgi.

```tsx
import { GoldDivider } from "@/components/ui/luxury";

// Basic
<GoldDivider />

// Variants
<GoldDivider variant="default" />  // 4rem width
<GoldDivider variant="wide" />     // 6rem width
<GoldDivider variant="full" />     // max width

// Centered
<GoldDivider className="mx-auto" />

// Without animation
<GoldDivider animated={false} />

// With delay
<GoldDivider delay={0.3} />
```

---

### MagneticButton

Manyetik hover efektli buton. Premium CTA'lar icin.

```tsx
import { MagneticButton, ArrowIcon } from "@/components/ui/luxury";

// Primary (gold background)
<MagneticButton variant="primary">Kesfet</MagneticButton>

// Outline
<MagneticButton variant="outline">Detaylar</MagneticButton>

// Ghost
<MagneticButton variant="ghost">Daha Fazla</MagneticButton>

// With icon
<MagneticButton icon={<ArrowIcon />}>Devam Et</MagneticButton>

// As link
<MagneticButton href="/koleksiyonlar">Koleksiyonlar</MagneticButton>

// Sizes
<MagneticButton size="default">Default</MagneticButton>
<MagneticButton size="lg">Large</MagneticButton>
<MagneticButton size="xl">Extra Large</MagneticButton>
```

---

### TextReveal

Text animasyonlari. Luxury sayfalari icin.

```tsx
import { TextReveal, TextFadeIn, LetterSpacingReveal } from "@/components/ui/luxury";

// Word-by-word reveal
<TextReveal text="Premium El Yapimi Sandaletler" />

// Fade in paragraph
<TextFadeIn>
  Uzun paragraf metni burada yer alir...
</TextFadeIn>

// Letter spacing reveal (hero titles icin)
<LetterSpacingReveal>AEGEAN</LetterSpacingReveal>
```

---

### ParallaxImage

Parallax scroll efektli gorsel.

```tsx
import { ParallaxImage, ParallaxLayeredImage } from "@/components/ui/luxury";

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

// Layered (foreground + background)
<ParallaxLayeredImage
  backgroundSrc="/bg.jpg"
  foregroundSrc="/product.png"
/>
```

---

### ScrollIndicator

Scroll-snap sayfalar icin ilerleme gostergesi.

```tsx
import { ScrollIndicator, ChevronBounce } from "@/components/ui/luxury";

// Full progress indicator
<ScrollIndicator
  currentFrame={2}
  totalFrames={7}
/>

// Simple bouncing chevron
<ChevronBounce />

// Variants
<ScrollIndicator variant="arrow" />
<ScrollIndicator variant="mouse" />
<ScrollIndicator variant="line" />
```

---

### EditorialQuote

Editorial stil alintilar.

```tsx
import { EditorialQuote, EditorialText } from "@/components/ui/luxury";

<EditorialQuote
  quote="Luxury is in each detail."
  author="Hubert de Givenchy"
/>

<EditorialText>
  Editorial paragraf metni...
  Birden fazla satir olabilir.
</EditorialText>
```

---

### VideoBackground

Video veya gradient arka plan.

```tsx
import { VideoBackground, AnimatedGradientBackground } from "@/components/ui/luxury";

// Video background
<VideoBackground
  src="/videos/hero.mp4"
  poster="/images/hero-poster.jpg"
  overlay="gradient"
/>

// Animated gradient (video fallback)
<AnimatedGradientBackground />
```

---

### ProductShowcase

Luxury stil urun kartlari.

```tsx
import { ProductCardLuxury, ProductGridLuxury } from "@/components/ui/luxury";

// Single card
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

## Component Patterns

### Loading State

```tsx
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Inline loading
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Yukleniyor...
</Button>

// Skeleton loading
<Skeleton className="h-12 w-full" />
```

### Error State

```tsx
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertDescription>Bir hata olustu</AlertDescription>
</Alert>
```

### Empty State

```tsx
<div className="text-center py-12">
  <Icon className="mx-auto h-12 w-12 text-gray-400" />
  <h3 className="mt-2 text-lg font-medium">Burada hicbir sey yok</h3>
  <p className="text-gray-500">Hemen eklemeye baslayin.</p>
  <Button className="mt-4">Ekle</Button>
</div>
```

### Form Pattern

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Gecerli email girin"),
  password: z.string().min(8, "En az 8 karakter"),
});

type FormData = z.infer<typeof schema>;

export function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    // API call
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* More fields */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Gonder
        </Button>
      </form>
    </Form>
  );
}
```

---

## Styling Guidelines

### Button Variants

```tsx
// Primary (default)
<Button>Primary</Button>

// Secondary
<Button variant="secondary">Secondary</Button>

// Outline
<Button variant="outline">Outline</Button>

// Ghost
<Button variant="ghost">Ghost</Button>

// Destructive
<Button variant="destructive">Delete</Button>

// Link
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### Common Classes (Luxury Tokens)

```tsx
// Page background
<div className="bg-luxury-cream min-h-screen">

// Container
<div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">

// Card
<div className="bg-luxury-ivory border-luxury-stone rounded-lg shadow-soft p-6">

// Section title
<h2 className="font-serif text-2xl md:text-3xl text-luxury-charcoal mb-6">

// Body text
<p className="text-luxury-charcoal/80">

// Link
<a className="text-luxury-primary hover:text-luxury-gold">

// Luxury label
<span className="font-display text-xs tracking-[0.3em] uppercase text-luxury-gold">

// Gold divider
<GoldDivider className="mx-auto my-8" />

// Grid layouts
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">

// Flex center
<div className="flex items-center justify-center">
```

### Legacy Classes (DEPRECATED)

```tsx
// DO NOT USE - Migrate to luxury tokens
text-leather-*  -> text-luxury-charcoal
bg-sand-*       -> bg-luxury-cream/ivory/stone
text-aegean-*   -> text-luxury-primary
bg-aegean-*     -> bg-luxury-primary
```

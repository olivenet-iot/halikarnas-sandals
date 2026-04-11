# Skill: Halikarnas Frontend Gelistirme

## Bu Skill Ne Zaman Kullanilir

- Yeni component olusturma
- Sayfa ekleme/duzenleme
- Styling ve responsive tasarim
- Form islemleri
- State yonetimi
- API entegrasyonu

---

## Component Olusturma Kurallari

### 1. Dosya Yapisi

```typescript
"use client"; // Sadece client component icin

// 1. React imports
import { useState, useEffect } from "react";

// 2. Next.js imports
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// 3. UI component imports
import { Button } from "@/components/ui/button";

// 4. Icon imports
import { ShoppingCart, Heart } from "lucide-react";

// 5. Lib/utils imports
import { cn, formatPrice } from "@/lib/utils";

// 6. Store imports
import { useCartStore } from "@/stores/cart-store";

// 7. Types
interface ComponentProps {
  title: string;
  isActive?: boolean;
  onAction?: () => void;
}

// 8. Component
export function MyComponent({ title, isActive = false, onAction }: ComponentProps) {
  // Hooks
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Effects
  useEffect(() => {
    // ...
  }, []);

  // Handlers
  const handleClick = () => {
    onAction?.();
  };

  // Render
  return (
    <div className={cn("base-class", isActive && "active-class")}>
      {title}
    </div>
  );
}
```

### 2. Server vs Client Component

```typescript
// Server Component (default)
// - Direct database access
// - No useState, useEffect
// - No event handlers
// - Better performance
export default async function ProductPage() {
  const products = await db.product.findMany();
  return <ProductGrid products={products} />;
}

// Client Component
// - useState, useEffect kullanimi
// - Event handlers
// - Browser APIs
// - "use client" directive gerekli
"use client";
export function AddToCartButton({ productId }: { productId: string }) {
  const { addItem } = useCartStore();
  return <Button onClick={() => addItem(productId)}>Sepete Ekle</Button>;
}
```

---

## Styling Guidelines

**Detayli bilgi:** `.claude/skills/halikarnas-design-system.md`

### Renk Sistemi (V2 Palette)

```tsx
// V2 PRIMARY -- Renkler
<Button className="bg-v2-text-primary text-white hover:opacity-90 rounded-none">
<Link className="link-underline-v2 text-v2-text-primary">

// Backgrounds
<div className="bg-v2-bg-primary">      // Page background (#FAF7F2)
<div className="bg-v2-bg-dark">         // Footer, dark sections (#2A2A26)

// Text
<h1 className="text-v2-text-primary font-serif font-light">   // Basliklar (#1C1917)
<p className="text-v2-text-muted font-inter">                 // Body text (#6B6560)
<span className="text-v2-accent font-inter">                  // Accent (#8B6F47)

// Border
<div className="border-b border-v2-border-subtle">            // (#E8E2D8)
```

> **Legacy Not:** `luxury-*` tokenlari sadece admin, auth ve hesabim sayfalarinda kullanilir.
> Yeni V2 sayfalarinda `luxury-*`, `sand-*`, `aegean-*`, `leather-*`, `terracotta-*` tokenlari YASAKTIR.

### Typography

```tsx
// Hero title
<h1 className="font-serif font-light text-[2.5rem] md:text-[4rem] text-v2-text-primary">

// Section title
<h2 className="font-serif font-light text-2xl md:text-3xl text-v2-text-primary">

// Eyebrow label
<span className="font-inter text-v2-label uppercase tracking-[0.2em] text-v2-accent">

// Body
<p className="font-inter text-v2-body text-v2-text-muted leading-relaxed">

// Form label
<label className="font-inter text-xs uppercase tracking-[0.15em] text-v2-text-muted">

// Product name
<h3 className="font-serif font-normal text-sm text-v2-text-primary">

// Price
<span className="font-inter text-sm text-v2-text-primary">

// Nav link
<span className="font-inter text-xs uppercase tracking-[0.15em] text-v2-text-primary">
```

### Layout Patterns

```tsx
// V2 Container
<div className="container-v2">

// V2 Section
<section className="section-v2 container-v2">

// 12-column Grid
<div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24">

// Product Grid (4 columns)
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

// Flex Center
<div className="flex items-center justify-center">

// Flex Between
<div className="flex items-center justify-between">
```

### Card Pattern (V2 Product Card)

```tsx
// V2 Product Card -- no border, no rounded
<div className="group relative w-full">
  <div className="aspect-[3/4] overflow-hidden bg-v2-bg-primary">
    <Image
      src="..."
      alt="..."
      fill
      className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.02]"
    />
  </div>
  <div className="pt-3 space-y-1">
    <h3 className="font-serif font-normal text-sm text-v2-text-primary">{name}</h3>
    <p className="font-inter text-sm text-v2-text-primary">{formatPrice(price)}</p>
  </div>
</div>
```

### Section Pattern

```tsx
<section className="section-v2 container-v2">
  <span className="font-inter text-v2-label uppercase tracking-[0.2em] text-v2-accent block mb-4">
    KATEGORI
  </span>
  <h2 className="font-serif font-light text-2xl md:text-3xl text-v2-text-primary mb-6">
    Baslik
  </h2>
  <p className="font-inter text-v2-body text-v2-text-muted mb-12">
    Aciklama
  </p>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Items */}
  </div>
</section>
```

---

## Form Pattern

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
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmali"),
  email: z.string().email("Gecerli email girin"),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Gonderim basarisiz");

      toast({
        title: "Basarili!",
        description: "Mesajiniz gonderildi.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Hata!",
        description: "Bir hata olustu.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad Soyad</FormLabel>
              <FormControl>
                <Input placeholder="Adinizi girin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="ornek@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="bg-v2-text-primary text-white hover:opacity-90 rounded-none w-full py-3 font-inter text-xs uppercase tracking-[0.15em]"
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Gonder
        </Button>
      </form>
    </Form>
  );
}
```

---

## Data Fetching

### Server Component (Tercih Edilen)

```tsx
// Direct database query
export default async function ProductsPage() {
  const products = await db.product.findMany({
    where: { status: "ACTIVE" },
    include: { images: true },
  });

  return <ProductGrid products={products} />;
}
```

### Client Component

```tsx
"use client";

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) return <Skeleton />;

  return <ProductGrid products={products} />;
}
```

---

## Zustand Store Kullanimi

```tsx
"use client";

import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

export function ProductActions({ product, variant }) {
  const { addItem } = useCartStore();
  const { isInWishlist, addItem: addToWishlist, removeItem } = useWishlistStore();

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="flex gap-2">
      <Button onClick={() => addItem(product, variant, 1)}>
        Sepete Ekle
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          inWishlist ? removeItem(product.id) : addToWishlist(product)
        }
      >
        <Heart className={cn(inWishlist && "fill-red-500 text-red-500")} />
      </Button>
    </div>
  );
}
```

---

## Loading States

```tsx
// Skeleton Loading (V2)
import { Skeleton } from "@/components/ui/skeleton";

function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="aspect-[3/4] w-full bg-v2-border-subtle animate-pulse" />
      <div className="h-4 w-3/4 bg-v2-border-subtle animate-pulse" />
      <div className="h-4 w-1/2 bg-v2-border-subtle animate-pulse" />
    </div>
  );
}

// Button Loading
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Kaydet
</Button>

// Page Loading (loading.tsx)
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-v2-text-muted" />
    </div>
  );
}
```

---

## Responsive Design

```tsx
// Breakpoints: sm (640), md (768), lg (1024), xl (1280), 2xl (1536)

// Mobile-first approach
<div className="
  grid
  grid-cols-1           // Mobile: 1 column
  sm:grid-cols-2        // Small: 2 columns
  md:grid-cols-3        // Medium: 3 columns
  lg:grid-cols-4        // Large: 4 columns
  gap-4 md:gap-6
">

// Hide/show
<div className="hidden md:block">Desktop only</div>
<div className="md:hidden">Mobile only</div>

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Responsive padding
<section className="py-8 md:py-12 lg:py-16">
```

---

## Image Handling

```tsx
import Image from "next/image";

// Product Image
<Image
  src={product.images[0].url}
  alt={product.images[0].alt || product.name}
  width={400}
  height={533}  // 3:4 ratio
  className="object-cover"
  priority={index < 4}  // Above fold images
/>

// Fill container
<div className="relative aspect-[3/4]">
  <Image
    src={url}
    alt={alt}
    fill
    sizes="(max-width: 768px) 50vw, 25vw"
    className="object-cover"
  />
</div>

// Blur placeholder
<Image
  src={url}
  alt={alt}
  fill
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

---

## Animation

**Detayli bilgi:** `.claude/skills/halikarnas-design-system.md`

### V2 Animasyonlar (Tercih Edilen)

V2 animasyonlar: `sectionRevealV2`, `staggerV2`, `viewportV2` kullanin.
CSS-first yaklasim: basit animasyonlar icin `transition-all duration-700 ease-out` tercih edin.

### Import

```tsx
import { motion } from "framer-motion";
import {
  TIMING,
  EASE,
  fadeInUp,
  sectionRevealV2,
  staggerV2,
  viewportV2,
} from "@/lib/animations";
```

### V2 Section Reveal (Tercih Edilen)

```tsx
// Section reveal on scroll
<motion.div
  variants={sectionRevealV2}
  initial="hidden"
  whileInView="visible"
  viewport={viewportV2}
>
  Content
</motion.div>

// Staggered list (V2)
<motion.div
  variants={staggerV2}
  initial="hidden"
  whileInView="visible"
  viewport={viewportV2}
>
  {items.map((item) => (
    <motion.div key={item.id} variants={sectionRevealV2}>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

### CSS-First Animation (Basit Durumlar Icin)

```tsx
// Entry reveal
<div className={cn(
  "transition-all duration-700 ease-out",
  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
)}>
  Content
</div>

// Image hover zoom (800ms, max 1.02 scale)
<div className="relative overflow-hidden">
  <Image
    src="..."
    alt="..."
    fill
    className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.02]"
  />
</div>

// Product image swap (opacity transition)
<Image className="object-cover transition-all duration-[400ms] ease-out group-hover:opacity-0" />
<Image className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] ease-out" />
```

### Manuel Animation (Gerektiginde)

```tsx
// Fade in with luxury easing
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: TIMING.medium, ease: EASE.luxury }}
>

// Slide up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: TIMING.slow, ease: EASE.luxury }}
  viewport={{ once: true }}
>

// Step transition (checkout)
<AnimatePresence mode="wait">
  <motion.div
    key={currentStep}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.4, ease: EASE.luxury }}
  >
    {/* Step content */}
  </motion.div>
</AnimatePresence>
```

### TIMING & EASE Constants

```tsx
// Timing
TIMING.instant  // 0.15s - micro-interactions
TIMING.fast     // 0.3s  - hovers
TIMING.medium   // 0.5s  - overlays
TIMING.slow     // 0.7s  - sections
TIMING.cinematic // 1.5s - hero

// Easing
EASE.luxury     // [0.4, 0, 0.2, 1] - premium feel (DEFAULT)
EASE.smooth     // [0.25, 0.1, 0.25, 1]
EASE.bounce     // bouncy effect
EASE.spring     // physics-based

// V2 viewport settings
viewportV2      // { once: true, amount: 0.15, margin: "-50px" }
```

---

## LEGACY -- Sadece admin/auth/hesabim

**UYARI:** Asagidaki component'ler V2 sayfalarda KESINLIKLE kullanilmaz. Sadece admin paneli, auth sayfalari ve hesabim bolumunde kalirlar.

**Detayli bilgi:** `.claude/skills/halikarnas-design-system.md`

### Import

```tsx
import {
  GoldDivider,
  MagneticButton,
  TextReveal,
  TextFadeIn,
  ParallaxImage,
  ScrollIndicator,
  EditorialQuote,
} from "@/components/ui/luxury";
```

### Kullanim Ornekleri (sadece legacy sayfalar)

```tsx
// Gold divider
<GoldDivider />
<GoldDivider variant="wide" />

// Magnetic button (gold, premium feel)
<MagneticButton variant="primary">Kesfet</MagneticButton>
<MagneticButton variant="outline" href="/hakkimizda">
  Hikayemiz
</MagneticButton>

// Text animations
<TextReveal text="Premium El Yapimi" />
<TextFadeIn>Paragraf metni...</TextFadeIn>

// Parallax image
<ParallaxImage
  src="/hero.jpg"
  alt="Hero"
  parallaxAmount={0.3}
/>

// Scroll indicator (for scroll-snap pages)
<ScrollIndicator currentFrame={2} totalFrames={7} />

// Editorial quote
<EditorialQuote
  quote="Luxury is in each detail."
  author="Hubert de Givenchy"
/>
```

### Legacy Renk Token'lari (admin/auth/hesabim)

```tsx
// Bu tokenlar SADECE legacy sayfalarda kullanilir
<Button className="bg-luxury-primary hover:bg-luxury-primary-light text-white">
<span className="text-luxury-gold">
<div className="bg-luxury-cream">
<div className="bg-luxury-ivory border-luxury-stone">
```

### Legacy Animation'lar

```tsx
// Sadece legacy sayfalarda
import { goldLine, letterSpacingReveal, staggerContainerCinematic } from "@/lib/animations";

<motion.div variants={goldLine}>
  <GoldDivider />
</motion.div>
```

---

## V2 Sayfa Olusturma Rehberi

1. Sayfa arka plani: `bg-v2-bg-primary`
2. Section'lar: `section-v2 container-v2`
3. Basliklar: `font-serif font-light` (Cormorant Garamond)
4. Body text: `font-inter` (Inter)
5. Linkler: `link-underline-v2`
6. Formlar: Underline input pattern (border-b, no card wrapper)
7. Butonlar: `rounded-none`, outline veya dolu siyah
8. Animasyonlar: sectionRevealV2 + viewportV2

**Detayli pattern ornekleri:** `.claude/skills/halikarnas-v2-patterns.md`
**Detayli token bilgisi:** `.claude/skills/halikarnas-design-system.md`

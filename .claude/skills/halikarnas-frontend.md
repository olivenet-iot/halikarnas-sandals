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
import { Card } from "@/components/ui/card";

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

### Renk Sistemi

```tsx
// Primary (Aegean)
<Button className="bg-aegean-500 hover:bg-aegean-600 text-white">
<Link className="text-aegean-600 hover:text-aegean-700">

// Secondary (Sand)
<div className="bg-sand-50">
<Button variant="outline" className="border-sand-300 hover:bg-sand-100">

// Text (Leather)
<h1 className="text-leather-900">  // Basliklar
<p className="text-leather-600">   // Body text
<span className="text-leather-400"> // Muted text

// Accent (Terracotta)
<Badge className="bg-terracotta-500"> // Sale badge
```

### Typography

```tsx
// Headings
<h1 className="text-3xl md:text-4xl font-bold font-heading text-leather-900">
<h2 className="text-2xl md:text-3xl font-bold text-leather-900">
<h3 className="text-xl font-semibold text-leather-900">

// Body
<p className="text-body-md text-leather-600">
<p className="text-body-sm text-leather-500">

// Labels
<label className="text-sm font-medium text-leather-700">
```

### Layout Patterns

```tsx
// Container
<div className="container py-8 md:py-12">

// Section
<section className="py-16 md:py-24">

// Grid
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

// Flex Center
<div className="flex items-center justify-center">

// Flex Between
<div className="flex items-center justify-between">
```

### Card Pattern

```tsx
<Card className="bg-white rounded-lg shadow-soft border overflow-hidden">
  <CardHeader className="p-4 border-b">
    <CardTitle>Baslik</CardTitle>
  </CardHeader>
  <CardContent className="p-4">
    Icerik
  </CardContent>
  <CardFooter className="p-4 border-t bg-sand-50">
    Footer
  </CardFooter>
</Card>
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

        <Button type="submit" disabled={form.formState.isSubmitting}>
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
// Skeleton Loading
import { Skeleton } from "@/components/ui/skeleton";

function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-64 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
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
      <Loader2 className="h-8 w-8 animate-spin text-aegean-600" />
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

## Animation (Framer Motion)

```tsx
import { motion } from "framer-motion";

// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>

// Slide up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>

// Stagger children
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

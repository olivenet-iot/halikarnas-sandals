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

### Common Classes

```tsx
// Container
<div className="container py-8 md:py-12">

// Card
<div className="bg-white rounded-lg shadow-soft border p-6">

// Section title
<h2 className="text-2xl md:text-3xl font-bold text-leather-900 mb-6">

// Body text
<p className="text-leather-600">

// Link
<a className="text-aegean-600 hover:underline">

// Grid layouts
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

// Flex center
<div className="flex items-center justify-center">
```

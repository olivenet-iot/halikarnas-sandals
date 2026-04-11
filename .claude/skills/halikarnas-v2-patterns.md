# Skill: Halikarnas V2 Component Patterns

## Bu Skill Ne Zaman Kullanilir

- Yeni V2 sayfa olusturma
- V2 component yazma
- V2 form olusturma
- V2 section ekleme
- Mevcut sayfayi V2'ye migrate etme
- Checkout/helper sayfa pattern'leri

**Detayli token bilgisi:** `.claude/skills/halikarnas-design-system.md`

---

## 1. V2 Page Scaffold

Her yeni V2 sayfasi bu template'den baslar:

```tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sayfa Adi | Halikarnas Sandals",
  description: "Sayfa aciklamasi",
};

export default function PageName() {
  return (
    <div className="bg-v2-bg-primary">
      {/* Hero/Header Section */}
      <section className="section-v2 container-v2">
        <span className="font-inter text-v2-label uppercase tracking-[0.2em] text-v2-accent block mb-4">
          KATEGORI
        </span>
        <h1 className="font-serif font-light text-2xl md:text-4xl text-v2-text-primary mb-6">
          Sayfa Basligi
        </h1>
        <p className="font-inter text-v2-body text-v2-text-muted max-w-2xl leading-relaxed">
          Aciklama metni
        </p>
      </section>

      {/* Content Section */}
      <section className="section-v2 container-v2">
        {/* Content */}
      </section>
    </div>
  );
}
```

### Onemli CSS Utility'ler

| Utility | Ne Yapar | Kaynak |
|---------|----------|--------|
| `section-v2` | `py-v2-section-mobile md:py-v2-section` (6.25rem / 10rem) | globals.css |
| `container-v2` | `px-6 md:px-12 lg:px-24 mx-auto max-w-[1440px]` | globals.css |
| `link-underline-v2` | Hover'da soldan saga 1px underline animasyonu (400ms) | globals.css |

---

## 2. V2 Section Variants

### 2a. Text + Image Side-by-Side

Kullanim: Hikayemiz, BrandStoryTeaser, zanaat bloklari.

Ozellik: 12-column grid, text 5 kolon, image 7 kolon (veya 6+1 gap). `items-start` veya `items-center` tercih durumuna gore.

```tsx
<section className="section-v2 container-v2">
  <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24 items-start">
    {/* Left column — text */}
    <div className="md:col-span-5">
      <span className="font-inter text-v2-label uppercase tracking-[0.2em] text-v2-accent block mb-6">
        ETIKET
      </span>
      <h2 className="font-serif font-light text-2xl md:text-3xl text-v2-text-primary mb-8">
        Baslik
      </h2>
      <div className="font-inter text-v2-body text-v2-text-muted max-w-[60ch] space-y-4">
        <p>Paragraf bir.</p>
        <p>Paragraf iki.</p>
      </div>
    </div>

    {/* Right column — image */}
    <div className="hidden md:block md:col-span-6 md:col-start-7">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image src="..." alt="..." fill className="object-cover" sizes="(max-width: 768px) 0px, 50vw" />
      </div>
    </div>
  </div>
</section>
```

**Ters Yerlesiim** (image sol, text sag): `md:col-span-7` image icin, `md:col-span-5` text icin, grid order degistir.

### 2b. Full-Bleed Editorial

Kullanim: Atmosferik gorsel + tek cumle statement.

```tsx
<section className="relative w-full h-[60vh] md:h-[70vh] min-h-[500px] overflow-hidden">
  <Image
    src="..."
    alt="..."
    fill
    className="object-cover object-[center_75%]"
    sizes="100vw"
  />
  {/* Centered statement text */}
  <p className="absolute inset-0 flex items-center justify-center font-serif italic font-light text-3xl md:text-5xl lg:text-6xl text-white/90">
    Her dikis, bir usta eli.
  </p>
</section>
```

**Varyant** (alt-sol metin):
```tsx
<div className="absolute inset-0 flex items-end p-8 md:p-16">
  <p className="font-serif font-light text-xl md:text-2xl text-white max-w-lg">
    Atmosfer metni
  </p>
</div>
```

### 2c. Product Grid Section

Kullanim: Atolyeden/secmeler, vitrin alanlari. 4 esit kolon.

```tsx
<section className="section-v2 container-v2">
  {/* Section heading + "See all" link */}
  <div className="flex items-end justify-between mb-12 md:mb-16">
    <h2 className="font-serif font-light text-v2-section-sm md:text-v2-section text-v2-text-primary">
      Atolyeden
    </h2>
    <Link
      href="/kadin"
      className="font-inter text-xs tracking-[0.15em] uppercase text-v2-text-primary link-underline-v2"
    >
      Tumunu Gor &rarr;
    </Link>
  </div>

  {/* Equal 4-column product grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
    {products.map(product => (
      <ProductCardV2 key={product.id} product={product} />
    ))}
  </div>
</section>
```

**Urun Karti Yapisi** (kartlar arasi tutarlilik icin):
```tsx
<Link href={url} className="group block w-full">
  {/* Image */}
  <div className="relative overflow-hidden bg-v2-bg-primary aspect-[4/5]">
    <Image
      src={mainImage}
      alt={name}
      fill
      className="object-cover transition-all duration-[400ms] ease-out group-hover:opacity-0"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
    />
    {hoverImage && (
      <Image
        src={hoverImage}
        alt={`${name} - 2`}
        fill
        className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] ease-out"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
    )}
  </div>

  {/* Info */}
  <div className="mt-4">
    <h3 className="font-serif font-normal text-sm tracking-[-0.01em] text-v2-text-muted">
      {name}
    </h3>
    <div className="flex items-baseline gap-3 mt-2">
      <span className="font-inter text-sm text-v2-text-primary">{formatPrice(price)}</span>
      {compareAtPrice && (
        <span className="font-inter text-xs text-v2-text-muted line-through">
          {formatPrice(compareAtPrice)}
        </span>
      )}
    </div>
  </div>
</Link>
```

### 2d. Centered Single Column

Kullanim: SSS, Iletisim, Beden Rehberi, form sayfalari.

```tsx
<div className="bg-v2-bg-primary">
  <section className="py-20 md:py-28">
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <div className="text-center mb-16">
        <span className="text-v2-accent tracking-widest text-xs font-inter uppercase">
          ETIKET
        </span>
        <h1 className="font-serif font-light text-4xl md:text-5xl text-v2-text-primary mt-4">
          Baslik
        </h1>
        <p className="font-inter text-v2-text-muted mt-4">
          Alt baslik aciklama
        </p>
      </div>

      {/* Content (form, accordion, table, etc.) */}
    </div>
  </section>
</div>
```

### 2e. Editorial Category Block

Kullanim: Cinsiyet/kategori vitrin alani.

```tsx
<section className="section-v2 container-v2">
  <div className="grid grid-cols-1 md:grid-cols-[65fr_35fr] gap-4 md:gap-6">
    {/* Large image — primary category */}
    <Link href="/kadin" className="group block">
      <div className="relative h-[400px] md:h-[650px] overflow-hidden">
        <Image
          src="..."
          alt="..."
          fill
          className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 65vw"
        />
      </div>
      <span className="inline-block mt-4 font-inter text-v2-label uppercase text-v2-text-muted link-underline-v2">
        Kadin
      </span>
    </Link>

    {/* Smaller image + typography block */}
    <div className="flex flex-col gap-4 md:gap-6">
      <Link href="/erkek" className="group block">
        <div className="relative h-[400px] md:h-[65%] min-h-[350px] overflow-hidden">
          <Image src="..." alt="..." fill
            className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 35vw"
          />
        </div>
        <span className="inline-block mt-4 font-inter text-v2-label uppercase text-v2-text-muted link-underline-v2">
          Erkek
        </span>
      </Link>

      <div className="flex items-end flex-1 pb-4">
        <h2 className="font-serif font-light text-2xl md:text-3xl lg:text-4xl text-v2-text-primary leading-[1.2]">
          Farkli Yollar,<br />Ayni Ustalik
        </h2>
      </div>
    </div>
  </div>
</section>
```

---

## 3. V2 Form Patterns

### V2 Input Wrapper (forwardRef zorunlu)

react-hook-form ile kullanim icin `forwardRef` SART. Bu olmadan validation calismaz.

```tsx
const V2Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
    required?: boolean;
  }
>(({ label, error, required, className, ...props }, ref) => {
  return (
    <div>
      <label className="font-inter text-xs uppercase tracking-[0.15em] text-v2-text-muted mb-2 block">
        {label} {required && <span className="text-v2-accent">*</span>}
      </label>
      <input
        ref={ref}
        className={cn(
          "w-full px-0 pb-2 bg-transparent border-0 border-b border-v2-border-subtle",
          "text-v2-text-primary text-sm outline-none",
          "focus:border-v2-text-primary transition-colors duration-200",
          "placeholder:text-v2-text-muted/50",
          error && "border-red-400 focus:border-red-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
});
V2Input.displayName = "V2Input";
```

### V2 Select Wrapper

```tsx
const V2Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    error?: string;
    required?: boolean;
  }
>(({ label, error, required, children, className, ...props }, ref) => {
  return (
    <div>
      <label className="font-inter text-xs uppercase tracking-[0.15em] text-v2-text-muted mb-2 block">
        {label} {required && <span className="text-v2-accent">*</span>}
      </label>
      <select
        ref={ref}
        className={cn(
          "w-full px-0 pb-2 bg-transparent border-0 border-b border-v2-border-subtle",
          "text-v2-text-primary text-sm outline-none appearance-none cursor-pointer",
          "focus:border-v2-text-primary transition-colors duration-200",
          error && "border-red-400 focus:border-red-400",
          className
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B6560'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0px center",
          backgroundSize: "20px",
        }}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
});
V2Select.displayName = "V2Select";
```

### V2 Textarea Wrapper

```tsx
const V2Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    error?: string;
    required?: boolean;
  }
>(({ label, error, required, className, ...props }, ref) => {
  return (
    <div>
      <label className="font-inter text-xs uppercase tracking-[0.15em] text-v2-text-muted mb-2 block">
        {label} {required && <span className="text-v2-accent">*</span>}
      </label>
      <textarea
        ref={ref}
        className={cn(
          "w-full px-0 pb-2 bg-transparent border-0 border-b border-v2-border-subtle",
          "text-v2-text-primary text-sm outline-none resize-none min-h-[80px]",
          "focus:border-v2-text-primary transition-colors duration-200",
          "placeholder:text-v2-text-muted/50",
          error && "border-red-400 focus:border-red-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
});
V2Textarea.displayName = "V2Textarea";
```

### Form Layout

V2 form'larda 2-kolon grid. Full-width field'lar `md:col-span-2` ile.

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
    <V2Input label="Ad" required placeholder="Adiniz"
      error={errors.firstName?.message} {...register("firstName")} />
    <V2Input label="Soyad" required placeholder="Soyadiniz"
      error={errors.lastName?.message} {...register("lastName")} />

    {/* Full-width field */}
    <div className="md:col-span-2">
      <V2Textarea label="Adres" required placeholder="..."
        error={errors.address?.message} {...register("address")} />
    </div>
  </div>

  {/* Submit */}
  <div className="flex justify-end pt-8">
    <button type="submit"
      className="border border-v2-text-primary text-v2-text-primary bg-transparent
        hover:bg-v2-text-primary hover:text-white
        px-8 py-3 text-sm tracking-wide uppercase transition-colors rounded-none">
      Devam Et &rarr;
    </button>
  </div>
</form>
```

### Checkout Section Heading Pattern

Her form step'i ayni heading pattern ile baslar:

```tsx
<h2 className="font-serif font-light text-2xl md:text-3xl text-v2-text-primary">
  Teslimat Bilgileri
</h2>
<div className="border-b border-v2-border-subtle mt-4 mb-8" />
```

---

## 4. V2 Checkout Patterns

### Text Stepper (Numarali circle YASAK)

Checkout step gostergesi olarak yalnizca metin kullan:

```tsx
<div className="py-8 mb-8">
  <div className="flex items-center justify-center gap-3">
    {steps.map((step, index) => (
      <div key={step.number} className="flex items-center gap-3">
        <span className="flex flex-col items-center">
          <span className={`font-inter font-medium text-xs tracking-[0.15em] uppercase ${
            currentStep > step.number
              ? "text-v2-text-muted"       /* completed */
              : currentStep === step.number
                ? "text-v2-text-primary"    /* active */
                : "text-v2-text-muted opacity-50"  /* upcoming */
          }`}>
            {currentStep > step.number && (
              <Check className="w-3 h-3 inline mr-1" strokeWidth={1.5} />
            )}
            {step.label}
          </span>
          {currentStep === step.number && (
            <span className="block w-6 h-px bg-v2-accent mt-1" />
          )}
        </span>
        {index < steps.length - 1 && (
          <span className="text-v2-text-muted/30 text-xs">&middot;</span>
        )}
      </div>
    ))}
  </div>
</div>
```

### Checkout Layout (2-panel)

```tsx
<div className="min-h-screen bg-v2-bg-primary">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <CheckoutSteps currentStep={currentStep} />

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
      {/* Form (left) */}
      <div className="lg:col-span-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: EASE.luxury }}
          >
            {currentStep === 1 && <ShippingForm onNext={nextStep} />}
            {currentStep === 2 && <PaymentForm onNext={nextStep} onBack={prevStep} />}
            {currentStep === 3 && <OrderReview onBack={prevStep} setStep={setStep} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Summary (right, sticky) */}
      <div className="lg:col-span-5">
        <CheckoutSummary />
      </div>
    </div>
  </div>
</div>
```

### Order Summary Pattern

```tsx
<div className="sticky lg:top-24">
  <h2 className="font-serif font-light text-2xl text-v2-text-primary mb-6">
    Siparis Ozeti
  </h2>
  <div className="border-b border-v2-border-subtle mb-2" />

  {/* Items */}
  {items.map(item => (
    <div key={item.id} className="flex gap-4 py-4 border-b border-v2-border-subtle">
      {/* 60x60 thumbnail, info, price */}
    </div>
  ))}

  {/* Price rows */}
  <div className="space-y-3 text-sm">
    <div className="flex justify-between">
      <span className="text-v2-text-muted">Ara Toplam</span>
      <span className="font-medium text-v2-text-primary">{formatPrice(subtotal)}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-v2-text-muted">Kargo</span>
      <span className="text-v2-accent">Ucretsiz</span>
    </div>
  </div>

  {/* Total */}
  <div className="border-t border-v2-border-subtle mt-6 pt-4">
    <div className="flex justify-between items-center">
      <span className="text-lg font-medium text-v2-text-primary">Toplam</span>
      <span className="font-serif text-xl text-v2-text-primary">{formatPrice(total)}</span>
    </div>
  </div>
</div>
```

---

## 5. V2 Button Hierarchy

| Tip | Kullanim | Classes |
|-----|----------|---------|
| **Primary (dolu)** | Final CTA (Siparisi Tamamla) | `bg-v2-text-primary text-white hover:opacity-90 rounded-none w-full py-4 font-inter text-sm tracking-wide uppercase transition-colors` |
| **Secondary (outline)** | Devam Et, standart CTA | `border border-v2-text-primary text-v2-text-primary bg-transparent hover:bg-v2-text-primary hover:text-white px-8 py-3 font-inter text-sm tracking-wide uppercase transition-colors rounded-none` |
| **Text link** | "Tumunu Gor", "Duzenle" | `font-inter text-xs tracking-[0.15em] uppercase text-v2-text-primary link-underline-v2` |
| **Navigasyon link** | Kategori baglantilari | `font-inter font-medium text-sm text-v2-text-primary underline underline-offset-4 hover:text-v2-text-muted transition-colors` |
| **Back link** | Geri don | `text-v2-text-muted hover:text-v2-text-primary underline underline-offset-4 text-sm transition-colors` |
| **Disabled** | Devre disi durum | `opacity-50 cursor-not-allowed` eklenir |

### Buton Ornekleri

```tsx
{/* Primary — son adim CTA */}
<button className="w-full py-4 bg-v2-text-primary text-white font-inter text-sm
  tracking-wide uppercase hover:opacity-90 transition-colors rounded-none">
  Siparisi Tamamla
</button>

{/* Secondary — adim ilerleme */}
<button className="border border-v2-text-primary text-v2-text-primary bg-transparent
  hover:bg-v2-text-primary hover:text-white px-8 py-3 font-inter text-sm
  tracking-wide uppercase transition-colors rounded-none">
  Devam Et &rarr;
</button>

{/* Text link — section ici navigasyon */}
<Link href="/kadin"
  className="font-inter text-xs tracking-[0.15em] uppercase text-v2-text-primary link-underline-v2">
  Tumunu Gor &rarr;
</Link>
```

---

## 6. V2 Typography Quick Reference

| Element | Classes |
|---------|---------|
| Hero title | `font-serif font-light text-[2.5rem] md:text-[4rem] lg:text-[5.5rem] leading-[1.05] text-v2-text-primary` |
| Page title (centered) | `font-serif font-light text-4xl md:text-5xl text-v2-text-primary` |
| Section title | `font-serif font-light text-2xl md:text-3xl text-v2-text-primary` |
| Section title (token) | `font-serif font-light text-v2-section-sm md:text-v2-section text-v2-text-primary` |
| Eyebrow/label | `font-inter text-v2-label uppercase tracking-[0.2em] text-v2-accent` |
| Eyebrow (inline) | `text-v2-accent tracking-widest text-xs font-inter uppercase` |
| Product name | `font-serif font-normal text-sm tracking-[-0.01em] text-v2-text-muted` |
| Body text | `font-inter text-v2-body text-v2-text-muted leading-relaxed` |
| Body text (small) | `font-inter text-sm text-v2-text-muted leading-relaxed` |
| Price | `font-inter text-sm text-v2-text-primary` |
| Old price | `font-inter text-xs text-v2-text-muted line-through` |
| Form label | `font-inter text-xs uppercase tracking-[0.15em] text-v2-text-muted` |
| Nav link | `font-inter text-xs uppercase tracking-[0.15em] text-v2-text-primary` |
| Table header | `font-inter text-xs uppercase tracking-wide text-v2-text-muted` |
| Table cell | `font-inter text-sm text-v2-text-primary` |
| Italic statement | `font-serif font-light italic text-2xl md:text-3xl text-v2-text-primary` |

---

## 7. V2 Animation Patterns

### CSS-First Approach (tercih edilen)

Basit animasyonlar icin Framer Motion yerine CSS transition kullan:

```tsx
{/* Entry reveal — CSS class ile */}
<div className={cn(
  "transition-all duration-700 ease-out",
  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
)}>
  Content
</div>

{/* Image hover zoom — 800ms ease-out, max scale 1.02 */}
<div className="relative overflow-hidden">
  <Image
    src="..."
    alt="..."
    fill
    className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.02]"
  />
</div>

{/* Product image swap — opacity transition */}
<Image className="object-cover transition-all duration-[400ms] ease-out group-hover:opacity-0" />
<Image className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] ease-out" />
```

### Framer Motion (karmasik animasyonlar icin)

```tsx
import { sectionRevealV2, staggerV2, viewportV2 } from "@/lib/animations";
import { EASE } from "@/lib/animations";

{/* Section reveal on scroll */}
<motion.div
  variants={sectionRevealV2}
  initial="hidden"
  whileInView="visible"
  viewport={viewportV2}
>
  Content
</motion.div>

{/* Stagger children */}
<motion.div variants={staggerV2} initial="hidden" whileInView="visible" viewport={viewportV2}>
  {items.map(item => (
    <motion.div key={item.id} variants={sectionRevealV2}>
      {item.content}
    </motion.div>
  ))}
</motion.div>

{/* Step transition (checkout) */}
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

### V2 Animation Constants

```
sectionRevealV2: opacity 0->1 + y 20->0, 0.5s, ease [0.4, 0, 0.2, 1]
staggerV2: staggerChildren 0.1s
viewportV2: { once: true, amount: 0.15, margin: "-50px" }
```

---

## 8. V2 Table Pattern

Beden rehberi ve benzeri tablolar:

```tsx
<table className="w-full border-t border-b border-v2-border-subtle">
  <thead>
    <tr className="border-b border-v2-border-subtle">
      <th className="py-3 px-4 text-left font-inter text-xs uppercase tracking-wide text-v2-text-muted">
        Baslik
      </th>
    </tr>
  </thead>
  <tbody>
    {rows.map((row, i) => (
      <tr key={i} className={i < rows.length - 1 ? "border-b border-v2-border-subtle" : ""}>
        <td className="py-3 px-4 font-inter text-sm text-v2-text-primary">
          {row.value}
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## 9. V2 Accordion Pattern (SSS)

```tsx
<Accordion type="single" collapsible>
  {items.map(item => (
    <AccordionItem
      key={item.id}
      value={item.id}
      className="border-t border-v2-border-subtle border-b-0"
    >
      <AccordionTrigger className="font-serif text-lg hover:no-underline">
        {item.question}
      </AccordionTrigger>
      <AccordionContent className="font-inter text-sm text-v2-text-muted leading-relaxed">
        {item.answer}
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

---

## 10. V2 Hero Pattern (Homepage)

Buyuk split-layout hero. Sol typografi, sag gorsel/video.

```tsx
<section className="relative min-h-[90vh] bg-v2-bg-primary mt-[-64px] md:mt-[-80px]">
  <div className="grid grid-cols-1 md:grid-cols-[35fr_65fr] min-h-[90vh]">
    {/* Left — Typography block */}
    <div className="order-2 md:order-1 flex flex-col justify-center px-8 py-24 md:py-32 md:px-16 lg:px-24 xl:px-32">
      <div className="max-w-[600px]">
        <h1 className="font-serif font-light text-[2.5rem] md:text-[4rem] lg:text-[5.5rem] leading-[1.05] text-v2-text-primary">
          Topragin Hafizasi,<br />Derinin Dili
        </h1>
        <p className="font-inter text-v2-body text-v2-text-muted max-w-[45ch] mt-6">
          El yapimi hakiki deri sandaletler.
        </p>
        <Link href="/kadin"
          className="inline-block mt-10 font-inter text-xs tracking-[0.15em] uppercase text-v2-text-primary link-underline-v2">
          Kesfet
        </Link>
      </div>
    </div>

    {/* Right — Full-bleed image */}
    <div className="order-1 md:order-2 relative h-[55vh] md:h-auto overflow-hidden">
      <Image src="..." alt="..." fill priority className="object-cover"
        sizes="(max-width: 768px) 100vw, 65vw" />
    </div>
  </div>
</section>
```

Not: `mt-[-64px] md:mt-[-80px]` navbar'in altina kaydirir (navbar transparent overlay).

---

## YASAK (Quick Reference)

Tam liste icin `.claude/skills/halikarnas-design-system.md` YASAK bolumune bakin.

V2 sayfalarda asla kullanma:

- **Legacy token'lar:** `luxury-*`, `sand-*`, `aegean-*`, `leather-*`, `terracotta-*` — her zaman `v2-*` kullan
- **Legacy component'ler:** `GoldDivider`, `MagneticButton`, `TextReveal`, `font-display`, `font-accent` (Cinzel) — V2'de yoklar
- **Card-border form input:** V2 form'lar sadece underline (`border-b`) kullanir, kutulu/card-style input YASAK
- **Rounded butonlar:** `rounded-lg`, `rounded-full`, `rounded-md` — her zaman `rounded-none` (veya belirtme, default)
- **Trust bar / success banner / circle stepper:** Yesil basari banneri, guven bari, numarali circle progress gostergeleri V2'de yok — text stepper kullan
- **`bg-white`:** V2 sayfalarda `bg-v2-bg-primary` (#FAF7F2) kullan, saf beyaz arka plan kullanma
- **shadcn Card ile form wrapping:** Form alanlari card icine sarma, duz section olarak birak

# Skill: Halikarnas Urun Yonetimi

## Bu Skill Ne Zaman Kullanilir

- Yeni urun ekleme
- Mevcut urun duzenleme
- Varyant (beden/renk) yonetimi
- Gorsel ekleme/duzenleme
- Kategori atama
- Koleksiyona ekleme

---

## Urun Olusturma Adimlari

### 1. Temel Bilgiler

```typescript
{
  name: "Aegean Sandalet",           // Urun adi
  slug: "aegean-sandalet",           // URL-friendly (unique)
  sku: "HS-W-AEG-001",               // Stok kodu (unique)
  description: "Detayli aciklama...",
  shortDescription: "Kisa aciklama",
}
```

### 2. Fiyatlandirma

```typescript
{
  basePrice: 1299.00,                // Ana fiyat (TL)
  compareAtPrice: 1599.00,           // Karsilastirma fiyati (indirim gosterimi)
  costPrice: 450.00,                 // Maliyet (opsiyonel)
}
```

### 3. Kategorilendirme

```typescript
{
  categoryId: "kategori-cuid",       // Kategori FK
  gender: "KADIN",                   // KADIN, ERKEK, UNISEX
}
```

### 4. Urun Detaylari

```typescript
{
  material: "Hakiki Dana Derisi",    // Malzeme
  soleType: "Kosele",                // Taban tipi
  heelHeight: "Duz",                 // Topuk yuksekligi
  madeIn: "Turkiye",                 // Uretim yeri
  careInstructions: "Bakim...",      // Bakim talimatlari
}
```

### 5. Varyantlar

```typescript
variants: [
  { size: "36", color: "Taba", colorHex: "#C17E61", stock: 10 },
  { size: "37", color: "Taba", colorHex: "#C17E61", stock: 15 },
  { size: "38", color: "Taba", colorHex: "#C17E61", stock: 12 },
  { size: "36", color: "Siyah", colorHex: "#2D2926", stock: 8 },
  // ...
]
```

### 6. Gorseller

```typescript
images: [
  { url: "https://...", alt: "Ana gorsel", position: 0, isPrimary: true },
  { url: "https://...", alt: "Yan gorsel", position: 1, isPrimary: false },
  { url: "https://...", alt: "Detay", position: 2, isPrimary: false },
]
```

### 7. SEO

```typescript
{
  metaTitle: "Aegean Sandalet | Halikarnas",
  metaDescription: "El yapimi hakiki deri...",
}
```

### 8. Gorunurluk

```typescript
{
  status: "ACTIVE",      // DRAFT, ACTIVE, ARCHIVED
  isFeatured: true,      // One cikan
  isNew: true,           // Yeni urun
  isBestSeller: false,   // Cok satan
}
```

---

## Varyant SKU Formati

```
{PRODUCT_SKU}-{COLOR_CODE}-{SIZE}

Ornekler:
- HS-W-AEG-001-TAB-38  (Aegean Kadin Taba 38)
- HS-M-BOD-002-SYH-42  (Bodrum Erkek Siyah 42)

Prefixler:
- HS-W-: Kadin (Women)
- HS-M-: Erkek (Men)
- HS-U-: Unisex
```

---

## Renk Kodlari

```typescript
// constants.ts'den
const colorOptions = [
  { name: "Taba", hex: "#C17E61", slug: "taba" },
  { name: "Siyah", hex: "#2D2926", slug: "siyah" },
  { name: "Kahverengi", hex: "#4A3728", slug: "kahverengi" },
  { name: "Natural", hex: "#D4B896", slug: "natural" },
  { name: "Beyaz", hex: "#FFFFFF", slug: "beyaz" },
  { name: "Gold", hex: "#A68B5B", slug: "gold" },
  { name: "Gumus", hex: "#C0C0C0", slug: "gumus" },
];
```

---

## Beden Secenekleri

```typescript
// Kadin: 35-41
// Erkek: 39-45
// Unisex: 35-45

const sizeOptions = {
  women: ["35", "36", "37", "38", "39", "40", "41"],
  men: ["39", "40", "41", "42", "43", "44", "45"],
  unisex: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
};
```

---

## API Kullanimi

### Urun Olusturma

```typescript
// POST /api/admin/products
const response = await fetch("/api/admin/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Yeni Sandalet",
    slug: "yeni-sandalet",
    description: "...",
    basePrice: 1299,
    categoryId: "cuid...",
    gender: "KADIN",
    status: "DRAFT",
    variants: [...],
    images: [...],
  }),
});
```

### Urun Guncelleme

```typescript
// PATCH /api/admin/products/[id]
const response = await fetch(`/api/admin/products/${productId}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    basePrice: 1399,
    status: "ACTIVE",
  }),
});
```

---

## Dikkat Edilecekler

1. **Slug Kontrolu**: Slug unique olmali, Turkce karakter icermemeli
2. **SKU Kontrolu**: Varyant SKU'lari unique olmali
3. **Gorsel Sirasi**: position degeri ile siralama yapilir
4. **Ana Gorsel**: isPrimary: true olan gorsel listelemede kullanilir
5. **Stok Takibi**: stock degeri 0 ise "Tukendi" badge gosterilir
6. **Fiyat Formati**: Decimal, iki ondalik basamak
7. **Kategori Atama**: Kategori zorunlu, ust kategori tercihen secilmeli

---

## Ornek Prisma Sorgusu

```typescript
// Urun olusturma (transaction ile)
const product = await db.$transaction(async (tx) => {
  // 1. Urunu olustur
  const product = await tx.product.create({
    data: {
      name,
      slug,
      description,
      basePrice,
      categoryId,
      gender,
      status: "DRAFT",
    },
  });

  // 2. Varyantlari olustur
  await tx.productVariant.createMany({
    data: variants.map((v, i) => ({
      productId: product.id,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex,
      sku: `${sku}-${v.color.slice(0, 3).toUpperCase()}-${v.size}`,
      stock: v.stock || 0,
    })),
  });

  // 3. Gorselleri olustur
  await tx.productImage.createMany({
    data: images.map((img, i) => ({
      productId: product.id,
      url: img.url,
      alt: img.alt || name,
      position: i,
      isPrimary: i === 0,
    })),
  });

  return product;
});
```

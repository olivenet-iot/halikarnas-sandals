# Skill: Halikarnas API Gelistirme

## Bu Skill Ne Zaman Kullanilir

- Yeni API endpoint olusturma
- Mevcut endpoint duzenleme
- Auth kontrolu ekleme
- Validasyon ekleme
- Database islemleri

---

## Route Handler Pattern

### Temel Yapi

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// 1. Validation schema
const createSchema = z.object({
  name: z.string().min(1, "Isim gerekli"),
  email: z.string().email("Gecerli email girin"),
  age: z.number().min(0).optional(),
});

// 2. GET - Liste/Detay
export async function GET(request: NextRequest) {
  try {
    // Query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Database query
    const [items, total] = await Promise.all([
      db.model.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.model.count(),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Bir hata olustu" },
      { status: 500 }
    );
  }
}

// 3. POST - Olusturma
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Oturum acmaniz gerekiyor" },
        { status: 401 }
      );
    }

    // Parse body
    const body = await request.json();

    // Validate
    const validated = createSchema.parse(body);

    // Create
    const item = await db.model.create({
      data: validated,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Bir hata olustu" },
      { status: 500 }
    );
  }
}
```

---

## Dynamic Route Handler

```typescript
// app/api/example/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{ id: string }>;
}

// GET - Tekil kayit
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const item = await db.model.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Kayit bulunamadi" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: "Bir hata olustu" },
      { status: 500 }
    );
  }
}

// PATCH - Guncelleme
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const item = await db.model.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: "Bir hata olustu" },
      { status: 500 }
    );
  }
}

// DELETE - Silme
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await db.model.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Bir hata olustu" },
      { status: 500 }
    );
  }
}
```

---

## Admin Route Pattern

```typescript
// app/api/admin/[resource]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Admin auth check
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Oturum acmaniz gerekiyor" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Bu islemi yapmaya yetkiniz yok" },
        { status: 403 }
      );
    }

    // ... rest of the handler
  } catch (error) {
    console.error("Admin error:", error);
    return NextResponse.json(
      { error: "Bir hata olustu" },
      { status: 500 }
    );
  }
}
```

---

## Zod Validation Schemalar

### Urun

```typescript
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Urun adi gerekli"),
  slug: z.string().min(1, "Slug gerekli").regex(/^[a-z0-9-]+$/, "Gecersiz slug"),
  description: z.string().min(10, "Aciklama en az 10 karakter olmali"),
  shortDescription: z.string().optional(),
  basePrice: z.number().positive("Fiyat pozitif olmali"),
  compareAtPrice: z.number().positive().optional().nullable(),
  sku: z.string().optional(),
  categoryId: z.string().min(1, "Kategori secin"),
  gender: z.enum(["ERKEK", "KADIN", "UNISEX"]).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  material: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
});

export const productVariantSchema = z.object({
  size: z.string().min(1, "Beden gerekli"),
  color: z.string().optional(),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  sku: z.string().min(1, "Varyant SKU gerekli"),
  stock: z.number().int().min(0).default(0),
  price: z.number().positive().optional(),
});
```

### Siparis

```typescript
export const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string(),
    quantity: z.number().int().positive(),
  })).min(1, "En az bir urun ekleyin"),
  shippingAddressId: z.string().optional(),
  billingAddressId: z.string().optional(),
  paymentMethod: z.string().min(1),
  couponCode: z.string().optional(),
  customerNote: z.string().optional(),
});

export const orderUpdateSchema = z.object({
  status: z.enum([
    "PENDING", "CONFIRMED", "PROCESSING",
    "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"
  ]).optional(),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  adminNote: z.string().optional(),
});
```

### Kullanici

```typescript
export const registerSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmali"),
  email: z.string().email("Gecerli email girin"),
  password: z.string()
    .min(8, "Sifre en az 8 karakter olmali")
    .regex(/[A-Z]/, "En az bir buyuk harf icermeli")
    .regex(/[0-9]/, "En az bir rakam icermeli"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const profileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
});
```

### Adres

```typescript
export const addressSchema = z.object({
  title: z.string().min(1, "Baslik gerekli"),
  firstName: z.string().min(1, "Ad gerekli"),
  lastName: z.string().min(1, "Soyad gerekli"),
  phone: z.string().min(10, "Gecerli telefon numarasi girin"),
  address: z.string().min(10, "Adres en az 10 karakter olmali"),
  city: z.string().min(1, "Sehir secin"),
  district: z.string().min(1, "Ilce secin"),
  postalCode: z.string().optional(),
  isDefault: z.boolean().default(false),
});
```

---

## Pagination Pattern

```typescript
// Query params
const { searchParams } = new URL(request.url);
const page = parseInt(searchParams.get("page") || "1");
const limit = parseInt(searchParams.get("limit") || "20");
const skip = (page - 1) * limit;

// Database query
const [items, total] = await Promise.all([
  db.model.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  }),
  db.model.count(),
]);

// Response
return NextResponse.json({
  items,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  },
});
```

---

## Search & Filter Pattern

```typescript
const { searchParams } = new URL(request.url);
const search = searchParams.get("search");
const category = searchParams.get("category");
const status = searchParams.get("status");
const minPrice = searchParams.get("minPrice");
const maxPrice = searchParams.get("maxPrice");
const sort = searchParams.get("sort") || "newest";

// Build where clause
const where: Prisma.ProductWhereInput = {
  status: "ACTIVE",
};

if (search) {
  where.OR = [
    { name: { contains: search, mode: "insensitive" } },
    { description: { contains: search, mode: "insensitive" } },
    { sku: { contains: search, mode: "insensitive" } },
  ];
}

if (category) {
  where.category = { slug: category };
}

if (status && status !== "all") {
  where.status = status as ProductStatus;
}

if (minPrice || maxPrice) {
  where.basePrice = {};
  if (minPrice) where.basePrice.gte = parseFloat(minPrice);
  if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
}

// Build orderBy
let orderBy: Prisma.ProductOrderByWithRelationInput = {};
switch (sort) {
  case "price-asc":
    orderBy = { basePrice: "asc" };
    break;
  case "price-desc":
    orderBy = { basePrice: "desc" };
    break;
  case "name":
    orderBy = { name: "asc" };
    break;
  default:
    orderBy = { createdAt: "desc" };
}

const products = await db.product.findMany({
  where,
  orderBy,
  include: { images: { take: 1 } },
});
```

---

## Transaction Pattern

```typescript
const result = await db.$transaction(async (tx) => {
  // 1. Create order
  const order = await tx.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: session.user.id,
      status: "PENDING",
      // ...
    },
  });

  // 2. Create order items
  await tx.orderItem.createMany({
    data: items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      // ...
    })),
  });

  // 3. Update stock
  for (const item of items) {
    await tx.productVariant.update({
      where: { id: item.variantId },
      data: {
        stock: { decrement: item.quantity },
      },
    });
  }

  // 4. Update coupon usage
  if (couponId) {
    await tx.coupon.update({
      where: { id: couponId },
      data: {
        usageCount: { increment: 1 },
      },
    });
  }

  return order;
});
```

---

## Error Handling

```typescript
import { z } from "zod";
import { Prisma } from "@prisma/client";

try {
  // ... logic
} catch (error) {
  // Zod validation error
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: "Gecersiz veri",
        details: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  // Prisma unique constraint
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Bu kayit zaten mevcut" },
        { status: 409 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Kayit bulunamadi" },
        { status: 404 }
      );
    }
  }

  // Generic error
  console.error("API Error:", error);
  return NextResponse.json(
    { error: "Bir hata olustu" },
    { status: 500 }
  );
}
```

---

## Rate Limiting Pattern

```typescript
// Simple in-memory rate limit (use Redis in production)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const LIMIT = 10;
const WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + WINDOW });
    return true;
  }

  if (record.count >= LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Cok fazla istek. Lutfen bekleyin." },
      { status: 429 }
    );
  }

  // ... rest of handler
}
```

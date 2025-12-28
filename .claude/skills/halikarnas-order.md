# Skill: Halikarnas Siparis Yonetimi

## Bu Skill Ne Zaman Kullanilir

- Siparis durumu guncelleme
- Kargo bilgisi ekleme
- Siparis iptali
- Iade islemi
- Siparis notlari

---

## Siparis Durumlari

```
PENDING ─────► CONFIRMED ─────► PROCESSING ─────► SHIPPED ─────► DELIVERED
    │              │                 │                │
    │              │                 │                └──► RETURNED
    │              │                 │
    └──────────────┴─────────────────┴────────────► CANCELLED
```

### Durum Aciklamalari

| Durum | Turkce | Aciklama |
|-------|--------|----------|
| PENDING | Beklemede | Siparis olusturuldu, odeme bekleniyor |
| CONFIRMED | Onaylandi | Odeme alindi, hazirlama bekleniyor |
| PROCESSING | Hazirlaniyor | Siparis hazirlanmakta |
| SHIPPED | Kargoda | Kargoya verildi |
| DELIVERED | Teslim Edildi | Musteri teslim aldi |
| CANCELLED | Iptal Edildi | Siparis iptal edildi |
| REFUNDED | Iade Edildi | Para iadesi yapildi |

---

## Durum Gecisleri

### Izin Verilen Gecisler

```typescript
const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};
```

### Durum Degistirme

```typescript
// PATCH /api/admin/orders/[id]
const response = await fetch(`/api/admin/orders/${orderId}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    status: "SHIPPED",
    trackingNumber: "123456789",
    carrier: "Yurtici Kargo",
    adminNote: "Kargoya verildi",
  }),
});
```

---

## Kargo Bilgileri

### Desteklenen Kargo Firmalari

```typescript
const carriers = [
  { value: "yurtici", label: "Yurtici Kargo" },
  { value: "mng", label: "MNG Kargo" },
  { value: "aras", label: "Aras Kargo" },
  { value: "ptt", label: "PTT Kargo" },
  { value: "ups", label: "UPS" },
  { value: "dhl", label: "DHL" },
];
```

### Kargo Guncelleme

```typescript
await db.order.update({
  where: { id: orderId },
  data: {
    status: "SHIPPED",
    trackingNumber: "123456789",
    carrier: "Yurtici Kargo",
    shippedAt: new Date(),
  },
});
```

---

## Siparis Iptali

### Iptal Kurallari

1. Sadece PENDING veya CONFIRMED durumda iptal edilebilir
2. PROCESSING baslamisssa iptal icin admin onay gerekir
3. SHIPPED sonrasi iptal yapilamaz (iade sureci baslar)

### Iptal Islemi

```typescript
// 1. Siparis durumunu guncelle
await db.order.update({
  where: { id: orderId },
  data: {
    status: "CANCELLED",
    adminNote: "Musteri talebi ile iptal edildi",
  },
});

// 2. Stok geri ekle (opsiyonel)
for (const item of order.items) {
  await db.productVariant.update({
    where: { id: item.variantId },
    data: {
      stock: { increment: item.quantity },
    },
  });
}

// 3. Kupon kullanimi geri al (varsa)
if (order.couponId) {
  await db.coupon.update({
    where: { id: order.couponId },
    data: {
      usageCount: { decrement: 1 },
    },
  });
}
```

---

## Iade Islemi

### Iade Kurallari

1. DELIVERED sonrasi 15 gun icinde iade basvurusu yapilabilir
2. Urun kullanilmamis ve orijinal ambalajinda olmali
3. Beden degisikligi ucretsiz, fikir degisikliginde kargo musteriye ait

### Iade Sureci

```typescript
// 1. Iade talebini kaydet
await db.order.update({
  where: { id: orderId },
  data: {
    status: "REFUNDED",
    adminNote: "Iade talebi onaylandi - Beden degisikligi",
  },
});

// 2. Stok geri ekle
for (const item of order.items) {
  await db.productVariant.update({
    where: { id: item.variantId },
    data: {
      stock: { increment: item.quantity },
    },
  });
}

// 3. Status history ekle
await db.orderStatusHistory.create({
  data: {
    orderId,
    status: "REFUNDED",
    note: "Iade islemi tamamlandi",
    createdBy: adminUserId,
  },
});
```

---

## Siparis Numarasi Formati

```
HS-{YIL}-{SIRANO}

Ornekler:
- HS-2024-000001
- HS-2024-000542
- HS-2025-000001

Olusturma:
const orderNumber = `HS-${year}-${count.toString().padStart(6, '0')}`;
```

---

## Fiyat Hesaplama

```typescript
const calculateOrderTotals = (items, coupon, shippingCost) => {
  // Ara toplam
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  // Indirim
  let discount = 0;
  if (coupon) {
    if (coupon.discountType === "PERCENTAGE") {
      discount = subtotal * (coupon.discountValue / 100);
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }
  }

  // Kargo
  const shipping = subtotal >= 500 ? 0 : shippingCost;

  // KDV dahil toplam
  const total = subtotal - discount + shipping;

  return { subtotal, discount, shipping, total };
};
```

---

## Status History

Her durum degisikliginde gecmis kaydedilir:

```typescript
await db.orderStatusHistory.create({
  data: {
    orderId,
    status: newStatus,
    note: "Kargoya verildi - Yurtici Kargo 123456789",
    createdBy: adminUserId,
  },
});
```

---

## Siparis Detay Sorgusu

```typescript
const order = await db.order.findUnique({
  where: { id: orderId },
  include: {
    user: {
      select: { name: true, email: true, phone: true },
    },
    items: {
      include: {
        product: {
          include: { images: { take: 1, orderBy: { position: "asc" } } },
        },
        variant: true,
      },
    },
    statusHistory: {
      orderBy: { createdAt: "desc" },
    },
    coupon: true,
  },
});
```

---

## Email Bildirimleri (Planned)

| Durum | Email Tipi |
|-------|------------|
| CONFIRMED | Siparis onay emaili |
| SHIPPED | Kargo bilgi emaili (takip no) |
| DELIVERED | Teslim bilgi + review talebi |
| CANCELLED | Iptal bildirimi |
| REFUNDED | Iade onay emaili |

---

## Admin Dashboard Istatistikleri

```typescript
// Gunluk siparis sayisi
const todayOrders = await db.order.count({
  where: {
    createdAt: { gte: startOfDay(new Date()) },
  },
});

// Bekleyen siparisler
const pendingOrders = await db.order.count({
  where: { status: "PENDING" },
});

// Gunluk ciro
const todayRevenue = await db.order.aggregate({
  where: {
    status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
    createdAt: { gte: startOfDay(new Date()) },
  },
  _sum: { total: true },
});
```

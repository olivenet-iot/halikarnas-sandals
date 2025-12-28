# API Dokumantasyonu

## Genel Bilgiler

### Base URL

```
Development: http://localhost:3000/api
Production: https://halikarnassandals.com/api
```

### Authentication

Korunmali endpointler icin NextAuth session cookie otomatik gonderilir.
Admin endpointleri icin `ADMIN` veya `SUPER_ADMIN` rolu gereklidir.

### Response Format

Basarili response:
```json
{
  "data": { ... },
  "message": "Islem basarili"
}
```

Hata response:
```json
{
  "error": "Hata mesaji",
  "details": [ ... ]  // Zod validation hatalari icin
}
```

### HTTP Status Codes

| Code | Anlami |
|------|--------|
| 200 | Basarili |
| 201 | Olusturuldu |
| 400 | Gecersiz istek |
| 401 | Yetkisiz (login gerekli) |
| 403 | Yasak (yetki yetersiz) |
| 404 | Bulunamadi |
| 429 | Cok fazla istek |
| 500 | Sunucu hatasi |

---

## Public Endpoints

### GET /api/search

Urun arama ve filtreleme.

**Query Parameters:**

| Param | Tip | Zorunlu | Aciklama |
|-------|-----|---------|----------|
| q | string | - | Arama sorgusu |
| category | string | - | Kategori slug |
| gender | string | - | ERKEK, KADIN, UNISEX |
| minPrice | number | - | Minimum fiyat |
| maxPrice | number | - | Maksimum fiyat |
| sort | string | - | relevance, newest, price-asc, price-desc, bestseller |
| page | number | - | Sayfa (default: 1) |
| limit | number | - | Sayfa basi urun (default: 20) |

**Response:**

```json
{
  "products": [
    {
      "id": "cuid...",
      "name": "Aegean Sandalet",
      "slug": "aegean-sandalet",
      "price": 1299,
      "compareAtPrice": 1599,
      "images": [
        { "url": "https://...", "alt": "Aegean Sandalet" }
      ],
      "colors": [
        { "name": "Taba", "hex": "#C17E61" }
      ],
      "isNew": true,
      "isSale": true,
      "isBestseller": false,
      "category": { "name": "Bodrum Sandalet", "slug": "bodrum-sandalet" }
    }
  ],
  "total": 156,
  "page": 1,
  "totalPages": 8
}
```

---

### POST /api/contact

Iletisim formu gonderimi.

**Rate Limit:** 5 istek/saat (IP bazli)

**Request Body:**

```json
{
  "name": "Ahmet Yilmaz",
  "email": "ahmet@example.com",
  "subject": "siparis",
  "message": "Siparis hakkinda sorum var...",
  "honeypot": ""  // Bos olmali (spam kontrolu)
}
```

**Response (201):**

```json
{
  "success": true
}
```

---

### POST /api/coupon/validate

Kupon kodu dogrulama.

**Request Body:**

```json
{
  "code": "YAZ2024",
  "subtotal": 1500
}
```

**Response (200):**

```json
{
  "valid": true,
  "coupon": {
    "code": "YAZ2024",
    "discountType": "PERCENTAGE",
    "discountValue": 15,
    "minOrderAmount": 500,
    "maxDiscount": 300
  },
  "discount": 225
}
```

**Response (400) - Gecersiz:**

```json
{
  "valid": false,
  "error": "Kupon suresi dolmus"
}
```

---

### GET /api/locations/cities

Turkiye sehir listesi.

**Response:**

```json
{
  "cities": ["Adana", "Ankara", "Istanbul", ...]
}
```

---

### GET /api/locations/districts

Ilce listesi.

**Query Parameters:**

| Param | Tip | Zorunlu | Aciklama |
|-------|-----|---------|----------|
| city | string | Evet | Sehir adi |

**Response:**

```json
{
  "districts": ["Kadikoy", "Besiktas", "Uskudar", ...]
}
```

---

## Auth Endpoints

### POST /api/auth/register

Yeni kullanici kaydi.

**Request Body:**

```json
{
  "name": "Ahmet Yilmaz",
  "email": "ahmet@example.com",
  "password": "gucluSifre123!"
}
```

**Response (201):**

```json
{
  "user": {
    "id": "cuid...",
    "name": "Ahmet Yilmaz",
    "email": "ahmet@example.com"
  }
}
```

---

### POST /api/auth/forgot-password

Sifre sifirlama emaili gonderir.

**Request Body:**

```json
{
  "email": "ahmet@example.com"
}
```

**Response (200):**

```json
{
  "message": "Sifre sifirlama linki email adresinize gonderildi"
}
```

---

### POST /api/auth/reset-password

Yeni sifre belirleme.

**Request Body:**

```json
{
  "token": "reset-token...",
  "password": "yeniGucluSifre123!"
}
```

**Response (200):**

```json
{
  "message": "Sifreniz basariyla degistirildi"
}
```

---

## User Endpoints (Auth Required)

### GET /api/user/profile

Kullanici profil bilgileri.

**Response:**

```json
{
  "id": "cuid...",
  "name": "Ahmet Yilmaz",
  "email": "ahmet@example.com",
  "phone": "+90 532 123 4567",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### PATCH /api/user/profile

Profil guncelleme.

**Request Body:**

```json
{
  "name": "Ahmet Yilmaz",
  "phone": "+90 532 123 4567"
}
```

---

### POST /api/user/change-password

Sifre degistirme.

**Request Body:**

```json
{
  "currentPassword": "eskiSifre123",
  "newPassword": "yeniSifre456!"
}
```

---

### DELETE /api/user/delete

Hesap silme.

**Request Body:**

```json
{
  "password": "mevcutSifre123"
}
```

---

## Address Endpoints (Auth Required)

### GET /api/addresses

Kullanici adresleri listesi.

**Response:**

```json
{
  "addresses": [
    {
      "id": "cuid...",
      "title": "Ev",
      "firstName": "Ahmet",
      "lastName": "Yilmaz",
      "phone": "+90 532 123 4567",
      "address": "Ataturk Cad. No:123",
      "city": "Istanbul",
      "district": "Kadikoy",
      "postalCode": "34710",
      "isDefault": true
    }
  ]
}
```

---

### POST /api/addresses

Yeni adres ekleme.

**Request Body:**

```json
{
  "title": "Is",
  "firstName": "Ahmet",
  "lastName": "Yilmaz",
  "phone": "+90 532 123 4567",
  "address": "Levent Plaza No:50",
  "city": "Istanbul",
  "district": "Levent",
  "postalCode": "34330",
  "isDefault": false
}
```

---

### PATCH /api/addresses/[id]

Adres guncelleme.

---

### DELETE /api/addresses/[id]

Adres silme.

---

## Wishlist Endpoints (Auth Required)

### GET /api/wishlist

Favori urunler listesi.

**Response:**

```json
{
  "items": [
    {
      "id": "cuid...",
      "productId": "cuid...",
      "product": {
        "id": "cuid...",
        "name": "Aegean Sandalet",
        "slug": "aegean-sandalet",
        "basePrice": 1299,
        "images": [...]
      }
    }
  ]
}
```

---

### POST /api/wishlist

Favorilere ekle.

**Request Body:**

```json
{
  "productId": "cuid..."
}
```

---

### DELETE /api/wishlist/[productId]

Favorilerden cikar.

---

## Order Endpoints

### POST /api/orders

Siparis olusturma.

**Request Body:**

```json
{
  "items": [
    {
      "productId": "cuid...",
      "variantId": "cuid...",
      "quantity": 2
    }
  ],
  "shippingAddressId": "cuid...",
  "billingAddressId": "cuid...",
  "paymentMethod": "credit_card",
  "couponCode": "YAZ2024",
  "customerNote": "Kapida birakabilirsiniz"
}
```

**Response (201):**

```json
{
  "order": {
    "id": "cuid...",
    "orderNumber": "HS-2024-000123",
    "status": "PENDING",
    "total": 2598,
    "createdAt": "2024-06-15T14:30:00Z"
  }
}
```

---

### GET /api/orders (Auth Required)

Kullanici siparisleri.

**Query Parameters:**

| Param | Tip | Zorunlu | Aciklama |
|-------|-----|---------|----------|
| page | number | - | Sayfa (default: 1) |
| limit | number | - | Sayfa basi (default: 10) |

**Response:**

```json
{
  "orders": [
    {
      "id": "cuid...",
      "orderNumber": "HS-2024-000123",
      "status": "DELIVERED",
      "total": 2598,
      "items": [...],
      "createdAt": "2024-06-15T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

---

## Admin Endpoints (Admin Required)

### Products

#### GET /api/admin/products

**Query Parameters:**

| Param | Tip | Aciklama |
|-------|-----|----------|
| page | number | Sayfa |
| limit | number | Sayfa basi |
| search | string | Isim/SKU arama |
| category | string | Kategori ID |
| status | string | DRAFT, ACTIVE, ARCHIVED |
| gender | string | ERKEK, KADIN, UNISEX |

#### POST /api/admin/products

Yeni urun olusturma.

**Request Body:**

```json
{
  "name": "Yeni Sandalet",
  "slug": "yeni-sandalet",
  "description": "Urun aciklamasi...",
  "shortDescription": "Kisa aciklama",
  "basePrice": 1499,
  "compareAtPrice": 1799,
  "sku": "HS-W-YEN-001",
  "categoryId": "cuid...",
  "gender": "KADIN",
  "material": "Hakiki Deri",
  "status": "DRAFT",
  "variants": [
    { "size": "37", "color": "Taba", "colorHex": "#C17E61", "stock": 10 },
    { "size": "38", "color": "Taba", "colorHex": "#C17E61", "stock": 15 }
  ],
  "images": [
    { "url": "https://...", "alt": "Ana gorsel", "isPrimary": true }
  ]
}
```

#### PATCH /api/admin/products/[id]

Urun guncelleme (partial update).

#### DELETE /api/admin/products/[id]

Urun silme.

---

### Orders

#### GET /api/admin/orders

Tum siparisler (filtreleme + pagination).

#### GET /api/admin/orders/[id]

Siparis detayi.

#### PATCH /api/admin/orders/[id]

Siparis durumu guncelleme.

**Request Body:**

```json
{
  "status": "SHIPPED",
  "trackingNumber": "123456789",
  "carrier": "Yurtici Kargo",
  "adminNote": "Kargoya verildi"
}
```

---

### Users

#### GET /api/admin/users

Kullanici listesi.

#### PATCH /api/admin/users/[id]

Kullanici bilgileri/rol guncelleme.

#### DELETE /api/admin/users/[id]

Kullanici silme.

---

### Settings

#### GET /api/admin/settings

Tum site ayarlari.

**Response:**

```json
{
  "settings": {
    "site_name": "Halikarnas Sandals",
    "contact_email": "info@halikarnassandals.com",
    "free_shipping_threshold": "500",
    "standard_shipping_cost": "29.90"
  }
}
```

#### POST /api/admin/settings

Ayarlari guncelle.

**Request Body:**

```json
{
  "settings": {
    "free_shipping_threshold": "750",
    "standard_shipping_cost": "34.90"
  }
}
```

---

## Webhook Endpoints (Planned)

### POST /api/webhooks/payment

Odeme bildirimi (iyzico/PayTR).

### POST /api/webhooks/shipping

Kargo durumu bildirimi.

---

## Error Codes

| Code | Mesaj | Aciklama |
|------|-------|----------|
| AUTH_REQUIRED | Oturum acmaniz gerekiyor | Login gerekli |
| FORBIDDEN | Bu islemi yapmaya yetkiniz yok | Rol yetersiz |
| NOT_FOUND | Kayit bulunamadi | Gecersiz ID |
| VALIDATION_ERROR | Gecersiz veri | Zod validation hatasi |
| DUPLICATE_ENTRY | Bu kayit zaten mevcut | Unique constraint |
| RATE_LIMITED | Cok fazla istek | Rate limit asildi |
| INTERNAL_ERROR | Bir hata olustu | Sunucu hatasi |

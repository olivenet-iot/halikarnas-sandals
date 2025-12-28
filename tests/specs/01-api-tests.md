# API Testleri

## Genel Bilgiler

- **Base URL:** `http://localhost:3000`
- **Auth:** NextAuth session cookie
- **Format:** JSON
- **Toplam Endpoint:** 46
- **Toplam Test:** ~143

---

## Icerik

1. [Authentication API](#1-authentication-api)
2. [User/Profile API](#2-userprofile-api)
3. [Addresses API](#3-addresses-api)
4. [Wishlist API](#4-wishlist-api)
5. [Cart API](#5-cart-api)
6. [Orders API](#6-orders-api)
7. [Coupon API](#7-coupon-api)
8. [Search API](#8-search-api)
9. [Contact & Newsletter API](#9-contact--newsletter-api)
10. [Locations API](#10-locations-api)
11. [Admin Products API](#11-admin-products-api)
12. [Admin Categories API](#12-admin-categories-api)
13. [Admin Collections API](#13-admin-collections-api)
14. [Admin Orders API](#14-admin-orders-api)
15. [Admin Users API](#15-admin-users-api)
16. [Admin Coupons API](#16-admin-coupons-api)
17. [Admin Banners API](#17-admin-banners-api)
18. [Admin Pages API](#18-admin-pages-api)
19. [Admin Settings API](#19-admin-settings-api)
20. [Upload API](#20-upload-api)

---

## 1. Authentication API

### TEST-API-001: User Registration - Basarili
- **Endpoint:** `POST /api/auth/register`
- **Auth:** Gerekli degil
- **Request Body:**
```json
{
  "name": "Test User",
  "email": "newuser@example.com",
  "password": "Test123!",
  "newsletter": true
}
```
- **Beklenen Response:** `201 Created`
```json
{
  "success": true,
  "user": { "id": "...", "email": "newuser@example.com", "name": "Test User" }
}
```
- **Kontrol Listesi:**
  - [ ] Status 201 donuyor
  - [ ] User objesi donuyor
  - [ ] Password response'da yok
  - [ ] Veritabaninda kullanici olusmus

---

### TEST-API-002: User Registration - Eksik Email
- **Endpoint:** `POST /api/auth/register`
- **Request Body:**
```json
{
  "name": "Test User",
  "password": "Test123!"
}
```
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] Status 400 donuyor
  - [ ] Hata mesaji email iceriyor

---

### TEST-API-003: User Registration - Eksik Password
- **Endpoint:** `POST /api/auth/register`
- **Request Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com"
}
```
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] Status 400 donuyor
  - [ ] Hata mesaji password iceriyor

---

### TEST-API-004: User Registration - Zayif Password
- **Endpoint:** `POST /api/auth/register`
- **Request Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123"
}
```
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] Status 400 donuyor
  - [ ] Minimum 8 karakter hatasi

---

### TEST-API-005: User Registration - Duplicate Email
- **Endpoint:** `POST /api/auth/register`
- **Onkosul:** `test@example.com` kayitli olmali
- **Request Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test123!"
}
```
- **Beklenen Response:** `409 Conflict`
- **Kontrol Listesi:**
  - [ ] Status 409 donuyor
  - [ ] Email zaten kayitli hatasi

---

### TEST-API-006: User Login - Basarili
- **Endpoint:** `POST /api/auth/callback/credentials`
- **Request Body:**
```json
{
  "email": "test@example.com",
  "password": "Test123!"
}
```
- **Beklenen Response:** `200 OK` + `Set-Cookie` header
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] Session cookie set ediliyor
  - [ ] next-auth.session-token cookie var

---

### TEST-API-007: User Login - Yanlis Password
- **Endpoint:** `POST /api/auth/callback/credentials`
- **Request Body:**
```json
{
  "email": "test@example.com",
  "password": "wrongpassword"
}
```
- **Beklenen Response:** `401 Unauthorized`
- **Kontrol Listesi:**
  - [ ] Status 401 donuyor
  - [ ] Session cookie set edilmiyor

---

### TEST-API-008: User Login - Olmayan Email
- **Endpoint:** `POST /api/auth/callback/credentials`
- **Request Body:**
```json
{
  "email": "notexist@example.com",
  "password": "Test123!"
}
```
- **Beklenen Response:** `401 Unauthorized`
- **Kontrol Listesi:**
  - [ ] Status 401 donuyor
  - [ ] Generic hata mesaji (email enumeration engellenmeli)

---

### TEST-API-009: Get Current Session
- **Endpoint:** `GET /api/auth/session`
- **Auth:** Session cookie gerekli
- **Beklenen Response:** `200 OK`
```json
{
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User",
    "role": "CUSTOMER"
  }
}
```
- **Kontrol Listesi:**
  - [ ] Auth ile kullanici bilgisi donuyor
  - [ ] id, email, name, role var

---

### TEST-API-010: Get Session - Auth Yok
- **Endpoint:** `GET /api/auth/session`
- **Auth:** Yok
- **Beklenen Response:** `200 OK` with `{}`
- **Kontrol Listesi:**
  - [ ] Bos obje donuyor
  - [ ] Hata vermiyor

---

### TEST-API-011: Forgot Password - Basarili
- **Endpoint:** `POST /api/auth/forgot-password`
- **Request Body:**
```json
{
  "email": "test@example.com"
}
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] Basari mesaji donuyor
  - [ ] PasswordResetToken olusturulmus

---

### TEST-API-012: Forgot Password - Olmayan Email
- **Endpoint:** `POST /api/auth/forgot-password`
- **Request Body:**
```json
{
  "email": "notexist@example.com"
}
```
- **Beklenen Response:** `200 OK` (email enumeration engelleme)
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor (guvenlik icin)
  - [ ] Ayni mesaj donuyor

---

### TEST-API-013: Reset Password - Basarili
- **Endpoint:** `POST /api/auth/reset-password`
- **Onkosul:** Gecerli reset token olmali
- **Request Body:**
```json
{
  "token": "valid-reset-token",
  "password": "NewPass123!"
}
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] Yeni sifre ile giris yapilabiliyor
  - [ ] Token kullanildiktan sonra gecersiz

---

### TEST-API-014: Reset Password - Gecersiz Token
- **Endpoint:** `POST /api/auth/reset-password`
- **Request Body:**
```json
{
  "token": "invalid-token",
  "password": "NewPass123!"
}
```
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] Status 400 donuyor
  - [ ] Gecersiz veya suresi dolmus token hatasi

---

### TEST-API-015: Logout
- **Endpoint:** `POST /api/auth/signout`
- **Auth:** Session cookie gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Session cookie temizleniyor
  - [ ] Sonraki isteklerde auth yok

---

## 2. User/Profile API

### TEST-API-020: Get Profile
- **Endpoint:** `GET /api/user/profile`
- **Auth:** Session gerekli
- **Beklenen Response:** `200 OK`
```json
{
  "id": "...",
  "name": "Test User",
  "email": "test@example.com",
  "phone": "5551234567",
  "image": null,
  "createdAt": "..."
}
```
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] Tum profil alanlari var
  - [ ] Password donmuyor

---

### TEST-API-021: Get Profile - Auth Yok
- **Endpoint:** `GET /api/user/profile`
- **Auth:** Yok
- **Beklenen Response:** `401 Unauthorized`
- **Kontrol Listesi:**
  - [ ] Status 401 donuyor

---

### TEST-API-022: Update Profile
- **Endpoint:** `PATCH /api/user/profile`
- **Auth:** Session gerekli
- **Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "5559876543"
}
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] Name guncellenmis
  - [ ] Phone guncellenmis
  - [ ] Email degismemis (readonly)

---

### TEST-API-023: Change Password - Basarili
- **Endpoint:** `POST /api/user/change-password`
- **Auth:** Session gerekli
- **Request Body:**
```json
{
  "currentPassword": "Test123!",
  "newPassword": "NewPass456!",
  "confirmPassword": "NewPass456!"
}
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] Yeni sifre ile giris yapilabiliyor
  - [ ] Eski sifre artik gecersiz

---

### TEST-API-024: Change Password - Yanlis Current Password
- **Endpoint:** `POST /api/user/change-password`
- **Auth:** Session gerekli
- **Request Body:**
```json
{
  "currentPassword": "WrongPass!",
  "newPassword": "NewPass456!",
  "confirmPassword": "NewPass456!"
}
```
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] Status 400 donuyor
  - [ ] Mevcut sifre yanlis hatasi

---

### TEST-API-025: Change Password - Password Mismatch
- **Endpoint:** `POST /api/user/change-password`
- **Auth:** Session gerekli
- **Request Body:**
```json
{
  "currentPassword": "Test123!",
  "newPassword": "NewPass456!",
  "confirmPassword": "DifferentPass!"
}
```
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] Status 400 donuyor
  - [ ] Sifreler eslesmiyor hatasi

---

### TEST-API-026: Delete Account - Basarili
- **Endpoint:** `DELETE /api/user/delete`
- **Auth:** Session gerekli
- **Request Body:**
```json
{
  "password": "Test123!",
  "confirmation": "DELETE"
}
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] Kullanici silindi
  - [ ] Session sonlandi
  - [ ] Iliskili veriler silindi (cascade)

---

## 3. Addresses API

### TEST-API-030: List Addresses
- **Endpoint:** `GET /api/addresses`
- **Auth:** Session gerekli
- **Beklenen Response:** `200 OK`
```json
[
  {
    "id": "...",
    "title": "Ev",
    "firstName": "Test",
    "lastName": "User",
    "phone": "5551234567",
    "address": "Test Sokak No:1",
    "city": "Istanbul",
    "district": "Kadikoy",
    "postalCode": "34000",
    "isDefault": true
  }
]
```
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] Adres listesi donuyor
  - [ ] Default adres isaretli

---

### TEST-API-031: List Addresses - Auth Yok
- **Endpoint:** `GET /api/addresses`
- **Auth:** Yok
- **Beklenen Response:** `401 Unauthorized`
- **Kontrol Listesi:**
  - [ ] Status 401 donuyor

---

### TEST-API-032: Create Address - Basarili
- **Endpoint:** `POST /api/addresses`
- **Auth:** Session gerekli
- **Request Body:**
```json
{
  "title": "Is",
  "firstName": "Test",
  "lastName": "User",
  "phone": "5551234567",
  "address": "Is Merkezi No:5 Kat:3",
  "city": "Istanbul",
  "district": "Sisli",
  "postalCode": "34100"
}
```
- **Beklenen Response:** `201 Created`
- **Kontrol Listesi:**
  - [ ] Status 201 donuyor
  - [ ] Adres olusturuldu
  - [ ] Ilk adres ise default oldu

---

### TEST-API-033: Create Address - Eksik Alanlar
- **Endpoint:** `POST /api/addresses`
- **Auth:** Session gerekli
- **Request Body:**
```json
{
  "title": "Ev"
}
```
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] Status 400 donuyor
  - [ ] Zorunlu alanlar hatasi

---

### TEST-API-034: Create Address - Limit Asimi (Max 5)
- **Endpoint:** `POST /api/addresses`
- **Auth:** Session gerekli
- **Onkosul:** Kullanicinin 5 adresi olmali
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] Status 400 donuyor
  - [ ] Maksimum adres limiti hatasi

---

### TEST-API-035: Update Address
- **Endpoint:** `PATCH /api/addresses/[id]`
- **Auth:** Session gerekli
- **Request Body:**
```json
{
  "title": "Yeni Ev",
  "isDefault": true
}
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] Title guncellendi
  - [ ] Default yapildi
  - [ ] Diger adresler default degil

---

### TEST-API-036: Update Address - Baskasinin Adresi
- **Endpoint:** `PATCH /api/addresses/[baska-kullanici-id]`
- **Auth:** Session gerekli
- **Beklenen Response:** `404 Not Found`
- **Kontrol Listesi:**
  - [ ] Status 404 donuyor
  - [ ] Baskasinin adresine erisemiyor

---

### TEST-API-037: Delete Address
- **Endpoint:** `DELETE /api/addresses/[id]`
- **Auth:** Session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] Adres silindi
  - [ ] Default silindiyse baskasi default oldu

---

## 4. Wishlist API

### TEST-API-040: Get Wishlist
- **Endpoint:** `GET /api/wishlist`
- **Auth:** Session gerekli
- **Beklenen Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "...",
      "productId": "...",
      "createdAt": "...",
      "product": {
        "id": "...",
        "name": "Bodrum Sandalet",
        "slug": "bodrum-sandalet",
        "sku": "BS-001",
        "gender": "KADIN",
        "categorySlug": "sandalet",
        "basePrice": "1299.99",
        "image": "https://...",
        "inStock": true,
        "isActive": true
      }
    }
  ]
}
```
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] Urun detaylari var (sku, gender, categorySlug dahil)
  - [ ] URL olusturmak icin gerekli alanlar var

---

### TEST-API-041: Get Wishlist - Auth Yok
- **Endpoint:** `GET /api/wishlist`
- **Auth:** Yok
- **Beklenen Response:** `401 Unauthorized`
- **Kontrol Listesi:**
  - [ ] Status 401 donuyor

---

### TEST-API-042: Add to Wishlist
- **Endpoint:** `POST /api/wishlist`
- **Auth:** Session gerekli
- **Request Body:**
```json
{
  "productId": "valid-product-id"
}
```
- **Beklenen Response:** `201 Created`
- **Kontrol Listesi:**
  - [ ] Status 201 donuyor
  - [ ] Urun favorilere eklendi

---

### TEST-API-043: Add to Wishlist - Duplicate
- **Endpoint:** `POST /api/wishlist`
- **Auth:** Session gerekli
- **Onkosul:** Urun zaten favorilerde
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] Status 400 donuyor
  - [ ] Zaten favorilerde hatasi

---

### TEST-API-044: Add to Wishlist - Gecersiz Product
- **Endpoint:** `POST /api/wishlist`
- **Auth:** Session gerekli
- **Request Body:**
```json
{
  "productId": "invalid-id"
}
```
- **Beklenen Response:** `404 Not Found`
- **Kontrol Listesi:**
  - [ ] Status 404 donuyor

---

### TEST-API-045: Remove from Wishlist
- **Endpoint:** `DELETE /api/wishlist/[productId]`
- **Auth:** Session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] Urun favorilerden cikarildi

---

## 5. Cart API

### TEST-API-050: Get Cart
- **Endpoint:** `GET /api/cart`
- **Auth:** Session veya SessionID cookie
- **Beklenen Response:** `200 OK`
```json
{
  "items": [...],
  "total": 2599.98,
  "itemCount": 2
}
```
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] Items listesi donuyor
  - [ ] Total hesaplandi

---

### TEST-API-051: Get Cart - Bos Sepet
- **Endpoint:** `GET /api/cart`
- **Beklenen Response:** `200 OK`
```json
{
  "items": [],
  "total": 0,
  "itemCount": 0
}
```
- **Kontrol Listesi:**
  - [ ] Bos array donuyor
  - [ ] Total 0

---

### TEST-API-052: Add to Cart
- **Endpoint:** `POST /api/cart`
- **Request Body:**
```json
{
  "productId": "...",
  "variantId": "...",
  "quantity": 1
}
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] Urun sepete eklendi
  - [ ] Sepet toplami guncellendi

---

### TEST-API-053: Add to Cart - Ayni Urun (Quantity Artmali)
- **Endpoint:** `POST /api/cart`
- **Onkosul:** Ayni variant sepette var
- **Request Body:**
```json
{
  "productId": "...",
  "variantId": "...",
  "quantity": 2
}
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Yeni item eklenmedi
  - [ ] Mevcut item quantity artti

---

### TEST-API-054: Add to Cart - Stok Yetersiz
- **Endpoint:** `POST /api/cart`
- **Request Body:**
```json
{
  "productId": "...",
  "variantId": "stoksuz-variant",
  "quantity": 100
}
```
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] Status 400 donuyor
  - [ ] Stok yetersiz hatasi

---

### TEST-API-055: Update Cart Item
- **Endpoint:** `PATCH /api/cart`
- **Request Body:**
```json
{
  "variantId": "...",
  "quantity": 3
}
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Quantity guncellendi
  - [ ] Toplam guncellendi

---

### TEST-API-056: Update Cart Item - Quantity 0 (Silme)
- **Endpoint:** `PATCH /api/cart`
- **Request Body:**
```json
{
  "variantId": "...",
  "quantity": 0
}
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Item silindi
  - [ ] Sepetten cikarildi

---

### TEST-API-057: Remove from Cart
- **Endpoint:** `DELETE /api/cart?variantId=...`
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Item silindi
  - [ ] Toplam guncellendi

---

## 6. Orders API

### TEST-API-060: Create Order
- **Endpoint:** `POST /api/orders`
- **Auth:** Session veya Guest
- **Request Body:**
```json
{
  "items": [...],
  "shippingInfo": {
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "5551234567",
    "city": "Istanbul",
    "district": "Kadikoy",
    "address": "Test Sokak No:1",
    "postalCode": "34000"
  },
  "paymentMethod": "card"
}
```
- **Beklenen Response:** `201 Created`
```json
{
  "orderId": "...",
  "orderNumber": "HS-20251227-XXXX"
}
```
- **Kontrol Listesi:**
  - [ ] Status 201 donuyor
  - [ ] Order number olusturuldu
  - [ ] Stok dusuruldu
  - [ ] Sepet bosaltildi (auth varsa)

---

### TEST-API-061: Create Order - Stok Yetersiz
- **Endpoint:** `POST /api/orders`
- **Onkosul:** Sepetteki urun stokta yok
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] Status 400 donuyor
  - [ ] Stok yetersiz hatasi
  - [ ] Siparis olusturulmadi

---

### TEST-API-062: Get Order History
- **Endpoint:** `GET /api/orders`
- **Auth:** Session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Kullanicinin siparisleri donuyor
  - [ ] Baska kullanicinin siparisleri yok

---

### TEST-API-063: Get Order Detail
- **Endpoint:** `GET /api/orders/[id]`
- **Auth:** Session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Siparis detayi donuyor
  - [ ] Items, addresses, status var

---

### TEST-API-064: Get Order Detail - Baskasinin Siparisi
- **Endpoint:** `GET /api/orders/[baska-kullanici-order-id]`
- **Auth:** Session gerekli
- **Beklenen Response:** `403 Forbidden`
- **Kontrol Listesi:**
  - [ ] Status 403 donuyor

---

### TEST-API-065: Guest Order Lookup
- **Endpoint:** `GET /api/orders?orderNumber=...&email=...`
- **Auth:** Gerekli degil
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Order number + email ile siparis bulunuyor
  - [ ] Yanlis email ile bulunamaz

---

## 7. Coupon API

### TEST-API-070: Validate Coupon - Basarili
- **Endpoint:** `POST /api/coupon/validate`
- **Request Body:**
```json
{
  "code": "INDIRIM10",
  "subtotal": 500
}
```
- **Beklenen Response:** `200 OK`
```json
{
  "valid": true,
  "discount": 50,
  "discountType": "PERCENTAGE",
  "description": "%10 indirim"
}
```
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] Indirim hesaplandi
  - [ ] valid: true

---

### TEST-API-071: Validate Coupon - Gecersiz Kod
- **Endpoint:** `POST /api/coupon/validate`
- **Request Body:**
```json
{
  "code": "GECERSIZ",
  "subtotal": 500
}
```
- **Beklenen Response:** `200 OK`
```json
{
  "valid": false,
  "error": "Gecersiz kupon kodu"
}
```
- **Kontrol Listesi:**
  - [ ] valid: false
  - [ ] Hata mesaji var

---

### TEST-API-072: Validate Coupon - Minimum Tutar
- **Endpoint:** `POST /api/coupon/validate`
- **Onkosul:** Kupon min 200 TL gerektiriyor
- **Request Body:**
```json
{
  "code": "INDIRIM10",
  "subtotal": 100
}
```
- **Beklenen Response:** `200 OK`
```json
{
  "valid": false,
  "error": "Minimum siparis tutari 200 TL"
}
```
- **Kontrol Listesi:**
  - [ ] valid: false
  - [ ] Minimum tutar hatasi

---

### TEST-API-073: Validate Coupon - Suresi Dolmus
- **Endpoint:** `POST /api/coupon/validate`
- **Onkosul:** Kupon expiresAt gecmis
- **Beklenen Response:** `200 OK`
```json
{
  "valid": false,
  "error": "Kupon suresi dolmus"
}
```
- **Kontrol Listesi:**
  - [ ] valid: false

---

## 8. Search API

### TEST-API-080: Search Products
- **Endpoint:** `GET /api/search?q=bodrum`
- **Beklenen Response:** `200 OK`
```json
{
  "products": [...],
  "total": 5,
  "totalPages": 1
}
```
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] Arama sonuclari donuyor
  - [ ] Her urunde sku, gender, categorySlug var

---

### TEST-API-081: Search - Bos Query
- **Endpoint:** `GET /api/search?q=`
- **Beklenen Response:** `200 OK`
```json
{
  "products": [],
  "total": 0
}
```
- **Kontrol Listesi:**
  - [ ] Bos array donuyor

---

### TEST-API-082: Search - Filters
- **Endpoint:** `GET /api/search?q=sandalet&gender=KADIN&minPrice=500&maxPrice=1500`
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Sadece KADIN urunler
  - [ ] Fiyat araliginda
  - [ ] Arama terimi iceriyor

---

### TEST-API-083: Search - Sorting
- **Endpoint:** `GET /api/search?q=sandalet&sort=price-asc`
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Fiyata gore artan siralama
  - [ ] Ilk urun en ucuz

---

### TEST-API-084: Search - Pagination
- **Endpoint:** `GET /api/search?q=sandalet&page=2&limit=10`
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] 2. sayfa urunleri
  - [ ] totalPages dogru

---

## 9. Contact & Newsletter API

### TEST-API-090: Contact Form
- **Endpoint:** `POST /api/contact`
- **Request Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "subject": "Test Konusu",
  "message": "Bu bir test mesajidir. En az 10 karakter."
}
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] Basari mesaji

---

### TEST-API-091: Contact Form - Eksik Alanlar
- **Endpoint:** `POST /api/contact`
- **Request Body:**
```json
{
  "name": "Test"
}
```
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] Validation hatalari

---

### TEST-API-092: Contact Form - Rate Limit
- **Endpoint:** `POST /api/contact`
- **Onkosul:** Ayni IP'den 5+ istek
- **Beklenen Response:** `429 Too Many Requests`
- **Kontrol Listesi:**
  - [ ] Rate limit calisiyor
  - [ ] 1 saat sonra tekrar denenebilir

---

### TEST-API-093: Newsletter Subscribe
- **Endpoint:** `POST /api/newsletter`
- **Request Body:**
```json
{
  "email": "newsletter@example.com"
}
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Status 200 donuyor
  - [ ] NewsletterSubscriber olusturuldu

---

### TEST-API-094: Newsletter Subscribe - Duplicate
- **Endpoint:** `POST /api/newsletter`
- **Onkosul:** Email zaten abone
- **Beklenen Response:** `200 OK` (veya 400)
- **Kontrol Listesi:**
  - [ ] Duplicate hata veya reactivate

---

## 10. Locations API

### TEST-API-100: Get Cities
- **Endpoint:** `GET /api/locations/cities`
- **Beklenen Response:** `200 OK`
```json
[
  { "id": "1", "name": "Adana" },
  { "id": "34", "name": "Istanbul" },
  ...
]
```
- **Kontrol Listesi:**
  - [ ] 81 il donuyor
  - [ ] Alfabetik sirali

---

### TEST-API-101: Get Districts
- **Endpoint:** `GET /api/locations/districts?cityId=34`
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Istanbul ilceleri donuyor
  - [ ] Alfabetik sirali

---

### TEST-API-102: Get Districts - Eksik City
- **Endpoint:** `GET /api/locations/districts`
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] cityId zorunlu hatasi

---

## 11. Admin Products API

### TEST-API-110: List Products (Admin)
- **Endpoint:** `GET /api/admin/products`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Admin ile liste donuyor
  - [ ] Pagination calisiyor
  - [ ] Tum urun detaylari var

---

### TEST-API-111: List Products - User Role
- **Endpoint:** `GET /api/admin/products`
- **Auth:** Customer session
- **Beklenen Response:** `403 Forbidden`
- **Kontrol Listesi:**
  - [ ] Status 403 donuyor

---

### TEST-API-112: List Products - Auth Yok
- **Endpoint:** `GET /api/admin/products`
- **Auth:** Yok
- **Beklenen Response:** `401 Unauthorized`
- **Kontrol Listesi:**
  - [ ] Status 401 donuyor

---

### TEST-API-113: Create Product
- **Endpoint:** `POST /api/admin/products`
- **Auth:** Admin session gerekli
- **Request Body:**
```json
{
  "name": "Test Sandalet",
  "slug": "test-sandalet",
  "sku": "TS-001",
  "description": "Test aciklama",
  "basePrice": 999.99,
  "gender": "KADIN",
  "categoryId": "...",
  "status": "DRAFT",
  "variants": [
    { "size": "37", "color": "Siyah", "colorHex": "#000000", "stock": 10 }
  ],
  "images": [
    { "url": "https://...", "alt": "Test", "position": 0 }
  ]
}
```
- **Beklenen Response:** `201 Created`
- **Kontrol Listesi:**
  - [ ] Status 201 donuyor
  - [ ] Urun olusturuldu
  - [ ] Variants kaydedildi
  - [ ] Images kaydedildi

---

### TEST-API-114: Create Product - Duplicate SKU
- **Endpoint:** `POST /api/admin/products`
- **Auth:** Admin session gerekli
- **Onkosul:** SKU zaten var
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] SKU unique hatasi

---

### TEST-API-115: Create Product - Eksik Alanlar
- **Endpoint:** `POST /api/admin/products`
- **Auth:** Admin session gerekli
- **Request Body:**
```json
{
  "name": "Test"
}
```
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] Zorunlu alan hatalari

---

### TEST-API-116: Get Product Detail (Admin)
- **Endpoint:** `GET /api/admin/products/[id]`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Tum urun detaylari
  - [ ] Variants dahil
  - [ ] Images sirali (position)

---

### TEST-API-117: Update Product
- **Endpoint:** `PATCH /api/admin/products/[id]`
- **Auth:** Admin session gerekli
- **Request Body:**
```json
{
  "name": "Guncellenmis Isim",
  "basePrice": 1099.99
}
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Name guncellendi
  - [ ] Price guncellendi
  - [ ] Diger alanlar degismedi

---

### TEST-API-118: Update Product - Images
- **Endpoint:** `PATCH /api/admin/products/[id]`
- **Auth:** Admin session gerekli
- **Request Body:**
```json
{
  "images": [
    { "url": "https://new-image.jpg", "alt": "New", "position": 0 }
  ]
}
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Eski images silindi
  - [ ] Yeni images eklendi

---

### TEST-API-119: Delete Product
- **Endpoint:** `DELETE /api/admin/products/[id]`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Urun silindi
  - [ ] Variants silindi (cascade)
  - [ ] Images silindi (cascade)

---

## 12. Admin Categories API

### TEST-API-120: List Categories (Admin)
- **Endpoint:** `GET /api/admin/categories`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Kategoriler listeleniyor
  - [ ] Product count var

---

### TEST-API-121: Create Category
- **Endpoint:** `POST /api/admin/categories`
- **Auth:** Admin session gerekli
- **Request Body:**
```json
{
  "name": "Yeni Kategori",
  "slug": "yeni-kategori",
  "gender": "KADIN",
  "description": "Test aciklama"
}
```
- **Beklenen Response:** `201 Created`
- **Kontrol Listesi:**
  - [ ] Kategori olusturuldu

---

### TEST-API-122: Create Category - Duplicate Slug+Gender
- **Endpoint:** `POST /api/admin/categories`
- **Auth:** Admin session gerekli
- **Onkosul:** Ayni slug+gender var
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] Unique constraint hatasi

---

### TEST-API-123: Update Category
- **Endpoint:** `PATCH /api/admin/categories/[id]`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Kategori guncellendi

---

### TEST-API-124: Delete Category
- **Endpoint:** `DELETE /api/admin/categories/[id]`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Kategori silindi

---

### TEST-API-125: Delete Category - With Products
- **Endpoint:** `DELETE /api/admin/categories/[id-with-products]`
- **Auth:** Admin session gerekli
- **Onkosul:** Kategoride urunler var
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] Iliski hatasi
  - [ ] Once urunler tasinmali

---

## 13. Admin Collections API

### TEST-API-130: List Collections (Admin)
- **Endpoint:** `GET /api/admin/collections`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Koleksiyonlar listeleniyor
  - [ ] Product count var

---

### TEST-API-131: Create Collection
- **Endpoint:** `POST /api/admin/collections`
- **Auth:** Admin session gerekli
- **Request Body:**
```json
{
  "name": "Yaz Koleksiyonu",
  "slug": "yaz-koleksiyonu",
  "description": "2025 Yaz",
  "isActive": true
}
```
- **Beklenen Response:** `201 Created`
- **Kontrol Listesi:**
  - [ ] Koleksiyon olusturuldu

---

### TEST-API-132: Update Collection
- **Endpoint:** `PATCH /api/admin/collections/[id]`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Koleksiyon guncellendi

---

### TEST-API-133: Delete Collection
- **Endpoint:** `DELETE /api/admin/collections/[id]`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Koleksiyon silindi
  - [ ] CollectionProduct iliskileri silindi

---

## 14. Admin Orders API

### TEST-API-140: List Orders (Admin)
- **Endpoint:** `GET /api/admin/orders`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Tum siparisler listeleniyor
  - [ ] Filtreleme calisiyor

---

### TEST-API-141: Get Order Detail (Admin)
- **Endpoint:** `GET /api/admin/orders/[id]`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Siparis detayi
  - [ ] User bilgisi
  - [ ] Items listesi
  - [ ] Status history

---

### TEST-API-142: Update Order Status
- **Endpoint:** `PATCH /api/admin/orders/[id]`
- **Auth:** Admin session gerekli
- **Request Body:**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "TR123456789",
  "carrier": "Yurtici Kargo"
}
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Status guncellendi
  - [ ] Tracking number kaydedildi
  - [ ] StatusHistory'e eklendi
  - [ ] shippedAt set edildi

---

### TEST-API-143: Update Order - Cancel
- **Endpoint:** `PATCH /api/admin/orders/[id]`
- **Auth:** Admin session gerekli
- **Request Body:**
```json
{
  "status": "CANCELLED",
  "adminNote": "Musteri talebi ile iptal"
}
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Status CANCELLED oldu
  - [ ] Stok geri yuklendi (varsa)

---

## 15. Admin Users API

### TEST-API-150: List Users (Admin)
- **Endpoint:** `GET /api/admin/users`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Kullanicilar listeleniyor
  - [ ] Pagination calisiyor

---

### TEST-API-151: Get User Detail (Admin)
- **Endpoint:** `GET /api/admin/users/[id]`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Kullanici detayi
  - [ ] Siparisleri
  - [ ] Adresleri

---

### TEST-API-152: Update User Role
- **Endpoint:** `PATCH /api/admin/users/[id]`
- **Auth:** Super Admin session gerekli
- **Request Body:**
```json
{
  "role": "ADMIN"
}
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Role guncellendi

---

## 16. Admin Coupons API

### TEST-API-160: List Coupons (Admin)
- **Endpoint:** `GET /api/admin/coupons`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Kuponlar listeleniyor

---

### TEST-API-161: Create Coupon
- **Endpoint:** `POST /api/admin/coupons`
- **Auth:** Admin session gerekli
- **Request Body:**
```json
{
  "code": "YENI20",
  "discountType": "PERCENTAGE",
  "discountValue": 20,
  "minOrderAmount": 100,
  "usageLimit": 100,
  "expiresAt": "2025-12-31T23:59:59Z",
  "isActive": true
}
```
- **Beklenen Response:** `201 Created`
- **Kontrol Listesi:**
  - [ ] Kupon olusturuldu
  - [ ] Code buyuk harfe cevrildi

---

### TEST-API-162: Update Coupon
- **Endpoint:** `PATCH /api/admin/coupons/[id]`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Kupon guncellendi

---

### TEST-API-163: Delete Coupon
- **Endpoint:** `DELETE /api/admin/coupons/[id]`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Kupon silindi

---

## 17. Admin Banners API

### TEST-API-170: List Banners (Admin)
- **Endpoint:** `GET /api/admin/banners`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Bannerlar listeleniyor

---

### TEST-API-171: Create Banner
- **Endpoint:** `POST /api/admin/banners`
- **Auth:** Admin session gerekli
- **Request Body:**
```json
{
  "title": "Yaz Indirimi",
  "subtitle": "%50'ye varan indirimler",
  "imageUrl": "https://...",
  "linkUrl": "/kadin",
  "linkText": "Alisverise Basla",
  "isActive": true
}
```
- **Beklenen Response:** `201 Created`
- **Kontrol Listesi:**
  - [ ] Banner olusturuldu

---

### TEST-API-172: Update Banner
- **Endpoint:** `PATCH /api/admin/banners/[id]`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Banner guncellendi

---

### TEST-API-173: Delete Banner
- **Endpoint:** `DELETE /api/admin/banners/[id]`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Banner silindi

---

## 18. Admin Pages API

### TEST-API-180: List Pages (Admin)
- **Endpoint:** `GET /api/admin/pages`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Sayfalar listeleniyor

---

### TEST-API-181: Create Page
- **Endpoint:** `POST /api/admin/pages`
- **Auth:** Admin session gerekli
- **Request Body:**
```json
{
  "title": "Gizlilik Politikasi",
  "slug": "gizlilik-politikasi",
  "content": "<p>Icerik...</p>",
  "metaTitle": "Gizlilik | Halikarnas",
  "metaDescription": "Gizlilik politikamiz",
  "isActive": true
}
```
- **Beklenen Response:** `201 Created`
- **Kontrol Listesi:**
  - [ ] Sayfa olusturuldu

---

### TEST-API-182: Update Page
- **Endpoint:** `PATCH /api/admin/pages/[id]`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Sayfa guncellendi

---

### TEST-API-183: Delete Page
- **Endpoint:** `DELETE /api/admin/pages/[id]`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Sayfa silindi

---

## 19. Admin Settings API

### TEST-API-190: Get Settings
- **Endpoint:** `GET /api/admin/settings`
- **Auth:** Admin session gerekli
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Tum ayarlar donuyor
  - [ ] Key-value pairs

---

### TEST-API-191: Update Settings
- **Endpoint:** `PUT /api/admin/settings`
- **Auth:** Admin session gerekli
- **Request Body:**
```json
[
  { "key": "site_name", "value": "Halikarnas", "group": "general" },
  { "key": "shipping_cost", "value": "49.90", "group": "shipping" }
]
```
- **Beklenen Response:** `200 OK`
- **Kontrol Listesi:**
  - [ ] Ayarlar guncellendi
  - [ ] Upsert calisiyor (var ise guncelle, yoksa olustur)

---

## 20. Upload API

### TEST-API-200: Upload Image
- **Endpoint:** `POST /api/upload`
- **Auth:** Admin session gerekli
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - file: (image file, max 5MB)
  - folder: "products"
  - gender: "kadin"
  - categorySlug: "sandalet"
  - productSlug: "test-sandalet"
  - sku: "TS-001"
  - color: "siyah"
  - imageIndex: "1"
- **Beklenen Response:** `200 OK`
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "publicId": "halikarnas/products/kadin/sandalet/TS-001-test-sandalet-siyah-1",
  "folder": "halikarnas/products/kadin/sandalet",
  "width": 800,
  "height": 1200
}
```
- **Kontrol Listesi:**
  - [ ] Cloudinary'e yuklendi
  - [ ] Dogru klasore yuklendi
  - [ ] Dosya adi dogru formatta

---

### TEST-API-201: Upload Image - Auth Yok
- **Endpoint:** `POST /api/upload`
- **Auth:** Yok
- **Beklenen Response:** `401 Unauthorized`
- **Kontrol Listesi:**
  - [ ] Status 401 donuyor

---

### TEST-API-202: Upload Image - User Role
- **Endpoint:** `POST /api/upload`
- **Auth:** Customer session
- **Beklenen Response:** `403 Forbidden`
- **Kontrol Listesi:**
  - [ ] Status 403 donuyor

---

### TEST-API-203: Upload Image - Buyuk Dosya (>5MB)
- **Endpoint:** `POST /api/upload`
- **Auth:** Admin session gerekli
- **Form Data:** file: (>5MB file)
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] Dosya boyutu hatasi

---

### TEST-API-204: Upload Image - Gecersiz Format
- **Endpoint:** `POST /api/upload`
- **Auth:** Admin session gerekli
- **Form Data:** file: (PDF veya baska format)
- **Beklenen Response:** `400 Bad Request`
- **Kontrol Listesi:**
  - [ ] Sadece resim formatlari kabul edilir

---

## Test Ozeti

| Kategori | Test Sayisi |
|----------|-------------|
| Auth | 15 |
| User/Profile | 7 |
| Addresses | 8 |
| Wishlist | 6 |
| Cart | 8 |
| Orders | 6 |
| Coupon | 4 |
| Search | 5 |
| Contact/Newsletter | 5 |
| Locations | 3 |
| Admin Products | 10 |
| Admin Categories | 6 |
| Admin Collections | 4 |
| Admin Orders | 4 |
| Admin Users | 3 |
| Admin Coupons | 4 |
| Admin Banners | 4 |
| Admin Pages | 4 |
| Admin Settings | 2 |
| Upload | 5 |
| **TOPLAM** | **143** |

# Database Test Sonuclari - 27 Aralik 2025

---

## 1. Model Varlik Testleri

Prisma ile model varligini kontrol ediyoruz.

| Test ID | Model | Sonuc |
|---------|-------|-------|
| TEST-DB-0XX | User Model | PASS |
| TEST-DB-0XX | Product Model | PASS |
| TEST-DB-0XX | ProductVariant Model | PASS |
| TEST-DB-0XX | ProductImage Model | PASS |
| TEST-DB-0XX | Category Model | PASS |
| TEST-DB-0XX | Collection Model | PASS |
| TEST-DB-0XX | Order Model | PASS |
| TEST-DB-0XX | OrderItem Model | PASS |
| TEST-DB-0XX | Cart Model | PASS |
| TEST-DB-0XX | CartItem Model | PASS |
| TEST-DB-0XX | WishlistItem Model | PASS |
| TEST-DB-0XX | Address Model | PASS |
| TEST-DB-0XX | Coupon Model | PASS |
| TEST-DB-0XX | Banner Model | PASS |
| TEST-DB-0XX | Page Model | PASS |
| TEST-DB-0XX | FAQ Model | PASS |
| TEST-DB-0XX | NewsletterSubscriber Model | PASS |
| TEST-DB-0XX | ContactMessage Model | FAIL |
| TEST-DB-0XX | SiteSetting Model | PASS |

## 2. Iliski Testleri

| Test ID | Iliski | Sonuc |
|---------|--------|-------|
| TEST-DB-0XX | User.*Order | FAIL |
| TEST-DB-0XX | User.*Cart | FAIL |
| TEST-DB-0XX | User.*Address | FAIL |
| TEST-DB-0XX | Product.*ProductVariant | FAIL |
| TEST-DB-0XX | Product.*ProductImage | FAIL |
| TEST-DB-0XX | Product.*Category | FAIL |
| TEST-DB-0XX | Order.*OrderItem | FAIL |
| TEST-DB-0XX | Cart.*CartItem | FAIL |

## 3. Enum Testleri

| Test ID | Enum | Sonuc |
|---------|------|-------|
| TEST-DB-0XX | UserRole Enum | PASS |
| TEST-DB-0XX | Gender Enum | PASS |
| TEST-DB-0XX | ProductStatus Enum | PASS |
| TEST-DB-0XX | OrderStatus Enum | PASS |
| TEST-DB-0XX | PaymentStatus Enum | PASS |
| TEST-DB-0XX | DiscountType Enum | PASS |

## 4. Constraint Testleri

| Test ID | Constraint | Sonuc |
|---------|------------|-------|
| TEST-DB-080 | @unique constraints | PASS (24 found) |
| TEST-DB-081 | @@unique (compound) | PASS (9 found) |
| TEST-DB-082 | @default values | PASS (83 found) |
| TEST-DB-083 | Cascade deletes | PASS (18 found) |

---

## Sonuc Ozeti

| Metrik | Deger |
|--------|-------|
| Passed | 28 |
| Failed | 9 |

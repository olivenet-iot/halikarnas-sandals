# API Test Sonuclari - 27 Aralik 2025

**Baslangic:** $(date)
**Base URL:** http://localhost:3000

---

## Ozet


## 1. Authentication API

| Test ID | Test Adi | Beklenen | Gerceklesen | Sonuc |
|---------|----------|----------|-------------|-------|
| TEST-API-001 | User Registration - Basarili | 200 | 200 | PASS |
| TEST-API-002 | Registration - Eksik Email | 400 | 400 | PASS |
| TEST-API-003 | Registration - Eksik Password | 400 | 400 | PASS |
| TEST-API-004 | Registration - Zayif Password | 400 | 400 | PASS |
| TEST-API-005 | Registration - Duplicate Email | 409 | 409 | PASS |
| TEST-API-009 | Get Session - No Auth | 200 | 200 | PASS |
| TEST-API-011 | Forgot Password | 200 | 200 | PASS |
| TEST-API-012 | Forgot Password - Invalid Email | 200 | 200 | PASS |
| TEST-API-014 | Reset Password - Invalid Token | 400 | 400 | PASS |

## 2. User/Profile API

| Test ID | Test Adi | Beklenen | Gerceklesen | Sonuc |
|---------|----------|----------|-------------|-------|
| TEST-API-021 | Get Profile - Auth Yok | 401 | 401 | PASS |

## 3. Addresses API

| Test ID | Test Adi | Beklenen | Gerceklesen | Sonuc |
|---------|----------|----------|-------------|-------|
| TEST-API-031 | List Addresses - Auth Yok | 401 | 401 | PASS |

## 4. Wishlist API

| Test ID | Test Adi | Beklenen | Gerceklesen | Sonuc |
|---------|----------|----------|-------------|-------|
| TEST-API-041 | Get Wishlist - Auth Yok | 401 | 401 | PASS |

## 5. Cart API

| Test ID | Test Adi | Beklenen | Gerceklesen | Sonuc |
|---------|----------|----------|-------------|-------|
| TEST-API-050 | Get Cart | 200 | 200 | PASS |

## 6. Orders API

| Test ID | Test Adi | Beklenen | Gerceklesen | Sonuc |
|---------|----------|----------|-------------|-------|
| TEST-API-062 | Get Orders - No Auth | 200 | 200 | PASS |

## 7. Coupon API

| Test ID | Test Adi | Beklenen | Gerceklesen | Sonuc |
|---------|----------|----------|-------------|-------|
| TEST-API-071 | Validate Coupon - Invalid | 200 | 400 | FAIL |
<!-- TEST-API-071 Response: {"valid":false,"error":"Geçersiz kupon kodu"} -->

## 8. Search API

| Test ID | Test Adi | Beklenen | Gerceklesen | Sonuc |
|---------|----------|----------|-------------|-------|
| TEST-API-080 | Search Products | 200 | 200 | PASS |
| TEST-API-081 | Search - Empty Query | 200 | 200 | PASS |
| TEST-API-082 | Search - With Filters | 200 | 200 | PASS |
| TEST-API-083 | Search - Sorting | 200 | 200 | PASS |
| TEST-API-084 | Search - Pagination | 200 | 200 | PASS |

## 9. Contact & Newsletter API

| Test ID | Test Adi | Beklenen | Gerceklesen | Sonuc |
|---------|----------|----------|-------------|-------|
| TEST-API-090 | Contact Form | 201 | 201 | PASS |
| TEST-API-091 | Contact Form - Missing Fields | 400 | 400 | PASS |
| TEST-API-093 | Newsletter Subscribe | 200 | 200 | PASS |
| TEST-API-094 | Newsletter - Invalid Email | 400 | 400 | PASS |

## 10. Locations API

| Test ID | Test Adi | Beklenen | Gerceklesen | Sonuc |
|---------|----------|----------|-------------|-------|
| TEST-API-100 | Get Cities | 200 | 200 | PASS |
| TEST-API-101 | Get Districts | 200 | 200 | PASS |
| TEST-API-102 | Get Districts - No City | 400 | 400 | PASS |

## 11-20. Admin API (Auth Required)

| Test ID | Test Adi | Beklenen | Gerceklesen | Sonuc |
|---------|----------|----------|-------------|-------|
| TEST-API-110 | Admin Products - No Auth | 401 | 405 | FAIL |
<!-- TEST-API-110 Response:  -->
| TEST-API-120 | Admin Categories - No Auth | 401 | 401 | PASS |
| TEST-API-130 | Admin Collections - No Auth | 401 | 401 | PASS |
| TEST-API-140 | Admin Orders - No Auth | 401 | 404 | FAIL |
<!-- TEST-API-140 Response: <!DOCTYPE html><html lang="tr"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="preload" href="/_next/static/media/b497598118275079-s.p.woff -->
| TEST-API-150 | Admin Users - No Auth | 401 | 404 | FAIL |
<!-- TEST-API-150 Response: <!DOCTYPE html><html lang="tr"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="preload" href="/_next/static/media/b497598118275079-s.p.woff -->
| TEST-API-160 | Admin Coupons - No Auth | 401 | 405 | FAIL |
<!-- TEST-API-160 Response:  -->
| TEST-API-170 | Admin Banners - No Auth | 401 | 405 | FAIL |
<!-- TEST-API-170 Response:  -->
| TEST-API-180 | Admin Pages - No Auth | 401 | 405 | FAIL |
<!-- TEST-API-180 Response:  -->
| TEST-API-190 | Admin Settings - No Auth | 401 | 401 | PASS |
| TEST-API-201 | Upload - No Auth | 401 | 401 | PASS |

---

## Sonuc Ozeti

| Metrik | Deger |
|--------|-------|
| Passed | 30 |
| Failed | 7 |
| Skipped | 0 |
| Toplam | 37 |
| Oran | 78.9% |

**Bitis:** Sat Dec 27 19:55:56 +03 2025

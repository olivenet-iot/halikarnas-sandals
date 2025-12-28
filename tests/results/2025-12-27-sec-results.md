# Security Test Sonuclari - 27 Aralik 2025

---

## 1. Security Headers

| Header | Beklenen | Gerceklesen | Sonuc |
|--------|----------|-------------|-------|
| X-Frame-Options | DENY | DENY | PASS |
| X-Content-Type-Options | nosniff | nosniff | PASS |
| X-XSS-Protection | 1; mode=block | 1; mode=block | PASS |
| Referrer-Policy | strict-origin-when-cross-origin | strict-origin-when-cross-origin | PASS |

## 2. Auth Protection

| Test ID | Test | Beklenen | Gerceklesen | Sonuc |
|---------|------|----------|-------------|-------|
| TEST-SEC-001 | Profile API no auth | 401 | 401 | PASS |
| TEST-SEC-002 | Addresses API no auth | 401 | 401 | PASS |
| TEST-SEC-003 | Wishlist API no auth | 401 | 401 | PASS |
| TEST-SEC-004 | Admin Products no auth | 401 | 405 | FAIL |
| TEST-SEC-005 | Admin Orders no auth | 401 | 404 | FAIL |
| TEST-SEC-006 | Admin Users no auth | 401 | 404 | FAIL |
| TEST-SEC-007 | Upload no auth | 401 | 405 | FAIL |

## 3. Input Validation

| Test ID | Test | Payload | Sonuc |
|---------|------|---------|-------|
| TEST-SEC-010 | SQL Injection - Search | ' OR '1'='1 | PASS (safe) |
| TEST-SEC-011 | XSS - Search | <script>alert(1)</script> | PASS (safe) |
| TEST-SEC-012 | Honeypot Protection | honeypot=filled | PASS (blocked) |

## 4. Admin Route Protection

| Test ID | Route | Status | Sonuc |
|---------|-------|--------|-------|
| TEST-SEC-02X | /admin | 307 | PASS (protected) |
| TEST-SEC-02X | /admin/urunler | 307 | PASS (protected) |
| TEST-SEC-02X | /admin/siparisler | 307 | PASS (protected) |
| TEST-SEC-02X | /admin/kullanicilar | 307 | PASS (protected) |

---

## Sonuc Ozeti

| Metrik | Deger |
|--------|-------|
| Passed | 14 |
| Failed | 4 |

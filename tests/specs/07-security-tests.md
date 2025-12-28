# Guvenlik Testleri

Bu dokuman Halikarnas e-ticaret platformunun guvenlik testlerini icerir. OWASP Top 10 ve genel web guvenlik standartlarina gore hazirlanmistir.

**Toplam:** ~42 test
**Kategori Kodu:** SEC
**Test ID Formati:** TEST-SEC-XXX

---

## Icindekiler

1. [Authentication & Authorization](#1-authentication--authorization)
2. [Injection Attacks](#2-injection-attacks)
3. [XSS - Cross-Site Scripting](#3-xss---cross-site-scripting)
4. [CSRF - Cross-Site Request Forgery](#4-csrf---cross-site-request-forgery)
5. [Rate Limiting](#5-rate-limiting)
6. [Data Exposure](#6-data-exposure)
7. [File Upload Security](#7-file-upload-security)
8. [Session Security](#8-session-security)
9. [API Security](#9-api-security)
10. [Infrastructure Security](#10-infrastructure-security)

---

## Onkosuller

- Development server calisir durumda
- Test kullanicilari mevcut
- Browser DevTools aktif
- Burp Suite veya OWASP ZAP (opsiyonel)
- cURL veya Postman

### Test Kullanicilari

| Rol | Email | Sifre |
|-----|-------|-------|
| Admin | admin@halikarnas.com | Admin123! |
| Customer | test@example.com | Test123! |
| Guest | - | - |

---

## 1. Authentication & Authorization

### TEST-SEC-001: Broken Access Control - Admin Routes
- **Kategori:** A01:2021 - Broken Access Control
- **Test:** Admin route'lara yetkisiz erisim
- **Adimlar:**
  1. Giris yapmadan `/admin` adresine git
  2. Customer hesabi ile giris yap
  3. `/admin` adresine git
- **Beklenen:** Her iki durumda da `/giris`'e yonlendirme
- **Kontrol Listesi:**
  - [ ] `/admin` yetkisiz erisilemiyor
  - [ ] `/admin/urunler` yetkisiz erisilemiyor
  - [ ] `/admin/siparisler` yetkisiz erisilemiyor
  - [ ] `/api/admin/*` 401/403 donuyor

### TEST-SEC-002: Broken Access Control - User Data
- **Kategori:** A01:2021 - Broken Access Control
- **Test:** Baska kullanicinin verisine erisim
- **Adimlar:**
  1. User A ile giris yap
  2. User B'nin siparis ID'sini bul
  3. `/api/orders/[userB-order-id]` istegi yap
- **Beklenen:** 403 Forbidden veya 404 Not Found
- **Kontrol Listesi:**
  - [ ] Baska kullanicinin siparisleri gorunmuyor
  - [ ] Baska kullanicinin adresleri gorunmuyor
  - [ ] Baska kullanicinin sepeti gorunmuyor

### TEST-SEC-003: Broken Access Control - IDOR
- **Kategori:** A01:2021 - Insecure Direct Object References
- **Test:** ID manipulasyonu ile yetkisiz erisim
- **Adimlar:**
  1. Kendi adres ID'ni bul (ornegin: addr_123)
  2. Farkli bir ID dene (addr_456)
  3. DELETE /api/addresses/addr_456 istegi yap
- **Beklenen:** 403 veya 404
- **Kontrol Listesi:**
  - [ ] Address IDOR korunmus
  - [ ] Order IDOR korunmus
  - [ ] WishlistItem IDOR korunmus

### TEST-SEC-004: Privilege Escalation
- **Kategori:** A01:2021 - Privilege Escalation
- **Test:** Rol yukseltme denemesi
- **Adimlar:**
  1. Customer hesabi ile giris yap
  2. Profile update istegi yap: `{ "role": "ADMIN" }`
- **Beklenen:** role alani guncellenmemeli
- **Kontrol Listesi:**
  - [ ] Customer role degistiremiyor
  - [ ] API'da role alani korunmus (allowlist)

### TEST-SEC-005: Password Policy
- **Kategori:** A07:2021 - Identification and Authentication Failures
- **Test:** Zayif sifre kabul edilmiyor
- **Zayif Sifreler:**
  - `123456`
  - `password`
  - `abc`
  - `12345678`
- **Kontrol Listesi:**
  - [ ] 8 karakterden kisa sifre reddediliyor
  - [ ] Sadece rakam reddediliyor
  - [ ] Buyuk/kucuk harf zorunlu
  - [ ] Ozel karakter/rakam zorunlu

### TEST-SEC-006: Account Enumeration
- **Kategori:** A07:2021 - Identification and Authentication Failures
- **Test:** Kullanici varligini tespit etme
- **Adimlar:**
  1. Var olan email ile yanlis sifre dene
  2. Var olmayan email ile giris dene
  3. Hata mesajlarini karsilastir
- **Beklenen:** Ayni hata mesaji (generic)
- **Kontrol Listesi:**
  - [ ] Login hata mesaji generic ("Email veya sifre hatali")
  - [ ] Forgot password hata mesaji generic
  - [ ] Response time farki yok

### TEST-SEC-007: Brute Force Protection
- **Kategori:** A07:2021 - Identification and Authentication Failures
- **Test:** Coklu basarisiz giris denemesi
- **Adimlar:**
  1. Ayni hesaba 10 kez yanlis sifre dene
  2. 11. denemede dogru sifre dene
- **Beklenen:** Gecici hesap kilidi veya rate limit
- **Kontrol Listesi:**
  - [ ] 5+ basarisiz denemede uyari
  - [ ] 10+ denemede gecici kilit
  - [ ] Rate limit aktif (429 Too Many Requests)

---

## 2. Injection Attacks

### TEST-SEC-008: SQL Injection - Search
- **Kategori:** A03:2021 - Injection
- **Test:** Arama kutusunda SQL injection
- **Payload'lar:**
  ```
  ' OR '1'='1
  '; DROP TABLE products;--
  1' UNION SELECT * FROM users--
  ```
- **Kontrol Listesi:**
  - [ ] SQL hatasi donmuyor
  - [ ] Veri sizintisi yok
  - [ ] Normal arama sonucu donuyor veya bos

### TEST-SEC-009: SQL Injection - Login
- **Kategori:** A03:2021 - Injection
- **Test:** Login formunda SQL injection
- **Payload'lar:**
  ```
  Email: admin@halikarnas.com'--
  Email: ' OR 1=1--
  Password: ' OR '1'='1
  ```
- **Kontrol Listesi:**
  - [ ] Giris basarisiz
  - [ ] SQL hatasi donmuyor
  - [ ] Parameterized query kullaniliyor (Prisma)

### TEST-SEC-010: SQL Injection - ID Parameters
- **Kategori:** A03:2021 - Injection
- **Test:** URL parametrelerinde SQL injection
- **Test URL'leri:**
  ```
  /api/products/1' OR '1'='1
  /api/orders/1; DROP TABLE orders;--
  ```
- **Kontrol Listesi:**
  - [ ] 400 Bad Request donuyor
  - [ ] ID validation var
  - [ ] UUID format zorunlu

### TEST-SEC-011: NoSQL Injection
- **Kategori:** A03:2021 - Injection
- **Test:** NoSQL injection denemeleri
- **Payload'lar:**
  ```json
  { "email": { "$ne": "" } }
  { "email": { "$gt": "" } }
  ```
- **Kontrol Listesi:**
  - [ ] MongoDB operatorleri calismaz (PostgreSQL)
  - [ ] Input validation aktif
  - [ ] Type checking var

### TEST-SEC-012: Command Injection
- **Kategori:** A03:2021 - Injection
- **Test:** OS command injection
- **Test Alanlari:**
  - Dosya adi alanlari
  - URL alanlari
- **Payload'lar:**
  ```
  ; ls -la
  | cat /etc/passwd
  `whoami`
  ```
- **Kontrol Listesi:**
  - [ ] Komut calistirma yok
  - [ ] Server-side shell erisimi yok

---

## 3. XSS - Cross-Site Scripting

### TEST-SEC-013: Stored XSS - Product Name
- **Kategori:** A07:2021 - XSS
- **Test:** Urun adina script enjeksiyonu
- **Adimlar:**
  1. Admin panelden yeni urun olustur
  2. Urun adi: `<script>alert('XSS')</script>`
  3. Urun detay sayfasini ziyaret et
- **Beklenen:** Script calismiyor, encode ediliyor
- **Kontrol Listesi:**
  - [ ] Alert gorunmuyor
  - [ ] HTML encode edilmis (`&lt;script&gt;`)
  - [ ] React otomatik escape calisiyor

### TEST-SEC-014: Stored XSS - User Input
- **Kategori:** A07:2021 - XSS
- **Test:** Kullanici girisi alanlarda XSS
- **Test Alanlari:**
  - Adres bilgileri
  - Iletisim formu
  - Profil bilgileri
- **Payload'lar:**
  ```html
  <script>alert('XSS')</script>
  <img src=x onerror=alert('XSS')>
  <svg onload=alert('XSS')>
  javascript:alert('XSS')
  ```
- **Kontrol Listesi:**
  - [ ] Adres alanlarinda XSS yok
  - [ ] Iletisim formunda XSS yok
  - [ ] Profil alanlarinda XSS yok

### TEST-SEC-015: Reflected XSS - Search
- **Kategori:** A07:2021 - XSS
- **Test:** Arama sonuclarinda yansima XSS
- **Test URL:**
  ```
  /arama?q=<script>alert('XSS')</script>
  ```
- **Kontrol Listesi:**
  - [ ] Script calismiyor
  - [ ] Arama terimi encode edilmis

### TEST-SEC-016: DOM-based XSS
- **Kategori:** A07:2021 - XSS
- **Test:** Client-side XSS
- **Test Alanlari:**
  - URL hash parameters
  - LocalStorage/SessionStorage
  - innerHTML kullanimi
- **Kontrol Listesi:**
  - [ ] dangerouslySetInnerHTML kullanimi sinirli
  - [ ] URL parametreleri sanitize ediliyor
  - [ ] Storage verileri sanitize ediliyor

### TEST-SEC-017: Content Security Policy
- **Kategori:** A07:2021 - XSS Prevention
- **Test:** CSP header kontrolu
- **Kontrol Listesi:**
  - [ ] Content-Security-Policy header var
  - [ ] script-src tanimli
  - [ ] inline script blocked (veya nonce)
  - [ ] eval() blocked

---

## 4. CSRF - Cross-Site Request Forgery

### TEST-SEC-018: CSRF Token Kontrolu
- **Kategori:** A01:2021 - CSRF
- **Test:** State-changing islemlerde CSRF korumasi
- **Adimlar:**
  1. Giris yap
  2. Baska domain'den form submit dene
  3. veya Cookie olmadan API istegi yap
- **Kontrol Listesi:**
  - [ ] NextAuth CSRF token kullaniliyor
  - [ ] SameSite cookie attribute var
  - [ ] Cross-origin istekler reddediliyor

### TEST-SEC-019: CSRF - Sensitive Actions
- **Kategori:** A01:2021 - CSRF
- **Test:** Kritik islemlerde CSRF
- **Kritik Islemler:**
  - Sifre degistirme
  - Email degistirme
  - Hesap silme
  - Siparis olusturma
- **Kontrol Listesi:**
  - [ ] Password change CSRF korunmus
  - [ ] Profile update CSRF korunmus
  - [ ] Order creation CSRF korunmus

---

## 5. Rate Limiting

### TEST-SEC-020: Login Rate Limit
- **Kategori:** A07:2021 - Rate Limiting
- **Test:** Login endpoint rate limit
- **Adimlar:**
  1. 20 arka arkaya login istegi yap
  2. Response'lari kontrol et
- **Beklenen:** 429 Too Many Requests (5-10 istek sonra)
- **Kontrol Listesi:**
  - [ ] Rate limit aktif
  - [ ] 429 status kodu donuyor
  - [ ] Retry-After header var

### TEST-SEC-021: Register Rate Limit
- **Kategori:** A07:2021 - Rate Limiting
- **Test:** Kayit endpoint rate limit
- **Kontrol Listesi:**
  - [ ] Bulk kayit engellenmiyor
  - [ ] Rate limit aktif

### TEST-SEC-022: Contact Form Rate Limit
- **Kategori:** A07:2021 - Rate Limiting
- **Test:** Iletisim formu spam korumasi
- **Kontrol Listesi:**
  - [ ] Rate limit aktif (5 istek/dakika)
  - [ ] Honeypot field var
  - [ ] 429 donuyor asim durumunda

### TEST-SEC-023: Newsletter Rate Limit
- **Kategori:** A07:2021 - Rate Limiting
- **Test:** Newsletter abonelik spam korumasi
- **Kontrol Listesi:**
  - [ ] Rate limit aktif
  - [ ] Ayni email tekrar abone olamiyor

### TEST-SEC-024: API Rate Limit
- **Kategori:** A07:2021 - Rate Limiting
- **Test:** Genel API rate limit
- **Kontrol Listesi:**
  - [ ] Public API rate limit var
  - [ ] Admin API rate limit var
  - [ ] Authenticated vs unauthenticated fark

---

## 6. Data Exposure

### TEST-SEC-025: Sensitive Data in Response
- **Kategori:** A02:2021 - Cryptographic Failures
- **Test:** API response'larda hassas veri
- **Kontrol Listesi:**
  - [ ] Password hash donmuyor
  - [ ] Session token donmuyor
  - [ ] Kredi karti bilgisi donmuyor
  - [ ] Diger kullanicilarin emailleri donmuyor

### TEST-SEC-026: Error Messages
- **Kategori:** A02:2021 - Information Disclosure
- **Test:** Hata mesajlarinda bilgi sizintisi
- **Kontrol Listesi:**
  - [ ] Stack trace production'da gizli
  - [ ] Database error details gizli
  - [ ] File path bilgisi yok
  - [ ] Server teknoloji bilgisi minimal

### TEST-SEC-027: Directory Listing
- **Kategori:** A02:2021 - Information Disclosure
- **Test:** Dizin listelenemez
- **Test URL'leri:**
  ```
  /api/
  /public/
  /_next/
  ```
- **Kontrol Listesi:**
  - [ ] Dizin listeleme devre disi
  - [ ] 404 veya 403 donuyor

### TEST-SEC-028: Source Code Exposure
- **Kategori:** A02:2021 - Information Disclosure
- **Test:** Kaynak kod erisimi
- **Test URL'leri:**
  ```
  /.env
  /.git/config
  /package.json (runtime'da)
  ```
- **Kontrol Listesi:**
  - [ ] .env erisilemez
  - [ ] .git erisilemez
  - [ ] Source maps production'da gizli

### TEST-SEC-029: Sensitive Data in URL
- **Kategori:** A02:2021 - Information Disclosure
- **Test:** URL'de hassas veri
- **Kontrol Listesi:**
  - [ ] Password URL'de yok
  - [ ] Token URL'de yok (query param)
  - [ ] Session ID URL'de yok

---

## 7. File Upload Security

### TEST-SEC-030: File Type Validation
- **Kategori:** A04:2021 - Insecure Design
- **Test:** Gecersiz dosya tipi yukleme
- **Test Dosyalari:**
  - .php, .jsp, .exe uzantili dosyalar
  - Double extension: image.jpg.php
  - MIME type spoofing
- **Kontrol Listesi:**
  - [ ] Sadece izinli tipler kabul ediliyor (jpg, png, webp)
  - [ ] MIME type kontrolu var
  - [ ] File signature (magic bytes) kontrolu var

### TEST-SEC-031: File Size Limit
- **Kategori:** A04:2021 - Resource Management
- **Test:** Buyuk dosya yukleme
- **Kontrol Listesi:**
  - [ ] Max file size limiti var (5MB)
  - [ ] 413 Payload Too Large donuyor
  - [ ] Server crash olmuyor

### TEST-SEC-032: Malicious File Content
- **Kategori:** A04:2021 - Insecure Design
- **Test:** Zararli icerikli dosya
- **Test Senaryolari:**
  - Script iceren SVG
  - Polyglot dosyalar
  - Exif metadata injection
- **Kontrol Listesi:**
  - [ ] SVG sanitize ediliyor
  - [ ] Metadata strip ediliyor
  - [ ] Cloudinary processing aktif

### TEST-SEC-033: Path Traversal
- **Kategori:** A01:2021 - Path Traversal
- **Test:** Dosya yolu manipulasyonu
- **Payload'lar:**
  ```
  ../../../etc/passwd
  ....//....//etc/passwd
  ```
- **Kontrol Listesi:**
  - [ ] Path traversal engelleniyor
  - [ ] Dosya adi sanitize ediliyor
  - [ ] Sabit upload dizini kullaniliyor

---

## 8. Session Security

### TEST-SEC-034: Session Cookie Attributes
- **Kategori:** A02:2021 - Session Management
- **Test:** Cookie guvenlik attribute'lari
- **Kontrol Listesi:**
  - [ ] HttpOnly flag var
  - [ ] Secure flag var (HTTPS)
  - [ ] SameSite=Lax veya Strict
  - [ ] Path=/ veya spesifik

### TEST-SEC-035: Session Fixation
- **Kategori:** A07:2021 - Session Fixation
- **Test:** Giris sonrasi session ID degisimi
- **Adimlar:**
  1. Session ID'yi kaydet
  2. Giris yap
  3. Yeni session ID'yi kontrol et
- **Beklenen:** Farkli session ID
- **Kontrol Listesi:**
  - [ ] Login sonrasi yeni session
  - [ ] Logout sonrasi session invalidate

### TEST-SEC-036: Session Timeout
- **Kategori:** A07:2021 - Session Management
- **Test:** Otomatik oturum sonlandirma
- **Kontrol Listesi:**
  - [ ] Idle timeout var (30 dakika)
  - [ ] Absolute timeout var (24 saat)
  - [ ] "Remember me" ayrimi var

### TEST-SEC-037: Concurrent Sessions
- **Kategori:** A07:2021 - Session Management
- **Test:** Coklu oturum kontrolu
- **Kontrol Listesi:**
  - [ ] Esli oturumlar izin veriliyor/verilmiyor
  - [ ] Yeni giris eski oturumu kapatabilir
  - [ ] Session listesi gorulebilir (hesabim)

---

## 9. API Security

### TEST-SEC-038: HTTP Methods
- **Kategori:** A01:2021 - API Security
- **Test:** Izinsiz HTTP method kullanimi
- **Adimlar:**
  1. GET-only endpoint'e POST istegi
  2. OPTIONS, TRACE, PUT metodlarini dene
- **Kontrol Listesi:**
  - [ ] 405 Method Not Allowed donuyor
  - [ ] TRACE disable
  - [ ] OPTIONS dogru CORS header donuyor

### TEST-SEC-039: CORS Configuration
- **Kategori:** A01:2021 - API Security
- **Test:** Cross-Origin Resource Sharing
- **Kontrol Listesi:**
  - [ ] Access-Control-Allow-Origin spesifik
  - [ ] Wildcard (*) kullanilmiyor (sensitive API'lar)
  - [ ] Credentials ile CORS dogru

### TEST-SEC-040: Input Validation
- **Kategori:** A03:2021 - Input Validation
- **Test:** API input validasyonu
- **Test Alanlari:**
  - Email format
  - Phone format
  - Price (negatif deger)
  - Quantity (negatif/asiri buyuk)
- **Kontrol Listesi:**
  - [ ] Zod validation aktif
  - [ ] Type coercion guvenli
  - [ ] Max length limitleri var

---

## 10. Infrastructure Security

### TEST-SEC-041: Security Headers
- **Kategori:** A05:2021 - Security Misconfiguration
- **Test:** HTTP guvenlik header'lari
- **Kontrol Listesi:**
  - [ ] X-Frame-Options: DENY/SAMEORIGIN
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-XSS-Protection: 1; mode=block
  - [ ] Strict-Transport-Security (HSTS)
  - [ ] Referrer-Policy
  - [ ] Permissions-Policy

### TEST-SEC-042: HTTPS Enforcement
- **Kategori:** A02:2021 - Cryptographic Failures
- **Test:** HTTPS zorunlulugu
- **Kontrol Listesi:**
  - [ ] HTTP -> HTTPS yonlendirme var
  - [ ] HSTS header var
  - [ ] Mixed content yok
  - [ ] TLS 1.2+ kullaniliyor

---

## Guvenlik Kontrol Listesi (Deployment Oncesi)

### Authentication
- [ ] Password hashing (bcrypt)
- [ ] Session management (NextAuth)
- [ ] Rate limiting (login/register)
- [ ] Account lockout
- [ ] Password policy

### Authorization
- [ ] Role-based access control
- [ ] Resource ownership check
- [ ] Admin route protection
- [ ] API authorization

### Data Protection
- [ ] Input validation (Zod)
- [ ] Output encoding (React)
- [ ] SQL injection prevention (Prisma)
- [ ] XSS prevention
- [ ] CSRF protection

### Session
- [ ] Secure cookie flags
- [ ] Session timeout
- [ ] Session regeneration

### Headers
- [ ] Security headers
- [ ] CORS configuration
- [ ] CSP header

### Infrastructure
- [ ] HTTPS only
- [ ] Error handling
- [ ] Logging (no sensitive data)
- [ ] File upload restrictions

---

## Sonuc Raporu Sablonu

```markdown
# Guvenlik Test Sonuclari - [TARIH]

## Ozet

| Kategori | Toplam | Pass | Fail | Risk |
|----------|--------|------|------|------|
| Auth & Authz | 7 | X | X | High |
| Injection | 5 | X | X | Critical |
| XSS | 5 | X | X | High |
| CSRF | 2 | X | X | Medium |
| Rate Limiting | 5 | X | X | Medium |
| Data Exposure | 5 | X | X | High |
| File Upload | 4 | X | X | Medium |
| Session | 4 | X | X | High |
| API | 3 | X | X | Medium |
| Infrastructure | 2 | X | X | Medium |

## Risk Seviyeleri

| Seviye | Aciklama |
|--------|----------|
| Critical | Acil mudahale gerekli |
| High | 24 saat icinde duzeltilmeli |
| Medium | 1 hafta icinde duzeltilmeli |
| Low | Planli sprintte duzeltilmeli |
| Info | Bilgilendirme |

## Bulunan Zafiyetler

### [HIGH] TEST-SEC-XXX: Zafiyet Adi
- **Aciklama:** ...
- **Etki:** ...
- **Cozum Onerisi:** ...
- **Referans:** OWASP-XXX

## Aksiyonlar

1. [ ] [Critical] Zafiyet 1 duzeltilecek
2. [ ] [High] Zafiyet 2 duzeltilecek
3. [ ] [Medium] Zafiyet 3 duzeltilecek
```

---

## Kaynaklar

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [NextAuth Security](https://next-auth.js.org/getting-started/introduction)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access)

---

*Son Guncelleme: 27 Aralik 2025*

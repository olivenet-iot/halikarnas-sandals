# Halikarnas Test Sistemi

## Genel Bakis

Bu test sistemi Halikarnas e-ticaret platformunun tum ozelliklerini test eder.
Manual test dokumantasyonu olarak tasarlanmistir.

---

## Test Kategorileri

| Kategori | Dosya | Aciklama | Test Sayisi |
|----------|-------|----------|-------------|
| API Tests | [01-api-tests.md](./specs/01-api-tests.md) | Backend endpoint testleri | ~143 |
| UI Tests | [02-ui-tests.md](./specs/02-ui-tests.md) | Frontend sayfa testleri | ~151 |
| Admin Tests | [03-admin-tests.md](./specs/03-admin-tests.md) | Admin panel testleri | ~124 |
| E2E Tests | [04-e2e-tests.md](./specs/04-e2e-tests.md) | Uctan uca senaryolar | 8 senaryo |
| Database Tests | [05-database-tests.md](./specs/05-database-tests.md) | Veri butunlugu testleri | ~94 |
| Performance Tests | [06-performance-tests.md](./specs/06-performance-tests.md) | Performans testleri | ~15 |
| Security Tests | [07-security-tests.md](./specs/07-security-tests.md) | Guvenlik testleri | ~42 |

**Toplam:** ~660+ test senaryosu

---

## Test ID Formati

```
TEST-{KATEGORI}-{NUMARA}
```

### Kategoriler:

| Kod | Kategori | Ornek |
|-----|----------|-------|
| API | API endpoint testleri | TEST-API-001 |
| UI | Kullanici arayuzu testleri | TEST-UI-020 |
| ADM | Admin panel testleri | TEST-ADM-010 |
| E2E | End-to-end senaryolar | TEST-E2E-001 |
| DB | Database/model testleri | TEST-DB-005 |
| PERF | Performans testleri | TEST-PERF-001 |
| SEC | Guvenlik testleri | TEST-SEC-010 |

---

## Onkosullar

### Sistem Gereksinimleri:
- Node.js 18+
- PostgreSQL 14+
- Chrome/Chromium (UI testleri icin)

### Ortam Hazırligi:

```bash
# 1. Development server baslat
npm run dev

# 2. Veritabani hazir olmali
npx prisma db push
npx prisma db seed

# 3. Environment variables
cp .env.example .env
# DATABASE_URL, NEXTAUTH_SECRET, etc. doldur
```

### Test Kullanicilari:

| Rol | Email | Sifre |
|-----|-------|-------|
| Admin | admin@halikarnas.com | Admin123! |
| Customer | test@example.com | Test123! |

---

## Test Calistirma

### Manual Test Sureci:

1. **Test dosyasini ac** (ornegin `01-api-tests.md`)
2. **Test ID'sini bul** (ornegin TEST-API-001)
3. **Adimlari takip et**
4. **Checkbox'lari isaretle** ([ ] -> [x])
5. **Sonuclari kaydet**

### Sonuc Raporlama:

Test sonuclari `tests/results/` klasorune kaydedilir.

**Format:** `YYYY-MM-DD-HH-mm-results.md`

**Ornek:** `2025-12-27-14-30-results.md`

```markdown
# Test Sonuclari - 27 Aralik 2025

## Ozet
- Toplam: 50 test
- Basarili: 48
- Basarisiz: 2
- Atlanan: 0

## Basarisiz Testler

### TEST-API-005: Login with Invalid Password
- **Durum:** BASARISIZ
- **Beklenen:** 401 Unauthorized
- **Gerceklesen:** 500 Internal Server Error
- **Not:** Backend'de hata yakalama eksik
```

---

## Klasor Yapisi

```
tests/
├── README.md                    # Bu dosya
├── specs/
│   ├── 01-api-tests.md          # API endpoint testleri
│   ├── 02-ui-tests.md           # UI sayfa testleri
│   ├── 03-admin-tests.md        # Admin panel testleri
│   ├── 04-e2e-tests.md          # E2E senaryolar
│   ├── 05-database-tests.md     # Veritabani testleri
│   ├── 06-performance-tests.md  # Performans testleri
│   └── 07-security-tests.md     # Guvenlik testleri
├── fixtures/                    # Test verileri
│   ├── products.json            # Ornek urun verileri
│   ├── users.json               # Ornek kullanici verileri
│   └── orders.json              # Ornek siparis verileri
└── results/                     # Test sonuclari
    └── YYYY-MM-DD-HH-mm-results.md
```

---

## API Test Araclari

### cURL Ornekleri:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get Products
curl http://localhost:3000/api/products

# Admin - List Products (Auth gerekli)
curl http://localhost:3000/api/admin/products \
  -H "Cookie: next-auth.session-token=..."
```

### Postman/Insomnia:
- Base URL: `http://localhost:3000`
- Auth: Session cookie (NextAuth)

---

## UI Test Araclari

### Browser DevTools:
- **Network tab:** API isteklerini izle
- **Console tab:** JavaScript hatalarini kontrol et
- **Application tab:** LocalStorage, cookies kontrol et

### Responsive Test:
- **Desktop:** 1920x1080
- **Tablet:** 768x1024
- **Mobile:** 375x812 (iPhone X)

---

## Durum Kodlari

| Kod | Anlam |
|-----|-------|
| BASARILI | Test beklenen sonucu verdi |
| BASARISIZ | Test beklenenden farkli sonuc verdi |
| ATLANDI | Test calistirilmadi (onkosul saglanamadi) |
| BLOKLANDI | Test baska bir hatadan dolayi calistirilamadi |

---

## Onemli Notlar

1. **Test Izolasyonu:** Her test bagimsiz calisabilmeli
2. **Veri Temizligi:** Test sonrasi olusturulan veriler temizlenmeli
3. **Idempotent:** Ayni test tekrar calistirildiginda ayni sonucu vermeli
4. **Dokumantasyon:** Basarisiz testler detayli not ile kayit edilmeli

---

## Katkida Bulunma

Yeni test eklerken:

1. Uygun kategoriye ekle
2. Test ID formatina uy (TEST-XXX-NNN)
3. Tum adimlari ve beklenen sonuclari yaz
4. Kontrol listesi (checkbox) ekle
5. Onkosullari belirt

---

## Iletisim

Sorular ve geri bildirimler icin:
- GitHub Issues
- Email: dev@halikarnas.com

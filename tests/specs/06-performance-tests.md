# Performans Testleri

Bu dokuman Halikarnas e-ticaret platformunun performans testlerini icerir.

**Toplam:** ~15 test
**Kategori Kodu:** PERF
**Test ID Formati:** TEST-PERF-XXX

---

## Icindekiler

1. [Core Web Vitals](#1-core-web-vitals)
2. [Sayfa Yukleme Sureleri](#2-sayfa-yukleme-sureleri)
3. [API Response Sureleri](#3-api-response-sureleri)
4. [Database Query Performansi](#4-database-query-performansi)
5. [Bundle Analizi](#5-bundle-analizi)
6. [Image Optimizasyonu](#6-image-optimizasyonu)

---

## Onkosuller

- Production build (`npm run build && npm start`)
- Chrome DevTools veya Lighthouse CLI
- Network tab acik (throttling: Fast 3G)
- Database seed data yuklu (100+ urun)
- Cloudinary CDN aktif

### Araclar

| Arac | Kullanim |
|------|----------|
| Chrome DevTools | Network, Performance, Lighthouse |
| Lighthouse CLI | `npx lighthouse http://localhost:3000` |
| WebPageTest | Online performans analizi |
| Bundle Analyzer | `npm run analyze` |

---

## 1. Core Web Vitals

### TEST-PERF-001: LCP - Largest Contentful Paint
- **Metrik:** En buyuk icerigin render suresi
- **Hedef:** < 2.5 saniye
- **Test Sayfalari:**
  - Homepage (Hero banner)
  - Kadin/Erkek listeleme (Ilk urun gorseli)
  - Urun detay (Ana urun gorseli)
- **Olcum Yontemi:**
  1. Chrome DevTools > Performance tab
  2. Reload ile kayit baslat
  3. LCP marker'ini bul
- **Kontrol Listesi:**
  - [ ] Homepage LCP < 2.5s
  - [ ] Listeleme sayfasi LCP < 2.5s
  - [ ] Urun detay LCP < 2.5s
  - [ ] Mobile LCP < 3.0s

### TEST-PERF-002: FCP - First Contentful Paint
- **Metrik:** Ilk icerigin goruntulendigi an
- **Hedef:** < 1.8 saniye
- **Test Sayfalari:** Tum sayfalar
- **Kontrol Listesi:**
  - [ ] Homepage FCP < 1.8s
  - [ ] Listeleme sayfasi FCP < 1.8s
  - [ ] Urun detay FCP < 1.8s
  - [ ] Auth sayfalari FCP < 1.5s

### TEST-PERF-003: CLS - Cumulative Layout Shift
- **Metrik:** Gorsel kararsizlik skoru
- **Hedef:** < 0.1
- **Test Sayfalari:**
  - Homepage (banner, urunler)
  - Listeleme (filtreler, grid)
  - Urun detay (galeri, info)
- **Kontrol Listesi:**
  - [ ] Homepage CLS < 0.1
  - [ ] Listeleme CLS < 0.1
  - [ ] Urun detay CLS < 0.1
  - [ ] Image placeholder'lar dogru boyutta

### TEST-PERF-004: FID/INP - Interaction to Next Paint
- **Metrik:** Kullanici etkilesim gecikmesi
- **Hedef:** < 200ms
- **Test Etkiletimleri:**
  - Buton tiklama
  - Dropdown acma
  - Filtre secimi
  - Sepete ekleme
- **Kontrol Listesi:**
  - [ ] Buton tiklamalari < 200ms
  - [ ] Dropdown'lar < 200ms
  - [ ] Filtre degisiklikleri < 200ms
  - [ ] Modal acilmalari < 200ms

### TEST-PERF-005: TTFB - Time to First Byte
- **Metrik:** Sunucu yanit suresi
- **Hedef:** < 600ms
- **Test Endpoint'leri:**
  - Homepage
  - API routes
  - Static assets
- **Kontrol Listesi:**
  - [ ] Homepage TTFB < 600ms
  - [ ] API TTFB < 200ms
  - [ ] Static TTFB < 100ms

---

## 2. Sayfa Yukleme Sureleri

### TEST-PERF-006: Sayfa Yukleme Metrikleri
- **Test:** Tum sayfalarin yukleme sureleri
- **Hedefler:**
  | Sayfa | Hedef |
  |-------|-------|
  | Homepage | < 3s |
  | Kadin/Erkek Listeleme | < 2.5s |
  | Urun Detay | < 2s |
  | Sepet | < 1.5s |
  | Odeme | < 2s |
  | Hesabim | < 2s |
  | Admin Dashboard | < 2s |
  | Admin Urunler | < 2.5s |

- **Olcum Yontemi:**
  1. Chrome DevTools > Network tab
  2. "Disable cache" aktif
  3. Sayfa reload
  4. "Load" eventini kontrol et

- **Kontrol Listesi:**
  - [ ] Homepage < 3s
  - [ ] Listeleme sayfalari < 2.5s
  - [ ] Urun detay < 2s
  - [ ] Sepet < 1.5s
  - [ ] Odeme < 2s
  - [ ] Hesabim < 2s
  - [ ] Admin sayfalar < 2.5s

### TEST-PERF-007: Lazy Loading Kontrolu
- **Test:** Lazy loading dogru calisiyor
- **Kontrol Alanlari:**
  - Urun gorselleri (listeleme)
  - Galeri gorselleri (detay)
  - Avatar gorselleri
- **Kontrol Listesi:**
  - [ ] Viewport disindaki gorseller yuklenmemis
  - [ ] Scroll ile gorsel yukleniyor
  - [ ] Placeholder/skeleton gorunuyor
  - [ ] loading="lazy" attribute'u var

---

## 3. API Response Sureleri

### TEST-PERF-008: Public API Performansi
- **Test:** Public API endpoint yanit sureleri
- **Hedef:** Ortalama < 200ms
- **Endpoints:**

| Endpoint | Hedef |
|----------|-------|
| GET /api/search | < 300ms |
| GET /api/products (list) | < 200ms |
| GET /api/products/:id | < 100ms |
| POST /api/contact | < 500ms |
| POST /api/coupon/validate | < 150ms |

- **Olcum Yontemi:**
  1. Chrome DevTools > Network tab
  2. API istegini filtrele
  3. "Time" kolonunu kontrol et

- **Kontrol Listesi:**
  - [ ] Search API < 300ms
  - [ ] Product list < 200ms
  - [ ] Product detail < 100ms
  - [ ] Contact form < 500ms
  - [ ] Coupon validation < 150ms

### TEST-PERF-009: Auth API Performansi
- **Test:** Authentication API yanit sureleri
- **Hedef:** < 500ms (bcrypt hash nedeniyle)
- **Endpoints:**

| Endpoint | Hedef |
|----------|-------|
| POST /api/auth/signin | < 500ms |
| POST /api/auth/register | < 600ms |
| GET /api/auth/session | < 100ms |

- **Kontrol Listesi:**
  - [ ] Login < 500ms
  - [ ] Register < 600ms
  - [ ] Session check < 100ms

### TEST-PERF-010: Admin API Performansi
- **Test:** Admin API endpoint yanit sureleri
- **Hedef:** < 500ms
- **Endpoints:**

| Endpoint | Hedef |
|----------|-------|
| GET /api/admin/products | < 500ms |
| GET /api/admin/orders | < 400ms |
| POST /api/admin/products | < 600ms |
| PATCH /api/admin/products/:id | < 400ms |
| GET /api/admin/dashboard/stats | < 300ms |

- **Kontrol Listesi:**
  - [ ] Product list < 500ms
  - [ ] Orders list < 400ms
  - [ ] Product create < 600ms
  - [ ] Product update < 400ms
  - [ ] Dashboard stats < 300ms

---

## 4. Database Query Performansi

### TEST-PERF-011: Database Sorgu Sureleri
- **Test:** Prisma query execution sureleri
- **Hedef:** Ortalama < 50ms
- **Kritik Sorgular:**

| Sorgu | Hedef |
|-------|-------|
| User by email | < 20ms |
| Product by slug | < 30ms |
| Products with filters | < 100ms |
| Order with items | < 50ms |
| Cart with items + product | < 50ms |

- **Olcum Yontemi:**
  ```typescript
  // prisma logging
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  ```

- **Kontrol Listesi:**
  - [ ] User lookup < 20ms
  - [ ] Product lookup < 30ms
  - [ ] Filtered queries < 100ms
  - [ ] Order queries < 50ms
  - [ ] Cart queries < 50ms
  - [ ] N+1 sorgu problemi yok

### TEST-PERF-012: Index Kullanimi
- **Test:** Database index'leri kullaniliyor
- **Kontrol Edilecekler:**
  - email index (User)
  - slug index (Product, Category)
  - sku index (Product, Variant)
  - orderNumber index (Order)
  - Composite indexes

- **Olcum Yontemi:**
  ```sql
  EXPLAIN ANALYZE SELECT * FROM "Product" WHERE slug = 'test';
  ```

- **Kontrol Listesi:**
  - [ ] Index Scan kullaniliyor (Seq Scan degil)
  - [ ] Query cost dusuk
  - [ ] Rows estimate dogru

---

## 5. Bundle Analizi

### TEST-PERF-013: JavaScript Bundle Boyutu
- **Test:** Client-side JS boyutu
- **Hedefler:**
  | Bundle | Hedef |
  |--------|-------|
  | Main bundle | < 200KB gzipped |
  | First load JS | < 100KB |
  | Page-specific chunks | < 50KB each |

- **Olcum Yontemi:**
  ```bash
  npm run build
  # Build output'u kontrol et
  ```

- **Kontrol Listesi:**
  - [ ] Main bundle < 200KB gzipped
  - [ ] First load < 100KB
  - [ ] Code splitting calisiyor
  - [ ] Unused code yok (tree shaking)
  - [ ] Dynamic imports kullaniliyor

### TEST-PERF-014: Bundle Composition
- **Test:** Bundle icerik analizi
- **Arac:** `@next/bundle-analyzer`
- **Kontrol Listesi:**
  - [ ] node_modules orani < %50
  - [ ] Duplicate dependencies yok
  - [ ] Dev-only packages production'da yok
  - [ ] Buyuk kutuphaneler lazy loaded

---

## 6. Image Optimizasyonu

### TEST-PERF-015: Image Performansi
- **Test:** Gorsel optimizasyon kontrolu
- **Hedefler:**
  | Gorsel Tipi | Hedef Boyut |
  |-------------|-------------|
  | Thumbnail (card) | < 50KB |
  | Product gallery | < 150KB |
  | Hero banner | < 200KB |
  | Avatar | < 20KB |

- **Kontrol Listesi:**
  - [ ] Next.js Image component kullaniliyor
  - [ ] WebP format destegi var
  - [ ] Responsive srcset kullaniliyor
  - [ ] Cloudinary CDN aktif
  - [ ] Blur placeholder kullaniliyor
  - [ ] Priority attribute dogru kullaniliyor

### Image Format Kontrolu
- **Test:** Dogru format kullanimi
- **Kontrol Listesi:**
  - [ ] Fotograflar: WebP/AVIF
  - [ ] Iconlar: SVG
  - [ ] Logolar: SVG veya PNG
  - [ ] Progressive JPEG destegi

---

## Lighthouse Skor Hedefleri

### Desktop Hedefleri

| Metrik | Hedef |
|--------|-------|
| Performance | > 90 |
| Accessibility | > 90 |
| Best Practices | > 90 |
| SEO | > 90 |

### Mobile Hedefleri

| Metrik | Hedef |
|--------|-------|
| Performance | > 80 |
| Accessibility | > 90 |
| Best Practices | > 90 |
| SEO | > 90 |

### Lighthouse Calistirma

```bash
# CLI ile
npx lighthouse http://localhost:3000 --view

# CI/CD icin
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json
```

---

## Load Testing (Opsiyonel)

### Araclar
- Apache JMeter
- k6
- Artillery

### Test Senaryolari

| Senaryo | Hedef |
|---------|-------|
| 100 concurrent users | Response < 1s |
| 500 requests/sec | No errors |
| 10 min sustained load | Stable memory |

### Ornek k6 Script

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:3000/api/products');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

---

## Sonuc Raporu Sablonu

```markdown
# Performans Test Sonuclari - [TARIH]

## Ozet

| Kategori | Sonuc |
|----------|-------|
| Core Web Vitals | PASS/FAIL |
| Sayfa Yukleme | PASS/FAIL |
| API Response | PASS/FAIL |
| Database | PASS/FAIL |
| Bundle | PASS/FAIL |
| Image | PASS/FAIL |

## Core Web Vitals

| Metrik | Hedef | Sonuc | Durum |
|--------|-------|-------|-------|
| LCP | < 2.5s | Xs | PASS/FAIL |
| FCP | < 1.8s | Xs | PASS/FAIL |
| CLS | < 0.1 | X | PASS/FAIL |
| INP | < 200ms | Xms | PASS/FAIL |

## Lighthouse Skorlari

| Sayfa | Performance | Accessibility | Best Practices | SEO |
|-------|-------------|---------------|----------------|-----|
| Homepage | X | X | X | X |
| Listeleme | X | X | X | X |
| Detay | X | X | X | X |

## Iyilestirme Onerileri

1. [Oneri 1]
2. [Oneri 2]
3. [Oneri 3]
```

---

## Performans Checklist

### Deployment Oncesi

- [ ] Production build olusturuldu
- [ ] Bundle analizi yapildi
- [ ] Lighthouse >= 90 (desktop)
- [ ] Core Web Vitals pass
- [ ] API response < 200ms (avg)
- [ ] Database queries optimized
- [ ] Images optimized
- [ ] CDN aktif

### Surdurulebilir Performans

- [ ] Real User Monitoring (RUM) aktif
- [ ] Performance budget tanimli
- [ ] CI/CD'de Lighthouse check
- [ ] Weekly performance review

---

*Son Guncelleme: 27 Aralik 2025*

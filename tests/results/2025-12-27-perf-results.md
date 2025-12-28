# Performance Test Sonuclari - 27 Aralik 2025

---

## 1. Sayfa Yukleme Sureleri

| Test ID | Sayfa | Hedef | Gerceklesen | Sonuc |
|---------|-------|-------|-------------|-------|
| TEST-PERF-001 | Homepage | <3000ms | 76ms | PASS |
| TEST-PERF-002 | Kadin | <2500ms | 103ms | PASS |
| TEST-PERF-003 | Erkek | <2500ms | 72ms | PASS |
| TEST-PERF-004 | Koleksiyonlar | <2500ms | 69ms | PASS |
| TEST-PERF-005 | Sepet | <2000ms | 60ms | PASS |
| TEST-PERF-006 | Giris | <2000ms | 63ms | PASS |
| TEST-PERF-007 | SSS | <2000ms | 69ms | PASS |

## 2. API Response Sureleri

| Test ID | Endpoint | Hedef | Gerceklesen | Sonuc |
|---------|----------|-------|-------------|-------|
| TEST-PERF-008 | Search API | <500ms | 28ms | PASS |
| TEST-PERF-009 | Cart API | <300ms | 23ms | PASS |
| TEST-PERF-010 | Session API | <200ms | 57ms | PASS |
| TEST-PERF-011 | Cities API | <200ms | 51ms | PASS |
| TEST-PERF-012 | Districts API | <200ms | 57ms | PASS |

## 3. Static Assets

| Test ID | Asset | Hedef | Gerceklesen | Sonuc |
|---------|-------|-------|-------------|-------|
| TEST-PERF-013 | robots.txt | <100ms | 54ms | PASS |
| TEST-PERF-014 | sitemap.xml | <500ms | 52ms | PASS |
| TEST-PERF-015 | favicon | <100ms | 461ms | FAIL |

---

## Sonuc Ozeti

| Metrik | Deger |
|--------|-------|
| Passed | 14 |
| Failed | 1 |

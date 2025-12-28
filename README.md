# Halikarnas Sandals

Premium el yapimi deri sandalet e-ticaret platformu. Bodrum/Turkiye merkezli bir zanaat markasi icin gelistirilmistir.

## Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v5 |
| State | Zustand |
| Styling | Tailwind CSS + shadcn/ui |
| Forms | React Hook Form + Zod |
| Images | Cloudinary |

## Kurulum

### Gereksinimler

- Node.js 18+
- PostgreSQL 14+
- npm veya pnpm

### Adimlar

1. **Repository'yi klonlayin**
   ```bash
   git clone https://github.com/your-username/halikarnas-sandals.git
   cd halikarnas-sandals
   ```

2. **Bagimliliklari yukleyin**
   ```bash
   npm install
   ```

3. **Environment degiskenlerini ayarlayin**
   ```bash
   cp .env.example .env
   ```
   `.env` dosyasini kendi degerlerinizle doldurun.

4. **Veritabanini olusturun**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Gelistirme sunucusunu baslatin**
   ```bash
   npm run dev
   ```

   [http://localhost:3000](http://localhost:3000) adresinde acilir.

## Proje Yapisi

```
src/
├── app/                   # Next.js App Router
│   ├── (shop)/            # Public sayfalar
│   ├── (auth)/            # Auth sayfalari
│   ├── admin/             # Admin paneli
│   └── api/               # API Routes
├── components/
│   ├── ui/                # shadcn/ui componentleri
│   ├── layout/            # Navbar, Footer
│   ├── shop/              # Urun kartlari, filtreler
│   └── admin/             # Admin componentleri
├── lib/
│   ├── db.ts              # Prisma client
│   ├── auth.ts            # NextAuth config
│   └── utils.ts           # Yardimci fonksiyonlar
├── stores/                # Zustand state management
└── hooks/                 # Custom React hooks
```

## Komutlar

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint

# Database
npx prisma migrate dev     # Migration olustur
npx prisma db seed         # Seed data yukle
npx prisma studio          # DB GUI
npx prisma generate        # Client generate
```

## Environment Degiskenleri

`.env.example` dosyasina bakin. Gerekli degiskenler:

| Degisken | Aciklama |
|----------|----------|
| `DATABASE_URL` | PostgreSQL baglanti URL'i |
| `NEXTAUTH_SECRET` | NextAuth sifreleme anahtari |
| `NEXTAUTH_URL` | Uygulama URL'i |
| `CLOUDINARY_*` | Cloudinary API bilgileri |
| `RESEND_API_KEY` | Email servisi (opsiyonel) |
| `GOOGLE_*` | Google OAuth (opsiyonel) |

## Ozellikler

- Urun katalog yonetimi
- Sepet ve checkout
- Kullanici hesaplari
- Admin paneli
- Koleksiyon yonetimi
- Kupon sistemi
- SEO optimizasyonu
- Responsive tasarim

## Lisans

Bu proje ozel bir projedir. Izinsiz kullanim ve dagitim yasaktir.

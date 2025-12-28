# Sistem Mimarisi

## Genel Bakis

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Zustand   │  │    React    │  │      Tailwind CSS       │ │
│  │   Stores    │  │  Components │  │       + shadcn/ui       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS 14 (App Router)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     Middleware (Edge)                     │  │
│  │              - Auth kontrolu (getToken)                   │  │
│  │              - Route korumasi                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─────────────────────┐    ┌─────────────────────────────────┐ │
│  │   Server Components  │    │        API Routes               │ │
│  │   - Direct DB access │    │  - POST/PATCH/DELETE islemleri  │ │
│  │   - SSR/SSG         │    │  - Auth + Validation            │ │
│  └─────────────────────┘    └─────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────┐    ┌─────────────────────────────────┐ │
│  │  Client Components   │    │        NextAuth.js v5           │ │
│  │  - Interaktif UI    │    │  - JWT Session                  │ │
│  │  - Zustand + fetch  │    │  - Credentials + OAuth          │ │
│  └─────────────────────┘    └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Prisma ORM                                │
│                    (with pg adapter)                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       PostgreSQL                                 │
│                    (20+ tables)                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Server Component Data Fetching

```
Page Request
    │
    ▼
Server Component
    │
    ├──► Prisma Query (direct DB access)
    │
    ▼
Response (HTML + RSC Payload)
```

### 2. Client Component + API

```
User Action (click, submit)
    │
    ▼
Client Component
    │
    ├──► fetch('/api/...')
    │
    ▼
API Route
    │
    ├──► Auth Check (session)
    ├──► Zod Validation
    ├──► Prisma Query
    │
    ▼
JSON Response
    │
    ▼
State Update (Zustand / React Query)
```

### 3. Auth Flow

```
Login Request
    │
    ▼
NextAuth Credentials Provider
    │
    ├──► bcrypt.compare(password)
    ├──► Generate JWT Token
    │
    ▼
Set httpOnly Cookie
    │
    ▼
Redirect to Dashboard
```

---

## Route Groups

### (shop) - Public Store

Layout: Navbar + Footer
Auth: Optional (guest checkout desteklenir)

```
/(shop)
├── /                    # Homepage
├── /kadin               # Women's category
├── /erkek               # Men's category
├── /urun/[slug]         # Product detail
├── /sepet               # Cart
├── /odeme               # Checkout
├── /hesabim/*           # User account (protected)
├── /koleksiyonlar       # Collections
├── /arama               # Search results
├── /hakkimizda          # About
├── /iletisim            # Contact
├── /sss                 # FAQ
├── /beden-rehberi       # Size guide
└── /sayfa/[slug]        # CMS pages
```

### (auth) - Authentication

Layout: Minimal (no navbar)
Auth: Guest only (redirect if logged in)

```
/(auth)
├── /giris               # Login
├── /kayit               # Register
├── /sifremi-unuttum     # Forgot password
└── /sifre-sifirla/[token] # Reset password
```

### admin - Admin Panel

Layout: AdminSidebar
Auth: Required (ADMIN/SUPER_ADMIN role)

```
/admin
├── /                    # Dashboard
├── /urunler             # Products CRUD
├── /kategoriler         # Categories
├── /koleksiyonlar       # Collections
├── /siparisler          # Orders
├── /kullanicilar        # Users
├── /kuponlar            # Coupons
├── /bannerlar           # Banners
├── /sayfalar            # Pages
└── /ayarlar             # Settings
```

---

## Caching Strategy

### Static Generation (SSG)

- Homepage sections
- About page
- FAQ page
- Size guide
- Legal pages

### Dynamic Rendering

- Product listings (filters, pagination)
- Product detail (stock, reviews)
- Cart / Checkout
- User account pages
- Admin panel

### Client-Side Caching

- Zustand stores with localStorage persist
- React Query (opsiyonel, henuz eklenmedi)

---

## Security Measures

### Authentication

- JWT tokens (httpOnly cookies)
- Password hashing (bcrypt, 12 rounds)
- Session validation on each request
- CSRF protection (NextAuth built-in)

### Authorization

- Role-based access (CUSTOMER, ADMIN, SUPER_ADMIN)
- Middleware route protection
- API route auth checks

### Input Validation

- Zod schemas for all API inputs
- React Hook Form validation
- XSS prevention (React default escaping)
- SQL injection prevention (Prisma parameterized queries)

### Rate Limiting

- Contact form: 5 requests/hour per IP
- Login attempts: NextAuth built-in

### Additional

- Honeypot fields for forms
- HTTPS only (production)
- Secure headers (next.config)

---

## File Upload Strategy (Planned)

```
┌────────────────┐
│  Client Upload │
└───────┬────────┘
        │
        ▼
┌────────────────┐     ┌─────────────────┐
│  API Route     │────►│   Cloudinary    │
│  /api/upload   │     │   or            │
└────────────────┘     │   Uploadthing   │
        │              └─────────────────┘
        │                      │
        ▼                      ▼
┌────────────────┐     ┌─────────────────┐
│  Save URL to   │◄────│  Return URL     │
│  Database      │     │                 │
└────────────────┘     └─────────────────┘
```

---

## Error Handling

### API Routes

```typescript
try {
  // Business logic
} catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.errors }, { status: 400 });
  }
  if (error instanceof AuthError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.error("Error:", error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
```

### Pages

- `error.tsx` - Route-level error boundary
- `global-error.tsx` - Root error boundary
- `not-found.tsx` - 404 page

### Client-Side

- Toast notifications for user feedback
- Form validation errors inline
- Loading states for async operations

---

## Performance Optimizations

### Images

- Next.js Image component (automatic optimization)
- Lazy loading (priority for above-fold)
- Blur placeholder (blurDataURL)

### Code Splitting

- Dynamic imports for heavy components
- Route-based splitting (automatic)

### Database

- Prisma query optimization (select, include)
- Indexed fields for frequent queries
- Pagination for large datasets

### Caching

- Static page generation where possible
- Client-side state persistence
- API response caching (planned)

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│              Cloudflare/Vercel          │
│              (CDN + Edge)               │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│            Next.js App                   │
│         (Node.js Runtime)                │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │      PM2 Process Manager         │   │
│  │      (production)                 │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│           PostgreSQL                     │
│       (Neon/Supabase/Self-hosted)       │
└─────────────────────────────────────────┘
```

---

## Monitoring & Logging (Planned)

- Error tracking: Sentry
- Analytics: Vercel Analytics / Google Analytics
- Performance: Web Vitals
- Logs: Console (dev), Structured logs (prod)

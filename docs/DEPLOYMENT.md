# Deployment Rehberi

## Gereksinimler

- Node.js 18.17+ (LTS onerilen)
- PostgreSQL 14+
- npm veya pnpm
- PM2 (production process manager)
- Nginx (reverse proxy)
- SSL sertifikasi (Let's Encrypt)

---

## Environment Variables

`.env` dosyasi olusturun:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/halikarnas?schema=public"

# NextAuth
NEXTAUTH_URL="https://halikarnassandals.com"
NEXTAUTH_SECRET="super-secret-key-min-32-chars"  # openssl rand -base64 32

# OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App
NEXT_PUBLIC_APP_URL="https://halikarnassandals.com"
NODE_ENV="production"

# Email (Planned)
# RESEND_API_KEY="re_xxxxx"
# SMTP_HOST="smtp.example.com"
# SMTP_PORT="587"
# SMTP_USER="user"
# SMTP_PASS="pass"

# Payment (Planned)
# IYZICO_API_KEY="your-api-key"
# IYZICO_SECRET_KEY="your-secret-key"

# Image Upload (Planned)
# CLOUDINARY_CLOUD_NAME="your-cloud"
# CLOUDINARY_API_KEY="your-key"
# CLOUDINARY_API_SECRET="your-secret"
```

---

## Local Development

```bash
# Repository'yi klonla
git clone https://github.com/your-repo/halikarnas-sandals.git
cd halikarnas-sandals

# Bagimliliklari yukle
npm install

# .env dosyasini olustur
cp .env.example .env
# .env dosyasini duzenle

# Database migration
npx prisma migrate dev

# Seed data yukle
npx prisma db seed

# Development server
npm run dev
```

Tarayicida: http://localhost:3000

---

## Production Build

```bash
# Build
npm run build

# Build kontrol (opsiyonel)
npm run start

# Build ciktisi: .next/
```

---

## VPS Deployment

### 1. Server Hazirlik

```bash
# Ubuntu/Debian
sudo apt update
sudo apt upgrade -y

# Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# PM2
sudo npm install -g pm2

# Nginx
sudo apt install -y nginx

# Certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx

# PostgreSQL
sudo apt install -y postgresql postgresql-contrib
```

### 2. PostgreSQL Kurulum

```bash
# PostgreSQL'e eris
sudo -u postgres psql

# Veritabani ve kullanici olustur
CREATE DATABASE halikarnas;
CREATE USER halikarnas_user WITH ENCRYPTED PASSWORD 'guclu-sifre';
GRANT ALL PRIVILEGES ON DATABASE halikarnas TO halikarnas_user;
\q
```

### 3. Proje Deploy

```bash
# Proje dizini olustur
sudo mkdir -p /var/www/halikarnas
sudo chown $USER:$USER /var/www/halikarnas

# Git clone veya scp ile dosyalari tasimak
cd /var/www/halikarnas
git clone https://github.com/your-repo/halikarnas-sandals.git .

# .env olustur
nano .env
# Tum degerleri gir

# Bagimliliklari yukle
npm install --production

# Prisma client generate
npx prisma generate

# Database migration
npx prisma migrate deploy

# Seed (ilk deploy icin)
npx prisma db seed

# Build
npm run build
```

### 4. PM2 Konfigurasyonu

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "halikarnas",
      script: "npm",
      args: "start",
      cwd: "/var/www/halikarnas",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
```

```bash
# PM2 ile baslat
pm2 start ecosystem.config.js

# Otomatik baslama
pm2 startup
pm2 save

# Durumu kontrol
pm2 status
pm2 logs halikarnas
```

### 5. Nginx Konfigurasyonu

```nginx
# /etc/nginx/sites-available/halikarnas
server {
    listen 80;
    server_name halikarnassandals.com www.halikarnassandals.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files cache
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Image optimization cache
    location /_next/image {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 60m;
    }
}
```

```bash
# Site'i etkinlestir
sudo ln -s /etc/nginx/sites-available/halikarnas /etc/nginx/sites-enabled/

# Nginx test
sudo nginx -t

# Nginx restart
sudo systemctl restart nginx
```

### 6. SSL Sertifikasi

```bash
# Let's Encrypt SSL
sudo certbot --nginx -d halikarnassandals.com -d www.halikarnassandals.com

# Otomatik yenileme test
sudo certbot renew --dry-run
```

---

## Vercel Deployment

### 1. Vercel CLI

```bash
npm install -g vercel
vercel login
```

### 2. Deploy

```bash
# Proje dizininde
vercel

# Production deploy
vercel --prod
```

### 3. Environment Variables

Vercel Dashboard > Project Settings > Environment Variables

Tum `.env` degerlerini ekleyin.

### 4. Database

Vercel ile Neon veya Supabase PostgreSQL kullanin:

```env
# Neon
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Supabase
DATABASE_URL="postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres"
```

---

## Docker Deployment (Opsiyonel)

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/halikarnas
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=halikarnas
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# Build ve calistir
docker-compose up -d

# Migration
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
```

---

## CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Monitoring

### PM2 Monitoring

```bash
# Status
pm2 status

# Logs
pm2 logs halikarnas --lines 100

# Metrics
pm2 monit
```

### Health Check Endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: "ok", timestamp: new Date().toISOString() });
}
```

### Uptime Monitoring

- UptimeRobot (ucretsiz)
- Better Uptime
- Pingdom

---

## Backup

### Database Backup

```bash
# Manuel backup
pg_dump -U halikarnas_user -d halikarnas > backup_$(date +%Y%m%d).sql

# Otomatik backup (cron)
0 2 * * * pg_dump -U halikarnas_user -d halikarnas | gzip > /backups/halikarnas_$(date +\%Y\%m\%d).sql.gz
```

### Restore

```bash
psql -U halikarnas_user -d halikarnas < backup.sql
```

---

## Troubleshooting

### Build Hatalari

```bash
# Cache temizle
rm -rf .next
npm run build
```

### Database Baglanti

```bash
# Test baglanti
npx prisma db pull

# Schema sync
npx prisma db push
```

### PM2 Restart

```bash
pm2 restart halikarnas
pm2 reload halikarnas  # Zero-downtime
```

### Nginx 502 Bad Gateway

```bash
# PM2 calistigini kontrol et
pm2 status

# Port kontrol
netstat -tlnp | grep 3000

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

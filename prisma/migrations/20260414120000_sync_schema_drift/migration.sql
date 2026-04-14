-- Sprint 7A: Snapshot accumulated db-push drift into a dedicated migration.
-- Fresh DB bootstraps (new dev, new VPS, CI) now reach schema parity via
-- `prisma migrate deploy` alone, without needing `prisma db push`.
--
-- Captures:
--   * Category.@@unique([slug, gender]) composite (was single-column unique)
--   * Order.trackingToken column + unique index + secondary index
--   * ProductImage.color column + index
--   * PasswordResetToken model (forgot-password flow)
--   * ActivityLog model (admin activity audit trail)

-- DropIndex
DROP INDEX "Category_slug_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "trackingToken" TEXT;

-- Backfill any pre-existing Order rows with a unique token before we add the
-- UNIQUE INDEX. Empty table on fresh bootstrap/reset, so this is a no-op;
-- present only to keep the migration safe if replayed against a drifted env.
-- gen_random_uuid() is built into PostgreSQL 13+.
UPDATE "Order" SET "trackingToken" = gen_random_uuid()::text WHERE "trackingToken" IS NULL;

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "color" TEXT;

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "details" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_email_idx" ON "PasswordResetToken"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_email_token_key" ON "PasswordResetToken"("email", "token");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");

-- CreateIndex
CREATE INDEX "ActivityLog_action_idx" ON "ActivityLog"("action");

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_gender_key" ON "Category"("slug", "gender");

-- CreateIndex
CREATE UNIQUE INDEX "Order_trackingToken_key" ON "Order"("trackingToken");

-- CreateIndex
CREATE INDEX "Order_trackingToken_idx" ON "Order"("trackingToken");

-- CreateIndex
CREATE INDEX "ProductImage_color_idx" ON "ProductImage"("color");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

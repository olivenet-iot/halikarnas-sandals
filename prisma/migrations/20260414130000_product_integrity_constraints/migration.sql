-- Sprint 7A: Defensive DB-level integrity constraints on Product and
-- ProductVariant. Complements app-level Zod validation and the atomic-
-- decrement stock update added in Sprint 6.
--
-- Captures:
--   * Product.gender: NOT NULL, default UNISEX
--     (fixes NULL-safe @@unique([slug, gender]) gap — audit 2.1)
--   * ProductVariant.stock: CHECK (stock >= 0)
--     (admins can no longer set negative stock manually — audit 2.2)

-- Defensive backfill before NOT NULL constraint (no-op on fresh seed).
UPDATE "Product" SET "gender" = 'UNISEX' WHERE "gender" IS NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "gender" SET DEFAULT 'UNISEX';

-- Enforce non-negative stock at the database level.
ALTER TABLE "ProductVariant" ADD CONSTRAINT "stock_nonneg" CHECK ("stock" >= 0);

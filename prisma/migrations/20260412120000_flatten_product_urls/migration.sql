-- AlterTable: make Product.categoryId nullable
ALTER TABLE "Product" ALTER COLUMN "categoryId" DROP NOT NULL;

-- DropForeignKey to rebuild as ON DELETE SET NULL (since relation is now optional)
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropIndex: global unique on slug
DROP INDEX "Product_slug_key";

-- CreateIndex: per-gender unique on (slug, gender)
CREATE UNIQUE INDEX "Product_slug_gender_key" ON "Product"("slug", "gender");

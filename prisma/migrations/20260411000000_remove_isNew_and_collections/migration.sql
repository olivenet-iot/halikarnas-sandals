-- DropForeignKey
ALTER TABLE "CollectionProduct" DROP CONSTRAINT IF EXISTS "CollectionProduct_collectionId_fkey";
ALTER TABLE "CollectionProduct" DROP CONSTRAINT IF EXISTS "CollectionProduct_productId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "Product_isNew_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN IF EXISTS "isNew";

-- DropTable
DROP TABLE IF EXISTS "CollectionProduct";
DROP TABLE IF EXISTS "Collection";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "acceptIpAddress" TEXT,
ADD COLUMN     "kvkkAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "kvkkVersion" TEXT,
ADD COLUMN     "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "termsVersion" TEXT;

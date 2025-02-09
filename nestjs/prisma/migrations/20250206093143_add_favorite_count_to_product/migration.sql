-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "favoriteCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "favoriteCount" INTEGER NOT NULL DEFAULT 0;

/*
  Warnings:

  - The `content` column on the `ArticleComment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `content` column on the `ProductComment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ArticleComment" DROP COLUMN "content",
ADD COLUMN     "content" TEXT[];

-- AlterTable
ALTER TABLE "ProductComment" DROP COLUMN "content",
ADD COLUMN     "content" TEXT[];

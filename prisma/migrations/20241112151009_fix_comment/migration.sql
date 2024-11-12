/*
  Warnings:

  - Made the column `userId` on table `ArticleComment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `MarketComment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MarketComment" DROP CONSTRAINT "MarketComment_userId_fkey";

-- AlterTable
ALTER TABLE "ArticleComment" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "MarketComment" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "MarketComment" ADD CONSTRAINT "MarketComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

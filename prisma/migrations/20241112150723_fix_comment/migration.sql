/*
  Warnings:

  - You are about to drop the `BoardArticle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BoardComment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BoardComment" DROP CONSTRAINT "BoardComment_articleId_fkey";

-- DropForeignKey
ALTER TABLE "BoardComment" DROP CONSTRAINT "BoardComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "MarketComment" DROP CONSTRAINT "MarketComment_articleId_fkey";

-- DropForeignKey
ALTER TABLE "MarketComment" DROP CONSTRAINT "MarketComment_userId_fkey";

-- AlterTable
ALTER TABLE "MarketComment" ALTER COLUMN "userId" DROP NOT NULL;

-- DropTable
DROP TABLE "BoardArticle";

-- DropTable
DROP TABLE "BoardComment";

-- CreateTable
CREATE TABLE "MarketArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "articleId" TEXT NOT NULL DEFAULT 'default',

    CONSTRAINT "ArticleComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArticleComment" ADD CONSTRAINT "ArticleComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleComment" ADD CONSTRAINT "ArticleComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketComment" ADD CONSTRAINT "MarketComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketComment" ADD CONSTRAINT "MarketComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "MarketArticle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

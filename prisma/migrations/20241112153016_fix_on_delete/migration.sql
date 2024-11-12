-- DropForeignKey
ALTER TABLE "ArticleComment" DROP CONSTRAINT "ArticleComment_articleId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleComment" DROP CONSTRAINT "ArticleComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "MarketComment" DROP CONSTRAINT "MarketComment_articleId_fkey";

-- DropForeignKey
ALTER TABLE "MarketComment" DROP CONSTRAINT "MarketComment_userId_fkey";

-- AlterTable
ALTER TABLE "ArticleComment" ALTER COLUMN "articleId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "ArticleComment" ADD CONSTRAINT "ArticleComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleComment" ADD CONSTRAINT "ArticleComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketComment" ADD CONSTRAINT "MarketComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketComment" ADD CONSTRAINT "MarketComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "MarketArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

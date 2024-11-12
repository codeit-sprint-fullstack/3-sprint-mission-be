/*
  Warnings:

  - Added the required column `articleId` to the `BoardComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `BoardComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `articleId` to the `MarketComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `MarketComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BoardComment" ADD COLUMN     "articleId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MarketComment" ADD COLUMN     "articleId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "BoardArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MarketComment" ADD CONSTRAINT "MarketComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketComment" ADD CONSTRAINT "MarketComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardComment" ADD CONSTRAINT "BoardComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardComment" ADD CONSTRAINT "BoardComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "BoardArticle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

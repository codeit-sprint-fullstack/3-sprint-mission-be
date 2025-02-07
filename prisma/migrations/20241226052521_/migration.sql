/*
  Warnings:

  - You are about to drop the `_ProductLikes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProductLikes" DROP CONSTRAINT "_ProductLikes_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductLikes" DROP CONSTRAINT "_ProductLikes_B_fkey";

-- DropTable
DROP TABLE "_ProductLikes";

-- CreateTable
CREATE TABLE "IsLiked" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "articleId" INTEGER,
    "productId" INTEGER,

    CONSTRAINT "IsLiked_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IsLiked" ADD CONSTRAINT "IsLiked_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IsLiked" ADD CONSTRAINT "IsLiked_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IsLiked" ADD CONSTRAINT "IsLiked_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

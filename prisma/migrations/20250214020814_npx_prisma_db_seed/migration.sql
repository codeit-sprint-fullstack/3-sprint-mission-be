/*
  Warnings:

  - You are about to drop the column `likeCount` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `favoriteCount` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "likeCount";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "favoriteCount";

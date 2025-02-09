/*
  Warnings:

  - Added the required column `like` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" ADD COLUMN     "like" INTEGER NOT NULL;

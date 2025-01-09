/*
  Warnings:

  - Added the required column `nickname` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "nickname" TEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the column `email` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Product_email_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "email";

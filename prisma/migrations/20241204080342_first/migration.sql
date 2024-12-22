/*
  Warnings:

  - Added the required column `comentId` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "comentId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Coment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coment" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Coment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_comentId_fkey" FOREIGN KEY ("comentId") REFERENCES "Coment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

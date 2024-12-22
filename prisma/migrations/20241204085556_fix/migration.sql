/*
  Warnings:

  - You are about to drop the column `comentId` on the `Board` table. All the data in the column will be lost.
  - Added the required column `boardId` to the `Coment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_comentId_fkey";

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "comentId";

-- AlterTable
ALTER TABLE "Coment" ADD COLUMN     "boardId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Coment" ADD CONSTRAINT "Coment_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

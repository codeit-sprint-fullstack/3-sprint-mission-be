/*
  Warnings:

  - You are about to drop the column `userId` on the `Board` table. All the data in the column will be lost.
  - Added the required column `userUuId` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_userId_fkey";

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "userId",
ADD COLUMN     "userUuId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_userUuId_fkey" FOREIGN KEY ("userUuId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

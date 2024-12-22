/*
  Warnings:

  - You are about to drop the column `userUuId` on the `Board` table. All the data in the column will be lost.
  - Added the required column `userUuid` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_userUuId_fkey";

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "userUuId",
ADD COLUMN     "userUuid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

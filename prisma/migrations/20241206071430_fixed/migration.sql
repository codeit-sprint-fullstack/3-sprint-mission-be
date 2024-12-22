/*
  Warnings:

  - You are about to drop the column `userId` on the `Coment` table. All the data in the column will be lost.
  - Added the required column `userUuid` to the `Coment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coment" DROP COLUMN "userId",
ADD COLUMN     "userUuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT NOT NULL DEFAULT '/img/ic_profile.png';

-- AddForeignKey
ALTER TABLE "Coment" ADD CONSTRAINT "Coment_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

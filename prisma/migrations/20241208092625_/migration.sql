/*
  Warnings:

  - You are about to drop the column `userId` on the `Freeboard` table. All the data in the column will be lost.
  - Made the column `userid` on table `Freeboard` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Freeboard" DROP CONSTRAINT "Freeboard_userId_fkey";

-- AlterTable
ALTER TABLE "Freeboard" DROP COLUMN "userId",
ALTER COLUMN "userid" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Freeboard" ADD CONSTRAINT "Freeboard_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

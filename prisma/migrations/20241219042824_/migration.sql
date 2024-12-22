/*
  Warnings:

  - You are about to drop the `Coment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Coment" DROP CONSTRAINT "Coment_boardId_fkey";

-- DropForeignKey
ALTER TABLE "Coment" DROP CONSTRAINT "Coment_userUuid_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "image" DROP NOT NULL;

-- DropTable
DROP TABLE "Coment";

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "coment" TEXT NOT NULL DEFAULT '',
    "boardId" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

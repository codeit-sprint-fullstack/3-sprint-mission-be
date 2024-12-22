/*
  Warnings:

  - A unique constraint covering the columns `[boardNumber]` on the table `Board` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "boardNumber" SERIAL NOT NULL,
ADD COLUMN     "favorite" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Board_boardNumber_key" ON "Board"("boardNumber");

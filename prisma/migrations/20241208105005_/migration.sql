-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "freeboardId" TEXT;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_freeboardId_fkey" FOREIGN KEY ("freeboardId") REFERENCES "Freeboard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Freeboard" DROP CONSTRAINT "Freeboard_userid_fkey";

-- AlterTable
ALTER TABLE "Freeboard" ALTER COLUMN "userid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Freeboard" ADD CONSTRAINT "Freeboard_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

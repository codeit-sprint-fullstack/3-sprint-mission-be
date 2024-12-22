-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

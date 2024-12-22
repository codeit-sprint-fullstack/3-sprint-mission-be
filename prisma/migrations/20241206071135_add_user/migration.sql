-- AlterTable
ALTER TABLE "Board" ALTER COLUMN "userId" DROP DEFAULT;

-- CreateTable
CREATE TABLE "User" (
    "uuid" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

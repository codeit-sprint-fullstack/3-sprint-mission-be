-- CreateTable
CREATE TABLE "Freeboard" (
    "id" TEXT NOT NULL,
    "userid" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "img" TEXT,
    "like" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Freeboard_pkey" PRIMARY KEY ("id")
);

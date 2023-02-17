-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "rankId" TEXT NOT NULL DEFAULT 'default';

-- CreateTable
CREATE TABLE "Rank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prefix" CHAR NOT NULL,

    CONSTRAINT "Rank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rank_id_key" ON "Rank"("id");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

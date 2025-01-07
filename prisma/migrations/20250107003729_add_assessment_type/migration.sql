/*
  Warnings:

  - You are about to drop the column `isPaid` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `Assessment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Assessment_sessionId_key";

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "isPaid",
DROP COLUMN "sessionId",
ADD COLUMN     "assessmentType" TEXT NOT NULL DEFAULT 'VEA 2.0';

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assessmentId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_sessionId_key" ON "Payment"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_assessmentId_key" ON "Payment"("assessmentId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

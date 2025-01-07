/*
  Warnings:

  - You are about to drop the column `isPaid` on the `AssessmentResponse` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `AssessmentResponse` table. All the data in the column will be lost.
  - You are about to drop the column `userInfoId` on the `AssessmentResponse` table. All the data in the column will be lost.
  - You are about to drop the column `weightingResponses` on the `AssessmentResponse` table. All the data in the column will be lost.
  - Added the required column `assessmentId` to the `AssessmentResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weighting` to the `AssessmentResponse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_assessmentId_fkey";

-- DropForeignKey
ALTER TABLE "AssessmentResponse" DROP CONSTRAINT "AssessmentResponse_userInfoId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_assessmentId_fkey";

-- AlterTable
ALTER TABLE "AssessmentResponse" DROP COLUMN "isPaid",
DROP COLUMN "sessionId",
DROP COLUMN "userInfoId",
DROP COLUMN "weightingResponses",
ADD COLUMN     "assessmentId" TEXT NOT NULL,
ADD COLUMN     "weighting" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userInfoId" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "sessionId" TEXT,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_sessionId_key" ON "Assessment"("sessionId");

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_userInfoId_fkey" FOREIGN KEY ("userInfoId") REFERENCES "UserInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResponse" ADD CONSTRAINT "AssessmentResponse_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

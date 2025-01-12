/*
  Warnings:

  - Added the required column `source` to the `ValidEmail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ValidEmail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ValidEmail" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "cohortId" TEXT,
ADD COLUMN     "cohortName" TEXT,
ADD COLUMN     "source" TEXT NOT NULL,
ADD COLUMN     "sourceId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "validUntil" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Cohort" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Cohort_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cohort_organizationId_idx" ON "Cohort"("organizationId");

-- CreateIndex
CREATE INDEX "ValidEmail_email_idx" ON "ValidEmail"("email");

-- CreateIndex
CREATE INDEX "ValidEmail_source_idx" ON "ValidEmail"("source");

-- CreateIndex
CREATE INDEX "ValidEmail_cohortId_idx" ON "ValidEmail"("cohortId");


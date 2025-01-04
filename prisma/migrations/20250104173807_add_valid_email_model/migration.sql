/*
  Warnings:

  - You are about to drop the column `email` on the `AssessmentResponse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `UserInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AssessmentResponse" DROP COLUMN "email";

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidEmail" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ValidEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ValidEmail_email_key" ON "ValidEmail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_email_key" ON "UserInfo"("email");

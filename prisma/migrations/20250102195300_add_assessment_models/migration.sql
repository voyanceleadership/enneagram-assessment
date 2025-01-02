/*
  Warnings:

  - Added the required column `rankings` to the `AssessmentResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weightingResponses` to the `AssessmentResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssessmentResponse" ADD COLUMN     "rankings" JSONB NOT NULL,
ADD COLUMN     "weightingResponses" JSONB NOT NULL;

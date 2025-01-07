-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('STARTED', 'COMPLETED', 'PAID', 'ANALYZED');

-- AlterTable
ALTER TABLE "Assessment" 
ADD COLUMN "status" "AssessmentStatus" NOT NULL DEFAULT 'STARTED',
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Coupon" 
ADD COLUMN "usedCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UserInfo" 
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Result" 
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "CouponUsage_couponId_idx" ON "CouponUsage"("couponId");
CREATE INDEX "CouponUsage_email_idx" ON "CouponUsage"("email");
CREATE INDEX "Assessment_userInfoId_idx" ON "Assessment"("userInfoId");
CREATE INDEX "Payment_sessionId_idx" ON "Payment"("sessionId");
CREATE INDEX "AssessmentResponse_assessmentId_idx" ON "AssessmentResponse"("assessmentId");
CREATE INDEX "Result_assessmentId_idx" ON "Result"("assessmentId");
CREATE INDEX "Result_type_idx" ON "Result"("type");
CREATE INDEX "Analysis_assessmentId_idx" ON "Analysis"("assessmentId");
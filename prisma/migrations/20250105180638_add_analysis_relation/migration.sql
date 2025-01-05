-- Drop the foreign keys first
ALTER TABLE "Analysis" DROP CONSTRAINT IF EXISTS "Analysis_assessmentId_fkey";
ALTER TABLE "Result" DROP CONSTRAINT IF EXISTS "Result_assessmentId_fkey";

-- Drop the unique constraint on UserInfo email if it exists
DROP INDEX IF EXISTS "UserInfo_email_key";

-- Drop the Company table if it exists
DROP TABLE IF EXISTS "Company";

-- Add email column as nullable first
ALTER TABLE "AssessmentResponse" ADD COLUMN IF NOT EXISTS "email" TEXT;

-- Update existing records with email from UserInfo
UPDATE "AssessmentResponse"
SET "email" = "UserInfo"."email"
FROM "UserInfo"
WHERE "AssessmentResponse"."userInfoId" = "UserInfo"."id";

-- Now make it required
ALTER TABLE "AssessmentResponse" ALTER COLUMN "email" SET NOT NULL;

-- Re-add the foreign key constraints with CASCADE
ALTER TABLE "Result" ADD CONSTRAINT "Result_assessmentId_fkey" 
    FOREIGN KEY ("assessmentId") REFERENCES "AssessmentResponse"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_assessmentId_fkey" 
    FOREIGN KEY ("assessmentId") REFERENCES "AssessmentResponse"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;
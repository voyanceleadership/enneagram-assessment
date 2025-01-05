-- First, check for duplicate emails
SELECT email, COUNT(*)
FROM "UserInfo"
GROUP BY email
HAVING COUNT(*) > 1;

-- Add unique constraint back to UserInfo email
ALTER TABLE "UserInfo" ADD CONSTRAINT "UserInfo_email_key" UNIQUE ("email");
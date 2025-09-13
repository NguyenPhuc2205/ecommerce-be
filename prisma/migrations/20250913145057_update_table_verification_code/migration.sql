/*
  Warnings:

  - You are about to drop the column `email` on the `VerificationCode` table. All the data in the column will be lost.
  - Added the required column `identifier` to the `VerificationCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VerificationCode` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."OTPDeliveryMethod" AS ENUM ('EMAIL', 'SMS', 'VOICE', 'WHATSAPP');

-- DropIndex
DROP INDEX "public"."VerificationCode_email_code_type_idx";

-- DropIndex
DROP INDEX "public"."VerificationCode_email_type_key";

-- AlterTable
ALTER TABLE "public"."VerificationCode" DROP COLUMN "email",
ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "deliveryMethod" "public"."OTPDeliveryMethod" NOT NULL DEFAULT 'EMAIL',
ADD COLUMN     "identifier" VARCHAR(500) NOT NULL,
ADD COLUMN     "isUsed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxAttempts" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "resendCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usedAt" TIMESTAMP(3),
ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "code" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE INDEX "VerificationCode_identifier_type_isUsed_idx" ON "public"."VerificationCode"("identifier", "type", "isUsed");

-- CreateIndex
CREATE INDEX "VerificationCode_identifier_code_type_idx" ON "public"."VerificationCode"("identifier", "code", "type");

-- CreateIndex
CREATE INDEX "VerificationCode_userId_idx" ON "public"."VerificationCode"("userId");

-- CreateIndex
CREATE INDEX "VerificationCode_createdAt_idx" ON "public"."VerificationCode"("createdAt");

-- CreateIndex
CREATE INDEX "VerificationCode_type_deliveryMethod_idx" ON "public"."VerificationCode"("type", "deliveryMethod");

-- AddForeignKey
ALTER TABLE "public"."VerificationCode" ADD CONSTRAINT "VerificationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

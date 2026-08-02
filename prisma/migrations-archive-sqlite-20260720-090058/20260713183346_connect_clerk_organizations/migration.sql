/*
  Warnings:

  - A unique constraint covering the columns `[clerkOrganizationId]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN "clerkOrganizationId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "clerkUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Business_clerkOrganizationId_key" ON "Business"("clerkOrganizationId");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

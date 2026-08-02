-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Business" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clerkOrganizationId" TEXT,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "subscriptionPlan" TEXT NOT NULL DEFAULT 'none',
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'inactive',
    "currentPeriodEndsAt" DATETIME,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "industry" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'America/New_York',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Business" ("clerkOrganizationId", "createdAt", "currentPeriodEndsAt", "id", "industry", "name", "phone", "stripeCustomerId", "stripeSubscriptionId", "subscriptionStatus", "timezone", "updatedAt") SELECT "clerkOrganizationId", "createdAt", "currentPeriodEndsAt", "id", "industry", "name", "phone", "stripeCustomerId", "stripeSubscriptionId", "subscriptionStatus", "timezone", "updatedAt" FROM "Business";
DROP TABLE "Business";
ALTER TABLE "new_Business" RENAME TO "Business";
CREATE UNIQUE INDEX "Business_clerkOrganizationId_key" ON "Business"("clerkOrganizationId");
CREATE UNIQUE INDEX "Business_stripeCustomerId_key" ON "Business"("stripeCustomerId");
CREATE UNIQUE INDEX "Business_stripeSubscriptionId_key" ON "Business"("stripeSubscriptionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateTable
CREATE TABLE "AtlasAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "customerReference" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "estimatedValue" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "decidedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AtlasAction_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "AtlasAction_businessId_idx" ON "AtlasAction"("businessId");

-- CreateIndex
CREATE INDEX "AtlasAction_status_idx" ON "AtlasAction"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AtlasAction_businessId_recommendationId_key" ON "AtlasAction"("businessId", "recommendationId");

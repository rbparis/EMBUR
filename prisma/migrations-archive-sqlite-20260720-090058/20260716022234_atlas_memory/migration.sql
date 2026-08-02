-- CreateTable
CREATE TABLE "AtlasMemory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL DEFAULT 'Owner',
    "preferredBriefLength" TEXT NOT NULL DEFAULT 'short',
    "preferredCommunication" TEXT NOT NULL DEFAULT 'call',
    "emergencyFirst" BOOLEAN NOT NULL DEFAULT true,
    "preferredStartHour" INTEGER NOT NULL DEFAULT 8,
    "averageResponseMinutes" INTEGER NOT NULL DEFAULT 15,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AtlasMemory_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AtlasMemory_businessId_key" ON "AtlasMemory"("businessId");

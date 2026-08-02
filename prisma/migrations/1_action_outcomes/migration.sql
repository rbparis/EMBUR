-- Add measurable outcomes to Atlas actions.
ALTER TABLE "AtlasAction"
ADD COLUMN "actualValue" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "timeSavedMinutes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "completedAt" TIMESTAMP(3);

ALTER TABLE "OutreachProspect"
ADD COLUMN "plan" TEXT,
ADD COLUMN "monthlyRevenue" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "wonAt" TIMESTAMP(3);

CREATE INDEX "OutreachProspect_wonAt_idx" ON "OutreachProspect"("wonAt");

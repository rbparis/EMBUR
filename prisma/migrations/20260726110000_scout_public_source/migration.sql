ALTER TABLE "OutreachProspect"
ALTER COLUMN "email" DROP NOT NULL;

CREATE UNIQUE INDEX "OutreachProspect_businessId_sourceUrl_key"
ON "OutreachProspect"("businessId", "sourceUrl");

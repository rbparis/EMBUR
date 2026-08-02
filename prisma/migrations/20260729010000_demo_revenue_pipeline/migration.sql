CREATE TABLE "DemoRequest" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "website" TEXT,
    "market" TEXT,
    "challenge" TEXT,
    "preferredTime" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "source" TEXT NOT NULL DEFAULT 'website',
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DemoRequest_businessId_idx" ON "DemoRequest"("businessId");
CREATE INDEX "DemoRequest_status_idx" ON "DemoRequest"("status");
CREATE INDEX "DemoRequest_createdAt_idx" ON "DemoRequest"("createdAt");
CREATE INDEX "DemoRequest_email_idx" ON "DemoRequest"("email");

ALTER TABLE "DemoRequest"
ADD CONSTRAINT "DemoRequest_businessId_fkey"
FOREIGN KEY ("businessId") REFERENCES "Business"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

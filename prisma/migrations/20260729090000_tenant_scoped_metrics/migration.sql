ALTER TABLE "MetricEvent" ADD COLUMN "accountMode" TEXT NOT NULL DEFAULT 'demo';

CREATE INDEX "MetricEvent_businessId_accountMode_createdAt_idx"
ON "MetricEvent"("businessId", "accountMode", "createdAt");

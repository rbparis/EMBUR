-- CreateTable
CREATE TABLE "MetricEvent" (
    "id" TEXT NOT NULL,
    "businessId" TEXT,
    "visitorId" TEXT,
    "externalId" TEXT,
    "event" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'app',
    "agent" TEXT,
    "path" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MetricEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MetricEvent_externalId_key" ON "MetricEvent"("externalId");

-- CreateIndex
CREATE INDEX "MetricEvent_businessId_idx" ON "MetricEvent"("businessId");

-- CreateIndex
CREATE INDEX "MetricEvent_event_idx" ON "MetricEvent"("event");

-- CreateIndex
CREATE INDEX "MetricEvent_agent_idx" ON "MetricEvent"("agent");

-- CreateIndex
CREATE INDEX "MetricEvent_createdAt_idx" ON "MetricEvent"("createdAt");

-- CreateIndex
CREATE INDEX "MetricEvent_visitorId_idx" ON "MetricEvent"("visitorId");

-- AddForeignKey
ALTER TABLE "MetricEvent" ADD CONSTRAINT "MetricEvent_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "HostedJob" (
  "id" TEXT NOT NULL, "businessId" TEXT NOT NULL, "accountMode" TEXT NOT NULL,
  "jobType" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'active', "lastRunAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3), "lastError" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "HostedJob_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "HostedRun" (
  "id" TEXT NOT NULL, "businessId" TEXT NOT NULL, "jobId" TEXT NOT NULL, "accountMode" TEXT NOT NULL,
  "scheduledKey" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'running', "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finishedAt" TIMESTAMP(3), "error" TEXT, "metrics" JSONB, "attempt" INTEGER NOT NULL DEFAULT 1,
  "maxAttempts" INTEGER NOT NULL DEFAULT 5, "retryAt" TIMESTAMP(3), "deadLetteredAt" TIMESTAMP(3), CONSTRAINT "HostedRun_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "OutreachSuppression" (
  "id" TEXT NOT NULL, "businessId" TEXT NOT NULL, "accountMode" TEXT NOT NULL, "channel" TEXT NOT NULL,
  "normalized" TEXT NOT NULL, "reason" TEXT NOT NULL, "source" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "OutreachSuppression_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ApprovalEmail" (
  "id" TEXT NOT NULL, "businessId" TEXT NOT NULL, "accountMode" TEXT NOT NULL, "prospectId" TEXT,
  "recipientEmail" TEXT NOT NULL, "normalized" TEXT NOT NULL, "subject" TEXT NOT NULL, "body" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending_approval', "approvedAt" TIMESTAMP(3), "rejectedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ApprovalEmail_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "HostedJob_businessId_accountMode_jobType_key" ON "HostedJob"("businessId", "accountMode", "jobType");
CREATE INDEX "HostedJob_status_nextRunAt_idx" ON "HostedJob"("status", "nextRunAt");
CREATE UNIQUE INDEX "HostedRun_jobId_scheduledKey_key" ON "HostedRun"("jobId", "scheduledKey");
CREATE INDEX "HostedRun_businessId_accountMode_startedAt_idx" ON "HostedRun"("businessId", "accountMode", "startedAt");
CREATE INDEX "HostedRun_status_startedAt_idx" ON "HostedRun"("status", "startedAt");
CREATE UNIQUE INDEX "OutreachSuppression_businessId_accountMode_channel_normalized_key" ON "OutreachSuppression"("businessId", "accountMode", "channel", "normalized");
CREATE INDEX "OutreachSuppression_businessId_accountMode_createdAt_idx" ON "OutreachSuppression"("businessId", "accountMode", "createdAt");
CREATE UNIQUE INDEX "ApprovalEmail_businessId_accountMode_prospectId_key" ON "ApprovalEmail"("businessId", "accountMode", "prospectId");
CREATE INDEX "ApprovalEmail_businessId_accountMode_status_createdAt_idx" ON "ApprovalEmail"("businessId", "accountMode", "status", "createdAt");
ALTER TABLE "HostedJob" ADD CONSTRAINT "HostedJob_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HostedRun" ADD CONSTRAINT "HostedRun_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HostedRun" ADD CONSTRAINT "HostedRun_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "HostedJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OutreachSuppression" ADD CONSTRAINT "OutreachSuppression_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ApprovalEmail" ADD CONSTRAINT "ApprovalEmail_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

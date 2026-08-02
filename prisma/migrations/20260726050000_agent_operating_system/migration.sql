-- CreateTable
CREATE TABLE "AgentTask" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "agent" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "taskType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "scheduledFor" TIMESTAMP(3),
    "result" TEXT,
    "metadata" JSONB,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachProspect" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "ownerName" TEXT,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "location" TEXT,
    "notes" TEXT,
    "sourceUrl" TEXT,
    "stage" TEXT NOT NULL DEFAULT 'draft',
    "sequence" JSONB,
    "activeStep" INTEGER NOT NULL DEFAULT 1,
    "nextFollowUpAt" TIMESTAMP(3),
    "lastContactedAt" TIMESTAMP(3),
    "optedOutAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutreachProspect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentArtifact" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "agent" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "checklist" JSONB,
    "channel" TEXT,
    "keywords" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'draft',
    "scheduledFor" TIMESTAMP(3),
    "publishedUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "keywords" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AgentTask_businessId_idx" ON "AgentTask"("businessId");
CREATE INDEX "AgentTask_agent_idx" ON "AgentTask"("agent");
CREATE INDEX "AgentTask_status_idx" ON "AgentTask"("status");
CREATE INDEX "AgentTask_scheduledFor_idx" ON "AgentTask"("scheduledFor");
CREATE UNIQUE INDEX "OutreachProspect_businessId_email_key" ON "OutreachProspect"("businessId", "email");
CREATE INDEX "OutreachProspect_businessId_idx" ON "OutreachProspect"("businessId");
CREATE INDEX "OutreachProspect_stage_idx" ON "OutreachProspect"("stage");
CREATE INDEX "OutreachProspect_nextFollowUpAt_idx" ON "OutreachProspect"("nextFollowUpAt");
CREATE INDEX "ContentArtifact_businessId_idx" ON "ContentArtifact"("businessId");
CREATE INDEX "ContentArtifact_agent_idx" ON "ContentArtifact"("agent");
CREATE INDEX "ContentArtifact_kind_idx" ON "ContentArtifact"("kind");
CREATE INDEX "ContentArtifact_status_idx" ON "ContentArtifact"("status");
CREATE INDEX "ContentArtifact_scheduledFor_idx" ON "ContentArtifact"("scheduledFor");
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE INDEX "BlogPost_businessId_idx" ON "BlogPost"("businessId");
CREATE INDEX "BlogPost_status_idx" ON "BlogPost"("status");
CREATE INDEX "BlogPost_publishedAt_idx" ON "BlogPost"("publishedAt");

-- AddForeignKey
ALTER TABLE "AgentTask" ADD CONSTRAINT "AgentTask_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OutreachProspect" ADD CONSTRAINT "OutreachProspect_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentArtifact" ADD CONSTRAINT "ContentArtifact_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

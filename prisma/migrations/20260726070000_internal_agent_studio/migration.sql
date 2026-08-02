CREATE TABLE "AgentMessage" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "agent" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "taskId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AgentMessage_businessId_idx" ON "AgentMessage"("businessId");
CREATE INDEX "AgentMessage_agent_idx" ON "AgentMessage"("agent");
CREATE INDEX "AgentMessage_createdAt_idx" ON "AgentMessage"("createdAt");

ALTER TABLE "AgentMessage"
ADD CONSTRAINT "AgentMessage_businessId_fkey"
FOREIGN KEY ("businessId") REFERENCES "Business"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

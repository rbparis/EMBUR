import { prisma } from "@/lib/prisma";
import { createHash } from "node:crypto";

export type AccountMode = "founder" | "client" | "demo";

const forbiddenMetadataKeys = /email|phone|name|domain|clerk|stripe|customer|subscription/i;

export function tenantMetricScope(tenantId: string, accountMode: AccountMode) {
  return { businessId: tenantId, accountMode };
}

export function metricEventKey(namespace: string, externalValue: string) {
  return `${namespace}:${createHash("sha256").update(externalValue).digest("hex")}`;
}

export function safeMetricMetadata(
  metadata?: Record<string, string | number | boolean | null>
) {
  if (!metadata) return undefined;
  for (const key of Object.keys(metadata)) {
    if (forbiddenMetadataKeys.test(key)) {
      throw new Error(`Metric metadata key is not allowed: ${key}`);
    }
  }
  return metadata;
}

export async function recordMetricEvent(input: {
  tenantId: string;
  accountMode: AccountMode;
  event: string;
  source: string;
  externalId?: string;
  visitorId?: string;
  path?: string;
  agent?: string;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  const data = {
    businessId: input.tenantId,
    accountMode: input.accountMode,
    event: input.event,
    source: input.source,
    externalId: input.externalId,
    visitorId: input.visitorId,
    path: input.path,
    agent: input.agent,
    metadata: safeMetricMetadata(input.metadata),
  };

  if (input.externalId) {
    return prisma.metricEvent.upsert({
      where: { externalId: input.externalId },
      update: {},
      create: data,
    });
  }
  return prisma.metricEvent.create({ data });
}

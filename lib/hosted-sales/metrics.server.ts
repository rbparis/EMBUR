import { prisma } from "@/lib/prisma";
import { HOSTED_ACCOUNT_MODE } from "@/lib/hosted-sales/dispatcher.server";
import { providerReadiness } from "@/lib/provider-readiness";
import { HOSTED_INTERVAL_MS } from "@/lib/hosted-sales/policy";

export type HostedSalesMetrics = {
  jobStatus: string;
  lastRunAt: string | null;
  nextRunAt: string | null;
  lastError: string | null;
  runs24h: number;
  failed24h: number;
  pendingApproval: number;
  suppressions: number;
  retryPending: number;
  deadLetters: number;
  stale: boolean;
  readiness: ReturnType<typeof providerReadiness>;
};

export async function getHostedSalesMetrics(businessId: string): Promise<HostedSalesMetrics> {
  const since = new Date(Date.now() - 86_400_000);
  const [job, runs24h, failed24h, pendingApproval, suppressions, retryPending, deadLetters] = await Promise.all([
    prisma.hostedJob.findFirst({ where: { businessId, accountMode: HOSTED_ACCOUNT_MODE }, orderBy: { updatedAt: "desc" } }),
    prisma.hostedRun.count({ where: { businessId, accountMode: HOSTED_ACCOUNT_MODE, startedAt: { gte: since } } }),
    prisma.hostedRun.count({ where: { businessId, accountMode: HOSTED_ACCOUNT_MODE, status: "failed", startedAt: { gte: since } } }),
    prisma.approvalEmail.count({ where: { businessId, accountMode: HOSTED_ACCOUNT_MODE, status: "pending_approval" } }),
    prisma.outreachSuppression.count({ where: { businessId, accountMode: HOSTED_ACCOUNT_MODE } }),
    prisma.hostedRun.count({ where: { businessId, accountMode: HOSTED_ACCOUNT_MODE, status: "retry_pending" } }),
    prisma.hostedRun.count({ where: { businessId, accountMode: HOSTED_ACCOUNT_MODE, status: "dead_letter" } }),
  ]);
  const stale = Boolean(job?.lastRunAt && Date.now() - job.lastRunAt.getTime() > HOSTED_INTERVAL_MS * 3);
  return {
    jobStatus: job?.status ?? "not_started",
    lastRunAt: job?.lastRunAt?.toISOString() ?? null,
    nextRunAt: job?.nextRunAt?.toISOString() ?? null,
    lastError: job?.lastError ?? null,
    runs24h, failed24h, pendingApproval, suppressions, retryPending, deadLetters, stale, readiness: providerReadiness(),
  };
}

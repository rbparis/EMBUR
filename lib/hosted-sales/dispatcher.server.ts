import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { HOSTED_INTERVAL_MS, MAX_ATTEMPTS, STALE_RUN_MS, retryDelayMs, scheduledKey } from "./policy";

export const HOSTED_JOB_TYPE = "approval_email_drafts";
export const HOSTED_ACCOUNT_MODE = "founder";

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export const fiveMinuteKey = scheduledKey;

async function recoverStaleRuns(businessId: string, now: Date) {
  const staleBefore = new Date(now.getTime() - STALE_RUN_MS);
  return prisma.hostedRun.updateMany({
    where: { businessId, accountMode: HOSTED_ACCOUNT_MODE, status: "running", startedAt: { lt: staleBefore } },
    data: { status: "retry_pending", error: "Recovered stale run lease", retryAt: now, finishedAt: now },
  });
}

async function prepareApprovalDrafts(businessId: string, accountMode: string) {
  const prospects = await prisma.outreachProspect.findMany({
    where: { businessId, email: { not: null }, optedOutAt: null, stage: { in: ["draft", "qualified"] } },
    orderBy: { createdAt: "asc" },
    take: 25,
  });
  let queued = 0;
  let suppressed = 0;
  for (const prospect of prospects) {
    const normalized = normalizeEmail(prospect.email!);
    const blocked = await prisma.outreachSuppression.findUnique({
      where: { businessId_accountMode_channel_normalized: { businessId, accountMode, channel: "email", normalized } },
      select: { id: true },
    });
    if (blocked) { suppressed += 1; continue; }
    const result = await prisma.approvalEmail.createMany({ data: [{
      businessId, accountMode, prospectId: prospect.id, recipientEmail: prospect.email!, normalized,
      subject: `A follow-up idea for ${prospect.company}`,
      body: `Draft only — owner approval required before any contact with ${prospect.company}.`,
      status: "pending_approval",
    }], skipDuplicates: true });
    queued += result.count;
  }
  return { considered: prospects.length, queued, suppressed, sent: 0 };
}

export async function dispatchHostedSales(businessId: string, now = new Date()) {
  await recoverStaleRuns(businessId, now);
  const job = await prisma.hostedJob.upsert({
    where: { businessId_accountMode_jobType: { businessId, accountMode: HOSTED_ACCOUNT_MODE, jobType: HOSTED_JOB_TYPE } },
    update: {},
    create: { businessId, accountMode: HOSTED_ACCOUNT_MODE, jobType: HOSTED_JOB_TYPE, nextRunAt: now },
  });
  if (job.status !== "active") return { status: "disabled" as const };
  const runKey = fiveMinuteKey(now);
  let run;
  try {
    const retry = await prisma.hostedRun.findFirst({
      where: { jobId: job.id, status: "retry_pending", retryAt: { lte: now } }, orderBy: { retryAt: "asc" },
    });
    run = retry
      ? await prisma.hostedRun.update({ where: { id: retry.id }, data: { status: "running", attempt: { increment: 1 }, startedAt: now, finishedAt: null, retryAt: null } })
      : await prisma.hostedRun.create({ data: { businessId, accountMode: job.accountMode, jobId: job.id, scheduledKey: runKey, maxAttempts: MAX_ATTEMPTS } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return { status: "duplicate" as const };
    throw error;
  }
  try {
    const metrics = await prepareApprovalDrafts(businessId, job.accountMode);
    const nextRunAt = new Date(now.getTime() + HOSTED_INTERVAL_MS);
    await prisma.$transaction([
      prisma.hostedRun.update({ where: { id: run.id }, data: { status: "succeeded", finishedAt: new Date(), metrics } }),
      prisma.hostedJob.update({ where: { id: job.id }, data: { lastRunAt: now, nextRunAt, lastError: null } }),
    ]);
    return { status: "succeeded" as const, runId: run.id, metrics };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 2000) : "Unknown dispatcher error";
    const deadLetter = run.attempt >= run.maxAttempts;
    const retryAt = deadLetter ? null : new Date(now.getTime() + retryDelayMs(run.attempt));
    await prisma.$transaction([
      prisma.hostedRun.update({ where: { id: run.id }, data: { status: deadLetter ? "dead_letter" : "retry_pending", finishedAt: new Date(), error: message, retryAt, deadLetteredAt: deadLetter ? new Date() : null } }),
      prisma.hostedJob.update({ where: { id: job.id }, data: { lastRunAt: now, nextRunAt: retryAt, lastError: message } }),
    ]);
    return { status: "failed" as const, runId: run.id, error: message, retryAt: retryAt?.toISOString() ?? null, deadLetter };
  }
}

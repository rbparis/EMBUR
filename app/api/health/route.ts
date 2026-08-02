import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HOSTED_ACCOUNT_MODE } from "@/lib/hosted-sales/dispatcher.server";
import { HOSTED_INTERVAL_MS } from "@/lib/hosted-sales/policy";
import { providerReadiness } from "@/lib/provider-readiness";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const job = await prisma.hostedJob.findFirst({ where: { accountMode: HOSTED_ACCOUNT_MODE }, orderBy: { updatedAt: "desc" }, select: { status: true, lastRunAt: true, lastError: true } });
    const stale = Boolean(job?.lastRunAt && Date.now() - job.lastRunAt.getTime() > HOSTED_INTERVAL_MS * 3);
    const ready = job?.status === "active" && Boolean(job.lastRunAt) && !stale && !job.lastError;
    return NextResponse.json({ status: ready ? "ok" : "degraded", service: "embur", database: "connected", scheduler: { ready, stale, lastRunAt: job?.lastRunAt, lastError: job?.lastError ?? null }, providers: providerReadiness(), timestamp: new Date().toISOString() }, { status: ready ? 200 : 503 });
  } catch {
    return NextResponse.json({ status: "degraded", service: "embur", database: "unavailable", timestamp: new Date().toISOString() }, { status: 503 });
  }
}

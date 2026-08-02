import { NextResponse } from "next/server";
import { getAuthenticatedFounder } from "@/lib/founderAccess.server";
import { prisma } from "@/lib/prisma";
import { tenantMetricScope } from "@/lib/metrics.server";

export const dynamic = "force-dynamic";

const AGENT_ORDER = ["atlas", "scout", "verifier", "hunter", "closer", "launch", "keeper", "relay", "pulse", "rank"];

function startOfDayInTimeZone(date: Date, timeZone: string) {
  const format = (value: Date) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(value);
  const part = (parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((item) => item.type === type)?.value || 0);

  const local = format(date);
  const localMidnightAsUtc = Date.UTC(part(local, "year"), part(local, "month") - 1, part(local, "day"));
  const probe = new Date(localMidnightAsUtc);
  const represented = format(probe);
  const representedAsUtc = Date.UTC(
    part(represented, "year"),
    part(represented, "month") - 1,
    part(represented, "day"),
    part(represented, "hour"),
    part(represented, "minute"),
    part(represented, "second"),
  );
  return new Date(localMidnightAsUtc - (representedAsUtc - probe.getTime()));
}

export async function GET() {
  const founder = await getAuthenticatedFounder();
  if (!founder) {
    return NextResponse.json({ success: false, message: "Founder metrics are internal to EMBUR." }, { status: 403 });
  }
  const business = founder.business;
  const timeZone = business.timezone || "America/New_York";
  const now = new Date();
  const dayStart = startOfDayInTimeZone(now, timeZone);
  const liveStart = new Date(now.getTime() - 5 * 60 * 1000);
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const founderMetricScope = tenantMetricScope(business.id, "founder");

  const [
    weekEventGroups,
    todayEventGroups,
    weekUniqueVisitors,
    todayUniqueVisitors,
    liveUniqueVisitors,
    tasks,
    stageGroups,
    recentTasks,
    demoGroups,
    recentEvents,
    contactedToday,
  ] = await Promise.all([
    prisma.metricEvent.groupBy({
      by: ["event"],
      where: { ...founderMetricScope, createdAt: { gte: weekStart } },
      _count: { _all: true },
    }),
    prisma.metricEvent.groupBy({
      by: ["event"],
      where: { ...founderMetricScope, createdAt: { gte: dayStart } },
      _count: { _all: true },
    }),
    prisma.metricEvent.findMany({
      where: { ...founderMetricScope, event: "landing_view", createdAt: { gte: weekStart }, visitorId: { not: null } },
      distinct: ["visitorId"],
      select: { visitorId: true },
    }),
    prisma.metricEvent.findMany({
      where: { ...founderMetricScope, event: "landing_view", createdAt: { gte: dayStart }, visitorId: { not: null } },
      distinct: ["visitorId"],
      select: { visitorId: true },
    }),
    prisma.metricEvent.findMany({
      where: { ...founderMetricScope, event: "landing_view", createdAt: { gte: liveStart }, visitorId: { not: null } },
      distinct: ["visitorId"],
      select: { visitorId: true },
    }),
    prisma.agentTask.groupBy({
      by: ["status"],
      where: { businessId: business.id, createdAt: { gte: dayStart } },
      _count: { _all: true },
    }),
    prisma.outreachProspect.groupBy({
      by: ["stage"],
      where: { businessId: business.id },
      _count: { _all: true },
    }),
    prisma.agentTask.findMany({
      where: { businessId: business.id },
      orderBy: { updatedAt: "desc" },
      take: 100,
      select: {
        id: true,
        agent: true,
        title: true,
        status: true,
        result: true,
        updatedAt: true,
      },
    }),
    prisma.demoRequest.groupBy({
      by: ["status"],
      where: { businessId: business.id },
      _count: { _all: true },
    }),
    prisma.metricEvent.findMany({
      where: { ...founderMetricScope, createdAt: { gte: dayStart } },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        event: true,
        path: true,
        source: true,
        agent: true,
        createdAt: true,
      },
    }),
    prisma.outreachProspect.count({
      where: { businessId: business.id, lastContactedAt: { gte: dayStart } },
    }),
  ]);

  const weekEvents = Object.fromEntries(weekEventGroups.map((row) => [row.event, row._count._all]));
  const todayEvents = Object.fromEntries(todayEventGroups.map((row) => [row.event, row._count._all]));
  const taskCounts = Object.fromEntries(tasks.map((row) => [row.status, row._count._all]));
  const stages = Object.fromEntries(stageGroups.map((row) => [row.stage, row._count._all]));
  const demoStages = Object.fromEntries(demoGroups.map((row) => [row.status, row._count._all]));
  const contacted = ["sent", "replied", "demo", "won"].reduce((sum, stage) => sum + (stages[stage] || 0), 0);
  const replies = ["replied", "demo", "won"].reduce((sum, stage) => sum + (stages[stage] || 0), 0);
  const latestByAgent = new Map<string, (typeof recentTasks)[number]>();
  for (const task of recentTasks) {
    const key = task.agent.toLowerCase();
    if (!latestByAgent.has(key)) latestByAgent.set(key, task);
  }
  const agentStates = AGENT_ORDER.map((agent) => {
    const task = latestByAgent.get(agent);
    const state = !task
      ? "idle"
      : task.status === "held"
        ? "blocked"
        : ["pending", "approved"].includes(task.status)
          ? "waiting"
          : task.status === "completed"
            ? "completed"
            : "working";
    return {
      agent,
      state,
      task: task?.title || null,
      result: task?.result || null,
      updatedAt: task?.updatedAt || null,
      verified: Boolean(task),
    };
  });

  return NextResponse.json({
    success: true,
    measuredAt: now.toISOString(),
    timeZone,
    todayStartedAt: dayStart.toISOString(),
    live: {
      activeVisitors: liveUniqueVisitors.length,
      windowMinutes: 5,
      recentEvents,
    },
    traffic: {
      today: {
        visits: todayEvents.landing_view || 0,
        uniqueVisitors: todayUniqueVisitors.length,
        pricingViews: todayEvents.pricing_view || 0,
        ctaClicks: todayEvents.cta_click || 0,
      },
      week: {
        visits: weekEvents.landing_view || 0,
        uniqueVisitors: weekUniqueVisitors.length,
        pricingViews: weekEvents.pricing_view || 0,
        ctaClicks: weekEvents.cta_click || 0,
      },
    },
    billing: {
      checkoutStarts: todayEvents.checkout_started || 0,
      paidConversions: null,
      paymentFailures: todayEvents.payment_failed || 0,
      expiredCheckouts: todayEvents.checkout_expired || 0,
    },
    inbound: {
      requests: Object.values(demoStages).reduce((sum, count) => sum + count, 0),
      new: demoStages.new || 0,
      booked: demoStages.booked || 0,
      won: demoStages.won || 0,
    },
    outreach: {
      approved: stages.approved || 0,
      contacted,
      contactedToday,
      replies,
      demos: (stages.demo || 0) + (stages.won || 0),
      customers: stages.won || 0,
      emailOpens: null,
      emailClicks: null,
    },
    agents: {
      attempted: Object.values(taskCounts).reduce((sum, count) => sum + count, 0),
      completed: taskCounts.completed || 0,
      blocked: taskCounts.held || 0,
      waiting: (taskCounts.pending || 0) + (taskCounts.approved || 0),
    },
    agentStates,
    recentTasks: recentTasks.slice(0, 20),
    connections: {
      traffic: true,
      stripe: false,
      outreachStages: true,
      emailDelivery: false,
      emailOpens: false,
      vercelAnalytics: false,
    },
  });
}

import { NextResponse } from "next/server";
import { getAuthenticatedFounder } from "@/lib/founderAccess.server";
import { EMBUR_INTERNAL_BUSINESS_ID } from "@/lib/internalWorkspace";
import { prisma } from "@/lib/prisma";
import { executeRevenueShift } from "@/lib/internal-agents/execute.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DailyAssignment = {
  agent: string;
  title: string;
  description: string;
  taskType: string;
};

const assignments: DailyAssignment[] = [
  {
    agent: "atlas",
    title: "Deliver the $3,000 MRR founder brief",
    description: "Report qualified leads, contacts, replies, demos, wins, current MRR, the main blocker, and Joon's single highest-value action.",
    taskType: "manager_brief",
  },
  {
    agent: "hunter",
    title: "Open 25 qualified conversations",
    description: "Prepare personal outreach for qualified HVAC owners and advance every due follow-up. Hold every message for owner approval.",
    taskType: "outreach_review",
  },
  {
    agent: "verifier",
    title: "Verify the next 25 Scout prospects",
    description: "Score public evidence, contactability, market fit, and independence. Move credible records into Hunter's queue without inventing contact data.",
    taskType: "qualification_review",
  },
  {
    agent: "closer",
    title: "Advance every warm sales opportunity",
    description: "Review replies and demonstrations, identify the next decision, and prepare a plan recommendation for Joon.",
    taskType: "close_pipeline",
  },
  {
    agent: "launch",
    title: "Protect every new customer launch",
    description: "Review paid customers and surface the next onboarding action required to reach a working lead-recovery setup.",
    taskType: "customer_onboarding",
  },
  {
    agent: "keeper",
    title: "Protect recurring revenue",
    description: "Review active customers, current MRR, retention risk, referral opportunities, and appropriate expansion moments.",
    taskType: "retention_review",
  },
  {
    agent: "pulse",
    title: "Create 11 social actions",
    description: "Draft one useful proof-led post and ten thoughtful conversations or responses for HVAC business owners.",
    taskType: "social_draft",
  },
  {
    agent: "rank",
    title: "Advance the three-article weekly target",
    description: "Prepare or improve one high-intent article around HVAC missed-call recovery, follow-up, or local service growth.",
    taskType: "seo_draft",
  },
  {
    agent: "scout",
    title: "Research 50 qualified HVAC prospects",
    description: "Use legitimate public business sources, verify problem fit, and document why each business belongs in Hunter's queue.",
    taskType: "prospect_research",
  },
  {
    agent: "relay",
    title: "Protect replies and advance 15 follow-ups",
    description: "Triage demonstrations, sales replies, support, billing, and due follow-ups. Prepare drafts but never send without Joon's approval.",
    taskType: "gmail_triage",
  },
];

function startOfUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

async function createDailyAssignments(businessId: string) {
  const dayStart = startOfUtcDay();
  const dayEnd = new Date(dayStart);
  dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

  const existing = await prisma.agentTask.findMany({
    where: {
      businessId,
      scheduledFor: { gte: dayStart, lt: dayEnd },
      taskType: { in: assignments.map((assignment) => assignment.taskType) },
    },
    select: { taskType: true },
  });
  const existingTypes = new Set(existing.map((task) => task.taskType));

  const missing = assignments.filter((assignment) => !existingTypes.has(assignment.taskType));
  if (missing.length) {
    await prisma.agentTask.createMany({
      data: missing.map((assignment) => ({
        businessId,
        ...assignment,
        status: "pending",
        scheduledFor: dayStart,
      })),
    });
  }

  await Promise.all(
    assignments.map((assignment) =>
      prisma.agentTask.updateMany({
        where: {
          businessId,
          scheduledFor: { gte: dayStart, lt: dayEnd },
          taskType: assignment.taskType,
          status: { not: "completed" },
        },
        data: {
          agent: assignment.agent,
          title: assignment.title,
          description: assignment.description,
        },
      })
    )
  );

  return prisma.agentTask.findMany({
    where: {
      businessId,
      scheduledFor: { gte: dayStart, lt: dayEnd },
      taskType: { in: assignments.map((assignment) => assignment.taskType) },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function POST() {
  const founder = await getAuthenticatedFounder();
  if (!founder) {
    return NextResponse.json(
      { success: false, message: "Founder operations are not available in customer workspaces." },
      { status: 403 }
    );
  }
  const business = founder.business;
  await createDailyAssignments(business.id);
  const executions = await executeRevenueShift(business.id);
  const tasks = await createDailyAssignments(business.id);
  return NextResponse.json({ success: true, tasks, executions });
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const business = await prisma.business.findUnique({
    where: { id: EMBUR_INTERNAL_BUSINESS_ID },
    select: { id: true },
  });
  if (!business) {
    return NextResponse.json({ success: true, businesses: 0, results: [] });
  }

  await createDailyAssignments(business.id);
  const executions = await executeRevenueShift(business.id);
  const tasks = await createDailyAssignments(business.id);
  return NextResponse.json({
    success: true,
    businesses: 1,
    results: [{ businessId: business.id, tasks: tasks.length, executions }],
  });
}

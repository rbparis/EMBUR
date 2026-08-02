import { NextResponse } from "next/server";
import { getAuthenticatedFounder } from "@/lib/founderAccess.server";
import { prisma } from "@/lib/prisma";
import { isSellablePlan, sellablePlans } from "@/lib/revenueMission";

const stages = ["research", "draft", "approved", "sent", "replied", "demo", "won", "lost", "opted_out"];

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/agents/prospects/[id]">
) {
  const founder = await getAuthenticatedFounder();
  if (!founder) return NextResponse.json({ success: false, message: "Founder outreach is private." }, { status: 403 });

  const { id } = await context.params;
  const body = (await request.json()) as { stage?: string; activeStep?: number; plan?: string | null };
  const business = founder.business;
  const existing = await prisma.outreachProspect.findFirst({ where: { id, businessId: business.id } });
  if (!existing) {
    return NextResponse.json({ success: false, message: "Prospect not found." }, { status: 404 });
  }

  const stage = stages.includes(body.stage ?? "") ? body.stage : existing.stage;
  const plan = isSellablePlan(body.plan) ? body.plan : existing.plan;
  if (stage === "won" && !isSellablePlan(plan)) {
    return NextResponse.json(
      { success: false, message: "Choose the customer plan before recording the sale." },
      { status: 400 }
    );
  }
  const now = new Date();
  const prospect = await prisma.outreachProspect.update({
    where: { id },
    data: {
      stage,
      plan,
      monthlyRevenue: stage === "won" && isSellablePlan(plan)
        ? sellablePlans[plan]
        : stage === "lost"
          ? 0
          : existing.monthlyRevenue,
      wonAt: stage === "won" ? existing.wonAt ?? now : stage === "lost" ? null : existing.wonAt,
      activeStep: [1, 2, 3].includes(Number(body.activeStep)) ? Number(body.activeStep) : existing.activeStep,
      lastContactedAt: stage === "sent" ? now : existing.lastContactedAt,
      nextFollowUpAt: stage === "sent"
        ? new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
        : ["replied", "demo", "won", "lost", "opted_out"].includes(stage ?? "")
          ? null
          : existing.nextFollowUpAt,
      optedOutAt: stage === "opted_out" ? now : existing.optedOutAt,
    },
  });

  return NextResponse.json({ success: true, prospect });
}

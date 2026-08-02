import { NextResponse } from "next/server";
import { getAuthenticatedFounder } from "@/lib/founderAccess.server";
import { prisma } from "@/lib/prisma";

const statuses = ["pending", "approved", "held", "completed"] as const;

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const founder = await getAuthenticatedFounder();
  if (!founder) return NextResponse.json({ success: false, message: "Founder operations are private." }, { status: 403 });

  const body = (await request.json()) as { status?: string; result?: string };
  if (!statuses.includes(body.status as (typeof statuses)[number])) {
    return NextResponse.json({ success: false, message: "Choose a valid task status." }, { status: 400 });
  }

  const business = founder.business;
  const { id } = await context.params;
  const existing = await prisma.agentTask.findFirst({
    where: { id, businessId: business.id },
  });

  if (!existing) {
    return NextResponse.json({ success: false, message: "Task not found." }, { status: 404 });
  }

  const task = await prisma.agentTask.update({
    where: { id },
    data: {
      status: body.status,
      result: typeof body.result === "string" ? body.result.trim().slice(0, 4000) || null : undefined,
      completedAt: body.status === "completed" ? new Date() : null,
    },
  });

  return NextResponse.json({ success: true, task });
}

import { NextResponse } from "next/server";
import { getAuthenticatedFounder } from "@/lib/founderAccess.server";
import { prisma } from "@/lib/prisma";

const statuses = ["new", "contacted", "booked", "won", "lost"] as const;

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/demo/requests/[id]">
) {
  const founder = await getAuthenticatedFounder();
  if (!founder) {
    return NextResponse.json({ success: false, message: "Founder demo requests are private." }, { status: 403 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as { status?: string };
  if (!statuses.includes(body.status as (typeof statuses)[number])) {
    return NextResponse.json({ success: false, message: "Choose a valid demo status." }, { status: 400 });
  }

  const existing = await prisma.demoRequest.findFirst({
    where: { id, businessId: founder.business.id },
  });
  if (!existing) {
    return NextResponse.json({ success: false, message: "Demo request not found." }, { status: 404 });
  }

  const updated = await prisma.demoRequest.update({
    where: { id },
    data: {
      status: body.status,
      scheduledAt: body.status === "booked" ? existing.scheduledAt ?? new Date() : existing.scheduledAt,
    },
  });

  return NextResponse.json({ success: true, request: updated });
}

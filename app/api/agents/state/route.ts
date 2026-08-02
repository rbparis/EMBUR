import { NextResponse } from "next/server";
import { getAuthenticatedFounder } from "@/lib/founderAccess.server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const founder = await getAuthenticatedFounder();
  if (!founder) {
    return NextResponse.json({ success: false, message: "Founder operations are internal to EMBUR." }, { status: 403 });
  }
  const business = founder.business;
  const [tasks, prospects, artifacts] = await Promise.all([
    prisma.agentTask.findMany({
      where: { businessId: business.id },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 100,
    }),
    prisma.outreachProspect.findMany({
      where: { businessId: business.id },
      orderBy: { updatedAt: "desc" },
      take: 250,
    }),
    prisma.contentArtifact.findMany({
      where: { businessId: business.id },
      orderBy: { updatedAt: "desc" },
      take: 150,
    }),
  ]);

  return NextResponse.json({ success: true, tasks, prospects, artifacts });
}

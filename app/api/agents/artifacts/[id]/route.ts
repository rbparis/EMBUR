import { NextResponse } from "next/server";
import { getAuthenticatedFounder } from "@/lib/founderAccess.server";
import { prisma } from "@/lib/prisma";

const statuses = ["draft", "approved", "published", "completed", "held"];

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/agents/artifacts/[id]">
) {
  const founder = await getAuthenticatedFounder();
  if (!founder) return NextResponse.json({ success: false, message: "Founder growth work is private." }, { status: 403 });

  const { id } = await context.params;
  const body = (await request.json()) as { status?: string; publishedUrl?: string };
  const business = founder.business;
  const existing = await prisma.contentArtifact.findFirst({ where: { id, businessId: business.id } });
  if (!existing) {
    return NextResponse.json({ success: false, message: "Agent work not found." }, { status: 404 });
  }

  const status = statuses.includes(body.status ?? "") ? body.status : existing.status;
  const artifact = await prisma.contentArtifact.update({
    where: { id },
    data: {
      status,
      publishedUrl: typeof body.publishedUrl === "string" ? body.publishedUrl.slice(0, 500) : existing.publishedUrl,
      publishedAt: status === "published" ? new Date() : existing.publishedAt,
    },
  });

  return NextResponse.json({ success: true, artifact });
}

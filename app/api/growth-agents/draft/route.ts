import { NextResponse } from "next/server";
import { getAuthenticatedFounder } from "@/lib/founderAccess.server";
import { generateGrowthArtifact } from "@/lib/growth-agents/generate.server";
import { prisma } from "@/lib/prisma";
import {
  type GrowthAgentArtifact,
  type GrowthAgentKind,
  type GrowthAgentRequest,
} from "@/lib/growth-agents/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const kinds: GrowthAgentKind[] = ["social", "seo", "research"];

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(request: Request) {
  const founder = await getAuthenticatedFounder();
  if (!founder) {
    return NextResponse.json({ success: false, message: "Founder growth agents are private." }, { status: 403 });
  }

  const body = (await request.json()) as Partial<GrowthAgentRequest>;
  const kind = clean(body.kind, 20) as GrowthAgentKind;
  const input: GrowthAgentRequest = {
    kind,
    topic: clean(body.topic, 160),
    audience: clean(body.audience, 160),
    location: clean(body.location, 120),
    channel: clean(body.channel, 80),
    notes: clean(body.notes, 800),
  };

  if (!kinds.includes(kind) || !input.topic) {
    return NextResponse.json(
      { success: false, message: "Choose an agent and give it one clear assignment." },
      { status: 400 }
    );
  }

  const business = founder.business;
  const { artifact, source } = await generateGrowthArtifact(input);
  const saved = await saveArtifact(business.id, input, artifact);
  return NextResponse.json({ success: true, artifact, source, artifactId: saved.id });
}

function saveArtifact(
  businessId: string,
  input: GrowthAgentRequest,
  artifact: GrowthAgentArtifact
) {
  const agent = input.kind === "social" ? "pulse" : input.kind === "seo" ? "rank" : "scout";
  return prisma.contentArtifact.create({
    data: {
      businessId,
      agent,
      kind: input.kind,
      title: artifact.title,
      summary: artifact.summary,
      content: artifact.content,
      checklist: artifact.checklist,
      channel: input.channel || null,
      keywords: [input.topic, input.location].filter((value): value is string => Boolean(value)),
      status: "draft",
    },
  });
}

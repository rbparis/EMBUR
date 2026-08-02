import { NextResponse } from "next/server";
import { getAuthenticatedFounder } from "@/lib/founderAccess.server";
import {
  internalAgents,
  isInternalAgentId,
  type AgentPermission,
} from "@/lib/internal-agents/agents";
import { getOpenAIClient } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function internalBusiness() {
  return (await getAuthenticatedFounder())?.business ?? null;
}

export async function GET(
  _request: Request,
  context: RouteContext<"/api/internal-agents/[agent]/messages">
) {
  const business = await internalBusiness();
  if (!business) {
    return NextResponse.json({ success: false, message: "This studio is private to EMBUR." }, { status: 403 });
  }

  const { agent } = await context.params;
  if (!isInternalAgentId(agent)) {
    return NextResponse.json({ success: false, message: "Agent not found." }, { status: 404 });
  }

  const [messages, tasks] = await Promise.all([
    prisma.agentMessage.findMany({
      where: { businessId: business.id, agent },
      orderBy: { createdAt: "asc" },
      take: 100,
    }),
    prisma.agentTask.findMany({
      where: { businessId: business.id, agent },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  return NextResponse.json({ success: true, agent: internalAgents[agent], messages, tasks });
}

export async function POST(
  request: Request,
  context: RouteContext<"/api/internal-agents/[agent]/messages">
) {
  const business = await internalBusiness();
  if (!business) {
    return NextResponse.json({ success: false, message: "This studio is private to EMBUR." }, { status: 403 });
  }

  const { agent } = await context.params;
  if (!isInternalAgentId(agent)) {
    return NextResponse.json({ success: false, message: "Agent not found." }, { status: 404 });
  }

  const body = (await request.json()) as {
    assignment?: string;
    permissions?: string[];
    continuous?: boolean;
  };
  const assignment = typeof body.assignment === "string" ? body.assignment.trim().slice(0, 4000) : "";
  if (!assignment) {
    return NextResponse.json({ success: false, message: "Give the agent a clear assignment." }, { status: 400 });
  }

  const definition = internalAgents[agent];
  const permissions = (body.permissions ?? []).filter(
    (permission): permission is AgentPermission =>
      definition.permissions.includes(permission as AgentPermission)
  );
  const continuous = Boolean(body.continuous);

  const task = await prisma.agentTask.create({
    data: {
      businessId: business.id,
      agent,
      title: assignment.slice(0, 120),
      description: assignment,
      taskType: "founder_assignment",
      status: "pending",
      scheduledFor: new Date(),
      metadata: { permissions, continuous },
    },
  });

  await prisma.agentMessage.create({
    data: {
      businessId: business.id,
      agent,
      role: "founder",
      content: assignment,
      taskId: task.id,
      metadata: { permissions, continuous },
    },
  });

  const recent = await prisma.agentMessage.findMany({
    where: { businessId: business.id, agent },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  let responseText = [
    `Assignment accepted by ${definition.name}.`,
    `Focus: ${definition.mission}`,
    permissions.length ? `Authorized tools: ${permissions.join(", ")}.` : "No external tools authorized.",
    continuous
      ? "I will keep this in my continuing queue and report verified progress."
      : "I will treat this as one focused assignment.",
    `Boundary: ${definition.boundary}`,
  ].join("\n\n");

  const model = process.env.OPENAI_MODEL?.trim();
  if (process.env.OPENAI_API_KEY && model) {
    try {
      const client = getOpenAIClient();
      const response = await client.responses.create({
        model,
        instructions: [
          `You are ${definition.name}, EMBUR's dedicated ${definition.title}.`,
          definition.mission,
          definition.boundary,
          "Respond to Joon as an accountable specialist.",
          "Confirm what you understood, state the first concrete work product, list any blocker, and say what verified result you will report.",
          "Never claim that an email was sent, a post was published, research was completed, or money was spent unless the supplied context proves it.",
          "Do not drift into another agent's specialty. Ask Atlas to coordinate cross-agent work.",
          `Approved permissions: ${permissions.join(", ") || "none"}.`,
          continuous ? "This is a continuing assignment." : "This is a one-time assignment.",
        ].join(" "),
        input: JSON.stringify({
          assignment,
          recentMessages: recent.reverse().map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });
      if (response.output_text.trim()) responseText = response.output_text.trim();
    } catch (error) {
      console.warn("Internal agent used its operating template:", error instanceof Error ? error.message : "Generation failed.");
    }
  }

  const message = await prisma.agentMessage.create({
    data: {
      businessId: business.id,
      agent,
      role: "agent",
      content: responseText,
      taskId: task.id,
      metadata: { permissions, continuous },
    },
  });

  await prisma.agentTask.update({
    where: { id: task.id },
    data: { result: responseText },
  });

  return NextResponse.json({ success: true, message, task });
}

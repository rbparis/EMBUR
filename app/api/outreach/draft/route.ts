import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { getAuthenticatedFounder } from "@/lib/founderAccess.server";
import { prisma } from "@/lib/prisma";
import {
  buildOutreachFallback,
  type OutreachEmailDraft,
  type OutreachProspectInput,
} from "@/lib/outreach/sequence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function isValidSequence(value: unknown): value is OutreachEmailDraft[] {
  if (!Array.isArray(value) || value.length !== 3) return false;

  return value.every((item, index) => {
    if (!item || typeof item !== "object") return false;
    const draft = item as Partial<OutreachEmailDraft>;
    return (
      draft.step === index + 1 &&
      [0, 2, 5].includes(Number(draft.day)) &&
      typeof draft.label === "string" &&
      typeof draft.subject === "string" &&
      typeof draft.body === "string" &&
      draft.subject.length <= 120 &&
      draft.body.length <= 1800
    );
  });
}

export async function POST(request: Request) {
  const founder = await getAuthenticatedFounder();
  if (!founder) {
    return NextResponse.json({ success: false, message: "This is private to EMBUR." }, { status: 403 });
  }

  const body = (await request.json()) as Partial<OutreachProspectInput>;
  const prospect: OutreachProspectInput = {
    company: clean(body.company, 120),
    ownerName: clean(body.ownerName, 80),
    email: clean(body.email, 160).toLowerCase(),
    city: clean(body.city, 100),
    notes: clean(body.notes, 600),
  };

  if (!prospect.company || !EMAIL_PATTERN.test(prospect.email)) {
    return NextResponse.json(
      { success: false, message: "Add a company and valid business email." },
      { status: 400 }
    );
  }

  const fallback = buildOutreachFallback(prospect);
  const business = founder.business;
  const model = process.env.OPENAI_MODEL?.trim();
  if (!process.env.OPENAI_API_KEY || !model) {
    const saved = await saveProspect(business.id, prospect, fallback);
    return NextResponse.json({ success: true, drafts: fallback, source: "template", prospectId: saved.id });
  }

  try {
    const client = getOpenAIClient();
    const response = await client.responses.create({
      model,
      instructions: [
        "You are Hunter, EMBUR's B2B outreach agent.",
        "Create a respectful three-email introduction sequence for one independent HVAC or local service business owner.",
        "The goal is a 15-minute product demonstration.",
        "Be concise, human, specific, and credible.",
        "Never invent facts, research, mutual contacts, customer results, testimonials, or guarantees.",
        "Do not use hype, pressure, fake urgency, tracking language, or deceptive subject lines.",
        "Email 1 introduces Joon and the missed-call/follow-up problem.",
        "Email 2 provides one useful business observation.",
        "Email 3 closes the loop respectfully.",
        "Preserve the schedule days 0, 2, and 5.",
        "Include Joon, Founder of EMBUR, getembur.com, and a simple opt-out line in the first email.",
        "Return only valid JSON: an array of exactly three objects with step, day, label, subject, and body.",
      ].join(" "),
      input: JSON.stringify(prospect),
    });

    const parsed = JSON.parse(response.output_text.trim()) as unknown;
    if (!isValidSequence(parsed)) throw new Error("Invalid outreach sequence.");

    const saved = await saveProspect(business.id, prospect, parsed);
    return NextResponse.json({ success: true, drafts: parsed, source: "openai", prospectId: saved.id });
  } catch (error) {
    console.warn(
      "Hunter used the approved EMBUR template:",
      error instanceof Error ? error.message : "Draft generation failed."
    );
    const saved = await saveProspect(business.id, prospect, fallback);
    return NextResponse.json({ success: true, drafts: fallback, source: "template", prospectId: saved.id });
  }
}

function saveProspect(
  businessId: string,
  prospect: OutreachProspectInput,
  drafts: OutreachEmailDraft[]
) {
  return prisma.outreachProspect.upsert({
    where: { businessId_email: { businessId, email: prospect.email } },
    create: {
      businessId,
      company: prospect.company,
      ownerName: prospect.ownerName || null,
      email: prospect.email,
      location: prospect.city || null,
      notes: prospect.notes || null,
      sequence: drafts,
      stage: "draft",
      activeStep: 1,
    },
    update: {
      company: prospect.company,
      ownerName: prospect.ownerName || null,
      location: prospect.city || null,
      notes: prospect.notes || null,
      sequence: drafts,
      stage: "draft",
      activeStep: 1,
    },
  });
}

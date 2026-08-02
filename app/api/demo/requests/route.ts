import { NextResponse } from "next/server";
import { getAuthenticatedFounder } from "@/lib/founderAccess.server";
import { EMBUR_INTERNAL_BUSINESS_ID } from "@/lib/internalWorkspace";
import { prisma } from "@/lib/prisma";
import { recordMetricEvent } from "@/lib/metrics.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function GET() {
  const founder = await getAuthenticatedFounder();
  if (!founder) {
    return NextResponse.json({ success: false, message: "Founder demo requests are private." }, { status: 403 });
  }

  const requests = await prisma.demoRequest.findMany({
    where: { businessId: founder.business.id },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
  });

  return NextResponse.json({ success: true, requests });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;
  if (origin && origin !== requestOrigin) {
    return NextResponse.json({ success: false, message: "Request origin was not accepted." }, { status: 403 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  if (clean(body.companyUrl, 200)) {
    return NextResponse.json({ success: true });
  }

  const name = clean(body.name, 100);
  const businessName = clean(body.businessName, 140);
  const email = clean(body.email, 180).toLowerCase();
  const phone = clean(body.phone, 50);
  const website = clean(body.website, 300);
  const market = clean(body.market, 140);
  const challenge = clean(body.challenge, 1200);
  const preferredTime = clean(body.preferredTime, 200);
  const consent = body.consent === true;

  if (!name || !businessName || !EMAIL.test(email) || phone.replace(/\D/g, "").length < 10 || !consent) {
    return NextResponse.json(
      { success: false, message: "Add your name, company, valid email and phone, then confirm we may contact you." },
      { status: 400 }
    );
  }

  const recent = await prisma.demoRequest.findFirst({
    where: {
      businessId: EMBUR_INTERNAL_BUSINESS_ID,
      email,
      createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) },
    },
    select: { id: true },
  });
  if (recent) {
    return NextResponse.json({ success: true, requestId: recent.id });
  }

  const demoRequest = await prisma.$transaction(async (database) => {
    const created = await database.demoRequest.create({
      data: {
        businessId: EMBUR_INTERNAL_BUSINESS_ID,
        name,
        businessName,
        email,
        phone,
        website: website || null,
        market: market || null,
        challenge: challenge || null,
        preferredTime: preferredTime || null,
      },
    });
    return created;
  });
  await recordMetricEvent({
    tenantId: EMBUR_INTERNAL_BUSINESS_ID,
    accountMode: "founder",
    externalId: `demo_requested:${demoRequest.id}`,
    event: "demo_requested",
    source: "marketing_site",
    path: "/demo",
    metadata: { market: market || null },
  });

  return NextResponse.json({ success: true, requestId: demoRequest.id });
}

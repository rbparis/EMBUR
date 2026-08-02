import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const requestLog = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 8;

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function requestAddress(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (requestLog.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  requestLog.set(key, recent);
  return recent.length > MAX_REQUESTS;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ businessId: string }> }
) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 20_000) {
    return NextResponse.json({ success: false, message: "That request was too large." }, { status: 413 });
  }

  const { businessId } = await context.params;
  const rateKey = `${businessId}:${requestAddress(request)}`;
  if (isRateLimited(rateKey)) {
    return NextResponse.json({ success: false, message: "Please wait a few minutes before trying again." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json({ success: false, message: "We could not read that request." }, { status: 400 });
  }

  // Hidden bot field. Real customers never see or complete it.
  if (clean(body.companyWebsite, 100)) {
    return NextResponse.json({ success: true, message: "Thank you. Your request was received." });
  }

  const name = clean(body.name, 100);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 160).toLowerCase();
  const address = clean(body.address, 220);
  const service = clean(body.service, 120);
  const details = clean(body.details, 1200);
  const preferredTime = clean(body.preferredTime, 120);
  const urgency = clean(body.urgency, 30).toLowerCase();
  const consent = body.consent === true;

  if (!name || !service || (!phone && !email) || !consent) {
    return NextResponse.json(
      { success: false, message: "Please provide your name, service need, contact information, and permission to respond." },
      { status: 400 }
    );
  }

  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { id: true, name: true },
  });

  if (!business) {
    return NextResponse.json({ success: false, message: "This after-hours assistant is not available." }, { status: 404 });
  }

  const urgencyLabel = urgency === "emergency" ? "Urgent" : urgency === "soon" ? "Soon" : "Routine";
  const summary = [
    `After-hours web intake — ${urgencyLabel}`,
    `Service: ${service}`,
    address ? `Address: ${address}` : null,
    preferredTime ? `Preferred time: ${preferredTime}` : null,
    details ? `Details: ${details}` : null,
    `Customer consented to a response by phone, text, or email.`,
  ].filter(Boolean).join("\n");

  const customer = await prisma.$transaction(async (transaction) => {
    const created = await transaction.customer.create({
      data: {
        businessId: business.id,
        name,
        phone: phone || null,
        email: email || null,
        address: address || null,
        service,
        status: "new",
      },
    });

    await transaction.conversation.create({
      data: {
        businessId: business.id,
        customerId: created.id,
        channel: "web",
        direction: "inbound",
        body: summary,
        status: urgency === "emergency" ? "urgent" : "received",
      },
    });

    return created;
  });

  return NextResponse.json({
    success: true,
    customerId: customer.id,
    message: `Thanks, ${name.split(" ")[0]}. ${business.name} received your request and will follow up as soon as possible.`,
  }, { status: 201 });
}

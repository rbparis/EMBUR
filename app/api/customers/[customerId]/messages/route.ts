import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateBusinessForUser } from "@/lib/currentBusiness";
import { findCustomerForBusiness } from "@/repositories/customerRepository";
import {
  getSmsDeliveryMode,
  normalizeSmsPhone,
  sendSms,
} from "@/lib/messaging/twilio";

const CONSENT_LANGUAGE = "Customer consented to a response by phone, text, or email.";

export async function POST(request: NextRequest, { params }: { params: Promise<{ customerId: string }> }) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return NextResponse.json({ success: false, message: "You must sign in." }, { status: 401 });
  if (!userId) return NextResponse.json({ success: false, message: "Sign in first." }, { status: 409 });

  const { customerId } = await params;
  const business = await getOrCreateBusinessForUser(userId);
  const customer = await findCustomerForBusiness(business.id, customerId);
  if (!customer) return NextResponse.json({ success: false, message: "Customer not found." }, { status: 404 });

  const body = (await request.json()) as { body?: string; channel?: string };
  const messageBody = body.body?.trim();
  if (!messageBody) return NextResponse.json({ success: false, message: "Message cannot be empty." }, { status: 400 });
  if (messageBody.length > 1600) {
    return NextResponse.json({ success: false, message: "Text messages must be 1,600 characters or fewer." }, { status: 400 });
  }
  if (body.channel === "email") {
    return NextResponse.json({ success: false, message: "Email delivery is not connected yet." }, { status: 409 });
  }

  const customerPhone = normalizeSmsPhone(customer.phone);
  if (!customerPhone) {
    return NextResponse.json({ success: false, message: "Add a valid customer phone number before texting." }, { status: 409 });
  }

  const [documentedConsent, latestSmsPreference] = await Promise.all([
    prisma.conversation.findFirst({
      where: {
        businessId: business.id,
        customerId,
        direction: "inbound",
        OR: [
          { channel: "web", body: { contains: CONSENT_LANGUAGE } },
          { channel: "sms" },
        ],
      },
      select: { id: true },
    }),
    prisma.conversation.findFirst({
      where: {
        businessId: business.id,
        customerId,
        channel: "sms",
        status: { in: ["opted_out", "opted_in"] },
      },
      orderBy: { createdAt: "desc" },
      select: { status: true },
    }),
  ]);

  if (!documentedConsent) {
    return NextResponse.json({
      success: false,
      message: "Text blocked: EMBUR needs documented customer consent before delivery.",
    }, { status: 409 });
  }

  if (latestSmsPreference?.status === "opted_out") {
    return NextResponse.json({
      success: false,
      message: "Text blocked: this customer opted out of SMS.",
    }, { status: 409 });
  }

  const mode = getSmsDeliveryMode();
  if (mode === "disabled") {
    return NextResponse.json({
      success: false,
      message: "Text delivery is safely disabled until Twilio is connected in production.",
    }, { status: 503 });
  }

  const message = await prisma.conversation.create({
    data: {
      businessId: business.id,
      customerId,
      channel: body.channel === "email" ? "email" : "sms",
      direction: "outbound",
      body: messageBody,
      status: "sending",
    },
  });

  try {
    const appUrl = (process.env.APP_URL || "https://getembur.com").replace(/\/$/, "");
    const delivery = await sendSms({
      to: customerPhone,
      body: messageBody,
      statusCallback: `${appUrl}/api/messaging/twilio/status?conversationId=${encodeURIComponent(message.id)}`,
    });

    const updatedMessage = await prisma.conversation.update({
      where: { id: message.id },
      data: { status: delivery.status || "queued" },
    });

    await prisma.customer.update({
      where: { id: customerId },
      data: { status: customer.status === "new" ? "contacted" : customer.status },
    });

    return NextResponse.json({
      success: true,
      message: updatedMessage,
      delivery: {
        mode: delivery.mode,
        status: delivery.status,
        recipient: `•••${delivery.recipient.slice(-4)}`,
      },
    }, { status: 201 });
  } catch (error) {
    await prisma.conversation.update({
      where: { id: message.id },
      data: { status: "failed" },
    });

    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Twilio could not accept this text.",
    }, { status: 502 });
  }
}

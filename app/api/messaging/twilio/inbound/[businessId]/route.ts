import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  emptyTwiml,
  normalizeSmsPhone,
  publicWebhookUrl,
  readTwilioForm,
  validateTwilioWebhook,
} from "@/lib/messaging/twilio";

function inboundStatus(optOutType: string | undefined) {
  if (optOutType === "STOP") return "opted_out";
  if (optOutType === "START") return "opted_in";
  if (optOutType === "HELP") return "help_requested";
  return "received";
}

export async function POST(
  request: Request,
  context: { params: Promise<{ businessId: string }> },
) {
  const params = await readTwilioForm(request);
  const signature = request.headers.get("x-twilio-signature");
  const webhookUrl = publicWebhookUrl(request);

  if (!validateTwilioWebhook(signature, webhookUrl, params)) {
    return NextResponse.json({ success: false, message: "Invalid webhook signature." }, { status: 403 });
  }

  const { businessId } = await context.params;
  const from = normalizeSmsPhone(params.From);
  const body = params.Body?.trim().slice(0, 1600);

  if (!from || !body) {
    return NextResponse.json({ success: false, message: "Missing sender or message." }, { status: 400 });
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { id: true },
  });
  if (!business) {
    return NextResponse.json({ success: false, message: "Business not found." }, { status: 404 });
  }

  await prisma.$transaction(async (transaction) => {
    const phoneCustomers = await transaction.customer.findMany({
      where: { businessId, phone: { not: null } },
      orderBy: { updatedAt: "desc" },
    });
    let customer = phoneCustomers.find((candidate) => normalizeSmsPhone(candidate.phone) === from);

    if (!customer) {
      customer = await transaction.customer.create({
        data: {
          businessId,
          name: `Text customer ${from.slice(-4)}`,
          phone: from,
          service: "Incoming text",
          status: "new",
        },
      });
    }

    await transaction.conversation.create({
      data: {
        businessId,
        customerId: customer.id,
        channel: "sms",
        direction: "inbound",
        body,
        status: inboundStatus(params.OptOutType?.toUpperCase()),
      },
    });
  });

  return emptyTwiml();
}

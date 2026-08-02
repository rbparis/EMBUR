import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  publicWebhookUrl,
  readTwilioForm,
  validateTwilioWebhook,
} from "@/lib/messaging/twilio";

const acceptedStatuses = new Set([
  "accepted",
  "scheduled",
  "queued",
  "sending",
  "sent",
  "delivered",
  "undelivered",
  "failed",
  "canceled",
  "read",
]);

export async function POST(request: Request) {
  const params = await readTwilioForm(request);
  const signature = request.headers.get("x-twilio-signature");
  const webhookUrl = publicWebhookUrl(request);

  if (!validateTwilioWebhook(signature, webhookUrl, params)) {
    return NextResponse.json({ success: false, message: "Invalid webhook signature." }, { status: 403 });
  }

  const conversationId = new URL(request.url).searchParams.get("conversationId");
  const messageStatus = params.MessageStatus?.toLowerCase();

  if (!conversationId || !messageStatus || !acceptedStatuses.has(messageStatus)) {
    return NextResponse.json({ success: false, message: "Missing callback details." }, { status: 400 });
  }

  await prisma.conversation.updateMany({
    where: { id: conversationId, direction: "outbound", channel: "sms" },
    data: { status: messageStatus },
  });

  return NextResponse.json({ success: true });
}

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getOrCreateBusinessForUser } from "@/lib/currentBusiness";
import { messagingReadiness } from "@/lib/messaging/twilio";

export async function GET() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated || !userId) {
    return NextResponse.json({ success: false, message: "You must sign in." }, { status: 401 });
  }

  const business = await getOrCreateBusinessForUser(userId);
  const readiness = messagingReadiness();

  return NextResponse.json({
    success: true,
    provider: "twilio",
    ...readiness,
    testNumber: readiness.testNumber
      ? `•••${readiness.testNumber.slice(-4)}`
      : null,
    inboundWebhook: `/api/messaging/twilio/inbound/${business.id}`,
    statusWebhook: "/api/messaging/twilio/status",
  });
}

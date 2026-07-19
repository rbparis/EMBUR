import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateBusinessForUser } from "@/lib/currentBusiness";
import { findCustomerForBusiness } from "@/repositories/customerRepository";

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

  const message = await prisma.conversation.create({
    data: {
      businessId: business.id,
      customerId,
      channel: body.channel === "email" ? "email" : "sms",
      direction: "outbound",
      body: messageBody,
      status: "queued",
    },
  });

  await prisma.customer.update({ where: { id: customerId }, data: { status: customer.status === "new" ? "contacted" : customer.status } });
  return NextResponse.json({ success: true, message }, { status: 201 });
}

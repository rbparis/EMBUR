import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateBusinessForUser } from "@/lib/currentBusiness";
import {
  deleteCustomerForBusiness,
  findCustomerForBusiness,
  updateCustomerForBusiness,
} from "@/repositories/customerRepository";

const allowedStatuses = new Set([
  "new", "waiting", "contacted", "follow_up", "booked",
  "completed", "invoiced", "paid", "lost",
]);

async function context(customerId: string) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return { error: "You must sign in.", status: 401 } as const;
  if (!userId) return { error: "Sign in first.", status: 409 } as const;
  const business = await getOrCreateBusinessForUser(userId);
  const customer = await findCustomerForBusiness(business.id, customerId);
  if (!customer) return { error: "Customer not found.", status: 404 } as const;
  return { business, customer } as const;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  const result = await context(customerId);
  if ("error" in result) return NextResponse.json({ success: false, message: result.error }, { status: result.status });
  return NextResponse.json({ success: true, customer: result.customer });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  const result = await context(customerId);
  if ("error" in result) return NextResponse.json({ success: false, message: result.error }, { status: result.status });

  const body = (await request.json()) as Record<string, unknown>;
  const status = typeof body.status === "string" ? body.status : undefined;
  if (status && !allowedStatuses.has(status)) {
    return NextResponse.json({ success: false, message: "Invalid workflow status." }, { status: 400 });
  }

  const estimated = body.estimatedValue === undefined ? undefined : Number(body.estimatedValue);
  const updated = await updateCustomerForBusiness(result.business.id, customerId, {
    name: typeof body.name === "string" ? body.name.trim() : undefined,
    phone: typeof body.phone === "string" ? body.phone.trim() || null : undefined,
    email: typeof body.email === "string" ? body.email.trim() || null : undefined,
    address: typeof body.address === "string" ? body.address.trim() || null : undefined,
    service: typeof body.service === "string" ? body.service.trim() || null : undefined,
    status,
    estimatedValue: estimated === undefined ? undefined : Number.isFinite(estimated) ? Math.max(0, Math.round(estimated)) : null,
  });

  return NextResponse.json({ success: true, customer: updated });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  const result = await context(customerId);
  if ("error" in result) return NextResponse.json({ success: false, message: result.error }, { status: result.status });
  await deleteCustomerForBusiness(result.business.id, customerId);
  return NextResponse.json({ success: true });
}

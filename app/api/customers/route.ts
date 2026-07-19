import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateBusinessForUser } from "@/lib/currentBusiness";
import {
  createCustomerForBusiness,
  findCustomersForBusiness,
} from "@/repositories/customerRepository";

function money(value: number | null) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function toViewModel(customer: Awaited<ReturnType<typeof findCustomersForBusiness>>[number]) {
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    service: customer.service?.trim() || "Service request",
    status: customer.status,
    value: money(customer.estimatedValue),
    estimatedValue: customer.estimatedValue ?? 0,
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
  };
}

async function getBusiness() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return { error: "You must sign in.", status: 401 } as const;
  if (!userId) return { error: "Sign in first.", status: 409 } as const;
  return { business: await getOrCreateBusinessForUser(userId) } as const;
}

export async function GET() {
  const context = await getBusiness();
  if ("error" in context) {
    return NextResponse.json({ success: false, customers: [], message: context.error }, { status: context.status });
  }

  const customers = await findCustomersForBusiness(context.business.id);
  return NextResponse.json({ success: true, customers: customers.map(toViewModel) });
}

export async function POST(request: NextRequest) {
  const context = await getBusiness();
  if ("error" in context) {
    return NextResponse.json({ success: false, message: context.error }, { status: context.status });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ success: false, message: "Customer name is required." }, { status: 400 });
  }

  const estimatedValue = Number(body.estimatedValue ?? 0);
  const customer = await createCustomerForBusiness(context.business.id, {
    name,
    phone: typeof body.phone === "string" ? body.phone.trim() : null,
    email: typeof body.email === "string" ? body.email.trim() : null,
    address: typeof body.address === "string" ? body.address.trim() : null,
    service: typeof body.service === "string" ? body.service.trim() : null,
    estimatedValue: Number.isFinite(estimatedValue) ? Math.max(0, Math.round(estimatedValue)) : 0,
  });

  return NextResponse.json({ success: true, customer: {
    ...customer,
    value: money(customer.estimatedValue),
    estimatedValue: customer.estimatedValue ?? 0,
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
  } }, { status: 201 });
}

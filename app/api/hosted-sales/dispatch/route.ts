import { NextResponse } from "next/server";
import { dispatchHostedSales } from "@/lib/hosted-sales/dispatcher.server";
import { EMBUR_INTERNAL_BUSINESS_ID } from "@/lib/internalWorkspace";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }
  const tenant = await prisma.business.findUnique({ where: { id: EMBUR_INTERNAL_BUSINESS_ID }, select: { id: true } });
  if (!tenant) return NextResponse.json({ success: true, status: "tenant_missing" });
  const result = await dispatchHostedSales(tenant.id);
  return NextResponse.json({ success: result.status !== "failed", tenantId: tenant.id, accountMode: "founder", ...result }, { status: result.status === "failed" ? 500 : 200 });
}

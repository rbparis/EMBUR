import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.business.count();
    return NextResponse.json({ status: "ok", service: "embur", database: "connected", timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "degraded", service: "embur", database: "unavailable", timestamp: new Date().toISOString() }, { status: 503 });
  }
}

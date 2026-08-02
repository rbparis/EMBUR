import { NextResponse } from "next/server";
import { EMBUR_INTERNAL_BUSINESS_ID } from "@/lib/internalWorkspace";
import { recordMetricEvent } from "@/lib/metrics.server";

export const runtime = "nodejs";

const publicEvents = new Set(["landing_view", "pricing_view", "cta_click"]);

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;
  if (origin && origin !== requestOrigin) {
    return NextResponse.json({ success: false }, { status: 403 });
  }

  const body = (await request.json()) as {
    event?: string;
    visitorId?: string;
    path?: string;
    label?: string;
  };
  if (!body.event || !publicEvents.has(body.event)) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
  if (!body.visitorId || !/^[a-zA-Z0-9-]{16,80}$/.test(body.visitorId)) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  await recordMetricEvent({
    tenantId: EMBUR_INTERNAL_BUSINESS_ID,
    accountMode: "founder",
    event: body.event,
    source: "marketing_site",
    visitorId: body.visitorId,
    path: (body.path || "/").slice(0, 300),
    metadata: body.label ? { label: body.label.slice(0, 120) } : undefined,
  });

  return NextResponse.json({ success: true });
}

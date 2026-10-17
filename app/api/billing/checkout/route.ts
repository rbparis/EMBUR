import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    { success: false, message: "Paid checkout is paused while EMBUR is in early access." },
    { status: 403 }
  );
}

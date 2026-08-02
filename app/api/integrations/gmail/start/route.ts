import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getAuthenticatedFounder } from "@/lib/founderAccess.server";

export const runtime = "nodejs";

const redirectUri = "https://getembur.com/api/integrations/gmail/callback";

export async function GET() {
  const founder = await getAuthenticatedFounder();
  if (!founder) {
    return NextResponse.json({ error: "Founder access required." }, { status: 403 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  if (!clientId) {
    return NextResponse.json({ error: "Google OAuth is not configured." }, { status: 503 });
  }

  const state = randomBytes(32).toString("base64url");
  const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", "https://www.googleapis.com/auth/gmail.modify");
  authorizationUrl.searchParams.set("access_type", "offline");
  authorizationUrl.searchParams.set("prompt", "consent");
  authorizationUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set("embur_gmail_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/integrations/gmail/callback",
    maxAge: 600,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

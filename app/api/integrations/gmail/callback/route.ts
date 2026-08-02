import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedFounder } from "@/lib/founderAccess.server";

export const runtime = "nodejs";

const redirectUri = "https://getembur.com/api/integrations/gmail/callback";

function html(message: string, status = 200) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>EMBUR Gmail</title></head><body style="font-family:system-ui;max-width:720px;margin:64px auto;padding:0 24px;background:#07152f;color:#fff"><h1>EMBUR Gmail</h1>${message}</body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store, max-age=0" } },
  );
}

function clearState(response: NextResponse) {
  response.cookies.set("embur_gmail_oauth_state", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/integrations/gmail/callback",
    maxAge: 0,
  });
  return response;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

export async function GET(request: NextRequest) {
  const founder = await getAuthenticatedFounder();
  if (!founder) return html("<p>Founder access is required.</p>", 403);

  const expectedState = request.cookies.get("embur_gmail_oauth_state")?.value;
  const state = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");
  const oauthError = request.nextUrl.searchParams.get("error");
  if (oauthError) return clearState(html(`<p>Google authorization failed: ${escapeHtml(oauthError)}</p>`, 400));
  if (!expectedState || !state || expectedState !== state || !code) {
    return clearState(html("<p>OAuth state validation failed. Start the connection again from EMBUR.</p>", 400));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return clearState(html("<p>Google OAuth is not configured.</p>", 503));

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, code, grant_type: "authorization_code", redirect_uri: redirectUri }),
    cache: "no-store",
  });
  const token = (await tokenResponse.json()) as { refresh_token?: string; error?: string; error_description?: string };
  if (!tokenResponse.ok || !token.refresh_token) {
    const detail = token.error_description || token.error || "Google did not return a refresh token.";
    return clearState(html(`<p>Token exchange failed: ${escapeHtml(detail)}</p>`, 502));
  }

  return clearState(html(`<p>Authorization succeeded. Copy this one-time refresh token into Vercel as <strong>GOOGLE_REFRESH_TOKEN</strong>, then close this page.</p><input aria-label="Google refresh token" readonly type="password" value="${escapeHtml(token.refresh_token)}" style="width:100%;padding:12px"><p>No email was sent.</p>`));
}

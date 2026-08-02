import { billingPlans } from "@/lib/billing/plans";
import { messagingReadiness } from "@/lib/messaging/twilio";

const clean = (value: string | undefined) => Boolean(value?.trim());

export function providerReadiness() {
  const stripePrices = Object.keys(billingPlans).map((plan) => ({
    plan,
    configured: clean(process.env[`STRIPE_${plan.toUpperCase()}_PRICE_ID`]),
  }));
  const gmailConfigured = clean(process.env.GOOGLE_CLIENT_ID) && clean(process.env.GOOGLE_CLIENT_SECRET) && clean(process.env.GOOGLE_REFRESH_TOKEN);
  return {
    gmail: { status: gmailConfigured ? "configured_unverified" : "not_connected", configured: gmailConfigured },
    twilio: messagingReadiness(),
    stripe: { secretConfigured: clean(process.env.STRIPE_SECRET_KEY), webhookConfigured: clean(process.env.STRIPE_WEBHOOK_SECRET), prices: stripePrices },
  };
}

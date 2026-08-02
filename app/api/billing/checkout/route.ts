import { NextResponse } from "next/server";
import {
  auth,
  currentUser,
} from "@clerk/nextjs/server";
import { getStripe } from "@/lib/stripe";
import { getClientWorkspaceForUser } from "@/lib/clientWorkspace.server";
import {
  billingPlans,
  isBillingPlanId,
} from "@/lib/billing/plans";
import { metricEventKey, recordMetricEvent } from "@/lib/metrics.server";

function getStripePriceId(
  planId: keyof typeof billingPlans
) {
  const priceIds = {
    copper:
      process.env.STRIPE_COPPER_PRICE_ID ??
      process.env.STRIPE_PRO_PRICE_ID,
    silver:
      process.env.STRIPE_SILVER_PRICE_ID ??
      process.env.STRIPE_GROWTH_PRICE_ID,
    gold:
      process.env.STRIPE_GOLD_PRICE_ID ??
      process.env.STRIPE_ELITE_PRICE_ID,
    diamond: process.env.STRIPE_DIAMOND_PRICE_ID,
    platinum: process.env.STRIPE_PLATINUM_PRICE_ID,
  };

  return priceIds[planId];
}

export async function POST(request: Request) {
  const {
    isAuthenticated,
    userId,
  } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json(
      {
        success: false,
        message: "You must sign in.",
      },
      {
        status: 401,
      }
    );
  }

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Sign in before starting billing.",
      },
      {
        status: 409,
      }
    );
  }

  const body = (await request.json()) as {
    planId?: string;
  };

  if (
    !body.planId ||
    !isBillingPlanId(body.planId)
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Select a valid EMBUR plan.",
      },
      {
        status: 400,
      }
    );
  }

  const plan = billingPlans[body.planId];
  const priceId = getStripePriceId(body.planId);
  const appUrl = process.env.APP_URL;

  if (!priceId || !appUrl) {
    return NextResponse.json(
      {
        success: false,
        message:
          `${plan.name} has not been configured in Stripe yet.`,
      },
      {
        status: 500,
      }
    );
  }

  try {
    const stripe = getStripe();

    const { business, mode } = await getClientWorkspaceForUser(userId);

    const user = await currentUser();

    const email =
      user?.primaryEmailAddress?.emailAddress;

    const session =
      await stripe.checkout.sessions.create({
        mode: "subscription",

        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],

        success_url:
          `${appUrl}/app/billing/success` +
          "?session_id={CHECKOUT_SESSION_ID}",

        cancel_url:
          `${appUrl}/app/billing` +
          `?plan=${body.planId}&canceled=true`,

        client_reference_id: business.id,

        customer_email: email,

        metadata: {
          businessId: business.id,
          planId: body.planId,
        },

        subscription_data: {
          metadata: {
            businessId: business.id,
            planId: body.planId,
          },
        },

        allow_promotion_codes: true,
      });

    if (!session.url) {
      throw new Error(
        "Stripe did not return a Checkout URL."
      );
    }

    await recordMetricEvent({
      tenantId: business.id,
      accountMode: mode,
      externalId: metricEventKey("checkout_start", session.id),
      event: "checkout_start",
      source: "stripe_checkout",
      path: "/app/billing",
      metadata: { planId: body.planId },
    });

    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error(
      "Failed to create Stripe Checkout Session:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Checkout could not be started.",
      },
      {
        status: 500,
      }
    );
  }
}

import { NextResponse } from "next/server";
import {
  auth,
  currentUser,
} from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { getOrCreateBusinessForOrganization } from "@/lib/currentBusiness";
import {
  billingPlans,
  isBillingPlanId,
} from "@/lib/billing/plans";

function getStripePriceId(
  planId: keyof typeof billingPlans
) {
  const priceIds = {
    pro: process.env.STRIPE_PRO_PRICE_ID,
    growth: process.env.STRIPE_GROWTH_PRICE_ID,
    elite: process.env.STRIPE_ELITE_PRICE_ID,
  };

  return priceIds[planId];
}

export async function POST(request: Request) {
  const {
    isAuthenticated,
    orgId,
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

  if (!orgId) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Select a company before starting billing.",
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
          `${plan.name} has not been configured in Stripe.`,
      },
      {
        status: 500,
      }
    );
  }

  try {
    const business =
      await getOrCreateBusinessForOrganization(
        orgId
      );

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
          clerkOrganizationId: orgId,
          planId: body.planId,
          planName: plan.name,
        },

        subscription_data: {
          metadata: {
            businessId: business.id,
            clerkOrganizationId: orgId,
            planId: body.planId,
            planName: plan.name,
          },
        },

        allow_promotion_codes: true,
      });

    if (!session.url) {
      throw new Error(
        "Stripe did not return a Checkout URL."
      );
    }

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
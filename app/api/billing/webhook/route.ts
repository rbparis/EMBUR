import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import {
  normalizeBillingPlanId,
  type BillingPlanId,
} from "@/lib/billing/plans";
import { EMBUR_INTERNAL_BUSINESS_ID } from "@/lib/internalWorkspace";
import { metricEventKey, recordMetricEvent } from "@/lib/metrics.server";

export const runtime = "nodejs";

type StripeObjectWithId =
  | Stripe.Customer
  | Stripe.DeletedCustomer
  | Stripe.Subscription;

function getStripeId(
  value: string | StripeObjectWithId | null
) {
  if (!value) {
    return null;
  }

  return typeof value === "string"
    ? value
    : value.id;
}

function getPlanId(
  value: string | null | undefined
): BillingPlanId | null {
  return normalizeBillingPlanId(value);
}

function getCurrentPeriodEndsAt(
  subscription: Stripe.Subscription
) {
  const periodEnd =
    subscription.items.data[0]?.current_period_end;

  return periodEnd
    ? new Date(periodEnd * 1000)
    : null;
}

async function recordStripeMetric({
  event,
  metric,
  businessId,
  metadata,
}: {
  event: Stripe.Event;
  metric: string;
  businessId?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  if (!businessId || businessId === EMBUR_INTERNAL_BUSINESS_ID) {
    throw new Error("Stripe event is missing a valid client tenant.");
  }
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { id: true },
  });
  if (!business) {
    throw new Error("Stripe event references an unknown client tenant.");
  }
  await recordMetricEvent({
    tenantId: business.id,
    accountMode: "client",
    externalId: metricEventKey("stripe_webhook", event.id),
    event: metric,
    source: "stripe_webhook",
    metadata,
  });
}

async function syncSubscription(
  subscription: Stripe.Subscription
) {
  const businessId =
    subscription.metadata.businessId;

  const subscriptionPlan = getPlanId(
    subscription.metadata.planId
  );

  const stripeCustomerId = getStripeId(
    subscription.customer
  );

  const updateData = {
    stripeCustomerId,
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    currentPeriodEndsAt:
      getCurrentPeriodEndsAt(subscription),
    ...(subscriptionPlan
      ? { subscriptionPlan }
      : {}),
  };

  if (businessId) {
    await prisma.business.updateMany({
      where: {
        id: businessId,
      },
      data: updateData,
    });

    return;
  }

  if (stripeCustomerId) {
    await prisma.business.updateMany({
      where: {
        stripeCustomerId,
      },
      data: updateData,
    });
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get(
    "stripe-signature"
  );

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      {
        received: false,
        message:
          "Stripe webhook configuration is missing.",
      },
      {
        status: 400,
      }
    );
  }

  const payload = await request.text();

  let event: Stripe.Event;

  try {
    const stripe = getStripe();

    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error
    );

    return NextResponse.json(
      {
        received: false,
        message: "Invalid Stripe signature.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const stripe = getStripe();

    switch (event.type) {
      case "checkout.session.completed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        const businessId =
          session.metadata?.businessId ??
          session.client_reference_id;

        const subscriptionPlan = getPlanId(
          session.metadata?.planId
        );

        const stripeCustomerId = getStripeId(
          session.customer
        );

        const stripeSubscriptionId = getStripeId(
          session.subscription
        );

        if (!businessId || businessId === EMBUR_INTERNAL_BUSINESS_ID) {
          throw new Error("Checkout completion is missing a valid client tenant.");
        }

        const updated = await prisma.business.updateMany({
            where: { id: businessId },
            data: {
              stripeCustomerId,
              stripeSubscriptionId,
              subscriptionStatus:
                session.payment_status === "paid"
                  ? "active"
                  : "processing",
              ...(subscriptionPlan
                ? { subscriptionPlan }
                : {}),
            },
          });
        if (updated.count !== 1) {
          throw new Error("Checkout completion references an unknown client tenant.");
        }

        if (stripeSubscriptionId) {
          const subscription =
            await stripe.subscriptions.retrieve(
              stripeSubscriptionId
            );

          await syncSubscription(subscription);
        }

        if (session.payment_status === "paid") {
          await recordStripeMetric({
            event,
            metric: "subscription_success",
            businessId,
            metadata: {
              planId: subscriptionPlan,
              paid: true,
            },
          });
        }

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await recordStripeMetric({
          event,
          metric: "checkout_expired",
          businessId: session.metadata?.businessId ?? session.client_reference_id,
          metadata: { planId: session.metadata?.planId ?? null },
        });
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription =
          event.data.object as Stripe.Subscription;

        await syncSubscription(subscription);

        break;
      }

      case "invoice.payment_failed": {
        const invoice =
          event.data.object as Stripe.Invoice;

        const stripeCustomerId = getStripeId(
          invoice.customer
        );

        if (stripeCustomerId) {
          await prisma.business.updateMany({
            where: {
              stripeCustomerId,
            },
            data: {
              subscriptionStatus: "past_due",
            },
          });
        }

        const business = stripeCustomerId
          ? await prisma.business.findUnique({
              where: { stripeCustomerId },
              select: { id: true },
            })
          : null;
        await recordStripeMetric({
          event,
          metric: "payment_failed",
          businessId: business?.id,
        });

        break;
      }

      default:
        console.log(
          `Unhandled Stripe event: ${event.type}`
        );
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      `Failed to process Stripe event ${event.type}:`,
      error
    );

    return NextResponse.json(
      {
        received: false,
        message:
          "Stripe event processing failed.",
      },
      {
        status: 500,
      }
    );
  }
}

import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (stripeClient) {
    return stripeClient;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY in the environment."
    );
  }

  stripeClient = new Stripe(secretKey);

  return stripeClient;
}

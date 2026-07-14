export const billingPlans = {
  pro: {
    id: "pro",
    name: "EMBUR Pro",
    price: 99,
    description:
      "Core intelligence and customer opportunity management for small service businesses.",
    features: [
      "Private company workspace",
      "Atlas Morning Brief",
      "Customer opportunity ranking",
      "Customer and conversation tracking",
      "Business Pulse",
      "Time Returned tracking",
    ],
  },

  growth: {
    id: "growth",
    name: "EMBUR Growth",
    price: 199,
    description:
      "Deeper automation and operational visibility for growing service teams.",
    features: [
      "Everything in Pro",
      "Multiple team members",
      "Advanced Atlas recommendations",
      "Automated customer follow-up",
      "Appointment support",
      "Revenue-risk reporting",
    ],
  },

  elite: {
    id: "elite",
    name: "EMBUR Elite",
    price: 399,
    description:
      "Advanced intelligence, automation, and support for established businesses.",
    features: [
      "Everything in Growth",
      "Multiple locations",
      "Advanced business analytics",
      "Priority automation workflows",
      "Premium integrations",
      "Priority support",
    ],
  },
} as const;

export type BillingPlanId =
  keyof typeof billingPlans;

export function isBillingPlanId(
  value: string
): value is BillingPlanId {
  return value in billingPlans;
}
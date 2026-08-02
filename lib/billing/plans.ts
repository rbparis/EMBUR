export const billingPlans = {
  copper: {
    id: "copper",
    name: "Copper",
    price: 99,
    promise: "Answer more. Book more.",
    description:
      "Essential opportunity capture and daily clarity for an owner getting control of follow-up.",
    features: [
      "Call Agent and Booking Agent",
      "After-hours call and lead capture",
      "Every opportunity in one place",
      "Customer and conversation tracking",
      "Opportunity priority ranking",
      "Recovered revenue and time tracking",
    ],
  },

  silver: {
    id: "silver",
    name: "Silver",
    price: 199,
    promise: "Bring customers back.",
    description:
      "Automated follow-up and relationship care for a service business ready to grow consistently.",
    features: [
      "Everything in Copper",
      "Follow-Up Agent",
      "Relationship Agent",
      "Birthday, holiday, weather, and thank-you messages",
      "Message templates with Atlas guidance",
      "Multi-user team access",
    ],
  },

  gold: {
    id: "gold",
    name: "Gold",
    price: 399,
    promise: "Turn trust into growth.",
    description:
      "A complete customer growth system with campaigns, referrals, and deeper operating intelligence.",
    features: [
      "Everything in Silver",
      "Referral Agent and Reputation Agent",
      "Campaign and Video template studio",
      "Repeat-business and referral tracking",
      "Customer segments and campaign analytics",
      "Multi-location reporting",
    ],
  },

  diamond: {
    id: "diamond",
    name: "Diamond",
    price: 799,
    promise: "Build demand while you work.",
    description:
      "Advanced creative, traffic, offers, and campaign management for a business ready to scale demand.",
    features: [
      "Everything in Gold",
      "Video Agent and Traffic Agent",
      "Paid-ad creative and campaign management",
      "Offers, landing pages, and call tracking",
      "Weekly growth plan and performance brief",
      "Owner approval before any campaign or spend",
      "Priority growth support",
    ],
    note: "Advertising spend is separate and always controlled by the owner.",
  },

  platinum: {
    id: "platinum",
    name: "Platinum",
    price: 999,
    promise: "Your managed growth office.",
    description:
      "A managed agent team that prepares outreach, content, search growth, reputation, referrals, and advertising with owner approval.",
    features: [
      "Everything in Gold",
      "Everything in Diamond",
      "Managed Growth Office with Atlas oversight",
      "Outreach, Social, SEO, Video, and Traffic Agents",
      "Paid-ad creative and campaign management",
      "Offers, landing pages, reputation, and referral campaigns",
      "Daily priorities and weekly performance brief",
      "Owner approval before any campaign or spend",
      "Priority onboarding and managed growth support",
    ],
    note: "Advertising spend is separate and always controlled by the owner.",
  },
} as const;

export type BillingPlanId = keyof typeof billingPlans;

export function isBillingPlanId(value: string): value is BillingPlanId {
  return value in billingPlans;
}

const legacyPlanAliases: Record<string, BillingPlanId> = {
  pro: "copper",
  growth: "silver",
  elite: "gold",
};

export function normalizeBillingPlanId(value: string | null | undefined): BillingPlanId | null {
  if (!value) return null;
  if (isBillingPlanId(value)) return value;
  return legacyPlanAliases[value] ?? null;
}

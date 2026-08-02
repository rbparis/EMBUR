export const monthlyMrrTargets = [
  { month: 1, target: 3000 },
  { month: 2, target: 6000 },
  { month: 3, target: 9000 },
] as const;

export const agentDailyQuotas = {
  atlas: { label: "Founder brief", target: 1 },
  scout: { label: "Qualified prospects", target: 50 },
  verifier: { label: "Verified prospects", target: 25 },
  hunter: { label: "New conversations", target: 25 },
  closer: { label: "Close decisions", target: 5 },
  launch: { label: "Onboarding reviews", target: 3 },
  keeper: { label: "Customer health reviews", target: 5 },
  relay: { label: "Follow-ups", target: 15 },
  pulse: { label: "Posts + conversations", target: 11 },
  rank: { label: "SEO articles weekly", target: 3 },
} as const;

export const sellablePlans = {
  copper: 99,
  silver: 199,
  gold: 399,
  diamond: 799,
  platinum: 999,
} as const;

export type SellablePlan = keyof typeof sellablePlans;

export function isSellablePlan(value: unknown): value is SellablePlan {
  return typeof value === "string" && value in sellablePlans;
}

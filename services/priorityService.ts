import type { Lead } from "@/types";

export type PriorityCustomer = Lead & {
  priorityScore: number;
};

function calculatePriorityScore(customer: Lead): number {
  let score = 0;

  // Waiting status
  switch (customer.status) {
    case "Waiting":
      score += 35;
      break;

    case "Follow-up Sent":
      score += 20;
      break;

    case "Booked":
      score += 5;
      break;
  }

  // Emergency keywords
  const emergencyKeywords = [
    "emergency",
    "no cooling",
    "no heat",
    "water leak",
    "electrical",
  ];

  const service = customer.service.toLowerCase();

  if (
    emergencyKeywords.some((keyword) =>
      service.includes(keyword)
    )
  ) {
    score += 25;
  }

  // Estimated opportunity
  if (customer.value >= 1000) {
    score += 20;
  } else if (customer.value >= 500) {
    score += 10;
  }

  // New lead bonus
  if (customer.isNew) {
    score += 10;
  }

  // Manual priority
  if (customer.priority === "High") {
    score += 10;
  }

  return score;
}

export function rankCustomers(
  customers: Lead[]
): PriorityCustomer[] {
  return [...customers]
    .map((customer) => ({
      ...customer,
      priorityScore: calculatePriorityScore(customer),
    }))
    .sort(
      (a, b) => b.priorityScore - a.priorityScore
    );
}

export function getHighestPriorityCustomer(
  customers: Lead[]
): PriorityCustomer | null {
  const ranked = rankCustomers(customers);

  return ranked.length ? ranked[0] : null;
}
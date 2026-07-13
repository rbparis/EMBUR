import type { Lead } from "@/types";
import {
  getHighestPriorityCustomer,
  type PriorityCustomer,
} from "@/services/priorityService";

export type AtlasHealthStatus =
  | "excellent"
  | "healthy"
  | "busy"
  | "attention";

export type AtlasBrief = {
  ownerName: string;
  summary: string;
  recoveredRevenue: number;
  timeReturnedMinutes: number;
  businessHealth: {
    score: number;
    status: AtlasHealthStatus;
    label: string;
    explanation: string;
  };
  recommendation: {
    customer: PriorityCustomer | null;
    action: string;
    reason: string;
    confidence: number;
    estimatedValue: number;
    signals: string[];
  };
};

type BuildAtlasBriefInput = {
  customers: Lead[];
  ownerName?: string;
  recoveredRevenue?: number;
  timeReturnedMinutes?: number;
};

function parseOpportunityValue(value: Lead["value"]): number {
  if (typeof value === "number") {
    return value;
  }

  const parsedValue = Number(
    String(value).replace(/[^0-9.-]+/g, "")
  );

  return Number.isFinite(parsedValue)
    ? Math.max(parsedValue, 0)
    : 0;
}

function calculateRecoveredRevenue(customers: Lead[]): number {
  return customers
    .filter((customer) =>
      String(customer.status)
        .toLowerCase()
        .includes("booked")
    )
    .reduce(
      (total, customer) =>
        total + parseOpportunityValue(customer.value),
      0
    );
}

function calculateBusinessHealth(customers: Lead[]) {
  if (customers.length === 0) {
    return {
      score: 100,
      status: "excellent" as const,
      label: "Excellent",
      explanation:
        "There are no open customer issues requiring attention.",
    };
  }

  const waitingCustomers = customers.filter((customer) =>
    String(customer.status)
      .toLowerCase()
      .includes("waiting")
  ).length;

  const bookedCustomers = customers.filter((customer) =>
    String(customer.status)
      .toLowerCase()
      .includes("booked")
  ).length;

  const followUps = customers.filter((customer) =>
    String(customer.status)
      .toLowerCase()
      .includes("follow")
  ).length;

  let score = 100;

  score -= waitingCustomers * 14;
  score -= followUps * 5;
  score += bookedCustomers * 3;

  const normalizedScore = Math.max(
    0,
    Math.min(100, Math.round(score))
  );

  if (normalizedScore >= 90) {
    return {
      score: normalizedScore,
      status: "excellent" as const,
      label: "Excellent",
      explanation:
        "The business is moving well and customer workload is under control.",
    };
  }

  if (normalizedScore >= 75) {
    return {
      score: normalizedScore,
      status: "healthy" as const,
      label: "Healthy",
      explanation:
        "The business is in good shape with only a small number of items needing attention.",
    };
  }

  if (normalizedScore >= 55) {
    return {
      score: normalizedScore,
      status: "busy" as const,
      label: "Busy",
      explanation:
        "Customer demand is increasing. Clearing today’s priority will help keep the day controlled.",
    };
  }

  return {
    score: normalizedScore,
    status: "attention" as const,
    label: "Needs Attention",
    explanation:
      "Several customer opportunities require attention before the workload grows.",
  };
}

function getRecommendationSignals(
  customer: PriorityCustomer
): string[] {
  const signals: string[] = [];
  const service = customer.service.toLowerCase();
  const status = String(customer.status).toLowerCase();
  const estimatedValue = parseOpportunityValue(customer.value);

  if (
    service.includes("emergency") ||
    service.includes("no cooling") ||
    service.includes("no heat") ||
    service.includes("leak")
  ) {
    signals.push("Urgent service need");
  }

  if (status.includes("waiting")) {
    signals.push("Customer is waiting");
  }

  if (estimatedValue >= 1000) {
    signals.push("Strong revenue opportunity");
  }

  if (status.includes("follow")) {
    signals.push("Follow-up is still active");
  }

  if (signals.length === 0) {
    signals.push("Highest-impact open opportunity");
  }

  return signals;
}

function calculateConfidence(
  customer: PriorityCustomer | null
): number {
  if (!customer) {
    return 100;
  }

  return Math.max(
    70,
    Math.min(
      98,
      Math.round(68 + customer.priorityScore * 0.32)
    )
  );
}

export function buildAtlasBrief({
  customers,
  ownerName = "Mike",
  recoveredRevenue,
  timeReturnedMinutes = 138,
}: BuildAtlasBriefInput): AtlasBrief {
  const topCustomer =
    getHighestPriorityCustomer(customers);

  const businessHealth =
    calculateBusinessHealth(customers);

  const calculatedRevenue =
    recoveredRevenue ??
    calculateRecoveredRevenue(customers);

  if (!topCustomer) {
    return {
      ownerName,
      summary:
        "You are caught up. EMBUR will continue watching the business.",
      recoveredRevenue: calculatedRevenue,
      timeReturnedMinutes,
      businessHealth,
      recommendation: {
        customer: null,
        action: "No immediate action required",
        reason:
          "There are currently no customer opportunities requiring your personal attention.",
        confidence: 100,
        estimatedValue: 0,
        signals: ["Everything is under control"],
      },
    };
  }

  return {
    ownerName,
    summary:
      "One customer deserves your attention. Everything else is under control.",
    recoveredRevenue: calculatedRevenue,
    timeReturnedMinutes,
    businessHealth,
    recommendation: {
      customer: topCustomer,
      action: `Call ${topCustomer.name}`,
      reason: topCustomer.priorityReason,
      confidence: calculateConfidence(topCustomer),
      estimatedValue: parseOpportunityValue(
        topCustomer.value
      ),
      signals: getRecommendationSignals(topCustomer),
    },
  };
}

export function formatAtlasCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatReturnedTime(
  totalMinutes: number
): string {
  const safeMinutes = Math.max(
    0,
    Math.round(totalMinutes)
  );

  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}
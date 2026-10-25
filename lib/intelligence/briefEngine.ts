import { viewerGreeting } from "./viewerGreeting";
import type { AtlasMemory } from "./memory/types";
import { normalizeAtlasMemory } from "./memory/memoryEngine";
import type { AtlasSnapshot } from "./types";

export type AtlasExecutiveBrief = {
  greeting: string;
  headline: string;
  summary: string;
  priorityStatement: string;
  riskStatement: string;
  closingStatement: string;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function createAtlasExecutiveBrief(
  snapshot: AtlasSnapshot,
  memory?: AtlasMemory | null,
  viewerTimeZone?: string
): AtlasExecutiveBrief {
  const atlasMemory = normalizeAtlasMemory(memory);

  const actionCount =
    snapshot.metrics.waitingCustomers +
    snapshot.metrics.followUpCustomers;

  const priorityCustomer =
    snapshot.topPriority.customer;

  const greeting = viewerGreeting(atlasMemory.ownerName, viewerTimeZone);

  const headline =
    actionCount === 0
      ? "Your business is under control."
      : `${actionCount} customer action${
          actionCount === 1 ? "" : "s"
        } deserve attention.`;

  const priorityStatement =
    `${snapshot.topPriority.recommendedAction} ` +
    `${priorityCustomer.service || "Their request"} represents approximately ` +
    `${formatCurrency(
      snapshot.topPriority.estimatedValue
    )}.`;

  const riskStatement =
    snapshot.revenueAtRisk > 0
      ? `${formatCurrency(
          snapshot.revenueAtRisk
        )} is currently at risk across waiting and follow-up opportunities.`
      : "No active customer revenue is currently marked at risk.";

  let summary: string;

  if (
    atlasMemory.preferredBriefLength === "short"
  ) {
    summary =
      `${snapshot.businessHealthSummary} ` +
      priorityStatement;
  } else if (
    atlasMemory.preferredBriefLength === "detailed"
  ) {
    summary =
      `${snapshot.businessHealthSummary} ` +
      `Business Health is ${snapshot.businessHealth} out of 100. ` +
      `The active pipeline is ${formatCurrency(
        snapshot.forecast.pipeline
      )}, with expected revenue of ${formatCurrency(
        snapshot.forecast.expectedRevenue
      )}. ` +
      priorityStatement;
  } else {
    summary =
      `${snapshot.businessHealthSummary} ` +
      `The active pipeline is ${formatCurrency(
        snapshot.forecast.pipeline
      )}. ` +
      priorityStatement;
  }

  const closingStatement =
    actionCount === 0
      ? "Everything important is handled."
      : "Complete the first recommendation, then let Atlas guide the next move.";

  return {
    greeting,
    headline,
    summary,
    priorityStatement,
    riskStatement,
    closingStatement,
  };
}
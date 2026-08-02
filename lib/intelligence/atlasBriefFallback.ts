import type { AtlasMemory } from "@/lib/intelligence/memory/types";
import type { AtlasSnapshot } from "@/lib/intelligence/types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function buildDeterministicAtlasBrief(
  snapshot: AtlasSnapshot,
  memory?: AtlasMemory | null
): string {
  const ownerName =
    memory?.ownerName?.trim() || "Owner";

  const topPriority = snapshot.topPriority;
  const customer = topPriority.customer;

  const waitingCustomers =
    snapshot.metrics.waitingCustomers;

  const followUpCustomers =
    snapshot.metrics.followUpCustomers;

  const revenueAtRisk =
    snapshot.revenueAtRisk;

  const expectedRevenue =
    snapshot.forecast.expectedRevenue;

  const firstAction =
    topPriority.recommendedAction?.trim() ||
    `Review ${customer.name}'s request`;

  const reason =
    topPriority.reason?.trim() ||
    "it is currently the highest-priority opportunity";

  const nextStep =
    snapshot.recommendations.length > 1
      ? `After that, Atlas has ${
          snapshot.recommendations.length - 1
        } additional ${
          snapshot.recommendations.length - 1 === 1
            ? "action"
            : "actions"
        } ready for review.`
      : "After that, continue monitoring new customer activity.";

  return [
    `${getGreeting()}, ${ownerName}.`,
    `Your business health is ${snapshot.businessHealth} out of 100.`,
    `${formatCurrency(
      revenueAtRisk
    )} is currently at risk, with ${waitingCustomers} ${
      waitingCustomers === 1
        ? "customer"
        : "customers"
    } waiting and ${followUpCustomers} ${
      followUpCustomers === 1
        ? "follow-up"
        : "follow-ups"
    } ready.`,
    `Your first action is to ${firstAction} for ${customer.name} because ${reason}.`,
    `Atlas estimates this opportunity at ${formatCurrency(
      topPriority.estimatedValue
    )} with ${topPriority.confidence}% confidence.`,
    `${nextStep}`,
    `The current pipeline is expected to produce approximately ${formatCurrency(
      expectedRevenue
    )}.`,
  ].join(" ");
}

export function buildDeterministicAtlasAnswer(
  question: string,
  snapshot: AtlasSnapshot,
  memory?: AtlasMemory | null
): string {
  const normalizedQuestion = question.toLowerCase();
  const priority = snapshot.topPriority;
  const customer = priority.customer;
  const action =
    priority.recommendedAction?.trim() ||
    `review ${customer.name}'s request`;
  const reason =
    priority.reason?.trim() ||
    "it is the highest-value time-sensitive opportunity in the current pipeline";

  if (/revenue|money|risk|lose|loss/.test(normalizedQuestion)) {
    return `${formatCurrency(snapshot.revenueAtRisk)} is currently at risk across ${snapshot.metrics.waitingCustomers} waiting ${snapshot.metrics.waitingCustomers === 1 ? "customer" : "customers"} and ${snapshot.metrics.followUpCustomers} ready ${snapshot.metrics.followUpCustomers === 1 ? "follow-up" : "follow-ups"}. Start with ${customer.name}, a ${formatCurrency(priority.estimatedValue)} opportunity. The best next action is to ${action}.`;
  }

  if (/why|priority|important|customer/.test(normalizedQuestion)) {
    return `${customer.name} is the top priority because ${reason}. Atlas values the opportunity at ${formatCurrency(priority.estimatedValue)} with ${priority.confidence}% confidence and a ${priority.riskLevel} risk level. The recommended next action is to ${action}.`;
  }

  if (/health|doing|performance|status/.test(normalizedQuestion)) {
    return `Business health is ${snapshot.businessHealth} out of 100. ${snapshot.businessHealthSummary} The current pipeline is expected to produce approximately ${formatCurrency(snapshot.forecast.expectedRevenue)}. The most valuable immediate move is to ${action} for ${customer.name}.`;
  }

  if (/forecast|expected|pipeline/.test(normalizedQuestion)) {
    return `The current pipeline is expected to produce approximately ${formatCurrency(snapshot.forecast.expectedRevenue)}, with ${formatCurrency(snapshot.revenueAtRisk)} still at risk. Protect the forecast by acting on ${customer.name} first: ${action}.`;
  }

  if (/first|next|should|today|do/.test(normalizedQuestion)) {
    return `Start with ${customer.name}: ${action}. This is the highest-priority move because ${reason}. The opportunity is worth about ${formatCurrency(priority.estimatedValue)}, and Atlas is ${priority.confidence}% confident in the priority. After that, review the remaining ${Math.max(0, snapshot.recommendations.length - 1)} ready ${snapshot.recommendations.length - 1 === 1 ? "action" : "actions"}.`;
  }

  return buildDeterministicAtlasBrief(snapshot, memory);
}

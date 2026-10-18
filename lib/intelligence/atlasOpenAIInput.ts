// Only explicitly selected scalar fields may cross the OpenAI boundary.
// Free-text values, including question, are not redacted by this allowlist.
type Fields = Record<string, unknown>;

function record(value: unknown): Fields {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Fields
    : {};
}

function pickScalars(value: unknown, fields: readonly string[]): Fields {
  const source = record(value);
  const result: Fields = {};
  for (const field of fields) {
    if (!Object.prototype.hasOwnProperty.call(source, field)) continue;
    const item = source[field];
    if (item === null || typeof item === "string" || typeof item === "boolean" ||
        (typeof item === "number" && Number.isFinite(item))) {
      result[field] = item;
    }
  }
  return result;
}

const forecastFields = ["pipeline", "expectedRevenue", "expectedAppointments"];
const metricFields = ["totalCustomers", "waitingCustomers", "bookedCustomers", "followUpCustomers"];
const priorityFields = ["customerName", "service", "status", "score", "confidence", "riskLevel", "estimatedValue", "reason", "recommendedAction"];
const recommendationFields = ["title", "description", "actionType", "riskLevel", "estimatedValue"];
const memoryFields = ["ownerName", "preferredBriefLength", "preferredCommunication", "emergencyFirst", "preferredStartHour", "averageResponseMinutes"];

function priority(snapshot: Fields) {
  const top = record(snapshot.topPriority);
  const customer = record(top.customer);
  return pickScalars({
    customerName: customer.name,
    service: customer.service,
    status: customer.status,
    score: top.score,
    confidence: top.confidence,
    riskLevel: top.riskLevel,
    estimatedValue: top.estimatedValue,
    reason: top.reason,
    recommendedAction: top.recommendedAction,
  }, priorityFields);
}

function recommendations(snapshot: Fields, includeIds: boolean) {
  if (!Array.isArray(snapshot.recommendations)) return [];
  const fields = includeIds
    ? ["id", "customerId", ...recommendationFields]
    : recommendationFields;
  return snapshot.recommendations.map(item => pickScalars(item, fields));
}

export function buildAtlasBriefOpenAIInput(snapshot: unknown, memory: unknown) {
  const data = record(snapshot);
  const preferences = pickScalars(memory, memoryFields);
  const forecast = pickScalars(data.forecast, forecastFields);
  const metrics = pickScalars(data.metrics, metricFields);
  const ownerName = typeof preferences.ownerName === "string"
    ? preferences.ownerName.trim() || "Owner"
    : "Owner";
  return {
    ownerName,
    preferences: {
      briefLength: preferences.preferredBriefLength ?? "short",
      communication: preferences.preferredCommunication ?? "call",
      emergencyFirst: preferences.emergencyFirst ?? true,
      preferredStartHour: preferences.preferredStartHour ?? 8,
      expectedResponseMinutes: preferences.averageResponseMinutes ?? 15,
    },
    business: {
      ...pickScalars({health: data.businessHealth, healthSummary: data.businessHealthSummary,
        revenueAtRisk: data.revenueAtRisk}, ["health", "healthSummary", "revenueAtRisk"]),
      ...forecast,
      ...metrics,
    },
    topPriority: priority(data),
    recommendations: recommendations(data, false),
  };
}

export function buildAtlasAskOpenAIInput(question: string, snapshot: unknown, memory: unknown) {
  const data = record(snapshot);
  return {
    question: question.trim(),
    ownerPreferences: memory == null ? null : pickScalars(memory, memoryFields),
    businessSnapshot: {
      ...pickScalars(data, ["businessHealth", "businessHealthSummary", "revenueAtRisk"]),
      forecast: pickScalars(data.forecast, forecastFields),
      metrics: pickScalars(data.metrics, metricFields),
      topPriority: priority(data),
      recommendations: recommendations(data, true),
    },
  };
}

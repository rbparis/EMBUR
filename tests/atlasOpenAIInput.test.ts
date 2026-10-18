import assert from "node:assert/strict";
import { test } from "node:test";
import { buildAtlasAskOpenAIInput, buildAtlasBriefOpenAIInput } from "../lib/intelligence/atlasOpenAIInput";

const marker = "UNLISTED_SYNTHETIC_FIELD";
const memory = { ownerName: " Test owner ", preferredBriefLength: "short", preferredCommunication: "call", emergencyFirst: true, preferredStartHour: 8, averageResponseMinutes: 15, extra: marker };
const snapshot = {
  businessHealth: 80, businessHealthSummary: "Synthetic summary", revenueAtRisk: 100,
  forecast: { pipeline: 100, expectedRevenue: 80, expectedAppointments: 1, extra: marker },
  metrics: { totalCustomers: 1, waitingCustomers: 1, bookedCustomers: 0, followUpCustomers: 0, extra: marker },
  topPriority: { customer: { name: "Synthetic customer", service: "HVAC", status: "waiting", email: marker, phone: marker, conversations: [marker] }, score: 90, confidence: 0.8, riskLevel: "high", estimatedValue: 100, reason: "Synthetic reason", recommendedAction: "Review", extra: marker },
  recommendations: [{ id: "synthetic-rec", customerId: "synthetic-customer", title: "Review", description: "Synthetic", actionType: "review", riskLevel: "high", estimatedValue: 100, extra: marker }],
  extra: marker,
};

test("ask strips unlisted fields at every object boundary and preserves question", () => {
  const result = buildAtlasAskOpenAIInput("  Synthetic question  ", snapshot, memory);
  assert.equal(result.question, "Synthetic question");
  assert.ok(!JSON.stringify(result).includes(marker));
  assert.deepEqual(Object.keys(result), ["question", "ownerPreferences", "businessSnapshot"]);
  assert.deepEqual(result.businessSnapshot.forecast, { pipeline: 100, expectedRevenue: 80, expectedAppointments: 1 });
  assert.deepEqual(result.businessSnapshot.metrics, { totalCustomers: 1, waitingCustomers: 1, bookedCustomers: 0, followUpCustomers: 0 });
  assert.equal(result.businessSnapshot.recommendations[0].customerId, "synthetic-customer");
});

test("brief selects fields, omits recommendation IDs and preserves defaults", () => {
  const result = buildAtlasBriefOpenAIInput(snapshot, memory);
  assert.ok(!JSON.stringify(result).includes(marker));
  assert.equal(result.ownerName, "Test owner");
  assert.equal(result.recommendations[0].id, undefined);
  assert.equal(result.recommendations[0].customerId, undefined);
  assert.equal(result.topPriority.customerName, "Synthetic customer");
  assert.deepEqual(buildAtlasBriefOpenAIInput(snapshot, null).preferences, { briefLength: "short", communication: "call", emergencyFirst: true, preferredStartHour: 8, expectedResponseMinutes: 15 });
});

test("objects and arrays smuggled under allowed scalar names are not serialized", () => {
  const injected = { ...snapshot, businessHealth: { extra: marker }, forecast: { pipeline: [marker] }, topPriority: { ...snapshot.topPriority, customer: { name: { extra: marker } } }, recommendations: [{ title: { extra: marker } }] };
  for (const result of [buildAtlasAskOpenAIInput("Synthetic", injected, { ownerName: { extra: marker } }), buildAtlasBriefOpenAIInput(injected, { preferredBriefLength: [marker] })]) {
    assert.ok(!JSON.stringify(result).includes(marker));
  }
});

test("null memory remains null and free text is not redacted", () => {
  const question = "Synthetic inquiry text is still free text.";
  const result = buildAtlasAskOpenAIInput(question, snapshot, null);
  assert.equal(result.ownerPreferences, null);
  assert.equal(result.question, question);
});

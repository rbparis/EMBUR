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

test("question truncates at 1000 and all other allowed strings at 500", () => {
  const long = "x".repeat(501);
  const input = { ...snapshot, businessHealthSummary: long, topPriority: { ...snapshot.topPriority, customer: { name: long, service: long, status: long }, reason: long, recommendedAction: long }, recommendations: [{ ...snapshot.recommendations[0], title: long, description: long, id: long, customerId: long }] };
  const ask = buildAtlasAskOpenAIInput("q".repeat(1001), input, { ...memory, ownerName: long });
  assert.equal(ask.question.length, 1000);
  function check(value: unknown) {
    if (typeof value === "string") assert.ok(value.length <= 500);
    else if (value && typeof value === "object") Object.values(value).forEach(check);
  }
  check(ask.ownerPreferences); check(ask.businessSnapshot);
  check(buildAtlasBriefOpenAIInput(input, { ...memory, ownerName: long }));
  assert.equal((ask.businessSnapshot as Record<string, unknown>).businessHealthSummary, long.slice(0, 500));
});

test("recommendations truncate to ten in both payloads", () => {
  const input = { ...snapshot, recommendations: Array.from({ length: 11 }, () => snapshot.recommendations[0]) };
  assert.equal(buildAtlasAskOpenAIInput("test", input, memory).businessSnapshot.recommendations.length, 10);
  assert.equal(buildAtlasBriefOpenAIInput(input, memory).recommendations.length, 10);
});

test("huge strings truncate without throwing and malformed inputs are safe", () => {
  const huge = "x".repeat(2_000_000);
  assert.equal(buildAtlasAskOpenAIInput(huge, snapshot, null).question.length, 1000);
  assert.equal(buildAtlasBriefOpenAIInput(snapshot, { ownerName: huge }).ownerName.length, 500);
  const bad = new Proxy({}, { get() { throw new Error("synthetic getter"); } });
  assert.doesNotThrow(() => buildAtlasAskOpenAIInput(null, bad, bad));
  assert.doesNotThrow(() => buildAtlasBriefOpenAIInput(bad, bad));
});

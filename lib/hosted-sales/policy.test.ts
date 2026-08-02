import assert from "node:assert/strict";
import test from "node:test";
import { isStale, isSuppressed, retryDelayMs, scheduledKey } from "./policy";

test("scheduled keys lock all invocations in one five-minute window", () => {
  assert.equal(scheduledKey(new Date("2026-08-01T10:04:59Z")), scheduledKey(new Date("2026-08-01T10:00:01Z")));
});
test("retry backoff grows and is capped", () => {
  assert.equal(retryDelayMs(1), 60_000); assert.equal(retryDelayMs(99), 3_600_000);
});
test("stale lease threshold is deterministic", () => {
  assert.equal(isStale(new Date(0), new Date(15 * 60_000)), true);
});
test("suppression is normalized", () => {
  assert.equal(isSuppressed([" Owner@Example.com "], "owner@example.com"), true);
});

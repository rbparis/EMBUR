import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
function route(name: string, env: Record<string, string>) {
  let providerCalls = 0;
  const cache = new Map<string, Record<string, unknown>>();
  function load(file: string): Record<string, unknown> {
    if (cache.has(file)) return cache.get(file)!;
    const module = { exports: {} as Record<string, unknown> };
    cache.set(file, module.exports);
    const code = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    function requireModule(id: string) {
      if (id === "next/server") return { NextResponse: { json: Response.json.bind(Response) } };
      if (id === "@clerk/nextjs/server") return { auth: async () => ({ isAuthenticated: true, userId: "synthetic-test-user" }) };
      if (id === "@/lib/openai") return { getOpenAIClient: () => { providerCalls++; throw new Error("Provider access blocked in offline test"); } };
      if (id.startsWith("@/")) return load(resolve(root, id.slice(2) + ".ts"));
      throw new Error("Unexpected test dependency " + id);
    }
    runInNewContext(code, { exports: module.exports, module, require: requireModule, process: { env }, console, Response, Request, TextDecoder, Uint8Array, Date, Intl });
    return module.exports;
  }
  return { post: load(resolve(root, "app/api/atlas", name, "route.ts")).POST as (r: Request) => Promise<Response>, calls: () => providerCalls };
}
const snapshot = {
  businessHealth: 80, businessHealthSummary: "Synthetic summary", revenueAtRisk: 100,
  forecast: { pipeline: 100, expectedRevenue: 80, expectedAppointments: 1 },
  metrics: { totalCustomers: 1, waitingCustomers: 1, bookedCustomers: 0, followUpCustomers: 0 },
  topPriority: { customer: { name: "Synthetic", service: "HVAC", status: "waiting" }, score: 90, confidence: 80, riskLevel: "high", estimatedValue: 100, reason: "Review", recommendedAction: "Review" }, recommendations: [],
};
for (const name of ["ask", "brief"]) {
  for (const [label, env] of [["missing key", { OPENAI_MODEL: "synthetic-model" }], ["blank model", { OPENAI_API_KEY: "synthetic-not-a-key", OPENAI_MODEL: "" }]] as const) {
    test(`${name}: ${label} uses deterministic response without OpenAI`, async () => {
      const handler = route(name, env);
      const response = await handler.post(new Request("https://example.com", { method: "POST", body: JSON.stringify({ question: "What should I review?", snapshot, memory: null }) }));
      assert.equal(response.status, 200);
      const result = await response.json();
      assert.equal(result.source, name === "ask" ? "deterministic" : "rules");
      assert.ok(result.answer || result.brief);
      assert.equal(handler.calls(), 0);
    });
  }
  test(`${name}: oversized body returns 413 before provider access`, async () => {
    const handler = route(name, { OPENAI_API_KEY: "synthetic-not-a-key", OPENAI_MODEL: "synthetic-model" });
    const response = await handler.post(new Request("https://example.com", { method: "POST", body: JSON.stringify({ text: "x".repeat(51201) }) }));
    assert.equal(response.status, 413);
    assert.equal(handler.calls(), 0);
  });
}

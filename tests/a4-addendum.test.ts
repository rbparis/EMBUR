import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
import { normalizeAtlasMemory } from "../lib/intelligence/memory/memoryEngine";
import { viewerGreeting } from "../lib/intelligence/viewerGreeting";

// Test A is deliberately restricted to this approved list. GetMyTimeBack is not read.
const testAFiles = [
  "components/settings/SettingsScreen.tsx",
  "components/settings/AtlasMemorySettings.tsx",
  "app/api/atlas/memory/route.ts",
  "lib/intelligence/memory/types.ts",
  "lib/intelligence/memory/memoryEngine.ts",
  "lib/intelligence/briefEngine.ts",
  "lib/intelligence/atlasBriefFallback.ts",
  "components/app/AppShellPreview.tsx",
];
const source = (path: string) => readFileSync(path, "utf8");
const parse = (path: string) => ts.createSourceFile(path, source(path), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function nodes(root: ts.Node, match: (node: ts.Node) => boolean): ts.Node[] {
  const found: ts.Node[] = [];
  function visit(node: ts.Node) { if (match(node)) found.push(node); ts.forEachChild(node, visit); }
  visit(root); return found;
}

test("Test A: approved files have no fabricated owner or business defaults", () => {
  for (const path of testAFiles) {
    const literals = nodes(parse(path), ts.isStringLiteral).map(n => (n as ts.StringLiteral).text);
    for (const forbidden of ["Mike", "Owner", "Mike's Heating & Air", "(555) 555-1212"]) {
      assert.ok(!literals.includes(forbidden), `${path}: ${forbidden}`);
    }
  }
  assert.match(source("components/settings/SettingsScreen.tsx"), /placeholder="Business name"/);
  assert.match(source("components/settings/SettingsScreen.tsx"), /placeholder="Business phone number"/);
  assert.match(source("components/settings/AtlasMemorySettings.tsx"), /placeholder="Your name \(optional\)"/);
});

test("blank, missing and whitespace owner names remain blank; saved names survive", () => {
  for (const memory of [undefined, null, {}, { ownerName: null }, { ownerName: "" }, { ownerName: "  " }]) {
    assert.equal(normalizeAtlasMemory(memory).ownerName, "");
  }
  assert.equal(normalizeAtlasMemory({ ownerName: " Alex " }).ownerName, "Alex");
  assert.equal(normalizeAtlasMemory({ ownerName: "Mike" }).ownerName, "Mike");
});

test("greetings use the viewer timezone at the same instant", () => {
  const now = new Date("2026-10-23T16:00:00Z");
  assert.equal(viewerGreeting("", "America/Los_Angeles", now), "Good morning.");
  assert.equal(viewerGreeting(" Alex ", "America/New_York", now), "Good afternoon, Alex.");
  assert.equal(viewerGreeting(null, "Asia/Tokyo", now), "Good morning.");
  assert.equal(viewerGreeting(undefined, "Europe/Paris", now), "Good evening.");
});

test("greetings respect DST and never substitute server time for an absent/invalid zone", () => {
  assert.equal(viewerGreeting("", "America/New_York", new Date("2026-07-01T15:00:00Z")), "Good morning.");
  assert.equal(viewerGreeting("", "America/New_York", new Date("2026-01-01T16:00:00Z")), "Good morning.");
  assert.equal(viewerGreeting("Alex"), "");
  assert.equal(viewerGreeting("Alex", "invalid/timezone"), "");
});

test("non-live switches are disabled, off and labelled Not live", () => {
  const tree = parse("components/settings/SettingsScreen.tsx");
  const switches = nodes(tree, n => ts.isJsxOpeningElement(n) && n.attributes.properties.some(p => ts.isJsxAttribute(p) && p.name.getText() === "role" && p.initializer?.getText() === '"switch"')) as ts.JsxOpeningElement[];
  assert.equal(switches.length, 1);
  const attrs = switches[0].attributes.properties;
  assert.ok(attrs.some(p => ts.isJsxAttribute(p) && p.name.getText() === "disabled" && !p.initializer));
  assert.ok(attrs.some(p => ts.isJsxAttribute(p) && p.name.getText() === "aria-checked" && p.initializer?.getText() === "{false}"));
  assert.ok(!attrs.some(p => ts.isJsxAttribute(p) && p.name.getText() === "onClick"));
  assert.match(tree.text, /Not live/);
  assert.equal(nodes(tree, n => ts.isJsxSelfClosingElement(n) && n.tagName.getText() === "SettingToggle").length, 4);
});

test("privacy includes the approved deletion sentence, mailto and unchanged effective date", () => {
  const text = source("app/privacy/page.tsx");
  assert.match(text, /To make a privacy request, including a request to delete your EMBUR account, email/);
  assert.match(text, /<a href="mailto:getembur@gmail.com"[^>]*>getembur@gmail.com<\/a>\./);
  assert.match(source("components/legal/LegalPage.tsx"), /Effective October 18, 2026/);
  assert.match(text, /We may need to verify your identity and authority before completing a request/);
});

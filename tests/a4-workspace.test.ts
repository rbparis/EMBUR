import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
import { defaultSettings, normalizeLocalDraft, readLocalDraft, saveLocalDraft, storageKey } from "../lib/settings/localDraft";
import { reportedValueTotal } from "../lib/intelligence/reportedOutcomes";
import { saveAtlasAction } from "../services/atlasActionsApi";
import type { AtlasRecommendation } from "../lib/intelligence/types";
const read = (p: string) => readFileSync(p, "utf8");
const paths = ["components/app/AppSidebar.tsx", "components/app/AppHeader.tsx", "components/pages/GrowthPage.tsx", "components/settings/SettingsScreen.tsx", "components/pages/CustomerDetailPage.tsx", "components/pages/ConversationsPage.tsx", "components/atlas/AtlasActionQueue.tsx"];
const legacy = { businessName: "Mike's Heating & Air", businessPhone: "(555) 555-1212", openingTime: "07:00", closingTime: "18:00", afterHoursFollowUp: true, reviewRequests: true, ownerNotifications: true, appointmentConfirmations: true };
function memoryStorage(entries: Record<string, string>) {
  const values = new Map(Object.entries(entries));
  const writes: string[] = [];
  return { values, writes, getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { writes.push(key); values.set(key, value); } };
}

test("section 6A additional signed-in retired phrase guard; fixture and legacy journey excluded", () => {
  for (const path of paths) {
    const text = read(path).replaceAll("’", "'");
    for (const phrase of ["Agents online", "Atlas online", "Approve & send text", "Everything saved", "Mike's Heating & Air"]) assert.ok(!text.toLowerCase().includes(phrase.toLowerCase()), `${path}: ${phrase}`);
  }
});

test("6B legacy true flags normalize off; switches have no handlers", () => {
  const draft = normalizeLocalDraft(legacy);
  for (const key of ["afterHoursFollowUp", "reviewRequests", "ownerNotifications", "appointmentConfirmations"] as const) assert.equal(draft[key], false);
  const text = read("components/settings/SettingsScreen.tsx");
  assert.ok(!text.includes("onToggle") && !text.includes("toggleSetting"));
  assert.match(text, /disabled\s+aria-checked=\{false\}/);
  for (const title of ["After-hours follow-up", "Appointment confirmations", "Review requests", "Priority alerts"]) assert.ok(text.includes(`title="${title} — Not live"`));
});

test("6C untouched legacy sample clears only owned draft; migration is idempotent", () => {
  const store = memoryStorage({ [storageKey]: JSON.stringify(legacy), theme: "dark", clerk: "untouched", atlas: "untouched" });
  assert.deepEqual(readLocalDraft(store), defaultSettings);
  assert.deepEqual(store.writes, [storageKey]);
  assert.equal(store.values.get("theme"), "dark"); assert.equal(store.values.get("clerk"), "untouched"); assert.equal(store.values.get("atlas"), "untouched");
  readLocalDraft(store); assert.equal(store.writes.length, 1);
});

test("6C customized fields/hours survive; sample fields removed independently", () => {
  assert.equal(normalizeLocalDraft({ ...legacy, businessName: "Custom Co" }).businessName, "Custom Co");
  assert.equal(normalizeLocalDraft({ ...legacy, businessName: "Custom Co" }).openingTime, "07:00");
  const draft = normalizeLocalDraft({ ...legacy, businessPhone: "4101234567", openingTime: "09:00" });
  assert.equal(draft.businessName, ""); assert.equal(draft.businessPhone, "4101234567"); assert.equal(draft.openingTime, "09:00"); assert.equal(draft.closingTime, "18:00");
});

test("6C empty drafts remain blank and storage failures propagate", () => {
  assert.deepEqual(readLocalDraft(memoryStorage({})), defaultSettings);
  const failing = { getItem: () => JSON.stringify(legacy), setItem: () => { throw new Error("blocked"); } };
  assert.throws(() => readLocalDraft(failing), /blocked/);
  assert.throws(() => saveLocalDraft(failing, defaultSettings), /blocked/);
  assert.match(read("components/settings/SettingsScreen.tsx"), /Could not save this local draft\. Check your browser storage settings and try again\./);
});

test("6D saved decisions/skips send existing statuses only to Atlas record endpoint", async () => {
  const original = globalThis.fetch;
  const calls: { url: string; body: Record<string, unknown> }[] = [];
  globalThis.fetch = async (input, init) => {
    const body = JSON.parse(String(init?.body)); calls.push({ url: String(input), body });
    return new Response(JSON.stringify({ success: true, action: { id: "synthetic", ...body } }), { headers: { "Content-Type": "application/json" } });
  };
  try {
    const recommendation = { id: "test", title: "Test", description: "Synthetic", actionType: "follow_up", riskLevel: "low", estimatedValue: 100 } as AtlasRecommendation;
    await saveAtlasAction(recommendation, "approved"); await saveAtlasAction(recommendation, "skipped");
    assert.deepEqual(calls.map(c => c.url), ["/api/atlas/actions", "/api/atlas/actions"]);
    assert.deepEqual(calls.map(c => c.body.status), ["approved", "skipped"]);
    assert.ok(calls.every(c => c.body.actualValue === 0 && c.body.timeSavedMinutes === 0));
  } finally { globalThis.fetch = original; }
  const route = read("app/api/atlas/actions/route.ts");
  assert.match(route, /prisma\.atlasAction\.upsert/);
  assert.ok(!/prisma\.customer\.(update|upsert)|sendSms|sendMessage|executeAgent|agentExecutor/.test(route));
  const ui = read("components/atlas/AtlasActionQueue.tsx");
  assert.match(ui, /Save a decision for your records\. EMBUR does not carry out the suggested action for you\./);
  for (const copy of ["Atlas decisions", "Decision saved", "Decisions saved", "DECISION SAVED", "Value reported by you", "Time saved reported by you", "Save reported outcome", "Reported value", "not independently verified revenue, payments, or time savings"]) assert.ok(ui.includes(copy), copy);
});

test("6D reported total counts only recorded outcomes, never estimates or saved decisions", () => {
  assert.equal(reportedValueTotal([
    { status: "approved", actualValue: 999, completedAt: null },
    { status: "recovered", actualValue: 50, completedAt: "2026-01-01" },
    { status: "completed", actualValue: 20, completedAt: "2026-01-01" },
    { status: "recovered", actualValue: 900, completedAt: null },
    { status: "completed", actualValue: NaN, completedAt: "2026-01-01" },
  ]), 70);
});

test("6E Money and Jobs carry exact disclaimer; agent availability ignores tier", () => {
  const disclaimer = "Amounts and job statuses shown here come from customer records. Estimates are not verified payments or revenue collected by EMBUR. A booked status does not mean EMBUR automatically scheduled an appointment.";
  for (const file of ["BusinessPage", "OperationsPage"]) assert.ok(read(`components/pages/${file}.tsx`).includes(disclaimer));
  const text = read("components/pages/GrowthPage.tsx");
  assert.ok(!/currentRank|planRank|unlocked|Available with|Included/.test(text));
  assert.match(text, /const isAtlas = agent.name === "Atlas"/);
  assert.match(text, /isAtlas \? "Suggestions available — Atlas only" : "Not live"/);
  assert.match(text, /isAtlas && <p/);
  assert.equal((text.match(/name: '/g) ?? []).length, 10);
});

test("6F saved-profile link is actual JSX and local draft code has no network calls", () => {
  const text = read("components/settings/SettingsScreen.tsx");
  const tree = ts.createSourceFile("Settings.tsx", text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let link = false;
  function visit(n: ts.Node) {
    if (ts.isJsxElement(n) && n.openingElement.tagName.getText() === "Link" && n.openingElement.attributes.getText().includes('href="/app/onboarding"') && n.getText().includes("Edit saved business profile")) link = true;
    ts.forEachChild(n, visit);
  }
  visit(tree); assert.ok(link);
  assert.ok(!/fetch\(|axios|updateBusiness|saveBusinessProfile/.test(text + read("lib/settings/localDraft.ts")));
  const store = memoryStorage({}); saveLocalDraft(store, { ...defaultSettings, businessName: "Local only" });
  assert.deepEqual(store.writes, [storageKey]);
});

test("6B unavailable text control cannot invoke a messaging handler", () => {
  const text = read("components/pages/CustomerDetailPage.tsx");
  assert.match(text, /<button disabled[^>]*>.*Text messaging unavailable<\/button>/);
  assert.ok(!text.includes("onClick={send}") && !text.includes("await onSendMessage"));
  assert.match(text, /Call using your device/);
});

// Exact approved section wording fixtures are not inputs to the retired-phrase scan.

test("approved section 1 exact wording", () => {
  const renderedSource = ["components/app/AppSidebar.tsx", "components/app/AppHeader.tsx"].map(path => { const raw = read(path); return raw + " " + raw.replace(/<[^>]+>/g, " "); }).join(" ").replace(/\s+/g, " ");
  for (const text of ["Workspace tools", "Atlas suggestions", "Your next steps, organized.", "Review customer records and suggested next steps. Automated calling, outreach, and campaigns are not live.", "Workspace view", "Your opportunity overview.", "Review customer records, priorities, and suggested next steps.", "Customer conversations.", "Review stored inquiries and conversation history. Phone answering is not live.", "Available tools and non-live agents.", "Review recommendations and save your decisions.", "Review business details, local preferences, and account settings."]) assert.ok(renderedSource.includes(text), text);
});

test("approved section 2 exact wording", () => {
  const renderedSource = ["components/pages/GrowthPage.tsx"].map(path => { const raw = read(path); return raw + " " + raw.replace(/<[^>]+>/g, " "); }).join(" ").replace(/\s+/g, " ");
  for (const text of ["Review your tools. You stay in control.", "Atlas suggestions available", "Atlas suggests next steps for you to review. It does not contact customers or take actions for you.", "Suggestions available — Atlas only", "Not live", "Not live", "Not live", "Not live", "Not live", "No customer activity to analyze", "Phone answering is not live. Customers can currently submit requests through web intake.", "Automated booking is not live.", "Automated customer follow-up is not live. You can review leads and choose your next steps.", "Automated customer-care messages are not live.", "Automated referral requests are not live.", "Automated review requests are not live.", "Video generation is not live.", "Campaign launch and paid traffic management are not live.", "Coordinated marketing automation is not live.", "Suggests priorities and next steps from your customer records using rules built into EMBUR or, when enabled, an AI model. Review suggestions before acting.", "Example voice scripts", "Illustrative scripts only. EMBUR does not currently answer phone calls.", "Example script — not active", "Voice answering is not live. These examples do not activate calling or connect a phone service."]) assert.ok(renderedSource.includes(text), text);
});

test("approved section 3 exact wording", () => {
  const renderedSource = ["components/atlas/AtlasActionQueue.tsx"].map(path => { const raw = read(path); return raw + " " + raw.replace(/<[^>]+>/g, " "); }).join(" ").replace(/\s+/g, " ");
  for (const text of ["Atlas decisions", "Suggested next steps", "Save a decision for your records. EMBUR does not carry out the suggested action for you.", "Save decision", "Decision saved", "Decisions saved", "DECISION SAVED", "Open customer record →", "Value reported by you", "Time saved reported by you", "Save reported outcome", "Reported value"]) assert.ok(renderedSource.includes(text), text);
});

test("approved section 4 exact wording", () => {
  const renderedSource = ["components/settings/SettingsScreen.tsx"].map(path => { const raw = read(path); return raw + " " + raw.replace(/<[^>]+>/g, " "); }).join(" ").replace(/\s+/g, " ");
  for (const text of ["Local preferences", "Draft preferences", "These draft preferences are stored in this browser only. They do not update your saved business profile or activate any automated service.", "No unsaved local changes", "Unsaved local changes", "Draft business details", "These fields are local notes only. To change the business name, phone, industry, or timezone stored in your EMBUR workspace, use Business setup.", "Draft operating hours", "These hours are local notes only. They do not control calling, booking, or messaging.", "Draft saved in this browser only. Your saved business profile and live services have not changed.", "Could not save this local draft. Check your browser storage settings and try again.", "Save local draft", "Local draft saved", "Reset local draft", "Local draft reset. Select Save local draft to store these blank defaults.", "Local draft only", "These preferences do not operate live services.", "This section stores reference preferences in your browser. It does not enable automated communications or change your saved business profile.", "After-hours follow-up — Not live", "Automated follow-up is not available. This setting cannot send messages.", "Appointment confirmations — Not live", "Automated appointment confirmations are not available.", "Review requests — Not live", "Automated review requests are not available.", "Priority alerts — Not live", "Automatic priority notifications are not available.", "Non-live communication features", "These features are not live. Their controls are disabled and cannot activate communications.", "Non-live notifications", "Automatic owner notifications are not live. The control below is disabled."]) assert.ok(renderedSource.includes(text), text);
});

test("approved section 5 exact wording", () => {
  const renderedSource = ["components/pages/ConversationsPage.tsx", "components/pages/CustomerDetailPage.tsx", "components/settings/MessagingConnectionCard.tsx", "components/app/AppShellPreview.tsx", "components/pages/BusinessPage.tsx", "components/pages/OperationsPage.tsx", "components/pages/TodayPage.tsx", "components/app/AppHeader.tsx", "components/settings/AtlasMemorySettings.tsx"].map(path => { const raw = read(path); return raw + " " + raw.replace(/<[^>]+>/g, " "); }).join(" ").replace(/\s+/g, " ");
  for (const text of ["Conversation history", "Conversation records available", "Messaging is not live. This thread is a read-only record of customer interactions.", "Customer inquiries recorded through web intake will appear here.", "Text messaging unavailable", "SMS delivery is not live. EMBUR cannot currently send this message.", "Text messaging setup — Not live", "SMS delivery is not live. Provider setup and compliance verification are required before live messaging is available.", "After-hours web intake", "Intake page available", "Give customers a way to submit after-hours requests.", "Share your web intake link through channels you control. Submitted requests are recorded in your customer and conversation history. EMBUR does not answer calls or send follow-up messages automatically.", "Estimated opportunity value from customer records.", "Recorded opportunity values and job statuses.", "Track your work from inquiry to outcome.", "Estimated appointments", "Forecast only — no automatic booking"]) assert.ok(renderedSource.includes(text), text);
});

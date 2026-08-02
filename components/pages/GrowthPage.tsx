"use client";

import { useState } from "react";
import AtlasActionQueue from "@/components/atlas/AtlasActionQueue";
import { createAtlasSnapshot } from "@/lib/intelligence/atlasEngine";
import type { AtlasMemory } from "@/lib/intelligence/memory/types";
import type { Lead } from "@/types";

const voices = [
  { id: "maya", name: "Maya", style: "Warm and reassuring", line: "You called the right place. We have you covered." },
  { id: "marcus", name: "Marcus", style: "Calm and confident", line: "I can help with that. Let me get this handled for you." },
  { id: "nina", name: "Nina", style: "Clear and direct", line: "You are in the right place. I will get the details to the team now." },
  { id: "james", name: "James", style: "Friendly and local", line: "We have got you. Tell me what is happening and we will take it from here." },
];

function statusOf(customer: Lead) { return customer.status.toLowerCase().replaceAll("-", "_").replaceAll(" ", "_"); }
function valueOf(customer: Lead) { return customer.estimatedValue ?? (Number(customer.value.replace(/[^0-9.]/g, "")) || 0); }
function dollars(value: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value); }

export default function GrowthPage({
  customers,
  atlasMemory,
  subscriptionPlan,
  isInternalWorkspace,
  onOpenCustomer,
}: {
  customers: Lead[];
  atlasMemory?: AtlasMemory | null;
  subscriptionPlan: string;
  isInternalWorkspace: boolean;
  onOpenCustomer: (customer: Lead) => void;
}) {
  const [voice, setVoice] = useState(voices[0]);
  const atlas = customers.length ? createAtlasSnapshot(customers, atlasMemory) : null;
  const waiting = customers.filter((customer) => ["new", "waiting", "contacted", "follow_up", "follow_up_sent"].includes(statusOf(customer)));
  const booked = customers.filter((customer) => statusOf(customer) === "booked");
  const won = customers.filter((customer) => ["completed", "invoiced", "paid"].includes(statusOf(customer)));
  const planRank: Record<string, number> = { none: 0, copper: 1, silver: 2, gold: 3, diamond: 4, platinum: 5 };
  const currentRank = isInternalWorkspace ? 5 : (planRank[subscriptionPlan] ?? 0);
  const agentRows = [
    { name: "Call Agent", job: "Answers missed and after-hours calls", result: `${waiting.length} leads need contact`, required: 1, tier: "Copper" },
    { name: "Booking Agent", job: "Moves qualified leads onto the calendar", result: `${booked.length} ${booked.length === 1 ? "job" : "jobs"} booked`, required: 1, tier: "Copper" },
    { name: "Follow-Up Agent", job: "Brings open estimates back", result: `${dollars(waiting.reduce((sum, customer) => sum + valueOf(customer), 0))} waiting`, required: 2, tier: "Silver" },
    { name: "Relationship Agent", job: "Handles thank-yous, milestones, and customer care", result: `${won.length} relationships ready`, required: 2, tier: "Silver" },
    { name: "Referral Agent", job: "Asks happy customers for the next introduction", result: `${won.length} ${won.length === 1 ? "customer" : "customers"} eligible`, required: 3, tier: "Gold" },
    { name: "Reputation Agent", job: "Requests reviews after good work", result: `${won.length} requests available`, required: 3, tier: "Gold" },
    { name: "Video Agent", job: "Builds short proof and offer videos", result: "Video provider connection required", required: 4, tier: "Diamond" },
    { name: "Traffic Agent", job: "Prepares campaigns that produce booked work", result: "Ad account connection required", required: 4, tier: "Diamond" },
    { name: "Managed Growth Office", job: "Coordinates outreach, social, SEO, reputation, referrals, video, and traffic", result: "Managed by Atlas", required: 5, tier: "Platinum" },
    { name: "Atlas", job: "Chooses the highest-value next move", result: atlas ? `${atlas.recommendations.length} moves ready` : "Waiting for activity", required: 1, tier: "Copper" },
  ];

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-[2rem] bg-[#04112b] p-6 text-white shadow-xl md:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8fb4ff]">Agents</p>
        <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h3 className="font-display text-4xl font-semibold tracking-[-0.045em] md:text-6xl">Work gets done.<br /><span className="text-[#ff6a3d]">You stay in control.</span></h3>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"><p className="text-sm font-bold text-emerald-200">Atlas is working</p><p className="mt-1 text-sm text-[#9eb0ce]">Nothing sends or spends without your rules.</p></div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {agentRows.map((agent) => {
          const unlocked = currentRank >= agent.required;
          return <article key={agent.name} className={`rounded-2xl border p-5 shadow-sm ${unlocked ? "border-[#d8e1ee] bg-white" : "border-slate-200 bg-slate-50"}`}><div className="flex items-center justify-between gap-3"><h4 className={`font-display text-xl font-semibold ${unlocked ? "text-[#06142f]" : "text-slate-500"}`}>{agent.name}</h4><span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${unlocked ? "bg-emerald-50 text-emerald-700" : "bg-[#edf3ff] text-[#1555c6]"}`}>{unlocked ? "Included" : agent.tier}</span></div><p className="mt-3 text-sm leading-6 text-[#66758d]">{agent.job}</p><p className={`mt-5 font-bold ${unlocked ? "text-[#06142f]" : "text-slate-500"}`}>{unlocked ? agent.result : `Available with ${agent.tier}`}</p></article>;
        })}
      </section>

      {currentRank < 5 && (
        <section className="rounded-[1.75rem] border border-[#1b3a70] bg-[#06142f] p-6 text-white shadow-xl md:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-200">Platinum · $999/month</p>
          <h3 className="font-display mt-3 text-3xl font-semibold">Add a managed Growth Office.</h3>
          <p className="mt-3 max-w-3xl leading-7 text-[#a8b9d4]">Atlas coordinates outreach, social, SEO, video, reputation, referrals, and paid-campaign preparation. You approve what sends, publishes, or spends.</p>
          <a href="/app/billing?plan=platinum" className="mt-6 inline-flex rounded-xl bg-[#ff6a3d] px-6 py-3 font-extrabold text-white">See Platinum</a>
        </section>
      )}

      {atlas && <AtlasActionQueue recommendations={atlas.recommendations} onOpenCustomer={(customerId) => { const customer = customers.find((item) => String(item.id) === String(customerId)); if (customer) onOpenCustomer(customer); }} />}

      <section className="rounded-[1.75rem] border border-[#d8e1ee] bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-7 xl:grid-cols-[0.85fr_1.15fr]">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#1555c6]">Call Agent</p><h3 className="font-display mt-3 text-3xl font-semibold text-[#06142f]">Choose the voice.</h3><p className="mt-3 leading-7 text-[#66758d]">The welcome should feel safe, capable, and human.</p></div>
          <div><div className="grid grid-cols-2 gap-2">{voices.map((item) => <button key={item.id} type="button" onClick={() => setVoice(item)} aria-pressed={voice.id === item.id} className={`rounded-xl border p-3 text-left transition ${voice.id === item.id ? "border-[#246bfe] bg-[#eaf1ff]" : "border-[#d8e1ee]"}`}><p className="font-bold text-[#06142f]">{item.name}</p><p className="mt-1 text-xs text-[#66758d]">{item.style}</p></button>)}</div><div className="mt-4 rounded-2xl bg-[#06142f] p-5 text-white"><p className="text-xs font-bold uppercase tracking-wider text-emerald-200">Script preview</p><p className="font-display mt-3 text-xl font-semibold leading-8">&ldquo;{voice.line}&rdquo;</p></div></div>
        </div>
        <p className="mt-5 border-t border-[#e4eaf2] pt-5 text-xs leading-5 text-[#7a8ba5]">Live voice calling activates after a phone provider, disclosure, business hours, and escalation rules are connected.</p>
      </section>
    </div>
  );
}

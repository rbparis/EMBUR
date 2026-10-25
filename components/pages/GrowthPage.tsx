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

export default function GrowthPage({
  customers,
  atlasMemory,
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
  const agentRows = [
    { name: 'Call Agent', job: 'Phone answering is not live. Customers can currently submit requests through web intake.' },
    { name: 'Booking Agent', job: 'Automated booking is not live.' },
    { name: 'Follow-Up Agent', job: 'Automated customer follow-up is not live. You can review leads and choose your next steps.' },
    { name: 'Relationship Agent', job: 'Automated customer-care messages are not live.' },
    { name: 'Referral Agent', job: 'Automated referral requests are not live.' },
    { name: 'Reputation Agent', job: 'Automated review requests are not live.' },
    { name: 'Video Agent', job: 'Video generation is not live.' },
    { name: 'Traffic Agent', job: 'Campaign launch and paid traffic management are not live.' },
    { name: 'Managed Growth Office', job: 'Coordinated marketing automation is not live.' },
    { name: 'Atlas', job: 'Suggests priorities and next steps from your customer records using rules built into EMBUR or, when enabled, an AI model. Review suggestions before acting.' },
  ];

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-[2rem] bg-[#04112b] p-6 text-white shadow-xl md:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8fb4ff]">Agents</p>
        <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h3 className="font-display text-4xl font-semibold tracking-[-0.045em] md:text-6xl">Review your tools.<br /><span className="text-[#ff6a3d]">You stay in control.</span></h3>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"><p className="text-sm font-bold text-slate-300">Atlas suggestions available</p><p className="mt-1 text-sm text-[#9eb0ce]">Atlas suggests next steps for you to review. It does not contact customers or take actions for you.</p></div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {agentRows.map((agent) => {
          const isAtlas = agent.name === "Atlas";
          return <article key={agent.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><h4 className="font-display text-xl font-semibold text-[#06142f]">{agent.name}</h4><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-600">{isAtlas ? "Suggestions available — Atlas only" : "Not live"}</span></div><p className="mt-3 text-sm leading-6 text-[#66758d]">{agent.job}</p>{isAtlas && <p className="mt-5 font-bold text-[#06142f]">{atlas ? `${atlas.recommendations.length} suggested actions` : "No customer activity to analyze"}</p>}</article>;
        })}
      </section>

      {atlas && <AtlasActionQueue recommendations={atlas.recommendations} onOpenCustomer={(customerId) => { const customer = customers.find((item) => String(item.id) === String(customerId)); if (customer) onOpenCustomer(customer); }} />}

      <section className="rounded-[1.75rem] border border-[#d8e1ee] bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-7 xl:grid-cols-[0.85fr_1.15fr]">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#1555c6]">Call Agent</p><h3 className="font-display mt-3 text-3xl font-semibold text-[#06142f]">Example voice scripts</h3><p className="mt-3 leading-7 text-[#66758d]">Illustrative scripts only. EMBUR does not currently answer phone calls.</p></div>
          <div><div className="grid grid-cols-2 gap-2">{voices.map((item) => <button key={item.id} type="button" onClick={() => setVoice(item)} aria-pressed={voice.id === item.id} className={`rounded-xl border p-3 text-left transition ${voice.id === item.id ? "border-[#246bfe] bg-[#eaf1ff]" : "border-[#d8e1ee]"}`}><p className="font-bold text-[#06142f]">{item.name}</p><p className="mt-1 text-xs text-[#66758d]">{item.style}</p></button>)}</div><div className="mt-4 rounded-2xl bg-[#06142f] p-5 text-white"><p className="text-xs font-bold uppercase tracking-wider text-slate-300">Example script — not active</p><p className="font-display mt-3 text-xl font-semibold leading-8">&ldquo;{voice.line}&rdquo;</p></div></div>
        </div>
        <p className="mt-5 border-t border-[#e4eaf2] pt-5 text-xs leading-5 text-[#7a8ba5]">Voice answering is not live. These examples do not activate calling or connect a phone service.</p>
      </section>
    </div>
  );
}

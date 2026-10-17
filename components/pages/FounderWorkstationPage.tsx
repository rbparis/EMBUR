"use client";

import DailyAgentControlPanel from "@/components/outreach/DailyAgentControlPanel";
import GrowthAgentOperationsPanel from "@/components/outreach/GrowthAgentOperationsPanel";
import OutreachAgentPanel from "@/components/outreach/OutreachAgentPanel";
import RevenueMissionPanel from "@/components/outreach/RevenueMissionPanel";
import FirstRevenueQueue from "@/components/outreach/FirstRevenueQueue";
import AgentCommandCenter from "@/components/outreach/AgentCommandCenter";
import DemoRequestPanel from "@/components/outreach/DemoRequestPanel";
import HostedSalesStatus from "@/components/founder/HostedSalesStatus";
import type { HostedSalesMetrics } from "@/lib/hosted-sales/metrics.server";

export default function FounderWorkstationPage({ hostedSalesMetrics }: { hostedSalesMetrics: HostedSalesMetrics }) {
  return (
    <div className="mt-8 space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#1b3a70] bg-[#031027] p-6 text-white shadow-2xl md:p-8">
        <div className="pointer-events-none absolute left-[42%] top-[-8rem] h-80 w-80 rounded-full bg-blue-500/20 blur-[100px]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 embur-soft-pulse" />
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-200">Founder HQ · Live operations</p>
            </div>
            <h3 className="font-display mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              Your virtual<br /><span className="text-[#ff6a3d]">growth office.</span>
            </h3>
            <p className="mt-4 max-w-2xl leading-7 text-[#9eb0ce]">
              See verified traffic, outreach, replies, revenue, blockers, and every agent&apos;s latest recorded action. No activity is implied without evidence.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <HqMetric value="Live" label="data" />
            <HqMetric value="5 sec" label="refresh" />
            <HqMetric value="You" label="control" />
          </div>
        </div>
      </section>

      <HostedSalesStatus metrics={hostedSalesMetrics} />
      <AgentCommandCenter />
      <RevenueMissionPanel />
      <DemoRequestPanel />
      <FirstRevenueQueue />
      <DailyAgentControlPanel />
      <OutreachAgentPanel />
      <GrowthAgentOperationsPanel />

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        <strong>Operating rule:</strong> HQ can research, plan, draft, prioritize, publish an approved EMBUR article, and learn from outcomes. Sending email or text, posting to connected social accounts, buying ads, or contacting scraped personal data requires an approved channel, lawful suppression controls, and your authorization.
        <span className="mt-2 block text-xs text-amber-800">
          Scout preserves the source URL for every public business record. Fallback data attribution:{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="font-bold underline">© OpenStreetMap contributors, ODbL</a>.
        </span>
      </section>
    </div>
  );
}

function HqMetric({ value, label }: { value: string; label: string }) {
  return <div className="min-w-20 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-center"><p className="font-display text-2xl font-semibold">{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#8297b8]">{label}</p></div>;
}

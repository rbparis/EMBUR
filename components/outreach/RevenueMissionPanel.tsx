"use client";

import { useEffect, useMemo, useState } from "react";
import { agentDailyQuotas, monthlyMrrTargets } from "@/lib/revenueMission";
import { getAgentState, type StoredProspect } from "@/services/agentStateApi";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function RevenueMissionPanel() {
  const [prospects, setProspects] = useState<StoredProspect[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAgentState()
      .then((state) => {
        if (active) setProspects(state.prospects);
      })
      .catch((reason) => {
        setError(reason instanceof Error ? reason.message : "The revenue mission could not be loaded.");
      });
    return () => { active = false; };
  }, []);

  const funnel = useMemo(() => {
    const won = prospects.filter((prospect) => prospect.stage === "won");
    return {
      researched: prospects.length,
      contacted: prospects.filter((prospect) => ["sent", "replied", "demo", "won"].includes(prospect.stage)).length,
      replies: prospects.filter((prospect) => ["replied", "demo", "won"].includes(prospect.stage)).length,
      demos: prospects.filter((prospect) => ["demo", "won"].includes(prospect.stage)).length,
      customers: won.length,
      mrr: won.reduce((sum, prospect) => sum + prospect.monthlyRevenue, 0),
    };
  }, [prospects]);

  const currentTarget = monthlyMrrTargets[0].target;
  const progress = Math.min(100, Math.round((funnel.mrr / currentTarget) * 100));

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#1b3a70] bg-[#031027] text-white shadow-2xl">
      <div className="grid xl:grid-cols-[0.92fr_1.08fr]">
        <div className="p-6 md:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-200">Priority one</p>
          <h2 className="font-display mt-3 text-4xl font-semibold">The $3,000 mission.</h2>
          <p className="mt-3 max-w-xl leading-7 text-[#a8b9d4]">
            Every assignment must move a qualified HVAC owner toward a conversation, demonstration, or paid EMBUR plan.
          </p>
          <div className="mt-7 flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-5xl font-semibold">{money.format(funnel.mrr)}</p>
              <p className="mt-2 text-xs font-extrabold uppercase tracking-wider text-[#8297b8]">Current MRR</p>
            </div>
            <p className="font-display text-2xl font-semibold text-[#8fb4ff]">{progress}%</p>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-[#ff6a3d] to-[#ffb347] transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {monthlyMrrTargets.map((goal) => (
              <div key={goal.month} className={`rounded-xl border p-3 ${goal.month === 1 ? "border-orange-300/30 bg-orange-300/10" : "border-white/10 bg-white/[0.04]"}`}>
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#8297b8]">Month {goal.month}</p>
                <p className="font-display mt-1 text-xl font-semibold">{money.format(goal.target)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/[0.035] p-6 xl:border-l xl:border-t-0 md:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8fb4ff]">Live sales funnel</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <FunnelMetric label="Prospects" value={funnel.researched} />
            <FunnelMetric label="Contacted" value={funnel.contacted} />
            <FunnelMetric label="Replies" value={funnel.replies} />
            <FunnelMetric label="Demos" value={funnel.demos} />
            <FunnelMetric label="Customers" value={funnel.customers} />
          </div>
          <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.18em] text-[#8fb4ff]">Non-negotiable output</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {Object.entries(agentDailyQuotas).map(([agent, quota]) => (
              <div key={agent} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3">
                <div>
                  <p className="font-bold capitalize">{agent}</p>
                  <p className="text-xs text-[#8297b8]">{quota.label}</p>
                </div>
                <span className="font-display text-2xl font-semibold text-orange-200">{quota.target}</span>
              </div>
            ))}
          </div>
          {error && <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">{error}</p>}
        </div>
      </div>
    </section>
  );
}

function FunnelMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4 text-center">
      <p className="font-display text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-[9px] font-extrabold uppercase tracking-wider text-[#8297b8]">{label}</p>
    </div>
  );
}

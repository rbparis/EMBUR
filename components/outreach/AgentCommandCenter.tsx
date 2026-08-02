"use client";

import { useCallback, useEffect, useState } from "react";

type TrafficWindow = {
  visits: number;
  uniqueVisitors: number;
  pricingViews: number;
  ctaClicks: number;
};

type AgentState = {
  agent: string;
  state: "working" | "waiting" | "blocked" | "completed" | "idle";
  task: string | null;
  result: string | null;
  updatedAt: string | null;
  verified: boolean;
};

type Metrics = {
  measuredAt: string;
  timeZone: string;
  live: {
    activeVisitors: number;
    windowMinutes: number;
    recentEvents: Array<{
      id: string;
      event: string;
      path: string | null;
      source: string;
      agent: string | null;
      createdAt: string;
    }>;
  };
  traffic: { today: TrafficWindow; week: TrafficWindow };
  billing: { checkoutStarts: number; paidConversions: number; paymentFailures: number; expiredCheckouts: number };
  inbound: { requests: number; new: number; booked: number; won: number };
  outreach: {
    approved: number;
    contacted: number;
    contactedToday: number;
    replies: number;
    demos: number;
    customers: number;
    emailOpens: null;
    emailClicks: null;
  };
  agents: { attempted: number; completed: number; blocked: number; waiting: number };
  agentStates: AgentState[];
  recentTasks: Array<{ id: string; agent: string; title: string; status: string; result: string | null; updatedAt: string }>;
  connections: {
    traffic: boolean;
    stripe: boolean;
    outreachStages: boolean;
    emailDelivery: boolean;
    emailOpens: boolean;
    vercelAnalytics: boolean;
  };
};

const AGENT_JOBS: Record<string, string> = {
  atlas: "Growth manager",
  scout: "Lead research",
  verifier: "Lead qualification",
  hunter: "Sales outreach",
  closer: "Sales conversion",
  launch: "Customer onboarding",
  keeper: "Retention",
  relay: "Gmail and follow-up",
  pulse: "Social media",
  rank: "SEO and content",
};

const EVENT_LABELS: Record<string, string> = {
  landing_view: "Website visit",
  pricing_view: "Pricing viewed",
  cta_click: "Call-to-action clicked",
  checkout_started: "Checkout started",
  subscription_started: "Payment completed",
  payment_failed: "Payment failed",
  checkout_expired: "Checkout expired",
};

export default function AgentCommandCenter() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const response = await fetch("/api/metrics/founder", { cache: "no-store" });
      const result = (await response.json()) as Metrics & { success?: boolean; message?: string };
      if (!response.ok || !result.success) throw new Error(result.message || "Metrics could not be loaded.");
      setMetrics(result);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Metrics could not be loaded.");
    } finally {
      if (manual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 5_000);
    return () => window.clearInterval(timer);
  }, [load]);

  const liveAgents = metrics?.agentStates.filter((agent) => agent.state === "working").length ?? 0;
  const blockedAgents = metrics?.agentStates.filter((agent) => agent.state === "blocked").length ?? 0;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#1b3a70] bg-[#031027] text-white shadow-2xl">
      <div className="border-b border-white/10 p-6 md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-200">Live founder intelligence</p>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-300/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-300 embur-soft-pulse" />
                Refreshing every 5 seconds
              </span>
            </div>
            <h2 className="font-display mt-3 text-4xl font-semibold md:text-5xl">What is happening right now.</h2>
            <p className="mt-3 max-w-3xl text-[#a8b9d4]">
              Real recorded events only. A desk is never labeled working unless EMBUR has a current task and a timestamp to prove it.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold text-[#c8d5e9]">
              {metrics ? `Updated ${formatTime(metrics.measuredAt, metrics.timeZone)}` : "Connecting..."}
            </span>
            <button
              type="button"
              onClick={() => void load(true)}
              disabled={refreshing}
              className="rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-extrabold text-[#1d0b00] transition hover:bg-orange-400 disabled:opacity-60"
            >
              {refreshing ? "Refreshing..." : "Refresh now"}
            </button>
          </div>
        </div>
      </div>

      {error && <p className="m-6 rounded-xl bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-200">{error}</p>}

      <div className="grid gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-6">
        <HeadlineMetric value={metrics?.live.activeVisitors} label={`Live visitors (${metrics?.live.windowMinutes ?? 5} min)`} tone="green" />
        <HeadlineMetric value={metrics?.traffic.today.uniqueVisitors} label="People today" />
        <HeadlineMetric value={metrics?.traffic.today.pricingViews} label="Pricing views today" />
        <HeadlineMetric value={metrics?.outreach.contactedToday} label="Prospects contacted today" tone={metrics?.outreach.contactedToday ? "green" : "orange"} />
        <HeadlineMetric value={metrics?.outreach.replies} label="Replies total" />
        <HeadlineMetric value={metrics?.billing.paidConversions} label="Payments today" tone={metrics?.billing.paidConversions ? "green" : "orange"} />
      </div>

      <div className="grid gap-6 p-6 md:p-8 xl:grid-cols-[1.4fr_0.6fr]">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8fb4ff]">Live agent floor</p>
              <h3 className="font-display mt-2 text-3xl font-semibold">Verified work, desk by desk.</h3>
            </div>
            <div className="flex gap-2 text-xs font-bold">
              <span className="rounded-full bg-emerald-300/10 px-3 py-1.5 text-emerald-200">{liveAgents} working</span>
              <span className="rounded-full bg-amber-300/10 px-3 py-1.5 text-amber-200">{blockedAgents} blocked</span>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {metrics?.agentStates.map((agent) => <AgentCard key={agent.agent} agent={agent} timeZone={metrics.timeZone} />)}
            {!metrics && Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-40 animate-pulse rounded-2xl bg-white/[0.05]" />)}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8fb4ff]">Live website feed</p>
            <div className="mt-4 space-y-2">
              {metrics?.live.recentEvents.slice(0, 10).map((event) => (
                <article key={event.id} className="rounded-xl border border-white/10 bg-white/[0.045] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-bold">{EVENT_LABELS[event.event] || event.event.replaceAll("_", " ")}</p>
                    <time className="shrink-0 text-[10px] font-bold uppercase text-[#8297b8]">
                      {formatTime(event.createdAt, metrics.timeZone)}
                    </time>
                  </div>
                  <p className="mt-1 truncate text-xs text-[#8fa2c0]">{event.path || event.source}</p>
                </article>
              ))}
              {metrics && !metrics.live.recentEvents.length && (
                <p className="rounded-xl border border-white/10 p-5 text-sm text-[#a8b9d4]">No website event has been recorded today.</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8fb4ff]">Measurement truth</p>
            <div className="mt-4 space-y-3">
              <Connection name="EMBUR website tracker" connected={metrics?.connections.traffic ?? false} />
              <Connection name="Stripe conversions" connected={metrics?.connections.stripe ?? false} />
              <Connection name="Sales pipeline" connected={metrics?.connections.outreachStages ?? false} />
              <Connection name="Gmail sends, opens, and clicks" connected={metrics?.connections.emailDelivery ?? false} note="Not connected. The Gmail Sent folder is the source of truth for actual sends; open tracking requires a separate consent-aware delivery provider." />
              <Connection name="Vercel Web Analytics" connected={metrics?.connections.vercelAnalytics ?? false} note="Currently disabled in Vercel. EMBUR's first-party tracker is recording the website events shown above." />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-px border-t border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4">
        <MetricGroup title="Website today" connected={metrics?.connections.traffic ?? false} metrics={[
          ["Visits", metrics?.traffic.today.visits],
          ["People", metrics?.traffic.today.uniqueVisitors],
          ["Pricing views", metrics?.traffic.today.pricingViews],
          ["CTA clicks", metrics?.traffic.today.ctaClicks],
        ]} />
        <MetricGroup title="Website - 7 days" connected={metrics?.connections.traffic ?? false} metrics={[
          ["Visits", metrics?.traffic.week.visits],
          ["People", metrics?.traffic.week.uniqueVisitors],
          ["Pricing views", metrics?.traffic.week.pricingViews],
          ["CTA clicks", metrics?.traffic.week.ctaClicks],
        ]} />
        <MetricGroup title="Revenue today" connected={metrics?.connections.stripe ?? false} metrics={[
          ["Checkout starts", metrics?.billing.checkoutStarts],
          ["Paid", metrics?.billing.paidConversions],
          ["Failed", metrics?.billing.paymentFailures],
          ["Expired", metrics?.billing.expiredCheckouts],
        ]} />
        <MetricGroup title="Sales pipeline" connected={metrics?.connections.outreachStages ?? false} metrics={[
          ["Approved", metrics?.outreach.approved],
          ["Contacted", metrics?.outreach.contacted],
          ["Replies", metrics?.outreach.replies],
          ["Demos", metrics?.outreach.demos],
        ]} />
      </div>
    </section>
  );
}

function AgentCard({ agent, timeZone }: { agent: AgentState; timeZone: string }) {
  const tone = {
    working: "bg-emerald-300/10 text-emerald-200",
    waiting: "bg-blue-300/10 text-blue-200",
    blocked: "bg-amber-300/10 text-amber-200",
    completed: "bg-violet-300/10 text-violet-200",
    idle: "bg-white/5 text-[#8fa2c0]",
  }[agent.state];
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#071832] font-display text-lg font-semibold text-orange-300">
            {agent.agent.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <p className="font-display text-xl font-semibold capitalize">{agent.agent}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8297b8]">{AGENT_JOBS[agent.agent] || "Specialist"}</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase ${tone}`}>{agent.state}</span>
      </div>
      <p className="mt-4 min-h-10 text-sm font-bold leading-5 text-[#e4ecf9]">{agent.task || "No verified assignment"}</p>
      {agent.result && <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#9eb0ce]">{agent.result}</p>}
      <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-[#6f83a5]">
        {agent.updatedAt ? `Last evidence ${formatTime(agent.updatedAt, timeZone)}` : "No activity recorded"}
      </p>
    </article>
  );
}

function HeadlineMetric({ value, label, tone = "blue" }: { value: number | undefined; label: string; tone?: "blue" | "green" | "orange" }) {
  const colors = {
    blue: "text-white",
    green: "text-emerald-300",
    orange: "text-orange-300",
  };
  return (
    <div className="bg-[#071832] p-5">
      <p className={`font-display text-4xl font-semibold ${colors[tone]}`}>{value ?? "-"}</p>
      <p className="mt-2 text-[10px] font-extrabold uppercase tracking-wider text-[#8297b8]">{label}</p>
    </div>
  );
}

function MetricGroup({ title, connected, metrics }: { title: string; connected: boolean; metrics: Array<[string, number | undefined]> }) {
  return (
    <div className="bg-[#071832] p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8fb4ff]">{title}</p>
        <span className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-300" : "bg-amber-300"}`} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-white/[0.055] p-3">
            <p className="font-display text-2xl font-semibold">{value ?? "-"}</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[#8297b8]">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Connection({ name, connected, note }: { name: string; connected: boolean; note?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.045] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold">{name}</p>
        <span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase ${connected ? "bg-emerald-300/10 text-emerald-200" : "bg-amber-300/10 text-amber-200"}`}>
          {connected ? "Measuring" : "Not connected"}
        </span>
      </div>
      {note && <p className="mt-2 text-xs leading-5 text-[#8fa2c0]">{note}</p>}
    </div>
  );
}

function formatTime(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

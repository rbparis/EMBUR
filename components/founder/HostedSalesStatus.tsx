import type { HostedSalesMetrics } from "@/lib/hosted-sales/metrics.server";

export default function HostedSalesStatus({ metrics }: { metrics: HostedSalesMetrics }) {
  const healthy = metrics.jobStatus === "active" && metrics.failed24h === 0 && !metrics.stale && metrics.deadLetters === 0;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">Hosted sales worker</p>
          <h3 className="mt-2 text-xl font-bold text-slate-950">{healthy ? "Cloud runs healthy" : metrics.jobStatus === "not_started" ? "Awaiting first cloud run" : "Needs attention"}</h3>
          <p className="mt-1 text-sm text-slate-600">Approval-only queue. This worker cannot send email.</p>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${healthy ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>{metrics.jobStatus}</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="Runs · 24h" value={metrics.runs24h} />
        <Metric label="Errors · 24h" value={metrics.failed24h} />
        <Metric label="Awaiting approval" value={metrics.pendingApproval} />
        <Metric label="Suppressed" value={metrics.suppressions} />
        <Metric label="Retry pending" value={metrics.retryPending} />
        <Metric label="Dead letters" value={metrics.deadLetters} />
      </div>
      <div className="mt-4 text-xs text-slate-500">
        Last run: {formatTime(metrics.lastRunAt)} · Next expected: {formatTime(metrics.nextRunAt)}
      </div>
      {metrics.lastError ? <pre className="mt-3 overflow-auto rounded-xl bg-red-50 p-3 text-xs text-red-800">{metrics.lastError}</pre> : null}
      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
        Gmail: {metrics.readiness.gmail.status} · Twilio: {metrics.readiness.twilio.liveReady ? "live ready" : "not live ready"} · Stripe Platinum: {metrics.readiness.stripe.prices.find((item) => item.plan === "platinum")?.configured ? "configured" : "missing price ID"}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl bg-slate-50 p-3"><p className="text-2xl font-bold text-slate-950">{value}</p><p className="text-xs font-semibold text-slate-500">{label}</p></div>;
}

function formatTime(value: string | null) {
  return value ? new Date(value).toLocaleString() : "not recorded";
}

import type { MorningMetric } from "@/services/morningService";

type MorningMetricsProps = {
  metrics: MorningMetric[];
};

export default function MorningMetrics({
  metrics,
}: MorningMetricsProps) {
  return (
    <section>
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
            While you were away
          </p>

          <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
            EMBUR kept the business moving.
          </h3>
        </div>

        <p className="hidden text-sm text-slate-400 sm:block">
          Yesterday&apos;s activity
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <article
            key={metric.label}
            className="embur-hover-lift rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <p className="text-sm font-semibold text-slate-500">
              {metric.label}
            </p>

            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              {metric.value}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              {metric.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
import type { BusinessMetric } from "@/services/businessService";

type BusinessPageProps = {
  metrics: BusinessMetric[];
};

export default function BusinessPage({
  metrics,
}: BusinessPageProps) {
  return (
    <section className="mt-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
          Business impact
        </p>

        <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          What EMBUR returned this month
        </h3>

        <p className="mt-2 text-slate-500">
          Outcomes that show how much work EMBUR carried for the
          business.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
              {metric.label}
            </p>

            <p className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
              {metric.value}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              {metric.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
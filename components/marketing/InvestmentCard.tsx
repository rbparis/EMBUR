import Link from "next/link";
import {
  billingPlans,
  type BillingPlanId,
} from "@/lib/billing/plans";

const featuredPlanId: BillingPlanId =
  "growth";

export default function InvestmentCard() {
  return (
    <section
      id="investment"
      className="bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
            Simple monthly plans
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Choose how much time EMBUR gives back.
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Start with what your business needs today.
            Upgrade as your team and automation grow.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {Object.values(
            billingPlans
          ).map((plan) => {
            const featured =
              plan.id === featuredPlanId;

            return (
              <article
                key={plan.id}
                className={`relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 shadow-lg md:p-8 ${
                  featured
                    ? "border-blue-600 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white shadow-2xl"
                    : "border-slate-200 bg-white text-slate-950"
                }`}
              >
                {featured && (
                  <div className="absolute right-5 top-5 rounded-full bg-orange-400 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-950">
                    Recommended
                  </div>
                )}

                <p
                  className={`text-sm font-bold uppercase tracking-[0.18em] ${
                    featured
                      ? "text-orange-300"
                      : "text-blue-700"
                  }`}
                >
                  {plan.name}
                </p>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-5xl font-bold tracking-tight">
                    ${plan.price}
                  </span>

                  <span
                    className={`pb-1 ${
                      featured
                        ? "text-slate-300"
                        : "text-slate-500"
                    }`}
                  >
                    per month
                  </span>
                </div>

                <p
                  className={`mt-5 leading-relaxed ${
                    featured
                      ? "text-slate-300"
                      : "text-slate-600"
                  }`}
                >
                  {plan.description}
                </p>

                <ul className="mt-8 space-y-4">
                  {plan.features.map(
                    (feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3"
                      >
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                            featured
                              ? "bg-green-400/20 text-green-300"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          ✓
                        </span>

                        <span
                          className={
                            featured
                              ? "text-slate-200"
                              : "text-slate-700"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    )
                  )}
                </ul>

                <div className="mt-auto pt-9">
                  <Link
                    href={`/app/billing?plan=${plan.id}`}
                    prefetch={false}
                    className={`flex w-full items-center justify-center rounded-xl px-6 py-4 font-bold shadow-sm transition hover:-translate-y-0.5 ${
                      featured
                        ? "bg-white text-slate-950 hover:bg-slate-100"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Choose {plan.name}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
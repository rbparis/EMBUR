import Link from "next/link";
import {
  billingPlans,
  type BillingPlanId,
} from "@/lib/billing/plans";

const featuredPlanId: BillingPlanId =
  "platinum";

export default function InvestmentCard() {
  return (
    <section
      id="investment"
      className="bg-[#eef3fb] py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1555c6]">
            Plans
          </p>

          <h2 className="font-display mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#06142f] md:text-6xl">
            Start with the agents you need.
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-[#596a85]">
            Add more when they prove the money.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {Object.values(
            billingPlans
          ).map((plan) => {
            const featured =
              plan.id === featuredPlanId;

            return (
              <article
                key={plan.id}
                className={`relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-7 shadow-[0_24px_70px_-45px_rgba(4,17,43,0.45)] transition hover:-translate-y-1 md:p-8 ${
                  featured
                    ? "border-[#285bba] bg-gradient-to-br from-[#04112b] via-[#071832] to-[#0c2e69] text-white shadow-2xl"
                    : "border-[#d5dfed] bg-white text-[#06142f]"
                }`}
              >
                {featured && (
                  <div className="absolute right-5 top-5 rounded-full bg-orange-400 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-950">
                    Full growth engine
                  </div>
                )}

                <p
                  className={`text-sm font-bold uppercase tracking-[0.18em] ${
                    featured
                      ? "mt-8 text-orange-300"
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
                  {plan.promise}
                </p>

                <ul className="mt-8 space-y-4">
                  {plan.features.slice(0, 3).map(
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

                {"note" in plan && (
                  <p className="mt-6 rounded-xl border border-orange-300/20 bg-orange-300/10 p-3 text-xs leading-5 text-orange-100">
                    {plan.note}
                  </p>
                )}

                <div className="mt-auto pt-9">
                  <Link
                    href={`/app/billing?plan=${plan.id}`}
                    prefetch={false}
                    className={`flex w-full items-center justify-center rounded-xl px-6 py-4 font-bold shadow-sm transition hover:-translate-y-0.5 ${
                      featured
                        ? "bg-white text-[#06142f] hover:bg-blue-50"
                        : "bg-[#246bfe] text-white hover:bg-[#1555c6]"
                    }`}
                  >
                    Choose {plan.name}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm font-semibold leading-6 text-[#66758d]">Advertising spend is separate. The owner approves every dollar.</p>
      </div>
    </section>
  );
}

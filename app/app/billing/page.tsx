import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import SubscribeButton from "@/components/billing/SubscribeButton";
import EmburLogo from "@/components/brand/EmburLogo";
import { getOrCreateBusinessForUser } from "@/lib/currentBusiness";
import {
  billingPlans,
  isBillingPlanId,
} from "@/lib/billing/plans";

type BillingPageProps = {
  searchParams: Promise<{
    plan?: string;
    canceled?: string;
  }>;
};

export default async function BillingPage({
  searchParams,
}: BillingPageProps) {
  const {
    isAuthenticated,
    userId,
  } = await auth();

  if (!isAuthenticated) {
    redirect("/sign-in?redirect_url=%2Fapp%2Fbilling");
  }

  if (!userId) {
    redirect("/sign-in?redirect_url=%2Fapp%2Fbilling");
  }

  const business =
    await getOrCreateBusinessForUser(userId);

  const {
    plan: requestedPlan,
    canceled,
  } = await searchParams;

  const selectedPlanId =
    requestedPlan &&
    isBillingPlanId(requestedPlan)
      ? requestedPlan
      : "growth";

  const selectedPlan =
    billingPlans[selectedPlanId];

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10 text-slate-950 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <EmburLogo size="small" />

          <Link
            href="/app"
            className="text-sm font-bold text-blue-700 transition hover:text-blue-800"
          >
            ← Return to Workspace
          </Link>
        </div>

        {canceled === "true" && (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
            Checkout was canceled. Nothing was charged.
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
              Select your plan
            </p>

            <div className="mt-6 space-y-3">
              {Object.values(billingPlans).map(
                (plan) => (
                  <Link
                    key={plan.id}
                    href={`/app/billing?plan=${plan.id}`}
                    className={`block rounded-2xl border p-5 transition ${
                      selectedPlanId === plan.id
                        ? "border-blue-600 bg-blue-50 shadow-sm"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-950">
                          {plan.name}
                        </p>

                        <p className="mt-1 text-sm leading-relaxed text-slate-500">
                          {plan.description}
                        </p>
                      </div>

                      <p className="shrink-0 text-xl font-bold text-slate-950">
                        ${plan.price}
                      </p>
                    </div>
                  </Link>
                )
              )}
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white md:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-300">
                {selectedPlan.name}
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight">
                Give {business.name} its time back.
              </h1>

              <div className="mt-7 flex items-end gap-2">
                <span className="text-5xl font-bold">
                  ${selectedPlan.price}
                </span>

                <span className="pb-1 text-slate-300">
                  per month
                </span>
              </div>
            </div>

            <div className="p-8 md:p-10">
              <ul className="space-y-4 text-slate-700">
                {selectedPlan.features.map(
                  (feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3"
                    >
                      <span className="font-bold text-green-700">
                        ✓
                      </span>

                      <span>{feature}</span>
                    </li>
                  )
                )}
              </ul>

              <div className="mt-8">
                <SubscribeButton
                  planId={selectedPlan.id}
                  planName={selectedPlan.name}
                  price={selectedPlan.price}
                />
              </div>

              <p className="mt-5 text-center text-xs leading-relaxed text-slate-500">
                Secure Stripe Checkout. Test mode currently
                enabled.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
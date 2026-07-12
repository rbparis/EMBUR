import type { Lead } from "@/types";
import MorningHero from "@/components/morning/MorningHero";
import MorningMetrics from "@/components/morning/MorningMetrics";
import BusinessPulse from "@/components/morning/BusinessPulse";
import OnePriorityCard from "@/components/morning/OnePriorityCard";
import TimeLedger from "@/components/morning/TimeLedger";
import { getMorningBrief } from "@/services/morningService";
import { findAllCustomers } from "@/repositories/customerRepository";
import {
  getHighestPriorityCustomer,
  type PriorityCustomer,
} from "@/services/priorityService";

type TodayPageProps = {
  onOpenCustomer: (customer: Lead) => void;
};

export default function TodayPage({
  onOpenCustomer,
}: TodayPageProps) {
  const brief = getMorningBrief();
  const customers = findAllCustomers();
  const priority = getHighestPriorityCustomer(customers);

  function handleOpenPriority(
    customer: PriorityCustomer
  ) {
    onOpenCustomer(customer);
  }

  return (
    <div className="mt-8 space-y-6">
      <MorningHero brief={brief} />

      <OnePriorityCard
        priority={priority}
        onOpenCustomer={handleOpenPriority}
      />
      <BusinessPulse />

      <MorningMetrics metrics={brief.metrics} />

      <TimeLedger />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm md:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
          Everything else
        </p>

        <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          Is already handled.
        </h3>

        <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-slate-600">
          EMBUR will continue watching calls, follow-ups,
          appointments, reviews, and customer activity throughout
          the day.
        </p>

        <p className="mt-6 text-lg font-semibold text-slate-950">
          Go run your business.
        </p>
      </section>
    </div>
  );
}
import MorningHero from "@/components/morning/MorningHero";
import MorningMetrics from "@/components/morning/MorningMetrics";
import OnePriorityCard from "@/components/morning/OnePriorityCard";
import { getMorningBrief } from "@/services/morningService";

type TodayPageProps = {
  onViewCustomers: () => void;
};

export default function TodayPage({
  onViewCustomers,
}: TodayPageProps) {
  const brief = getMorningBrief();

  return (
    <div className="mt-8 space-y-6">
      <MorningHero brief={brief} />

      <OnePriorityCard
        priority={brief.priority}
        onOpenCustomer={onViewCustomers}
      />

      <MorningMetrics metrics={brief.metrics} />

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
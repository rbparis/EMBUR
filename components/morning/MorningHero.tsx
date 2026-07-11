import EmburIcon from "@/components/ui/EmburIcon";
import type { MorningBrief } from "@/services/morningService";

type MorningHeroProps = {
  brief: MorningBrief;
};

export default function MorningHero({
  brief,
}: MorningHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-2xl md:p-9">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-300">
              Morning intelligence
            </p>

            <h3 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Good morning, {brief.ownerName}.
            </h3>

            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
              {brief.statusMessage}
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-300">
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            Business healthy
          </div>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-orange-300">
              <EmburIcon name="clock" size={22} />
              <p className="text-sm font-bold uppercase tracking-wider">
                Time returned yesterday
              </p>
            </div>

            <p className="mt-4 text-5xl font-bold tracking-tight">
              {brief.timeReturnedYesterday}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Time you did not have to spend chasing calls,
              appointments, and follow-ups.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-green-300">
              <EmburIcon name="business" size={22} />
              <p className="text-sm font-bold uppercase tracking-wider">
                Revenue recovered yesterday
              </p>
            </div>

            <p className="mt-4 text-5xl font-bold tracking-tight">
              {brief.revenueRecoveredYesterday}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Opportunity value recovered while the business
              continued moving.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
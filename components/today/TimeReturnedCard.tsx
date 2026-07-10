import EmburIcon from "@/components/ui/EmburIcon";

export default function TimeReturnedCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-500 to-amber-300 p-6 text-slate-950 shadow-lg">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/20 blur-2xl" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold uppercase tracking-wider">
            Time returned
          </p>

          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/30">
            <EmburIcon name="clock" />
          </div>
        </div>

        <p className="mt-8 text-5xl font-bold tracking-tight">43 hours</p>

        <p className="mt-2 text-lg font-semibold">returned this month.</p>

        <div className="mt-7 border-t border-slate-950/15 pt-5">
          <p className="text-lg font-bold">
            That is more than one full work week.
          </p>

          <p className="mt-2 leading-relaxed text-slate-900/75">
            Time that can belong to your family, health, team, or future again.
          </p>
        </div>
      </div>
    </section>
  );
}
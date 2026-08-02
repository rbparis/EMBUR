import type { Lead } from "@/types";
import { createAtlasSnapshot } from "@/lib/intelligence/atlasEngine";
import type { AtlasMemory } from "@/lib/intelligence/memory/types";

interface TodayPageProps {
  customers: Lead[];
  atlasMemory?: AtlasMemory | null;
  onOpenCustomer(customer: Lead): void;
  onOpenAgents(): void;
}

export default function TodayPage({ customers, atlasMemory, onOpenCustomer, onOpenAgents }: TodayPageProps) {
  if (customers.length === 0) {
    return <section className="mt-8 rounded-3xl border border-[#d8e1ee] bg-white p-8 shadow-sm"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1555c6]">Guided setup</p><h2 className="font-display mt-3 text-3xl font-semibold text-[#06142f]">Connect your first source of customer data.</h2><p className="mt-3 max-w-2xl text-[#66758d]">This workspace is private and empty. EMBUR will never substitute sample leads or estimated money for your real business data.</p><div className="mt-7 grid gap-3 md:grid-cols-3"><EmptyStatus label="Customer data" value="No data yet" /><EmptyStatus label="Phone & text" value="Not connected" /><EmptyStatus label="Pipeline & revenue" value="Unavailable" /></div><button type="button" onClick={onOpenAgents} className="mt-7 rounded-xl bg-[#246bfe] px-6 py-3 font-extrabold text-white">Review connections</button></section>;
  }

  const atlas = createAtlasSnapshot(customers, atlasMemory);
  const priority = atlas.topPriority;
  const priorityCustomer = priority.customer;

  return (
    <div className="mt-8 space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MoneyCard label="Pipeline" value={money(atlas.forecast.pipeline)} note="All open work" />
        <MoneyCard label="Money waiting" value={money(atlas.revenueAtRisk)} note="Needs action" hot />
        <MoneyCard label="Expected" value={money(atlas.forecast.expectedRevenue)} note="Weighted by likelihood" />
        <MoneyCard label="Jobs moving" value={String(atlas.forecast.expectedAppointments)} note="Expected bookings" />
      </section>

      <section className="relative overflow-hidden rounded-[2rem] bg-[#04112b] p-6 text-white shadow-xl md:p-9">
        <div className="pointer-events-none absolute right-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-blue-500/25 blur-[90px]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-[#ff6a3d] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em]">Do this first</span><span className="text-sm font-semibold text-[#8297b8]">{priority.confidence}% confidence</span></div>
            <h2 className="font-display mt-5 text-4xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-6xl">{priority.recommendedAction}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#a8b9d4]">{priority.reason}</p>
          </div>
          <div className="min-w-52 rounded-2xl border border-white/10 bg-white/[0.06] p-5 lg:text-right"><p className="text-xs font-bold uppercase tracking-wider text-[#8297b8]">Money attached</p><p className="font-display mt-2 text-4xl font-semibold text-white">{money(priority.estimatedValue)}</p><button type="button" onClick={() => onOpenCustomer(priorityCustomer)} className="mt-5 w-full rounded-xl bg-white px-5 py-3 font-extrabold text-[#06142f] transition hover:bg-blue-50">Open lead</button></div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.75rem] border border-[#d8e1ee] bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#1555c6]">Money waiting</p><h3 className="font-display mt-2 text-3xl font-semibold text-[#06142f]">Three moves.</h3></div><button type="button" onClick={onOpenAgents} className="text-sm font-extrabold text-[#1555c6]">View agents →</button></div>
          <div className="mt-6 space-y-3">
            {atlas.recommendations.slice(0, 3).map((recommendation, index) => {
              const customer = customers.find((item) => String(item.id) === String(recommendation.customerId));
              return <button key={recommendation.id} type="button" disabled={!customer} onClick={() => customer && onOpenCustomer(customer)} className="flex w-full items-center gap-4 rounded-2xl border border-[#e0e7f1] bg-[#f8faff] p-4 text-left transition hover:border-[#8fb4ff] hover:bg-white disabled:cursor-default"><span className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#06142f] text-xs font-bold text-white">0{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate font-bold text-[#06142f]">{recommendation.title}</p><p className="mt-1 truncate text-sm text-[#66758d]">{recommendation.actionType.replaceAll("_", " ")}</p></div><p className="font-display shrink-0 text-lg font-semibold text-[#1555c6]">{money(recommendation.estimatedValue)}</p></button>;
            })}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[#173568] bg-[#071832] p-6 text-white shadow-xl md:p-8">
          <div className="flex items-center justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#8fb4ff]">Verified workspace</p><h3 className="font-display mt-2 text-3xl font-semibold">Your data only.</h3></div></div>
          <div className="mt-6 space-y-3">
            <AgentRow name="Customer records" action="Tenant-scoped database" value={`${customers.length} saved`} />
            <AgentRow name="Phone & text" action="Business-specific provider required" value="Not connected" />
            <AgentRow name="External CRM" action="No integration record" value="Unavailable" />
          </div>
        </div>
      </section>
    </div>
  );
}

function MoneyCard({ label, value, note, hot = false }: { label: string; value: string; note: string; hot?: boolean }) { return <article className={`embur-money-card rounded-3xl border p-5 shadow-sm ${hot ? "embur-money-card-hot border-orange-200 bg-orange-50" : "border-[#d8e1ee] bg-white"}`}><p className={`text-xs font-extrabold uppercase tracking-[0.15em] ${hot ? "text-orange-700" : "text-[#66758d]"}`}>{label}</p><p className="font-display mt-3 text-3xl font-semibold text-[#06142f] md:text-4xl">{value}</p><p className="mt-2 text-sm font-semibold text-[#7a8ba5]">{note}</p></article>; }
function AgentRow({ name, action, value }: { name: string; action: string; value: string }) { return <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4"><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" /><div className="min-w-0 flex-1"><p className="font-bold">{name}</p><p className="mt-0.5 truncate text-xs text-[#8297b8]">{action}</p></div><span className="font-display text-sm font-semibold text-[#d5e1f7]">{value}</span></div>; }
function EmptyStatus({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-[#d8e1ee] bg-[#f8faff] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7188ad]">{label}</p><p className="mt-2 font-display text-xl font-semibold text-[#06142f]">{value}</p></div>; }
function money(value: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value); }

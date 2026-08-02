import type { Lead } from "@/types";

function statusOf(customer: Lead) { return customer.status.toLowerCase().replaceAll("-", "_").replaceAll(" ", "_"); }
function valueOf(customer: Lead) { return customer.estimatedValue ?? (Number(customer.value.replace(/[^0-9.]/g, "")) || 0); }
function money(value: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value); }

export default function BusinessPage({ customers }: { customers: Lead[] }) {
  const pipeline = customers.reduce((sum, customer) => sum + valueOf(customer), 0);
  const waitingCustomers = customers.filter((customer) => ["new", "waiting", "contacted", "follow_up", "follow_up_sent"].includes(statusOf(customer)));
  const bookedCustomers = customers.filter((customer) => statusOf(customer) === "booked");
  const wonCustomers = customers.filter((customer) => ["completed", "invoiced", "paid"].includes(statusOf(customer)));
  const waiting = waitingCustomers.reduce((sum, customer) => sum + valueOf(customer), 0);
  const booked = bookedCustomers.reduce((sum, customer) => sum + valueOf(customer), 0);
  const won = wonCustomers.reduce((sum, customer) => sum + valueOf(customer), 0);
  const sorted = [...customers].sort((a, b) => valueOf(b) - valueOf(a));

  return <div className="mt-8 space-y-6">
    <section className="rounded-[2rem] bg-[#04112b] p-7 text-white shadow-xl md:p-9"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8fb4ff]">Pipeline</p><p className="font-display mt-3 text-6xl font-semibold tracking-[-0.06em] md:text-8xl">{money(pipeline)}</p><p className="mt-3 text-[#9eb0ce]">Money tied to real leads and jobs.</p></section>
    <section className="grid gap-4 md:grid-cols-3"><MoneyCard label="Waiting" value={money(waiting)} detail={`${waitingCustomers.length} ${waitingCustomers.length === 1 ? "lead needs" : "leads need"} a move`} tone="orange" /><MoneyCard label="Booked" value={money(booked)} detail={`${bookedCustomers.length} ${bookedCustomers.length === 1 ? "job" : "jobs"} on the board`} tone="blue" /><MoneyCard label="Won" value={money(won)} detail={`${wonCustomers.length} ${wonCustomers.length === 1 ? "job" : "jobs"} completed or paid`} tone="green" /></section>
    <section className="rounded-3xl border border-[#d8e1ee] bg-white p-6 shadow-sm md:p-8"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1555c6]">Where the money sits</p><div className="mt-5 space-y-3">{sorted.length ? sorted.map((customer) => <div key={customer.id} className="flex items-center justify-between gap-4 rounded-2xl bg-[#f4f7fb] p-4"><div><p className="font-bold text-[#06142f]">{customer.name}</p><p className="mt-1 text-sm text-[#66758d]">{customer.service} · {customer.status.replaceAll("_", " ")}</p></div><p className="font-display text-xl font-semibold text-[#06142f]">{money(valueOf(customer))}</p></div>) : <p className="rounded-2xl border border-dashed border-[#cbd5e1] p-8 text-center text-[#66758d]">Add the first lead to put money on the board.</p>}</div></section>
  </div>;
}

function MoneyCard({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: "orange" | "blue" | "green" }) { const colors = { orange: "text-orange-600", blue: "text-[#1555c6]", green: "text-emerald-700" }; return <article className="rounded-2xl border border-[#d8e1ee] bg-white p-6 shadow-sm"><p className={`text-xs font-extrabold uppercase tracking-[0.16em] ${colors[tone]}`}>{label}</p><p className="font-display mt-3 text-4xl font-semibold text-[#06142f]">{value}</p><p className="mt-2 text-sm text-[#66758d]">{detail}</p></article>; }

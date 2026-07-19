"use client";

import type { Lead } from "@/types";

const stages = [
  ["new", "New"], ["waiting", "Waiting"], ["contacted", "Contacted"], ["follow_up", "Follow-up"],
  ["booked", "Booked"], ["completed", "Completed"], ["invoiced", "Invoiced"], ["paid", "Paid"],
] as const;

function normalized(status: string) {
  const value = status.toLowerCase().replaceAll("-", "_").replaceAll(" ", "_");
  if (value === "follow_up_sent") return "follow_up";
  return value;
}

export default function OperationsPage({ customers, onOpenCustomer }: { customers: Lead[]; onOpenCustomer: (customer: Lead) => void }) {
  const pipeline = stages.map(([key, label]) => ({ key, label, customers: customers.filter((customer) => normalized(customer.status) === key) }));
  const value = customers.reduce((total, customer) => total + (customer.estimatedValue ?? (Number(customer.value.replace(/[^0-9]/g, "")) || 0)), 0);
  return (
    <div className="mt-8 space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Metric label="Active opportunities" value={String(customers.filter((c) => !["paid", "lost"].includes(normalized(c.status))).length)} />
        <Metric label="Pipeline value" value={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)} />
        <Metric label="Waiting now" value={String(customers.filter((c) => ["new", "waiting"].includes(normalized(c.status))).length)} />
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">Operations</p>
        <h3 className="mt-2 text-3xl font-bold text-slate-950">Customer journey</h3>
        <p className="mt-2 text-slate-500">Open any card to move the work forward.</p>
        <div className="mt-6 grid gap-4 xl:grid-cols-4">
          {pipeline.map((stage) => (
            <div key={stage.key} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between"><h4 className="font-bold text-slate-900">{stage.label}</h4><span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-600">{stage.customers.length}</span></div>
              <div className="mt-4 space-y-3">
                {stage.customers.length === 0 ? <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-400">Nothing here</p> : stage.customers.map((customer) => (
                  <button key={customer.id} type="button" onClick={() => onOpenCustomer(customer)} className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-sm">
                    <p className="font-bold text-slate-900">{customer.name}</p><p className="mt-1 text-sm text-slate-500">{customer.service}</p><p className="mt-2 text-sm font-semibold text-green-700">{customer.value}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-950">{value}</p></div>; }

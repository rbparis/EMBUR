"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Lead } from "@/types";
import EmburIcon from "@/components/ui/EmburIcon";
import StatusBadge from "@/components/ui/StatusBadge";

type Props = {
  customers: Lead[];
  onCustomerSelect: (customer: Lead) => void;
  onCreateCustomer: (input: { name: string; phone?: string; email?: string; service?: string; estimatedValue?: number }) => Promise<void>;
};

export default function CustomersPage({ customers, onCustomerSelect, onCreateCustomer }: Props) {
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return customers;
    return customers.filter((customer) => [customer.name, customer.service, customer.phone, customer.email].some((value) => value?.toLowerCase().includes(needle)));
  }, [customers, query]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    const form = new FormData(event.currentTarget);
    try {
      await onCreateCustomer({
        name: String(form.get("name") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? ""),
        service: String(form.get("service") ?? ""),
        estimatedValue: Number(form.get("estimatedValue") ?? 0),
      });
      event.currentTarget.reset();
      setShowForm(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Customer could not be added.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">Customer 360</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-950">Every opportunity in one place</h3>
          <p className="mt-2 text-slate-500">Search, open, and move a customer through the entire service journey.</p>
        </div>
        <button type="button" onClick={() => setShowForm((value) => !value)} className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
          {showForm ? "Close" : "+ Add customer"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mt-6 grid gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:grid-cols-2">
          <Field name="name" label="Customer name" required />
          <Field name="service" label="Service needed" required />
          <Field name="phone" label="Phone" />
          <Field name="email" label="Email" type="email" />
          <Field name="estimatedValue" label="Estimated value" type="number" min="0" />
          <div className="flex items-end">
            <button disabled={saving} className="w-full rounded-xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-50">{saving ? "Adding…" : "Add to EMBUR"}</button>
          </div>
          {error && <p className="md:col-span-2 text-sm font-semibold text-red-700">{error}</p>}
        </form>
      )}

      <div className="mt-6">
        <label className="sr-only" htmlFor="customer-search">Search customers</label>
        <input id="customer-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, service, phone, or email…" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <h4 className="text-xl font-bold text-slate-900">{customers.length === 0 ? "Add your first customer" : "No matching customers"}</h4>
          <p className="mt-2 text-slate-500">{customers.length === 0 ? "EMBUR will prioritize the work as soon as activity arrives." : "Try a different search."}</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((customer) => (
            <button type="button" key={customer.id} onClick={() => onCustomerSelect(customer)} className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-950">{customer.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{customer.service}</p>
                  <p className="mt-2 text-sm font-semibold text-green-700">Opportunity: {customer.value}</p>
                </div>
                <div className="flex items-center gap-3"><StatusBadge status={customer.status} /><span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700"><EmburIcon name="arrowRight" /></span></div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return <label className="text-sm font-semibold text-slate-700">{label}<input {...inputProps} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>;
}

"use client";

import { useState } from "react";
import type { Lead } from "@/types";
import Button from "@/components/ui/Button";
import EmburIcon from "@/components/ui/EmburIcon";
import StatusBadge from "@/components/ui/StatusBadge";

const workflow = ["new", "waiting", "contacted", "follow_up", "booked", "completed", "invoiced", "paid"];

export default function CustomerDetailPage({ customer, onBack, onUpdate, onDelete, onSendMessage }: {
  customer: Lead;
  onBack: () => void;
  onUpdate: (customer: Lead, input: Partial<Lead> & { estimatedValue?: number }) => Promise<void>;
  onDelete: (customer: Lead) => Promise<void>;
  onSendMessage: (customer: Lead, body: string) => Promise<void>;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const current = workflow.indexOf(customer.status.toLowerCase().replaceAll("-", "_").replaceAll(" ", "_"));
  const next = workflow[Math.min(Math.max(current + 1, 0), workflow.length - 1)];

  async function advance() {
    setBusy(true); setNotice(null);
    try { await onUpdate(customer, { status: next }); setNotice(`Moved to ${next.replaceAll("_", " ")}.`); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Could not update customer."); }
    finally { setBusy(false); }
  }

  async function send() {
    if (!message.trim()) return;
    setBusy(true); setNotice(null);
    try { await onSendMessage(customer, message); setMessage(""); setNotice("Message queued and saved to the customer timeline."); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Could not save message."); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!window.confirm(`Delete ${customer.name}? This also removes their conversation history.`)) return;
    setBusy(true);
    try { await onDelete(customer); }
    finally { setBusy(false); }
  }

  return (
    <section className="mt-8 space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
        <Button variant="secondary" onClick={onBack}>← Back to Customers</Button>
        <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">Customer 360</p><h3 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">{customer.name}</h3><p className="mt-2 text-lg text-slate-600">{customer.service}</p></div>
          <StatusBadge status={customer.status} />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Info label="Phone" value={customer.phone || "Not added"} />
          <Info label="Email" value={customer.email || "Not added"} />
          <Info label="Address" value={customer.address || "Not added"} />
          <Info label="Opportunity" value={customer.value} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Next best action</p>
          <h4 className="mt-3 text-2xl font-bold text-slate-950">{next === customer.status ? "Keep this relationship warm" : `Move to ${next.replaceAll("_", " ")}`}</h4>
          <p className="mt-3 leading-relaxed text-slate-600">Atlas recommends closing the smallest clear next step instead of letting this opportunity sit.</p>
          <button disabled={busy || next === customer.status} onClick={advance} className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? "Working…" : `Complete next step →`}</button>
          <button disabled={busy} onClick={() => onUpdate(customer, { status: "lost" })} className="mt-3 w-full rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50">Mark as lost</button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">Action center</p>
          <h4 className="mt-3 text-2xl font-bold text-slate-950">Reach out now</h4>
          <p className="mt-2 text-slate-500">Messages are recorded immediately. Connect your SMS provider before production delivery.</p>
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={5} placeholder={`Hi ${customer.name.split(" ")[0]}, this is EMBUR following up about ${customer.service.toLowerCase()}…`} className="mt-5 w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <button disabled={busy || !message.trim()} onClick={send} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-50"><EmburIcon name="conversations" size={18} /> Queue message</button>
            {customer.phone && <a href={`tel:${customer.phone}`} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-800"><EmburIcon name="phone" size={18} /> Call</a>}
          </div>
          {notice && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">{notice}</p>}
        </div>
      </div>

      <div className="rounded-3xl border border-red-100 bg-white p-6">
        <p className="font-bold text-slate-900">Customer record</p><p className="mt-1 text-sm text-slate-500">Delete only when this record was created by mistake.</p>
        <button disabled={busy} onClick={remove} className="mt-4 text-sm font-bold text-red-700 hover:text-red-800">Delete customer</button>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-slate-50 p-5"><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 break-words font-bold text-slate-950">{value}</p></div>; }

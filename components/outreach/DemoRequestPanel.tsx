"use client";

import { useEffect, useMemo, useState } from "react";

type DemoRequest = {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  website: string | null;
  market: string | null;
  challenge: string | null;
  preferredTime: string | null;
  status: string;
  createdAt: string;
};

export default function DemoRequestPanel() {
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/demo/requests", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json() as { success?: boolean; requests?: DemoRequest[]; message?: string };
        if (!response.ok || !result.success) throw new Error(result.message || "Demo requests could not be loaded.");
        if (active) {
          setRequests(result.requests ?? []);
          setError("");
        }
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : "Demo requests could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  async function move(request: DemoRequest, status: string) {
    const previous = requests;
    setUpdating(request.id);
    setRequests((current) => current.map((item) => item.id === request.id ? { ...item, status } : item));
    try {
      const response = await fetch(`/api/demo/requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await response.json() as { success?: boolean; message?: string };
      if (!response.ok || !result.success) throw new Error(result.message || "Demo request could not be updated.");
    } catch (reason) {
      setRequests(previous);
      setError(reason instanceof Error ? reason.message : "Demo request could not be updated.");
    } finally {
      setUpdating(null);
    }
  }

  const counts = useMemo(() => ({
    new: requests.filter((item) => item.status === "new").length,
    contacted: requests.filter((item) => item.status === "contacted").length,
    booked: requests.filter((item) => item.status === "booked").length,
    won: requests.filter((item) => item.status === "won").length,
  }), [requests]);
  const active = requests.filter((item) => !["lost", "won"].includes(item.status)).slice(0, 12);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#d8e1ee] bg-white shadow-xl">
      <div className="border-b border-[#e0e7f0] bg-[#f6f9fd] p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.19em] text-[#1555c6]">Inbound demonstrations</p>
            <h2 className="font-display mt-2 text-3xl font-semibold text-[#06142f] md:text-4xl">People asking to see EMBUR work.</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#66758d]">Every request from getembur.com/demo appears here. Contact new requests first.</p>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <Metric value={counts.new} label="new" />
            <Metric value={counts.contacted} label="contacted" />
            <Metric value={counts.booked} label="booked" />
            <Metric value={counts.won} label="won" />
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8">
        {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
        {loading ? (
          <p className="rounded-2xl bg-[#f5f8fc] p-8 text-center text-[#66758d]">Loading demonstration requests…</p>
        ) : active.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#cbd7e8] bg-[#f8fafd] p-8 text-center">
            <p className="font-display text-2xl font-semibold text-[#06142f]">No inbound demo request yet.</p>
            <p className="mt-2 text-[#66758d]">The public booking page is live at getembur.com/demo and ready to receive one.</p>
          </div>
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {active.map((request) => (
              <article key={request.id} className="rounded-2xl border border-[#dce4ef] bg-[#fbfcfe] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#7188ad]">{request.market || "Market not supplied"}</p>
                    <h3 className="font-display mt-1 text-xl font-semibold text-[#06142f]">{request.businessName}</h3>
                    <p className="mt-1 text-sm font-semibold text-[#596a85]">{request.name}</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-800">{request.status}</span>
                </div>
                {request.challenge && <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#66758d]">{request.challenge}</p>}
                {request.preferredTime && <p className="mt-3 text-xs font-bold text-[#596a85]">Best time: {request.preferredTime}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={`tel:${request.phone.replace(/[^\d+]/g, "")}`} className="rounded-xl bg-[#1555c6] px-4 py-2.5 text-sm font-extrabold text-white">Call {request.phone}</a>
                  <a href={`mailto:${request.email}`} className="rounded-xl border border-[#d3dce9] bg-white px-4 py-2.5 text-sm font-extrabold text-[#1555c6]">Email</a>
                  {request.status === "new" && <button type="button" disabled={updating === request.id} onClick={() => move(request, "contacted")} className="rounded-xl bg-[#06142f] px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-50">Mark contacted</button>}
                  {request.status === "contacted" && <button type="button" disabled={updating === request.id} onClick={() => move(request, "booked")} className="rounded-xl bg-[#ff6a3d] px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-50">Demo booked</button>}
                  {request.status === "booked" && <button type="button" disabled={updating === request.id} onClick={() => move(request, "won")} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-50">Won</button>}
                  <button type="button" disabled={updating === request.id} onClick={() => move(request, "lost")} className="rounded-xl border border-[#d3dce9] bg-white px-4 py-2.5 text-sm font-extrabold text-[#596a85] disabled:opacity-50">Not a fit</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return <div className="min-w-16 rounded-xl border border-[#dce4ef] bg-white p-3"><p className="font-display text-xl font-semibold text-[#06142f]">{value}</p><p className="text-[8px] font-extrabold uppercase tracking-wider text-[#7188ad]">{label}</p></div>;
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { getAgentState, type StoredProspect, updateStoredProspect } from "@/services/agentStateApi";

function publicPhone(notes: string | null) {
  return notes?.match(/Public phone:\s*([+()\d\s.-]+)/i)?.[1]?.trim() || null;
}

function callOpener(prospect: StoredProspect) {
  return `Hi, is the owner or manager available? My name is Joon with EMBUR. We help HVAC companies recover missed and after-hours calls before those jobs go to the next contractor. I noticed ${prospect.company} serves ${prospect.location || "the local market"}. I am not calling to lock you into anything—I would like to show you a short working demo and see whether it could recover revenue for your team. Would a 15-minute look this week be unreasonable?`;
}

export default function FirstRevenueQueue() {
  const [prospects, setProspects] = useState<StoredProspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const state = await getAgentState();
      setProspects(state.prospects);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The first-revenue queue could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    getAgentState()
      .then((state) => {
        if (active) setProspects(state.prospects);
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : "The first-revenue queue could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const counts = useMemo(() => ({
    research: prospects.filter((prospect) => prospect.stage === "research").length,
    review: prospects.filter((prospect) => prospect.stage === "draft").length,
    approved: prospects.filter((prospect) => prospect.stage === "approved").length,
    contacted: prospects.filter((prospect) => ["sent", "replied", "demo", "won"].includes(prospect.stage)).length,
  }), [prospects]);

  const queue = useMemo(
    () => prospects
      .filter((prospect) => ["research", "draft", "approved", "sent", "replied", "demo"].includes(prospect.stage))
      .sort((a, b) => {
        const order: Record<string, number> = { replied: 0, demo: 1, approved: 2, sent: 3, draft: 4, research: 5 };
        return (order[a.stage] ?? 6) - (order[b.stage] ?? 6);
      })
      .slice(0, 16),
    [prospects]
  );

  async function move(prospect: StoredProspect, stage: string) {
    const previous = prospects;
    setUpdatingId(prospect.id);
    setError("");
    setProspects(prospects.map((item) => item.id === prospect.id ? { ...item, stage } : item));
    try {
      await updateStoredProspect(prospect.id, { stage });
    } catch (reason) {
      setProspects(previous);
      setError(reason instanceof Error ? reason.message : "That prospect could not be updated.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function copy(prospect: StoredProspect) {
    await navigator.clipboard.writeText(callOpener(prospect));
    setCopiedId(prospect.id);
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#d8e1ee] bg-white shadow-xl">
      <div className="border-b border-[#e0e7f0] bg-[#f6f9fd] p-6 md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.19em] text-[#e8532e]">First revenue queue</p>
            <h2 className="font-display mt-2 text-3xl font-semibold text-[#06142f] md:text-4xl">Turn research into conversations.</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#66758d]">Verifier checks the evidence. You approve the best businesses. Hunter gives you a respectful opener. Nothing is sent automatically.</p>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <QueueMetric value={counts.research} label="research" />
            <QueueMetric value={counts.review} label="review" />
            <QueueMetric value={counts.approved} label="approved" />
            <QueueMetric value={counts.contacted} label="contacted" />
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
        {loading ? (
          <p className="rounded-2xl bg-[#f5f8fc] p-8 text-center text-[#66758d]">Loading verified businesses…</p>
        ) : queue.length === 0 ? (
          <p className="rounded-2xl bg-emerald-50 p-8 text-center font-semibold text-emerald-900">The research queue is clear. Run today&apos;s shift to collect or verify the next market.</p>
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {queue.map((prospect) => {
              const phone = publicPhone(prospect.notes);
              return (
                <article key={prospect.id} className="rounded-2xl border border-[#dce4ef] bg-[#fbfcfe] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#7188ad]">{prospect.location || "Location unavailable"}</p>
                      <h3 className="font-display mt-1 text-xl font-semibold text-[#06142f]">{prospect.company}</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider ${
                      prospect.stage === "approved" ? "bg-emerald-100 text-emerald-800"
                        : prospect.stage === "replied" || prospect.stage === "demo" ? "bg-orange-100 text-orange-800"
                          : prospect.stage === "sent" ? "bg-violet-100 text-violet-800"
                            : prospect.stage === "draft" ? "bg-blue-100 text-blue-800"
                              : "bg-slate-100 text-slate-700"
                    }`}>{prospect.stage === "draft" ? "verified" : prospect.stage === "sent" ? "called" : prospect.stage === "replied" ? "interested" : prospect.stage}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm">
                    {phone && <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="rounded-lg border border-[#d3dce9] bg-white px-3 py-2 font-bold text-[#1555c6]">{phone}</a>}
                    {prospect.website && <a href={prospect.website} target="_blank" rel="noreferrer" className="rounded-lg border border-[#d3dce9] bg-white px-3 py-2 font-bold text-[#1555c6]">Website ↗</a>}
                    {prospect.sourceUrl && <a href={prospect.sourceUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-[#d3dce9] bg-white px-3 py-2 font-bold text-[#596a85]">Public source ↗</a>}
                  </div>
                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#66758d]">{prospect.notes || "Public record awaiting verification."}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {prospect.stage === "research" && <button type="button" onClick={() => move(prospect, "draft")} className="rounded-xl bg-[#06142f] px-4 py-2.5 text-sm font-extrabold text-white">Mark verified</button>}
                    {prospect.stage === "draft" && <button type="button" onClick={() => move(prospect, "approved")} className="rounded-xl bg-[#ff6a3d] px-4 py-2.5 text-sm font-extrabold text-white">Approve for Hunter</button>}
                    {prospect.stage === "approved" && <button type="button" onClick={() => copy(prospect)} className="rounded-xl bg-[#06142f] px-4 py-2.5 text-sm font-extrabold text-white">{copiedId === prospect.id ? "Opener copied" : "Copy call opener"}</button>}
                    {prospect.stage === "approved" && phone && <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="rounded-xl bg-[#1555c6] px-4 py-2.5 text-sm font-extrabold text-white">Call now</a>}
                    {prospect.stage === "approved" && <button type="button" disabled={updatingId === prospect.id} onClick={() => move(prospect, "sent")} className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-extrabold text-violet-800 disabled:opacity-50">Mark called</button>}
                    {prospect.stage === "sent" && <button type="button" disabled={updatingId === prospect.id} onClick={() => move(prospect, "replied")} className="rounded-xl bg-[#ff6a3d] px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-50">Owner interested</button>}
                    {prospect.stage === "sent" && <button type="button" disabled={updatingId === prospect.id} onClick={() => move(prospect, "lost")} className="rounded-xl border border-[#d3dce9] bg-white px-4 py-2.5 text-sm font-extrabold text-[#596a85] disabled:opacity-50">Not a fit</button>}
                    {prospect.stage === "replied" && <button type="button" disabled={updatingId === prospect.id} onClick={() => move(prospect, "demo")} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-50">Demo booked</button>}
                    {prospect.stage === "replied" && <button type="button" disabled={updatingId === prospect.id} onClick={() => move(prospect, "lost")} className="rounded-xl border border-[#d3dce9] bg-white px-4 py-2.5 text-sm font-extrabold text-[#596a85] disabled:opacity-50">Not a fit</button>}
                    {prospect.stage === "demo" && <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-extrabold text-emerald-800">Ready for Closer</span>}
                    {["draft", "approved"].includes(prospect.stage) && <button type="button" disabled={updatingId === prospect.id} onClick={() => move(prospect, "research")} className="rounded-xl border border-[#d3dce9] bg-white px-4 py-2.5 text-sm font-extrabold text-[#596a85] disabled:opacity-50">Needs research</button>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm leading-6 text-orange-950 sm:flex-row sm:items-center sm:justify-between">
          <p><strong>Today&apos;s highest-value move:</strong> approve ten strong businesses, call them personally, and ask for a 15-minute live demonstration.</p>
          <button type="button" onClick={load} disabled={loading} className="shrink-0 rounded-xl border border-orange-300 bg-white px-4 py-2.5 font-extrabold text-orange-900">Refresh queue</button>
        </div>
      </div>
    </section>
  );
}

function QueueMetric({ value, label }: { value: number; label: string }) {
  return <div className="min-w-16 rounded-xl border border-[#dce4ef] bg-white p-3"><p className="font-display text-xl font-semibold text-[#06142f]">{value}</p><p className="text-[8px] font-extrabold uppercase tracking-wider text-[#7188ad]">{label}</p></div>;
}

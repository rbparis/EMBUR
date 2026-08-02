"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  GrowthAgentArtifact,
  GrowthAgentKind,
  GrowthAgentRequest,
} from "@/lib/growth-agents/content";
import { generateGrowthAgentArtifact } from "@/services/growthAgentApi";
import {
  getAgentState,
  publishStoredArticle,
  updateStoredArtifact,
} from "@/services/agentStateApi";

type QueueStatus = "draft" | "approved" | "completed" | "published" | "held";

type QueueItem = GrowthAgentArtifact & {
  id: string;
  source: "openai" | "template";
  status: QueueStatus;
  createdAt: string;
};

const agents: Array<{
  kind: GrowthAgentKind;
  name: string;
  mission: string;
  outcome: string;
  color: string;
}> = [
  { kind: "social", name: "Pulse", mission: "Posts and responds with a consistent human voice.", outcome: "Attention → conversations", color: "bg-violet-600" },
  { kind: "seo", name: "Rank", mission: "Creates useful keyword-led articles that earn discovery.", outcome: "Search → qualified visits", color: "bg-blue-600" },
  { kind: "research", name: "Scout", mission: "Finds and qualifies public business opportunities.", outcome: "Research → Hunter queue", color: "bg-emerald-600" },
];

const defaults: Record<GrowthAgentKind, { topic: string; audience: string; location: string; channel: string }> = {
  social: { topic: "Why one missed HVAC call can become a lost job", audience: "Independent HVAC owners", location: "", channel: "LinkedIn" },
  seo: { topic: "HVAC missed call recovery", audience: "HVAC business owners", location: "United States", channel: "EMBUR blog" },
  research: { topic: "HVAC contractors", audience: "Independent HVAC owners", location: "Charlotte, NC", channel: "Public business sources" },
};

export default function GrowthAgentOperationsPanel() {
  const [activeKind, setActiveKind] = useState<GrowthAgentKind>("social");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAgentState()
      .then(({ artifacts }) => {
        if (!active) return;
        const restored = artifacts.map((artifact): QueueItem => ({
          id: artifact.id,
          kind: artifact.kind,
          title: artifact.title,
          summary: artifact.summary,
          content: artifact.content,
          checklist: artifact.checklist ?? [],
          source: "openai",
          status: artifact.status as QueueStatus,
          createdAt: artifact.createdAt,
        }));
        setQueue(restored);
        setSelectedId(restored[0]?.id ?? null);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "The agent workspace could not be loaded."))
      .finally(() => setWorkspaceLoading(false));
    return () => { active = false; };
  }, []);

  function save(next: QueueItem[]) {
    setQueue(next);
  }

  async function createAssignment(formData: FormData) {
    setLoading(true);
    setError("");
    setCopied(false);

    const request: GrowthAgentRequest = {
      kind: activeKind,
      topic: String(formData.get("topic") ?? "").trim(),
      audience: String(formData.get("audience") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
      channel: String(formData.get("channel") ?? "").trim(),
      notes: String(formData.get("notes") ?? "").trim(),
    };

    try {
      const result = await generateGrowthAgentArtifact(request);
      const item: QueueItem = {
        ...result.artifact,
        id: result.artifactId,
        source: result.source,
        status: "draft",
        createdAt: new Date().toISOString(),
      };
      save([item, ...queue]);
      setSelectedId(item.id);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The agent could not complete this assignment.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: QueueStatus) {
    save(queue.map((item) => item.id === id ? { ...item, status } : item));
    try {
      await updateStoredArtifact(id, status);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The agent could not save that update.");
    }
  }

  async function publishArticle(id: string) {
    setLoading(true);
    setError("");
    try {
      const post = await publishStoredArticle(id);
      save(queue.map((item) => item.id === id ? { ...item, status: "published" } : item));
      window.open(post.url, "_blank", "noopener,noreferrer");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Rank could not publish that article.");
    } finally {
      setLoading(false);
    }
  }

  const activeAgent = agents.find((agent) => agent.kind === activeKind) ?? agents[0];
  const selected = queue.find((item) => item.id === selectedId) ?? queue[0];
  const counts = useMemo(() => ({
    drafts: queue.filter((item) => item.status === "draft").length,
    approved: queue.filter((item) => item.status === "approved").length,
    completed: queue.filter((item) => ["completed", "published"].includes(item.status)).length,
  }), [queue]);

  async function copyArtifact() {
    if (!selected) return;
    await navigator.clipboard.writeText(`${selected.title}\n\n${selected.content}`);
    setCopied(true);
  }

  return (
    <section className="rounded-[2rem] border border-[#d8e1ee] bg-white p-6 shadow-xl md:p-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div><p className="text-xs font-extrabold uppercase tracking-[0.19em] text-[#1555c6]">Growth operations</p><h2 className="font-display mt-2 text-3xl font-semibold text-[#06142f] md:text-4xl">Three agents. Three clear jobs.</h2><p className="mt-3 max-w-2xl leading-7 text-[#66758d]">Create the work here, approve it once, and connect publishing and research sources when you are ready.</p></div>
        <div className="flex gap-2 text-center"><MiniMetric value={counts.drafts} label="drafts" /><MiniMetric value={counts.approved} label="approved" /><MiniMetric value={counts.completed} label="completed" /></div>
      </div>

      <div className="mt-7 grid gap-3 lg:grid-cols-3">
        {agents.map((agent) => (
          <button key={agent.kind} type="button" onClick={() => { setActiveKind(agent.kind); setCopied(false); }} className={`rounded-2xl border p-5 text-left transition ${activeKind === agent.kind ? "border-[#246bfe] bg-[#edf3ff] shadow-sm" : "border-[#dce4ef] hover:bg-[#f7f9fc]"}`}>
            <div className="flex items-center gap-3"><span className={`flex h-10 w-10 items-center justify-center rounded-xl font-display text-lg font-semibold text-white ${agent.color}`}>{agent.name.slice(0, 1)}</span><div><p className="font-display text-xl font-semibold text-[#06142f]">{agent.name}</p><p className="text-[10px] font-extrabold uppercase tracking-wider text-[#7188ad]">{agent.outcome}</p></div></div>
            <p className="mt-3 text-sm leading-6 text-[#66758d]">{agent.mission}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <form key={activeKind} action={createAssignment} className="rounded-2xl bg-[#f5f8fc] p-5 md:p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#1555c6]">Assign {activeAgent.name}</p>
          <h3 className="font-display mt-2 text-2xl font-semibold text-[#06142f]">{activeAgent.mission}</h3>
          <div className="mt-5 space-y-3">
            <AgentField name="topic" label={activeKind === "seo" ? "Primary keyword" : activeKind === "research" ? "Business type" : "Post topic"} defaultValue={defaults[activeKind].topic} />
            <AgentField name="audience" label="Audience" defaultValue={defaults[activeKind].audience} />
            <div className="grid gap-3 sm:grid-cols-2">
              <AgentField name="location" label="Market" defaultValue={defaults[activeKind].location} />
              <AgentField name="channel" label={activeKind === "research" ? "Sources" : "Channel"} defaultValue={defaults[activeKind].channel} />
            </div>
            <label className="block text-sm font-bold text-[#33435c]">Direction<textarea name="notes" rows={3} placeholder="Tone, offer, exclusions, or a fact the agent should use…" className="mt-1.5 w-full resize-none rounded-xl border border-[#cfd9e8] bg-white px-4 py-3 font-normal text-[#06142f] outline-none focus:border-[#246bfe] focus:ring-4 focus:ring-blue-100" /></label>
            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
            <button disabled={loading} className="w-full rounded-xl bg-[#06142f] px-5 py-3.5 font-extrabold text-white transition hover:bg-[#1555c6] disabled:cursor-wait disabled:opacity-60">{loading ? `${activeAgent.name} is working…` : `Give assignment to ${activeAgent.name}`}</button>
          </div>
        </form>

        <div className="min-w-0 rounded-2xl border border-[#dce4ef] p-5 md:p-6">
          {workspaceLoading ? (
            <div className="flex min-h-[390px] items-center justify-center text-center"><div><p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#7188ad]">Agents are checking their desks</p><p className="mt-3 text-[#66758d]">Loading saved work…</p></div></div>
          ) : !selected ? (
            <div className="flex min-h-[390px] items-center justify-center text-center"><div><p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#7188ad]">No work staged</p><h3 className="font-display mt-3 text-3xl font-semibold text-[#06142f]">Give an agent its first assignment.</h3></div></div>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#1555c6]">{agents.find((agent) => agent.kind === selected.kind)?.name} output</p><h3 className="font-display mt-2 text-2xl font-semibold text-[#06142f]">{selected.title}</h3><p className="mt-2 text-sm text-[#7188ad]">{selected.summary} · {selected.source === "openai" ? "AI prepared" : "EMBUR template"}</p></div><span className="rounded-full bg-[#edf2f8] px-3 py-1.5 text-xs font-extrabold capitalize text-[#52637e]">{selected.status}</span></div>
              <div className="mt-5 max-h-[410px] overflow-y-auto rounded-xl bg-[#f8faff] p-5"><p className="whitespace-pre-wrap text-sm leading-7 text-[#33435c]">{selected.content}</p></div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">{selected.checklist.map((item) => <div key={item} className="flex gap-2 rounded-xl bg-[#f4f7fb] p-3 text-xs leading-5 text-[#596a85]"><span className="font-black text-[#246bfe]">✓</span>{item}</div>)}</div>
              <div className="mt-5 flex flex-wrap gap-2">
                {selected.status === "draft" && <button type="button" onClick={() => updateStatus(selected.id, "approved")} className="rounded-xl bg-[#06142f] px-5 py-3 text-sm font-extrabold text-white">Approve</button>}
                <button type="button" onClick={copyArtifact} className="rounded-xl border border-[#cfd9e8] px-5 py-3 text-sm font-extrabold text-[#06142f]">{copied ? "Copied" : "Copy work"}</button>
                {selected.status === "approved" && selected.kind === "seo" && <button disabled={loading} type="button" onClick={() => publishArticle(selected.id)} className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-extrabold text-emerald-800 disabled:opacity-60">{loading ? "Publishing…" : "Publish to EMBUR"}</button>}
                {selected.status === "approved" && selected.kind !== "seo" && <button type="button" onClick={() => updateStatus(selected.id, "completed")} className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-extrabold text-emerald-800">{selected.kind === "research" ? "Research completed" : "Mark published"}</button>}
              </div>
            </>
          )}
        </div>
      </div>

      {queue.length > 0 && <div className="mt-6 flex gap-2 overflow-x-auto pb-1">{queue.map((item) => <button key={item.id} type="button" onClick={() => { setSelectedId(item.id); setActiveKind(item.kind); setCopied(false); }} className={`min-w-56 rounded-xl border p-4 text-left ${selected?.id === item.id ? "border-[#246bfe] bg-[#edf3ff]" : "border-[#dce4ef]"}`}><p className="text-[10px] font-extrabold uppercase tracking-wider text-[#7188ad]">{agents.find((agent) => agent.kind === item.kind)?.name} · {item.status}</p><p className="mt-2 line-clamp-2 text-sm font-bold text-[#06142f]">{item.title}</p></button>)}</div>}

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Connection status:</strong> Rank can publish approved field notes directly to EMBUR. Social posting, comment replies, and continuous public-source lead collection remain staged until each account and approval rule is connected.</div>
    </section>
  );
}

function AgentField({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return <label className="block text-sm font-bold text-[#33435c]">{label}<input name={name} defaultValue={defaultValue} required className="mt-1.5 w-full rounded-xl border border-[#cfd9e8] bg-white px-4 py-3 font-normal text-[#06142f] outline-none focus:border-[#246bfe] focus:ring-4 focus:ring-blue-100" /></label>;
}

function MiniMetric({ value, label }: { value: number; label: string }) {
  return <div className="min-w-20 rounded-xl bg-[#f1f5fa] p-3"><p className="font-display text-xl font-semibold text-[#06142f]">{value}</p><p className="text-[9px] font-extrabold uppercase tracking-wider text-[#7188ad]">{label}</p></div>;
}

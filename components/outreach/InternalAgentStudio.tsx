"use client";

import { useEffect, useMemo, useState } from "react";
import {
  internalAgentIds,
  internalAgents,
  type AgentPermission,
  type InternalAgentId,
} from "@/lib/internal-agents/agents";
import {
  assignInternalAgent,
  fetchInternalAgent,
  type InternalAgentMessage,
  type InternalAgentTask,
} from "@/services/internalAgentApi";
import { updateStoredTask } from "@/services/agentStateApi";

const permissionLabels: Record<AgentPermission, string> = {
  public_research: "Research public sources",
  create_drafts: "Create drafts",
  save_to_hq: "Save work to HQ",
  publish_approved_blog: "Publish approved field notes",
  review_gmail: "Review EMBUR Gmail",
};

const colorClasses: Record<string, string> = {
  blue: "bg-blue-600",
  emerald: "bg-emerald-600",
  orange: "bg-orange-500",
  violet: "bg-violet-600",
  cyan: "bg-cyan-600",
};

export default function InternalAgentStudio() {
  const [selected, setSelected] = useState<InternalAgentId>("atlas");
  const [messages, setMessages] = useState<InternalAgentMessage[]>([]);
  const [tasks, setTasks] = useState<InternalAgentTask[]>([]);
  const [permissions, setPermissions] = useState<AgentPermission[]>([]);
  const [continuous, setContinuous] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const definition = internalAgents[selected];

  useEffect(() => {
    let active = true;
    fetchInternalAgent(selected)
      .then((result) => {
        if (!active) return;
        setMessages(result.messages);
        setTasks(result.tasks);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "The agent could not be loaded."))
      .finally(() => setLoading(false));
    return () => { active = false; };
  }, [definition.permissions, selected]);

  function selectAgent(agentId: InternalAgentId) {
    setLoading(true);
    setError("");
    setPermissions(internalAgents[agentId].permissions);
    setSelected(agentId);
  }

  const activeTasks = useMemo(
    () => tasks.filter((task) => !["completed", "held"].includes(task.status)),
    [tasks]
  );

  function togglePermission(permission: AgentPermission) {
    setPermissions((current) =>
      current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission]
    );
  }

  async function submitAssignment(formData: FormData) {
    const assignment = String(formData.get("assignment") ?? "").trim();
    if (!assignment) return;
    setSubmitting(true);
    setError("");
    try {
      const result = await assignInternalAgent(selected, { assignment, permissions, continuous });
      setMessages((current) => [
        ...current,
        {
          id: `founder-${result.task.id}`,
          agent: selected,
          role: "founder",
          content: assignment,
          taskId: result.task.id,
          createdAt: new Date().toISOString(),
        },
        result.message,
      ]);
      setTasks((current) => [result.task, ...current]);
      const form = document.getElementById("internal-agent-assignment") as HTMLFormElement | null;
      form?.reset();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The agent could not accept that assignment.");
    } finally {
      setSubmitting(false);
    }
  }

  async function completeTask(id: string) {
    const previous = tasks;
    setTasks(tasks.map((task) => task.id === id ? { ...task, status: "completed" } : task));
    try {
      await updateStoredTask(id, "completed");
    } catch (reason) {
      setTasks(previous);
      setError(reason instanceof Error ? reason.message : "The task could not be updated.");
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-[#1b3a70] bg-[#031027] text-white shadow-2xl">
        <div className="grid xl:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="border-b border-white/10 bg-white/[0.035] p-4 xl:border-b-0 xl:border-r md:p-5">
            <p className="px-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#8fb4ff]">Private EMBUR office</p>
            <h2 className="font-display px-2 pt-2 text-2xl font-semibold">Agent Studio</h2>
            <div className="mt-5 grid grid-cols-2 gap-2 xl:grid-cols-1">
              {internalAgentIds.map((agentId) => {
                const agent = internalAgents[agentId];
                const isActive = selected === agentId;
                return (
                  <button key={agentId} type="button" onClick={() => selectAgent(agentId)} className={`rounded-2xl border p-3 text-left transition ${isActive ? "border-white/20 bg-white text-[#06142f]" : "border-white/5 bg-white/[0.045] text-white hover:bg-white/[0.09]"}`}>
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display font-semibold text-white ${colorClasses[agent.color]}`}>{agent.name.slice(0, 1)}</span>
                      <div className="min-w-0"><p className="font-bold">{agent.name}</p><p className={`truncate text-[10px] font-extrabold uppercase tracking-wider ${isActive ? "text-[#7188ad]" : "text-[#8297b8]"}`}>{agent.title}</p></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="p-5 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-200">{definition.title}</p>
                <h1 className="font-display mt-2 text-4xl font-semibold">{definition.name}</h1>
                <p className="mt-3 max-w-3xl leading-7 text-[#b8c7de]">{definition.mission}</p>
                <p className="mt-2 text-sm font-semibold text-[#8297b8]">{definition.boundary}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-center"><p className="font-display text-3xl font-semibold">{activeTasks.length}</p><p className="text-[10px] font-extrabold uppercase tracking-wider text-[#8297b8]">active assignments</p></div>
            </div>

            <div className="mt-7 grid gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
              <div>
                <div className="max-h-[460px] min-h-[320px] space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-[#06142f] p-4 md:p-5">
                  {loading && <p className="text-center text-sm text-[#8297b8]">Opening {definition.name}’s workspace…</p>}
                  {!loading && !messages.length && (
                    <div className="flex min-h-[280px] items-center justify-center text-center">
                      <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8fb4ff]">Dedicated workspace ready</p><h3 className="font-display mt-3 text-2xl font-semibold">Give {definition.name} the first assignment.</h3><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#8297b8]">This conversation and its work queue remain attached only to {definition.name}.</p></div>
                    </div>
                  )}
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === "founder" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 md:px-5 ${message.role === "founder" ? "bg-[#246bfe] text-white" : "border border-white/10 bg-white/[0.07] text-[#d5e1f7]"}`}>
                        <p className="mb-1 text-[9px] font-extrabold uppercase tracking-[0.16em] opacity-70">{message.role === "founder" ? "Joon" : definition.name}</p>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form id="internal-agent-assignment" action={submitAssignment} className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <label className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8fb4ff]">Message {definition.name}</label>
                  <textarea name="assignment" required rows={4} placeholder={`Tell ${definition.name} exactly what to own, produce, watch, or improve…`} className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-[#04112b] px-4 py-3 text-white outline-none placeholder:text-[#607495] focus:border-blue-400" />
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#b8c7de]"><input type="checkbox" checked={continuous} onChange={(event) => setContinuous(event.target.checked)} className="h-4 w-4 accent-orange-500" />Keep working until completed or held</label>
                    <button disabled={submitting} className="rounded-xl bg-[#ff6a3d] px-5 py-3 font-extrabold text-white disabled:opacity-60">{submitting ? `${definition.name} is accepting…` : "Assign work"}</button>
                  </div>
                </form>
                {error && <p className="mt-3 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">{error}</p>}
              </div>

              <aside className="space-y-4">
                <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                  <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#8fb4ff]">Permission envelope</p>
                  <div className="mt-4 space-y-3">
                    {definition.permissions.map((permission) => (
                      <label key={permission} className="flex items-start gap-3 rounded-xl bg-white/[0.045] p-3 text-sm text-[#d5e1f7]">
                        <input type="checkbox" checked={permissions.includes(permission)} onChange={() => togglePermission(permission)} className="mt-0.5 h-4 w-4 accent-orange-500" />
                        <span>{permissionLabels[permission]}</span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-4 text-xs leading-5 text-[#7188ad]">Sending email or text, posting publicly, and spending money are never included here. Those require a separate action approval.</p>
                </section>

                <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                  <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#8fb4ff]">{definition.name}’s queue</p>
                  <div className="mt-4 space-y-3">
                    {!tasks.length && <p className="text-sm text-[#8297b8]">No assignments yet.</p>}
                    {tasks.slice(0, 8).map((task) => (
                      <article key={task.id} className="rounded-xl bg-white/[0.05] p-3">
                        <div className="flex items-start justify-between gap-2"><p className="text-sm font-bold text-white">{task.title}</p><span className="rounded-full bg-white/[0.08] px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#8fb4ff]">{task.status}</span></div>
                        {task.status !== "completed" && <button type="button" onClick={() => completeTask(task.id)} className="mt-3 text-xs font-extrabold text-emerald-300">Mark complete</button>}
                      </article>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

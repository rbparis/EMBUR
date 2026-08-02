"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getAgentState,
  runDailyAgents,
  type StoredAgentTask,
  updateStoredTask,
} from "@/services/agentStateApi";

const agentColors: Record<string, string> = {
  atlas: "bg-blue-600",
  hunter: "bg-orange-500",
  pulse: "bg-violet-600",
  rank: "bg-blue-500",
  scout: "bg-emerald-600",
  verifier: "bg-cyan-600",
  closer: "bg-amber-600",
  launch: "bg-indigo-600",
  keeper: "bg-fuchsia-600",
  relay: "bg-cyan-600",
};

export default function DailyAgentControlPanel() {
  const [tasks, setTasks] = useState<StoredAgentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAgentState()
      .then((state) => {
        if (active) setTasks(state.tasks);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Atlas could not load today’s work."))
      .finally(() => setLoading(false));
    return () => { active = false; };
  }, []);

  const today = useMemo(() => {
    const utcDate = new Date().toISOString().slice(0, 10);
    return tasks.filter((task) => {
      const scheduled = task.scheduledFor ? new Date(task.scheduledFor) : new Date(task.createdAt);
      return scheduled.toISOString().slice(0, 10) === utcDate;
    });
  }, [tasks]);
  const waiting = today.filter((task) => task.status === "pending").length;
  const finished = today.filter((task) => task.status === "completed").length;
  const blocked = today.filter((task) => task.status === "held").length;

  async function startShift() {
    setLoading(true);
    setError("");
    try {
      setTasks(await runDailyAgents());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Atlas could not start today’s shift.");
    } finally {
      setLoading(false);
    }
  }

  async function decide(id: string, status: string) {
    const previous = tasks;
    setTasks(tasks.map((task) => task.id === id ? { ...task, status } : task));
    try {
      await updateStoredTask(id, status);
    } catch (reason) {
      setTasks(previous);
      setError(reason instanceof Error ? reason.message : "Atlas could not save that decision.");
    }
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#d8e1ee] bg-white shadow-xl">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="bg-[#071832] p-6 text-white md:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8fb4ff]">Atlas manager brief</p>
          <h2 className="font-display mt-3 text-3xl font-semibold">Today’s shift.</h2>
          <p className="mt-4 leading-7 text-[#a8b9d4]">
            {today.length
              ? `${today.length} focused assignments are on the floor. ${finished} completed, ${blocked} blocked, and ${waiting} waiting.`
              : "No assignments have been created for today. Start the shift and Atlas will assign and execute every safe revenue-focused job."}
          </p>
          <button type="button" disabled={loading} onClick={startShift} className="mt-6 rounded-xl bg-[#ff6a3d] px-5 py-3 font-extrabold text-white transition hover:bg-[#e8532e] disabled:opacity-60">
            {loading ? "Agents are working…" : today.length ? "Run today’s shift again" : "Start and run today’s shift"}
          </button>
          <div className="mt-6 grid grid-cols-3 gap-2">
            <BriefMetric value={today.length} label="assigned" />
            <BriefMetric value={blocked} label="blocked" />
            <BriefMetric value={finished} label="done" />
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1555c6]">Daily operating queue</p>
              <h3 className="font-display mt-2 text-3xl font-semibold text-[#06142f]">One clear job per agent.</h3>
            </div>
            <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-extrabold text-orange-700">{waiting} waiting</span>
          </div>
          {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
          <div className="mt-6 space-y-3">
            {!loading && !today.length && <div className="rounded-2xl bg-[#f5f8fc] p-6 text-center text-[#66758d]">Start the shift to create today’s assignments.</div>}
            {today.map((task) => (
              <article key={task.id} className="rounded-2xl border border-[#dce4ef] bg-[#f8faff] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display font-semibold uppercase text-white ${agentColors[task.agent] ?? "bg-slate-600"}`}>{task.agent.slice(0, 1)}</span>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#7188ad]">{task.agent}</p>
                      <h4 className="mt-1 font-display text-xl font-semibold text-[#06142f]">{task.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-[#66758d]">{task.description}</p>
                      {task.result && (
                        <div className={`mt-3 rounded-xl px-4 py-3 text-sm leading-6 ${task.status === "held" ? "border border-amber-200 bg-amber-50 text-amber-950" : "border border-emerald-100 bg-emerald-50 text-emerald-950"}`}>
                          <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] opacity-70">{task.status === "held" ? "Blocker" : "Agent output"}</p>
                          <p className="mt-1">{task.result.replace(/^BLOCKER:\s*/i, "")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="w-fit rounded-full bg-[#e9f0ff] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#1555c6]">{task.status}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {task.status !== "completed" && <button type="button" onClick={() => decide(task.id, "completed")} className="rounded-xl bg-[#06142f] px-4 py-2.5 text-sm font-extrabold text-white">Mark complete</button>}
                  {task.status !== "held" && task.status !== "completed" && <button type="button" onClick={() => decide(task.id, "held")} className="rounded-xl border border-[#cbd5e1] bg-white px-4 py-2.5 text-sm font-extrabold text-[#596a85]">Hold</button>}
                  {task.status === "held" && <button type="button" onClick={() => decide(task.id, "pending")} className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-extrabold text-blue-800">Return to queue</button>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BriefMetric({ value, label }: { value: number; label: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3 text-center"><p className="font-display text-xl font-semibold">{value}</p><p className="mt-1 text-[9px] font-extrabold uppercase tracking-wider text-[#8297b8]">{label}</p></div>;
}

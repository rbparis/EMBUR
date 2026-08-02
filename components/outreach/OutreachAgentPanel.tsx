"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  OutreachEmailDraft,
  OutreachProspectInput,
} from "@/lib/outreach/sequence";
import { generateOutreachSequence } from "@/services/outreachApi";
import { getAgentState, updateStoredProspect } from "@/services/agentStateApi";

type OutreachStage = "draft" | "approved" | "sent" | "replied" | "demo" | "won" | "lost" | "opted_out";

type OutreachProspect = OutreachProspectInput & {
  id: string;
  stage: OutreachStage;
  drafts: OutreachEmailDraft[];
  activeStep: 1 | 2 | 3;
  source: "openai" | "template";
  plan: string | null;
  monthlyRevenue: number;
  createdAt: string;
};

const stageLabels: Record<OutreachStage, string> = {
  draft: "Draft",
  approved: "Approved",
  sent: "Sent",
  replied: "Replied",
  demo: "Demo booked",
  won: "Customer",
  lost: "Closed",
  opted_out: "Opted out",
};

export default function OutreachAgentPanel() {
  const [prospects, setProspects] = useState<OutreachProspect[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAgentState()
      .then(({ prospects: stored }) => {
        if (!active) return;
        const restored = stored
          .filter((prospect) => Array.isArray(prospect.sequence) && prospect.sequence.length === 3)
          .map((prospect): OutreachProspect => ({
            id: prospect.id,
            company: prospect.company,
            ownerName: prospect.ownerName ?? "",
            email: prospect.email ?? "",
            city: prospect.location ?? "",
            notes: prospect.notes ?? "",
            stage: prospect.stage as OutreachStage,
            drafts: prospect.sequence ?? [],
            activeStep: ([1, 2, 3].includes(prospect.activeStep) ? prospect.activeStep : 1) as 1 | 2 | 3,
            source: "openai",
            plan: prospect.plan,
            monthlyRevenue: prospect.monthlyRevenue,
            createdAt: prospect.createdAt,
          }));
        setProspects(restored);
        setSelectedId(restored[0]?.id ?? null);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Hunter could not load the workspace."))
      .finally(() => setWorkspaceLoading(false));
    return () => { active = false; };
  }, []);

  function save(next: OutreachProspect[]) {
    setProspects(next);
  }

  async function createProspect(formData: FormData) {
    setLoading(true);
    setError("");
    setCopied(false);

    const prospect: OutreachProspectInput = {
      company: String(formData.get("company") ?? "").trim(),
      ownerName: String(formData.get("ownerName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      notes: String(formData.get("notes") ?? "").trim(),
    };

    try {
      const result = await generateOutreachSequence(prospect);
      const record: OutreachProspect = {
        ...prospect,
        id: result.prospectId,
        stage: "draft",
        drafts: result.drafts,
        activeStep: 1,
        source: result.source,
        plan: null,
        monthlyRevenue: 0,
        createdAt: new Date().toISOString(),
      };
      save([record, ...prospects]);
      setSelectedId(record.id);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Hunter could not prepare this sequence."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateProspect(id: string, patch: Partial<OutreachProspect>) {
    save(prospects.map((prospect) => prospect.id === id ? { ...prospect, ...patch } : prospect));
    try {
      await updateStoredProspect(id, { stage: patch.stage, activeStep: patch.activeStep, plan: patch.plan });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Hunter could not save that update.");
      const { prospects: stored } = await getAgentState();
      const current = stored.find((prospect) => prospect.id === id);
      if (current) {
        save(prospects.map((prospect) => prospect.id === id ? {
          ...prospect,
          stage: current.stage as OutreachStage,
          activeStep: current.activeStep as 1 | 2 | 3,
        } : prospect));
      }
    }
  }

  const selected = prospects.find((prospect) => prospect.id === selectedId) ?? prospects[0];
  const activeDraft = selected?.drafts.find((draft) => draft.step === selected.activeStep);

  const metrics = useMemo(() => ({
    prepared: prospects.length,
    sent: prospects.filter((prospect) => ["sent", "replied", "demo"].includes(prospect.stage)).length,
    replies: prospects.filter((prospect) => ["replied", "demo"].includes(prospect.stage)).length,
    demos: prospects.filter((prospect) => ["demo", "won"].includes(prospect.stage)).length,
  }), [prospects]);

  async function copyDraft() {
    if (!activeDraft) return;
    await navigator.clipboard.writeText(
      `Subject: ${activeDraft.subject}\n\n${activeDraft.body}`
    );
    setCopied(true);
  }

  const mailto = selected && activeDraft
    ? `mailto:${encodeURIComponent(selected.email)}?subject=${encodeURIComponent(activeDraft.subject)}&body=${encodeURIComponent(activeDraft.body)}`
    : "#";

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#d8e1ee] bg-white shadow-xl">
      <div className="bg-[#06142f] p-6 text-white md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff6a3d] font-display text-xl font-semibold text-white shadow-lg shadow-orange-950/30">H</span>
              <div><p className="text-xs font-extrabold uppercase tracking-[0.19em] text-orange-200">Dedicated outreach agent</p><h2 className="font-display mt-1 text-3xl font-semibold">Hunter</h2></div>
            </div>
            <p className="mt-4 max-w-2xl leading-7 text-[#a8b9d4]">Hunter prepares personal introductions, remembers every follow-up, and measures replies and demonstrations. You approve the message before it leaves.</p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Metric value={metrics.prepared} label="prepared" />
            <Metric value={metrics.sent} label="sent" />
            <Metric value={metrics.replies} label="replies" />
            <Metric value={metrics.demos} label="demos" />
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[0.78fr_1.22fr]">
        <div className="border-b border-[#e4eaf2] bg-[#f7f9fc] p-6 xl:border-b-0 xl:border-r md:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1555c6]">Add one qualified owner</p>
          <h3 className="font-display mt-2 text-2xl font-semibold text-[#06142f]">Prepare the next conversation.</h3>
          <form action={createProspect} className="mt-6 space-y-3">
            <Field name="company" label="Company" placeholder="Parkside Heating & Air" required />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field name="ownerName" label="Owner name" placeholder="Mike" />
              <Field name="city" label="City" placeholder="Charlotte, NC" />
            </div>
            <Field name="email" label="Business email" placeholder="mike@parksidehvac.com" type="email" required />
            <label className="block text-sm font-bold text-[#33435c]">Useful context<textarea name="notes" rows={3} placeholder="Family-owned, emergency service, missed-call form on website…" className="mt-1.5 w-full resize-none rounded-xl border border-[#cfd9e8] bg-white px-4 py-3 font-normal text-[#06142f] outline-none transition focus:border-[#246bfe] focus:ring-4 focus:ring-blue-100" /></label>
            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
            <button disabled={loading} className="w-full rounded-xl bg-[#ff6a3d] px-5 py-3.5 font-extrabold text-white transition hover:bg-[#e8532e] disabled:cursor-wait disabled:opacity-60">{loading ? "Hunter is writing…" : "Prepare 3-email sequence"}</button>
          </form>
          <p className="mt-4 text-xs leading-5 text-[#7188ad]">Use a relevant business contact. Do not upload purchased personal addresses or ignore an opt-out.</p>

          {prospects.length > 0 && (
            <div className="mt-7 border-t border-[#dce4ef] pt-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#7188ad]">Hunter&apos;s queue</p>
              <div className="mt-3 space-y-2">
                {prospects.map((prospect) => (
                  <button key={prospect.id} type="button" onClick={() => { setSelectedId(prospect.id); setCopied(false); }} className={`w-full rounded-xl border p-4 text-left transition ${selected?.id === prospect.id ? "border-[#246bfe] bg-white shadow-sm" : "border-transparent bg-[#edf2f8] hover:bg-white"}`}>
                    <div className="flex items-center justify-between gap-3"><p className="truncate font-bold text-[#06142f]">{prospect.company}</p><span className="shrink-0 rounded-full bg-[#e7eef9] px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#52637e]">{stageLabels[prospect.stage]}</span></div>
                    <p className="mt-1 truncate text-xs text-[#7188ad]">{prospect.email}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8">
          {workspaceLoading ? (
            <div className="flex min-h-[420px] items-center justify-center text-center"><div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1555c6]">Hunter is checking the queue</p><p className="mt-3 text-[#66758d]">Loading the saved outreach workspace…</p></div></div>
          ) : !selected || !activeDraft ? (
            <div className="flex min-h-[420px] items-center justify-center text-center"><div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1555c6]">Queue empty</p><h3 className="font-display mt-3 text-3xl font-semibold text-[#06142f]">Give Hunter the first owner.</h3><p className="mx-auto mt-3 max-w-md leading-7 text-[#66758d]">Add one qualified business contact. Hunter will prepare the complete sequence and hold it for your approval.</p></div></div>
          ) : (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1555c6]">Sequence for {selected.company}</p><h3 className="font-display mt-2 text-3xl font-semibold text-[#06142f]">Three respectful touches.</h3><p className="mt-2 text-sm text-[#7188ad]">{selected.source === "openai" ? "Personalized by Hunter" : "Approved EMBUR template"} · Owner approval required</p></div>
                <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-extrabold ${selected.stage === "demo" ? "bg-emerald-100 text-emerald-800" : "bg-orange-50 text-orange-700"}`}>{stageLabels[selected.stage]}</span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {selected.drafts.map((draft) => (
                  <button key={draft.step} type="button" onClick={() => { updateProspect(selected.id, { activeStep: draft.step }); setCopied(false); }} className={`rounded-xl border p-3 text-left transition ${selected.activeStep === draft.step ? "border-[#246bfe] bg-[#edf3ff]" : "border-[#dce4ef] bg-white hover:bg-[#f7f9fc]"}`}>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#7188ad]">Day {draft.day}</p>
                    <p className="mt-1 text-sm font-bold text-[#06142f]">{draft.label}</p>
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-[#dce4ef] bg-[#f8faff] p-5 md:p-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#7188ad]">Subject</p>
                <p className="mt-2 font-bold text-[#06142f]">{activeDraft.subject}</p>
                <div className="mt-5 border-t border-[#dce4ef] pt-5">
                  <p className="whitespace-pre-wrap text-[15px] leading-7 text-[#33435c]">{activeDraft.body}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {selected.stage === "draft" && <button type="button" onClick={() => updateProspect(selected.id, { stage: "approved" })} className="rounded-xl bg-[#06142f] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#1555c6]">Approve sequence</button>}
                <button type="button" onClick={copyDraft} className="rounded-xl border border-[#cfd9e8] bg-white px-5 py-3 text-sm font-extrabold text-[#06142f] transition hover:bg-[#f4f7fb]">{copied ? "Copied" : "Copy draft"}</button>
                {selected.stage !== "draft" && <a href={mailto} className="rounded-xl bg-[#ff6a3d] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#e8532e]">Open in email →</a>}
                {selected.stage === "approved" && <button type="button" onClick={() => updateProspect(selected.id, { stage: "sent" })} className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-extrabold text-emerald-800">Mark sent</button>}
                {selected.stage === "sent" && <button type="button" onClick={() => updateProspect(selected.id, { stage: "replied" })} className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-extrabold text-blue-800">Mark replied</button>}
                {selected.stage === "replied" && <button type="button" onClick={() => updateProspect(selected.id, { stage: "demo" })} className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-extrabold text-emerald-800">Demo booked</button>}
                {selected.stage === "demo" && (
                  <>
                    {(["silver", "gold", "diamond", "platinum"] as const).map((plan) => (
                      <button key={plan} type="button" onClick={() => updateProspect(selected.id, { stage: "won", plan })} className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-extrabold capitalize text-emerald-800">
                        Won · {plan}
                      </button>
                    ))}
                    <button type="button" onClick={() => updateProspect(selected.id, { stage: "lost" })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-extrabold text-slate-700">
                      Closed—not won
                    </button>
                  </>
                )}
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <NextMove number="01" title="Approve" detail="Read the complete sequence once." />
                <NextMove number="02" title="Send personally" detail="Hunter opens the draft in your email app." />
                <NextMove number="03" title="Report outcome" detail="Mark replies and demonstrations here." />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ name, label, placeholder, type = "text", required = false }: { name: string; label: string; placeholder: string; type?: string; required?: boolean }) {
  return <label className="block text-sm font-bold text-[#33435c]">{label}<input name={name} type={type} required={required} placeholder={placeholder} className="mt-1.5 w-full rounded-xl border border-[#cfd9e8] bg-white px-4 py-3 font-normal text-[#06142f] outline-none transition focus:border-[#246bfe] focus:ring-4 focus:ring-blue-100" /></label>;
}

function Metric({ value, label }: { value: number; label: string }) {
  return <div className="min-w-16 rounded-xl border border-white/10 bg-white/[0.06] p-3 text-center"><p className="font-display text-xl font-semibold">{value}</p><p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[#8297b8]">{label}</p></div>;
}

function NextMove({ number, title, detail }: { number: string; title: string; detail: string }) {
  return <div className="rounded-xl bg-[#f4f7fb] p-4"><p className="text-xs font-extrabold text-[#246bfe]">{number}</p><p className="mt-2 font-bold text-[#06142f]">{title}</p><p className="mt-1 text-xs leading-5 text-[#66758d]">{detail}</p></div>;
}

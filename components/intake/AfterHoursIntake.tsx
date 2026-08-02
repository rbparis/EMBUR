"use client";

import { FormEvent, useState } from "react";

type IntakeForm = {
  name: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  urgency: "emergency" | "soon" | "routine";
  preferredTime: string;
  details: string;
  consent: boolean;
  companyWebsite: string;
};

const initialForm: IntakeForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  service: "",
  urgency: "soon",
  preferredTime: "",
  details: "",
  consent: false,
  companyWebsite: "",
};

export default function AfterHoursIntake({ businessId, businessName, phone }: { businessId: string; businessName: string; phone?: string | null }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function update<Key extends keyof IntakeForm>(key: Key, value: IntakeForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch(`/api/intake/${businessId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json() as { success?: boolean; message?: string };

      if (!response.ok || !result.success) {
        throw new Error(result.message || "We could not send your request.");
      }

      setStatus("success");
      setMessage(result.message || "Your request was received.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not send your request.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[2rem] border border-emerald-200 bg-white p-8 text-center shadow-xl md:p-12" role="status">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-2xl font-black text-emerald-700">✓</div>
        <h2 className="font-display mt-6 text-3xl font-semibold tracking-tight text-[#07132d]">You are on the list.</h2>
        <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">{message}</p>
        <p className="mt-5 text-sm text-slate-500">If there is immediate danger, call 911 or the appropriate utility emergency line.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[2rem] border border-white/10 bg-white p-5 text-slate-950 shadow-[0_35px_90px_-35px_rgba(0,0,0,0.65)] md:p-8">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">After-hours assistant</p>
          <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight md:text-3xl">How can {businessName} help?</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Tell us what is happening. We will organize the details for the team.</p>
        </div>
        <span className="mt-1 flex shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Online</span>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Your name" required><input required autoComplete="name" value={form.name} onChange={(event) => update("name", event.target.value)} className={inputClass} placeholder="Jordan Smith" /></Field>
        <Field label="Phone number"><input autoComplete="tel" inputMode="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} className={inputClass} placeholder="(555) 555-0123" /></Field>
        <Field label="Email"><input autoComplete="email" inputMode="email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className={inputClass} placeholder="jordan@example.com" /></Field>
        <Field label="Service address"><input autoComplete="street-address" value={form.address} onChange={(event) => update("address", event.target.value)} className={inputClass} placeholder="Street, city, ZIP" /></Field>
        <Field label="What do you need help with?" required><input required value={form.service} onChange={(event) => update("service", event.target.value)} className={inputClass} placeholder="AC not cooling" /></Field>
        <Field label="Best time to reach you"><input value={form.preferredTime} onChange={(event) => update("preferredTime", event.target.value)} className={inputClass} placeholder="Tomorrow morning" /></Field>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-bold text-slate-700">How urgent is this?</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          <UrgencyOption selected={form.urgency === "emergency"} onClick={() => update("urgency", "emergency")} label="Urgent" detail="Needs attention now" />
          <UrgencyOption selected={form.urgency === "soon"} onClick={() => update("urgency", "soon")} label="Soon" detail="Within 24 hours" />
          <UrgencyOption selected={form.urgency === "routine"} onClick={() => update("urgency", "routine")} label="Routine" detail="Flexible timing" />
        </div>
      </fieldset>

      {form.urgency === "emergency" && <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">If anyone is in danger, you smell gas, or there is an active fire, call 911 or your utility emergency line now. This assistant does not replace emergency services.</div>}

      <Field label="Anything else the technician should know?" className="mt-5"><textarea value={form.details} onChange={(event) => update("details", event.target.value)} className={`${inputClass} min-h-28 resize-y`} placeholder="What happened, when it started, and anything you have already tried." /></Field>

      <div className="sr-only" aria-hidden="true"><label>Company website<input tabIndex={-1} autoComplete="off" value={form.companyWebsite} onChange={(event) => update("companyWebsite", event.target.value)} /></label></div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        <input required type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 accent-blue-600" />
        <span>I agree that {businessName} may contact me about this service request by phone, text, or email.</span>
      </label>

      {status === "error" && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">{message}</p>}

      <button disabled={status === "sending"} className="mt-5 min-h-14 w-full rounded-2xl bg-[#ff6b35] px-6 font-bold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-[#ff7b47] disabled:cursor-wait disabled:opacity-70">
        {status === "sending" ? "Sending your request…" : "Send my service request →"}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-slate-400">Your information goes directly to {businessName}.{phone ? ` For immediate help, call ${phone}.` : ""}</p>
    </form>
  );
}

const inputClass = "min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function Field({ label, required, className = "", children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return <label className={`block ${className}`}><span className="mb-2 block text-sm font-bold text-slate-700">{label}{required ? " *" : ""}</span>{children}</label>;
}

function UrgencyOption({ selected, onClick, label, detail }: { selected: boolean; onClick: () => void; label: string; detail: string }) {
  return <button type="button" aria-pressed={selected} onClick={onClick} className={`rounded-xl border p-3 text-left transition ${selected ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"}`}><span className="block text-sm font-bold text-slate-900">{label}</span><span className="mt-0.5 block text-xs text-slate-500">{detail}</span></button>;
}

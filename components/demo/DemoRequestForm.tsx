"use client";

import { FormEvent, useState } from "react";

type FormState = {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  website: string;
  market: string;
  challenge: string;
  preferredTime: string;
  companyUrl: string;
  consent: boolean;
};

const initialState: FormState = {
  name: "",
  businessName: "",
  email: "",
  phone: "",
  website: "",
  market: "",
  challenge: "",
  preferredTime: "",
  companyUrl: "",
  consent: false,
};

export default function DemoRequestForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  function field(name: keyof FormState, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/demo/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json() as { success?: boolean; message?: string };
      if (!response.ok || !result.success) throw new Error(result.message || "Your request could not be saved.");
      setStatus("sent");
      setForm(initialState);
    } catch (reason) {
      setStatus("error");
      setMessage(reason instanceof Error ? reason.message : "Your request could not be saved.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-[2rem] border border-emerald-300/30 bg-emerald-300/10 p-8 text-white md:p-10">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-200">Request received</p>
        <h2 className="font-display mt-4 text-4xl font-semibold">You are on the board.</h2>
        <p className="mt-4 max-w-xl leading-7 text-[#c5d5ee]">
          Joon will review your business and contact you personally to arrange the 15-minute working demonstration.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-7 rounded-full border border-white/20 px-6 py-3 font-bold text-white">
          Submit another business
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[2rem] border border-white/12 bg-[#071832] p-6 shadow-2xl md:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" value={form.name} onChange={(value) => field("name", value)} placeholder="Jordan Smith" autoComplete="name" />
        <Field label="Business name" value={form.businessName} onChange={(value) => field("businessName", value)} placeholder="Jordan Heating & Air" autoComplete="organization" />
        <Field label="Business email" type="email" value={form.email} onChange={(value) => field("email", value)} placeholder="jordan@company.com" autoComplete="email" />
        <Field label="Best phone" type="tel" value={form.phone} onChange={(value) => field("phone", value)} placeholder="(555) 555-0123" autoComplete="tel" />
        <Field label="Website (optional)" value={form.website} onChange={(value) => field("website", value)} placeholder="yourcompany.com" autoComplete="url" />
        <Field label="Market" value={form.market} onChange={(value) => field("market", value)} placeholder="Charlotte, NC" autoComplete="address-level2" />
      </div>

      <label className="mt-5 block">
        <span className="text-sm font-bold text-[#d5e1f7]">Where is revenue slipping through?</span>
        <textarea value={form.challenge} onChange={(event) => field("challenge", event.target.value)} maxLength={1200} rows={4} placeholder="Missed calls, after-hours leads, slow follow-up, referrals…" className="mt-2 w-full rounded-xl border border-white/12 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-[#667b9c] focus:border-[#78a9ff]" />
      </label>
      <Field label="Best time to reach you" value={form.preferredTime} onChange={(value) => field("preferredTime", value)} placeholder="Weekdays after 2 PM Eastern" />

      <label className="sr-only" aria-hidden="true">
        Company URL
        <input tabIndex={-1} autoComplete="off" value={form.companyUrl} onChange={(event) => field("companyUrl", event.target.value)} />
      </label>

      <label className="mt-5 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.045] p-4 text-sm leading-6 text-[#a8b9d4]">
        <input type="checkbox" checked={form.consent} onChange={(event) => field("consent", event.target.checked)} className="mt-1 h-4 w-4 accent-[#ff6a3d]" />
        EMBUR may contact me about this demonstration. No purchased list, no automated enrollment, and no obligation.
      </label>

      {status === "error" && <p role="alert" className="mt-4 rounded-xl bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-200">{message}</p>}
      <button type="submit" disabled={status === "sending"} className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#ff6a3d] px-7 font-extrabold text-white shadow-xl shadow-orange-950/30 transition hover:-translate-y-0.5 hover:bg-[#ff7a52] disabled:cursor-wait disabled:opacity-60">
        {status === "sending" ? "Putting you on the board…" : "Book the 15-minute demo"}
      </button>
      <p className="mt-4 text-center text-xs leading-5 text-[#7188ad]">Your information is used only to respond to this request.</p>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-[#d5e1f7]">{label}</span>
      <input required={!label.includes("optional") && label !== "Best time to reach you"} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete={autoComplete} className="mt-2 w-full rounded-xl border border-white/12 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-[#667b9c] focus:border-[#78a9ff]" />
    </label>
  );
}

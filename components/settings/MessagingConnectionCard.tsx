"use client";

import { useEffect, useState } from "react";

type MessagingStatus = {
  success: true;
  provider: "twilio";
  mode: "disabled" | "test" | "live";
  providerConfigured: boolean;
  testReady: boolean;
  liveReady: boolean;
  complianceStatus: string;
  senderType: "messaging_service" | "phone_number" | "missing";
  testNumber: string | null;
  inboundWebhook: string;
  statusWebhook: string;
};

function connectionLabel(status: MessagingStatus) {
  if (status.liveReady && status.mode === "live") return { label: "Live", color: "bg-emerald-100 text-emerald-800" };
  if (status.testReady && status.mode === "test") return { label: "Test ready", color: "bg-blue-100 text-blue-800" };
  if (status.providerConfigured) return { label: "Safety locked", color: "bg-amber-100 text-amber-800" };
  return { label: "Needs Twilio", color: "bg-slate-100 text-slate-700" };
}

export default function MessagingConnectionCard() {
  const [status, setStatus] = useState<MessagingStatus | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/messaging/status", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json() as MessagingStatus & { message?: string };
        if (!response.ok || !result.success) throw new Error(result.message || "Could not load texting status.");
        if (active) setStatus(result);
      })
      .catch(() => {
        if (active) setError(true);
      });

    return () => { active = false; };
  }, []);

  const badge = status ? connectionLabel(status) : null;

  return (
    <section className="rounded-3xl border border-[#d8e1ee] bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1555c6]">Customer texting</p>
          <h3 className="font-display mt-3 text-2xl font-semibold text-[#06142f]">Twilio delivery with owner approval</h3>
        </div>
        {badge && <span className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${badge.color}`}>{badge.label}</span>}
      </div>

      <p className="mt-3 max-w-3xl leading-7 text-[#596a85]">
        EMBUR prepares the response. A signed-in owner must approve each text before Twilio receives it. Consent and STOP requests are enforced before delivery.
      </p>

      {!status && !error && <p className="mt-5 text-sm font-semibold text-[#7188ad]">Checking the connection…</p>}
      {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">EMBUR could not read the texting configuration.</p>}

      {status && (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatusItem label="Provider" value={status.providerConfigured ? "Twilio connected" : "Credentials needed"} />
            <StatusItem label="Delivery mode" value={status.mode === "disabled" ? "Disabled safely" : status.mode} />
            <StatusItem label="Carrier registration" value={status.complianceStatus.replaceAll("_", " ")} />
          </div>

          <div className="mt-5 rounded-2xl bg-[#eef3fb] p-5">
            <p className="text-sm font-bold text-[#06142f]">Inbound message webhook</p>
            <code className="mt-2 block break-all text-sm text-[#52637e]">{`${typeof window === "undefined" ? "" : window.location.origin}${status.inboundWebhook}`}</code>
            <p className="mt-3 text-xs leading-5 text-[#7188ad]">Add this URL to the Twilio Messaging Service after the sender is registered. Delivery callbacks are configured automatically by EMBUR.</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <a href="https://console.twilio.com/" target="_blank" rel="noreferrer" className="inline-flex rounded-xl bg-[#246bfe] px-6 py-3 font-bold text-white transition hover:bg-[#1555c6]">Open Twilio Console →</a>
            <a href="/support" className="inline-flex rounded-xl border border-[#d8e1ee] px-6 py-3 font-bold text-[#06142f] transition hover:bg-[#eef3fb]">Get setup help</a>
          </div>
        </>
      )}
    </section>
  );
}

function StatusItem({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-[#d8e1ee] bg-white p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7188ad]">{label}</p><p className="mt-2 font-bold capitalize text-[#06142f]">{value}</p></div>;
}

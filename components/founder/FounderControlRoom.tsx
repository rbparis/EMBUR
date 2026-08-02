"use client";

import Link from "next/link";
import { useState } from "react";
import EmburLogo from "@/components/brand/EmburLogo";
import FounderWorkstationPage from "@/components/pages/FounderWorkstationPage";
import InternalAgentStudio from "@/components/outreach/InternalAgentStudio";
import type { HostedSalesMetrics } from "@/lib/hosted-sales/metrics.server";

type FounderView = "command" | "studio";

export default function FounderControlRoom({ hostedSalesMetrics }: { hostedSalesMetrics: HostedSalesMetrics }) {
  const [view, setView] = useState<FounderView>("command");

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <div className="border-b border-white/10 bg-[#04112b]/95">
        <div className="mx-auto flex max-w-[1680px] flex-col gap-5 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-5">
            <EmburLogo light />
            <div className="hidden h-9 w-px bg-white/10 sm:block" />
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-orange-300">
                Private founder system
              </p>
              <h1 className="font-display mt-1 text-xl font-semibold">
                EMBUR Owner Control Room
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Founder access verified
            </span>
            <Link
              href="/app"
              className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Open customer app
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1680px] px-4 py-5 md:px-8 md:py-8">
        <nav
          aria-label="Founder control room"
          className="mb-6 inline-flex rounded-2xl border border-white/10 bg-white/[0.05] p-1.5"
        >
          <button
            type="button"
            onClick={() => setView("command")}
            className={`rounded-xl px-5 py-3 text-sm font-extrabold transition ${
              view === "command"
                ? "bg-orange-500 text-[#1d0b00] shadow-lg shadow-orange-950/30"
                : "text-[#9eb0ce] hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            Command Center
          </button>
          <button
            type="button"
            onClick={() => setView("studio")}
            className={`rounded-xl px-5 py-3 text-sm font-extrabold transition ${
              view === "studio"
                ? "bg-orange-500 text-[#1d0b00] shadow-lg shadow-orange-950/30"
                : "text-[#9eb0ce] hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            Agent Studio
          </button>
        </nav>

        <section className="embur-app-surface overflow-hidden rounded-[2rem] bg-[#f4f7fb] text-[#06142f] shadow-[0_35px_100px_-45px_rgba(0,0,0,0.9)]">
          {view === "command" ? <FounderWorkstationPage hostedSalesMetrics={hostedSalesMetrics} /> : <InternalAgentStudio />}
        </section>
      </div>
    </main>
  );
}

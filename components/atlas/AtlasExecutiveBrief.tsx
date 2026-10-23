"use client";

import { useViewerTimeZone } from "./useViewerTimeZone";
import type { AtlasMemory } from "@/lib/intelligence/memory/types";
import type { AtlasSnapshot } from "@/lib/intelligence/types";
import { createAtlasExecutiveBrief } from "@/lib/intelligence/briefEngine";

type AtlasExecutiveBriefProps = {
  snapshot: AtlasSnapshot;
  memory?: AtlasMemory | null;
};

export default function AtlasExecutiveBrief({
  snapshot,
  memory,
}: AtlasExecutiveBriefProps) {
  const viewerTimeZone = useViewerTimeZone();
  const brief = createAtlasExecutiveBrief(
    snapshot,
    memory,
    viewerTimeZone
  );

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-2xl">
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-7 md:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-300">
          Atlas Executive Brief
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          {brief.greeting}
        </h1>

        <h2 className="mt-5 text-2xl font-semibold text-white">
          {brief.headline}
        </h2>

        <p className="mt-5 max-w-4xl text-lg leading-relaxed text-slate-300">
          {brief.summary}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <BriefCard
            label="Revenue Risk"
            value={brief.riskStatement}
          />

          <BriefCard
            label="Atlas Direction"
            value={brief.closingStatement}
          />
        </div>
      </div>
    </section>
  );
}

function BriefCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-300">
        {label}
      </p>

      <p className="mt-3 leading-relaxed text-white">
        {value}
      </p>
    </div>
  );
}
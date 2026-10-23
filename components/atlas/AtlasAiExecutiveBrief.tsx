"use client";

import {
  useEffect,
  useState,
} from "react";
import { useViewerTimeZone } from "./useViewerTimeZone";
import AtlasExecutiveBrief from "@/components/atlas/AtlasExecutiveBrief";
import {
  buildDeterministicAtlasBrief,
} from "@/lib/intelligence/atlasBriefFallback";
import type { AtlasMemory } from "@/lib/intelligence/memory/types";
import type { AtlasSnapshot } from "@/lib/intelligence/types";
import {
  fetchAtlasAiBrief,
  type AtlasBriefSource,
} from "@/services/atlasBriefApi";

type AtlasAiExecutiveBriefProps = {
  snapshot: AtlasSnapshot;
  memory?: AtlasMemory | null;
};

type BriefState = {
  status: "loading" | "ready";
  brief: string | null;
  source: AtlasBriefSource;
};

export default function AtlasAiExecutiveBrief({
  snapshot,
  memory,
}: AtlasAiExecutiveBriefProps) {
  const viewerTimeZone = useViewerTimeZone();
  const [state, setState] =
    useState<BriefState>({
      status: "loading",
      brief: null,
      source: "rules",
    });

  useEffect(() => {
    if (!viewerTimeZone) return;
    let active = true;

    async function loadBrief() {
      try {
        const result =
          await fetchAtlasAiBrief(
            snapshot,
            memory,
            viewerTimeZone
          );

        if (!active) {
          return;
        }

        setState({
          status: "ready",
          brief: result.brief,
          source: result.source,
        });
      } catch {
        if (!active) {
          return;
        }

        setState({
          status: "ready",
          brief:
            buildDeterministicAtlasBrief(
              snapshot,
              memory,
              viewerTimeZone
            ),
          source: "rules",
        });
      }
    }

    void loadBrief();

    return () => {
      active = false;
    };
  }, [snapshot, memory, viewerTimeZone]);

  if (
    state.status === "ready" &&
    !state.brief
  ) {
    return (
      <AtlasExecutiveBrief
        snapshot={snapshot}
        memory={memory}
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-2xl">
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-7 md:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-300">
            Atlas Executive Brief
          </p>

          <span className="w-fit rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-300">
            {state.status === "loading"
              ? "Thinking"
              : state.source === "openai"
                ? "AI Brief"
                : "Atlas Rules"}
          </span>
        </div>

        {state.status === "loading" ? (
          <div className="mt-8 space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded-lg bg-white/10" />
            <div className="h-5 w-full animate-pulse rounded-lg bg-white/10" />
            <div className="h-5 w-5/6 animate-pulse rounded-lg bg-white/10" />
            <div className="h-5 w-2/3 animate-pulse rounded-lg bg-white/10" />
          </div>
        ) : (
          <p className="mt-7 max-w-5xl whitespace-pre-wrap text-xl leading-relaxed text-slate-200 md:text-2xl">
            {state.brief}
          </p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Metric
            label="Business Health"
            value={`${snapshot.businessHealth}/100`}
          />

          <Metric
            label="Priority Confidence"
            value={`${snapshot.topPriority.confidence}%`}
          />

          <Metric
            label="Actions Ready"
            value={`${snapshot.recommendations.length}`}
          />
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}
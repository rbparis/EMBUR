"use client";

import { useEffect, useState } from "react";
import type { Lead } from "@/types";
import type { AtlasBrief } from "@/services/atlas/atlasEngine";
import {
  formatAtlasCurrency,
  formatReturnedTime,
} from "@/services/atlas/atlasEngine";

type AtlasBriefCardProps = {
  brief: AtlasBrief;
  onOpenCustomer: (customer: Lead) => void;
};

export default function AtlasBriefCard({
  brief,
  onOpenCustomer,
}: AtlasBriefCardProps) {
  const [greeting, setGreeting] =
    useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting("Good morning");
      return;
    }

    if (hour < 18) {
      setGreeting("Good afternoon");
      return;
    }

    setGreeting("Good evening");
  }, []);

  const recommendation = brief.recommendation;
  const customer = recommendation.customer;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-2xl md:p-9">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <img
                src="/embur-logo.png"
                alt=""
                className="h-11 w-11 rounded-2xl object-contain shadow-lg"
              />

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-300">
                  Atlas Intelligence
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Your EMBUR operations brief
                </p>
              </div>
            </div>

            <h3 className="mt-7 text-4xl font-bold tracking-tight md:text-5xl">
              {greeting}, {brief.ownerName}.
            </h3>

            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              {brief.summary}
            </p>
          </div>

          <HealthBadge
            score={brief.businessHealth.score}
            label={brief.businessHealth.label}
            status={brief.businessHealth.status}
          />
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          <BriefMetric
            label="Revenue recovered"
            value={formatAtlasCurrency(
              brief.recoveredRevenue
            )}
            detail="Booked opportunity value currently visible to Atlas."
          />

          <BriefMetric
            label="Time returned"
            value={formatReturnedTime(
              brief.timeReturnedMinutes
            )}
            detail="Estimated repetitive work EMBUR carried for the business."
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="border-b border-white/10 px-6 py-5 md:px-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-300">
                  Today&apos;s recommendation
                </p>

                <h4 className="mt-2 text-3xl font-bold tracking-tight">
                  {recommendation.action}
                </h4>
              </div>

              <div className="w-fit rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Confidence
                </p>

                <p className="mt-1 text-2xl font-bold text-white">
                  {recommendation.confidence}%
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-7">
            <p className="max-w-3xl leading-relaxed text-slate-300">
              {recommendation.reason}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {recommendation.signals.map((signal) => (
                <span
                  key={signal}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200"
                >
                  {signal}
                </span>
              ))}

              {recommendation.estimatedValue > 0 && (
                <span className="rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-300">
                  {formatAtlasCurrency(
                    recommendation.estimatedValue
                  )}{" "}
                  opportunity
                </span>
              )}
            </div>

            {customer ? (
              <button
                type="button"
                onClick={() => onOpenCustomer(customer)}
                className="mt-7 inline-flex items-center justify-center rounded-xl bg-white px-6 py-4 font-bold text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Open {customer.name} →
              </button>
            ) : (
              <div className="mt-7 inline-flex rounded-xl border border-green-400/20 bg-green-400/10 px-5 py-3 font-bold text-green-300">
                Nothing needs you right now
              </div>
            )}
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-slate-400">
          Business health:{" "}
          {brief.businessHealth.explanation}
        </p>
      </div>
    </section>
  );
}

function BriefMetric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-4xl font-bold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-slate-400">
        {detail}
      </p>
    </div>
  );
}

function HealthBadge({
  score,
  label,
  status,
}: {
  score: number;
  label: string;
  status:
    | "excellent"
    | "healthy"
    | "busy"
    | "attention";
}) {
  const styles = {
    excellent:
      "border-green-400/20 bg-green-400/10 text-green-300",
    healthy:
      "border-blue-400/20 bg-blue-400/10 text-blue-200",
    busy: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    attention:
      "border-red-400/20 bg-red-400/10 text-red-300",
  };

  return (
    <div
      className={`inline-flex w-fit items-center gap-3 rounded-2xl border px-4 py-3 ${styles[status]}`}
    >
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-30" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-current" />
      </span>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide opacity-75">
          Business health
        </p>

        <p className="mt-0.5 font-bold">
          {score} · {label}
        </p>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import EmburIcon from "@/components/ui/EmburIcon";
import type { MorningPriority } from "@/services/morningService";

type OnePriorityCardProps = {
  priority: MorningPriority;
  onOpenCustomer: () => void;
};

export default function OnePriorityCard({
  priority,
  onOpenCustomer,
}: OnePriorityCardProps) {
  const [isHandled, setIsHandled] = useState(false);

  if (isHandled) {
    return (
      <section className="rounded-3xl border border-green-200 bg-green-50 p-6 shadow-sm md:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-white">
          <EmburIcon name="check" size={24} />
        </div>

        <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-green-700">
          Today&apos;s priority handled
        </p>

        <h3 className="mt-3 text-3xl font-bold tracking-tight text-green-950">
          You&apos;re caught up.
        </h3>

        <p className="mt-3 max-w-2xl leading-relaxed text-green-800">
          The one item needing your attention has been marked handled.
          EMBUR will continue watching the rest of the business.
        </p>

        <button
          type="button"
          onClick={() => setIsHandled(false)}
          className="mt-6 rounded-xl border border-green-300 bg-white px-5 py-3 font-semibold text-green-800 transition hover:bg-green-100"
        >
          Undo
        </button>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-xl">
      <div className="border-b border-orange-100 bg-orange-50 px-6 py-5 md:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white">
            <EmburIcon name="activity" size={20} />
          </span>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-700">
              Today&apos;s one priority
            </p>

            <p className="mt-1 text-sm text-orange-800">
              This deserves your personal attention.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-3xl font-bold tracking-tight text-slate-950">
              Call {priority.customerName}
            </h3>

            <p className="mt-2 text-lg text-slate-600">
              {priority.service}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <PriorityDetail
                label="Opportunity"
                value={priority.opportunityValue}
              />

              <PriorityDetail
                label="Waiting"
                value={priority.waitTime}
              />

              <PriorityDetail
                label="Best action"
                value={priority.action}
              />
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
                Why this matters
              </p>

              <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">
                {priority.reason}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
            <Button onClick={onOpenCustomer}>
              <span className="flex items-center gap-2">
                Open Customer
                <EmburIcon name="arrowRight" size={18} />
              </span>
            </Button>

            <button
              type="button"
              onClick={() => setIsHandled(true)}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Mark Handled
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PriorityDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-bold text-slate-950">
        {value}
      </p>
    </div>
  );
}
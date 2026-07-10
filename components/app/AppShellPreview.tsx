"use client";

import { useState } from "react";
import { leads, settings } from "@/data/demoData";
import type { Lead } from "@/types";
import AppSidebar, { type AppPage } from "@/components/app/AppSidebar";
import Button from "@/components/ui/Button";
import EmburIcon from "@/components/ui/EmburIcon";
import StatusBadge from "@/components/ui/StatusBadge";
import WelcomeOverlay from "@/components/welcome/WelcomeOverlay";
import TodayOverview from "@/components/today/TodayOverview";

export default function AppShellPreview() {
  const [activePage, setActivePage] = useState<AppPage>("Today");
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  function openPage(page: AppPage) {
    setActivePage(page);
    setSelectedLead(null);
    setWelcomeOpen(false);
    setWelcomeStep(0);
  }

  function openWelcomeExperience() {
    setWelcomeOpen(true);
    setWelcomeStep(0);
    setSelectedLead(null);
  }

  function closeWelcomeExperience() {
    setWelcomeOpen(false);
    setWelcomeStep(0);
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
      <div className="relative overflow-hidden rounded-3xl border bg-white shadow-2xl">
        {welcomeOpen && (
          <WelcomeOverlay
            step={welcomeStep}
            onStart={() => setWelcomeStep(1)}
            onNext={() =>
              setWelcomeStep((currentStep) =>
                Math.min(currentStep + 1, 3)
              )
            }
            onClose={closeWelcomeExperience}
          />
        )}

        <div className="grid min-h-[780px] lg:grid-cols-[260px_minmax(0,1fr)]">
          <AppSidebar
            activePage={activePage}
            onPageChange={openPage}
          />

          <main className="min-w-0 bg-slate-50 p-5 md:p-8">
            <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
                  {selectedLead ? "Lead details" : activePage}
                </p>

                <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                  {selectedLead
                    ? selectedLead.name
                    : activePage === "Today"
                      ? "Morning, Mike."
                      : activePage}
                </h2>

                {!selectedLead && activePage === "Today" && (
                  <p className="mt-2 text-slate-500">
                    One customer needs you. The rest is under control.
                  </p>
                )}
              </div>

              <Button onClick={openWelcomeExperience}>
                <span className="flex items-center gap-2">
                  <EmburIcon name="activity" size={18} />
                  Start My Day
                </span>
              </Button>
            </header>

            {selectedLead ? (
              <LeadDetailScreen
                lead={selectedLead}
                back={() => setSelectedLead(null)}
              />
            ) : (
              <>
                {activePage === "Today" && (
                  <TodayOverview
                    onViewLeads={() => openPage("Customers")}
                  />
                )}

                {activePage === "Customers" && (
                  <CustomersScreen selectLead={setSelectedLead} />
                )}

                {activePage === "Conversations" && <ConversationsScreen />}

                {activePage === "Business" && <BusinessScreen />}

                {activePage === "Settings" && <SettingsScreen />}
              </>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

function CustomersScreen({
  selectLead,
}: {
  selectLead: (lead: Lead) => void;
}) {
  return (
    <section className="mt-8 rounded-3xl border bg-white p-5 shadow-sm md:p-6">
      <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
        Customer opportunities
      </p>

      <h3 className="mt-2 text-2xl font-bold">People waiting for help</h3>

      <p className="mt-2 text-slate-500">
        Open a customer to see what happened and what deserves attention.
      </p>

      <div className="mt-6 space-y-4">
        {leads.map((lead) => (
          <button
            type="button"
            key={lead.id}
            onClick={() => selectLead(lead)}
            className="group w-full cursor-pointer rounded-2xl border border-transparent bg-slate-50 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-bold text-slate-950">
                  {lead.name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {lead.service}
                </p>

                <p className="mt-3 text-sm font-semibold text-green-700">
                  Estimated opportunity: {lead.value}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={lead.status} />

                <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700">
                  <EmburIcon name="arrowRight" />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function LeadDetailScreen({
  lead,
  back,
}: {
  lead: Lead;
  back: () => void;
}) {
  return (
    <section className="mt-8 rounded-3xl border bg-white p-5 shadow-xl md:p-8">
      <Button variant="secondary" onClick={back}>
        ← Back to Customers
      </Button>

      <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
            Lead profile
          </p>

          <h3 className="mt-2 text-4xl font-bold tracking-tight">
            {lead.name}
          </h3>

          <p className="mt-2 text-lg text-slate-600">{lead.service}</p>
        </div>

        <StatusBadge status={lead.status} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Info label="Phone" value="(555) 555-1212" />
        <Info label="Estimated Value" value={lead.value} />
        <Info label="Address" value="123 Main Street" />
        <Info
          label="Priority"
          value={lead.name === "Mike Brown" ? "High" : "Normal"}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl bg-green-50 p-6">
          <p className="text-sm font-bold uppercase tracking-wider text-green-700">
            Lead health
          </p>

          <p className="mt-3 text-5xl font-bold text-green-900">98%</p>

          <p className="mt-2 font-semibold text-green-800">
            Likely to book today.
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm text-green-800">
            <EmburIcon name="check" size={18} />
            Urgent service need
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-green-800">
            <EmburIcon name="check" size={18} />
            Strong estimated value
          </div>
        </div>

        <div className="rounded-3xl border p-6">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
            Recommended action
          </p>

          <h4 className="mt-3 text-2xl font-bold">
            Call within 30 minutes.
          </h4>

          <p className="mt-3 leading-relaxed text-slate-600">
            This customer has waited 11 hours and reported an urgent cooling
            problem. A quick personal call is the strongest next step.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button>
              <span className="flex items-center gap-2">
                <EmburIcon name="phone" size={18} />
                Call Customer
              </span>
            </Button>

            <Button variant="secondary">Send Text</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 font-bold text-slate-950">{value}</p>
    </div>
  );
}

function ConversationsScreen() {
  return (
    <EmptyState
      title="You're all caught up."
      description="New customer conversations will appear here automatically when EMBUR begins responding."
    />
  );
}

function BusinessScreen() {
  const metrics = [
    {
      label: "Revenue Recovered",
      value: "$18,400",
      detail: "Opportunity value recovered this month.",
    },
    {
      label: "Time Returned",
      value: "43 hours",
      detail: "More than one full work week.",
    },
    {
      label: "Appointments Saved",
      value: "22",
      detail: "Jobs that could have been missed.",
    },
  ];

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-3">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
            {metric.label}
          </p>

          <p className="mt-4 text-4xl font-bold tracking-tight">
            {metric.value}
          </p>

          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            {metric.detail}
          </p>
        </div>
      ))}
    </div>
  );
}

function SettingsScreen() {
  return (
    <section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
        Business controls
      </p>

      <h3 className="mt-2 text-2xl font-bold">Settings</h3>

      <p className="mt-2 text-slate-500">
        Control how EMBUR represents and supports your business.
      </p>

      <div className="mt-6 space-y-4">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="rounded-2xl bg-slate-50 p-5 font-medium"
          >
            {setting.label}
          </div>
        ))}
      </div>
    </section>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mt-8 flex min-h-96 items-center justify-center rounded-3xl border bg-white p-8 text-center shadow-sm">
      <div className="max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <EmburIcon name="conversations" size={26} />
        </div>

        <h3 className="mt-5 text-2xl font-bold">{title}</h3>

        <p className="mt-3 leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
    </section>
  );
}
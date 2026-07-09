"use client";

import { useState } from "react";
import { leads, settings } from "@/data/demoData";
import type { Lead } from "@/types";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import WelcomeOverlay from "@/components/welcome/WelcomeOverlay";
import Dashboard from "@/components/dashboard/Dashboard";

export default function AppShellPreview() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const navItems = [
    "🏠 Dashboard",
    "👥 Customers",
    "💬 Conversations",
    "📊 Reports",
    "⚙️ Settings",
  ];

  function openPage(page: string) {
    setActivePage(page);
    setSelectedLead(null);
  }

  return (
    <section className="max-w-7xl mx-auto px-8 py-20">
      <div className="relative overflow-hidden rounded-3xl border bg-white shadow-2xl">
        {welcomeOpen && (
          <WelcomeOverlay
            step={welcomeStep}
            onStart={() => setWelcomeStep(1)}
            onNext={() => setWelcomeStep(welcomeStep + 1)}
            onClose={() => {
              setWelcomeOpen(false);
              setWelcomeStep(0);
            }}
          />
        )}

        <div className="grid min-h-[760px] lg:grid-cols-[260px_1fr]">
          <aside className="bg-slate-950 p-6 text-white">
            <div className="flex items-center gap-3 text-2xl font-bold">
              <span>🔥</span>
              <span>EMBUR</span>
            </div>

            <nav className="mt-10 space-y-3">
              {navItems.map((item) => {
                const page = item.replace(/^[^ ]+ /, "");

                return (
                  <button
                    key={item}
                    onClick={() => openPage(page)}
                    className={`w-full rounded-xl px-4 py-3 text-left transition ${
                      activePage === page && !selectedLead
                        ? "bg-white text-slate-950"
                        : "text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="bg-slate-50 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-700">
                  {selectedLead ? "Lead Details" : activePage}
                </p>

                <h2 className="text-3xl font-bold">
                  {selectedLead
                    ? selectedLead.name
                    : activePage === "Dashboard"
                    ? "Good morning, Mike."
                    : activePage}
                </h2>
              </div>

              <Button
                onClick={() => {
                  setWelcomeOpen(true);
                  setWelcomeStep(0);
                  setSelectedLead(null);
                }}
              >
                ▶ Start My Day
              </Button>
            </div>

            {selectedLead ? (
              <LeadDetailScreen
                lead={selectedLead}
                back={() => setSelectedLead(null)}
              />
            ) : (
              <>
                {activePage === "Dashboard" && (
                  <Dashboard onViewLeads={() => openPage("Customers")} />
                )}
                {activePage === "Customers" && (
                  <CustomersScreen selectLead={setSelectedLead} />
                )}
                {activePage === "Conversations" && <ConversationsScreen />}
                {activePage === "Reports" && <ReportsScreen />}
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
    <div className="mt-8 rounded-2xl border bg-white p-6">
      <h3 className="text-xl font-bold">Customers</h3>

      <div className="mt-5 space-y-4">
        {leads.map((lead) => (
          <button
            key={lead.id}
            onClick={() => selectLead(lead)}
            className="w-full rounded-xl bg-slate-50 p-4 text-left transition hover:bg-blue-50"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{lead.name}</p>
                <p className="text-sm text-slate-500">{lead.service}</p>
                <p className="mt-2 text-sm font-semibold text-green-700">
                  Estimated value: {lead.value}
                </p>
              </div>

              <StatusBadge status={lead.status} />
            </div>
          </button>
        ))}
      </div>
    </div>
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
    <div className="mt-8 rounded-3xl border bg-white p-8 shadow-xl">
      <Button variant="secondary" onClick={back}>
        ← Back to Customers
      </Button>

      <div className="mt-6 flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-semibold text-blue-700">Lead Profile</p>
          <h3 className="mt-2 text-4xl font-bold">{lead.name}</h3>
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

      <div className="mt-8 rounded-2xl border p-6">
        <h4 className="text-lg font-bold">Timeline</h4>

        <div className="mt-5 space-y-4">
          {[
            "9:02 AM — Customer contacted business.",
            "9:03 AM — EMBUR captured lead information.",
            "9:04 AM — Office was notified automatically.",
            "9:05 AM — Follow-up action was recommended.",
          ].map((event) => (
            <div key={event} className="flex gap-3">
              <div className="mt-2 h-2 w-2 rounded-full bg-blue-600" />
              <p className="text-slate-600">{event}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Button>📞 Call Customer</Button>
        <Button variant="secondary">✉️ Send Text</Button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}

function ConversationsScreen() {
  return (
    <div className="mt-8 rounded-2xl border bg-white p-6">
      <h3 className="text-xl font-bold">Conversations</h3>

      <div className="mt-6 space-y-4">
        <div className="max-w-md rounded-2xl bg-slate-100 p-4">
          My AC stopped working. Are you open?
        </div>

        <div className="ml-auto max-w-md rounded-2xl bg-blue-600 p-4 text-white">
          I&apos;m sorry you&apos;re dealing with that. What&apos;s your address?
        </div>

        <div className="max-w-md rounded-2xl bg-slate-100 p-4">
          123 Main Street.
        </div>

        <div className="ml-auto max-w-md rounded-2xl bg-blue-600 p-4 text-white">
          Thank you. Your request was captured and the office has been notified.
        </div>
      </div>
    </div>
  );
}

function ReportsScreen() {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-3">
      <Info label="Recovered This Month" value="$18,400" />
      <Info label="Recovery Rate" value="81%" />
      <Info label="Avg Response Time" value="18s" />
    </div>
  );
}

function SettingsScreen() {
  return (
    <div className="mt-8 rounded-2xl border bg-white p-6">
      <h3 className="text-xl font-bold">Settings</h3>

      <div className="mt-6 space-y-4">
        {settings.map((setting) => (
          <div key={setting.id} className="rounded-xl bg-slate-50 p-4">
            {setting.label}
          </div>
        ))}
      </div>
    </div>
  );
}
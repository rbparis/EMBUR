"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Lead } from "@/types";
import AppSidebar, { type AppPage } from "@/components/app/AppSidebar";
import AppHeader from "@/components/app/AppHeader";
import WelcomeOverlay from "@/components/welcome/WelcomeOverlay";
import TodayPage from "@/components/pages/TodayPage";
import CustomersPage from "@/components/pages/CustomersPage";
import CustomerDetailPage from "@/components/pages/CustomerDetailPage";
import ConversationsPage from "@/components/pages/ConversationsPage";
import OperationsPage from "@/components/pages/OperationsPage";
import BusinessPage from "@/components/pages/BusinessPage";
import SettingsPage from "@/components/pages/SettingsPage";
import { getBusinessMetrics } from "@/services/businessService";
import { fetchAtlasMemory } from "@/services/atlasMemoryApi";
import type { AtlasMemory } from "@/lib/intelligence/memory/types";
import {
  createDatabaseCustomer,
  deleteDatabaseCustomer,
  fetchDatabaseCustomers,
  sendCustomerMessage,
  updateDatabaseCustomer,
} from "@/services/customerApi";
import { fetchDatabaseConversations, type ConversationThread } from "@/services/conversationApi";

const businessMetrics = getBusinessMetrics();

type LoadStatus = "loading" | "ready" | "error";

export default function AppShellPreview() {
  const [activePage, setActivePage] = useState<AppPage>("Today");
  const [selectedCustomer, setSelectedCustomer] = useState<Lead | null>(null);
  const [customers, setCustomers] = useState<Lead[]>([]);
  const [customerStatus, setCustomerStatus] = useState<LoadStatus>("loading");
  const [threads, setThreads] = useState<ConversationThread[]>([]);
  const [conversationStatus, setConversationStatus] = useState<LoadStatus>("loading");
  const [atlasMemory, setAtlasMemory] = useState<AtlasMemory | null>(null);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(0);

  const loadCustomers = useCallback(async () => {
    setCustomerStatus("loading");
    try {
      const result = await fetchDatabaseCustomers();
      setCustomers(result);
      setSelectedCustomer((current) => current ? result.find((item) => String(item.id) === String(current.id)) ?? null : null);
      setCustomerStatus("ready");
    } catch {
      setCustomerStatus("error");
    }
  }, []);

  const loadConversations = useCallback(async () => {
    setConversationStatus("loading");
    try { setThreads(await fetchDatabaseConversations()); setConversationStatus("ready"); }
    catch { setThreads([]); setConversationStatus("error"); }
  }, []);

  useEffect(() => {
    // Initial network synchronization for the authenticated workspace.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadCustomers();
    void loadConversations();
    void fetchAtlasMemory().then(setAtlasMemory).catch(() => setAtlasMemory(null));
  }, [loadCustomers, loadConversations]);

  function changePage(page: AppPage) {
    setActivePage(page); setSelectedCustomer(null); setWelcomeOpen(false); setWelcomeStep(0);
  }

  async function createCustomer(input: Parameters<typeof createDatabaseCustomer>[0]) {
    const customer = await createDatabaseCustomer(input);
    setCustomers((current) => [customer, ...current]);
    setSelectedCustomer(customer);
  }

  async function updateCustomer(customer: Lead, input: Partial<Lead> & { estimatedValue?: number }) {
    await updateDatabaseCustomer(customer.id, input);
    await loadCustomers();
  }

  async function removeCustomer(customer: Lead) {
    await deleteDatabaseCustomer(customer.id);
    setSelectedCustomer(null);
    setActivePage("Customers");
    await Promise.all([loadCustomers(), loadConversations()]);
  }

  async function sendMessage(customer: Lead, body: string) {
    await sendCustomerMessage(customer.id, body);
    await Promise.all([loadCustomers(), loadConversations()]);
  }

  return (
    <section className="mx-auto max-w-[1500px] px-4 py-8 md:px-8 md:py-12">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {welcomeOpen && <WelcomeOverlay step={welcomeStep} onStart={() => setWelcomeStep(1)} onNext={() => setWelcomeStep((step) => Math.min(step + 1, 3))} onClose={() => { setWelcomeOpen(false); setWelcomeStep(0); }} />}
        <div className="grid min-h-[820px] lg:grid-cols-[260px_minmax(0,1fr)]">
          <AppSidebar activePage={activePage} onPageChange={changePage} />
          <main className="min-w-0 bg-slate-50 p-5 md:p-8">
            <AppHeader activePage={activePage} selectedCustomerName={selectedCustomer?.name} onStartMyDay={() => { setWelcomeOpen(true); setWelcomeStep(0); setSelectedCustomer(null); }} />
            {customerStatus === "loading" && <Notice text="Loading your company…" />}
            {customerStatus === "error" && <ErrorState onRetry={loadCustomers} />}
            {customerStatus === "ready" && selectedCustomer && (
              <CustomerDetailPage customer={selectedCustomer} onBack={() => { setSelectedCustomer(null); setActivePage("Customers"); }} onUpdate={updateCustomer} onDelete={removeCustomer} onSendMessage={sendMessage} />
            )}
            {customerStatus === "ready" && !selectedCustomer && (
              <>
                {activePage === "Today" && <TodayPage customers={customers} atlasMemory={atlasMemory} onOpenCustomer={setSelectedCustomer} />}
                {activePage === "Customers" && <CustomersPage customers={customers} onCustomerSelect={setSelectedCustomer} onCreateCustomer={createCustomer} />}
                {activePage === "Conversations" && <ConversationsPage threads={threads} status={conversationStatus === "ready" ? "database" : conversationStatus} onRetry={loadConversations} />}
                {activePage === "Operations" && <OperationsPage customers={customers} onOpenCustomer={setSelectedCustomer} />}
                {activePage === "Business" && <BusinessPage metrics={businessMetrics} />}
                {activePage === "Settings" && <div className="space-y-6"><SettingsPage /><BillingCard /></div>}
              </>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

function Notice({ text }: { text: string }) { return <div className="mt-5 text-sm font-semibold text-slate-500">{text}</div>; }
function ErrorState({ onRetry }: { onRetry: () => void }) { return <div className="mt-8 rounded-3xl border border-red-200 bg-white p-8 text-center"><h3 className="text-2xl font-bold text-slate-950">EMBUR could not load your workspace.</h3><p className="mt-2 text-slate-500">Check the database connection, then try again.</p><button onClick={onRetry} className="mt-5 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white">Try again</button></div>; }
function BillingCard() { return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"><p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">Subscription</p><h3 className="mt-3 text-2xl font-bold text-slate-950">Billing and plan</h3><p className="mt-3 text-slate-600">Manage the plan connected to this company.</p><Link href="/app/billing" className="mt-5 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white">Manage billing →</Link></section>; }

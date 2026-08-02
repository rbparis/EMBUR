"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Lead } from "@/types";
import AppSidebar, { type AppPage } from "@/components/app/AppSidebar";
import AppHeader from "@/components/app/AppHeader";
import TodayPage from "@/components/pages/TodayPage";
import CustomersPage from "@/components/pages/CustomersPage";
import CustomerDetailPage from "@/components/pages/CustomerDetailPage";
import ConversationsPage from "@/components/pages/ConversationsPage";
import OperationsPage from "@/components/pages/OperationsPage";
import BusinessPage from "@/components/pages/BusinessPage";
import SettingsPage from "@/components/pages/SettingsPage";
import GrowthPage from "@/components/pages/GrowthPage";
import type { WorkspaceTheme } from "@/components/settings/WorkspaceThemeSettings";
import MessagingConnectionCard from "@/components/settings/MessagingConnectionCard";
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

type LoadStatus = "loading" | "ready" | "error";

export default function AppShellPreview({
  businessId,
  subscriptionPlan,
  workspaceMode,
}: {
  businessId: string;
  subscriptionPlan: string;
  workspaceMode: "client" | "demo";
}) {
  const [activePage, setActivePage] = useState<AppPage>("Today");
  const [selectedCustomer, setSelectedCustomer] = useState<Lead | null>(null);
  const [customers, setCustomers] = useState<Lead[]>([]);
  const [customerStatus, setCustomerStatus] = useState<LoadStatus>("loading");
  const [threads, setThreads] = useState<ConversationThread[]>([]);
  const [conversationStatus, setConversationStatus] = useState<LoadStatus>("loading");
  const [atlasMemory, setAtlasMemory] = useState<AtlasMemory | null>(null);
  const [workspaceTheme, setWorkspaceTheme] = useState<WorkspaceTheme>("light");

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

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("embur-workspace-theme");
    if (["light", "night", "system", "contrast"].includes(storedTheme ?? "")) {
      // Restore the owner's visual preference after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWorkspaceTheme(storedTheme as WorkspaceTheme);
    }
  }, []);

  function changeTheme(theme: WorkspaceTheme) {
    setWorkspaceTheme(theme);
    window.localStorage.setItem("embur-workspace-theme", theme);
  }

  function changePage(page: AppPage) {
    setActivePage(page); setSelectedCustomer(null);
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
    setActivePage("Leads");
    await Promise.all([loadCustomers(), loadConversations()]);
  }

  async function sendMessage(customer: Lead, body: string) {
    const delivery = await sendCustomerMessage(customer.id, body);
    await Promise.all([loadCustomers(), loadConversations()]);
    return delivery;
  }

  return (
    <section data-workspace-theme={workspaceTheme} className="embur-workspace min-h-screen bg-[#04112b] p-0 xl:p-4">
      <div className="relative mx-auto max-w-[1680px] overflow-hidden bg-white shadow-[0_40px_120px_-40px_rgba(0,0,0,0.7)] xl:min-h-[calc(100vh-2rem)] xl:rounded-[2rem] xl:border xl:border-white/10">
        <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)] xl:min-h-[calc(100vh-2rem)]">
          <AppSidebar activePage={activePage} onPageChange={changePage} />
          <main className="embur-app-surface min-w-0 p-4 md:p-7 xl:p-9">
            {workspaceMode === "demo" && (
              <div className="mb-5 rounded-2xl border-2 border-amber-400 bg-amber-50 px-5 py-4 font-extrabold text-amber-950">
                DEMO MODE — sample information only. Nothing here is included in live client or EMBUR revenue totals.
              </div>
            )}
            <AppHeader activePage={activePage} selectedCustomerName={selectedCustomer?.name} onOpenAgents={() => { setSelectedCustomer(null); setActivePage("Agents"); }} />
            {customerStatus === "loading" && <Notice text="Loading your company…" />}
            {customerStatus === "error" && <ErrorState onRetry={loadCustomers} />}
            {customerStatus === "ready" && selectedCustomer && (
              <CustomerDetailPage customer={selectedCustomer} onBack={() => { setSelectedCustomer(null); setActivePage("Leads"); }} onUpdate={updateCustomer} onDelete={removeCustomer} onSendMessage={sendMessage} />
            )}
            {customerStatus === "ready" && !selectedCustomer && (
              <>
                {activePage === "Today" && <TodayPage customers={customers} atlasMemory={atlasMemory} onOpenCustomer={setSelectedCustomer} onOpenAgents={() => setActivePage("Agents")} />}
                {activePage === "Leads" && <CustomersPage customers={customers} onCustomerSelect={setSelectedCustomer} onCreateCustomer={createCustomer} />}
                {activePage === "Calls" && <ConversationsPage threads={threads} status={conversationStatus === "ready" ? "database" : conversationStatus} onRetry={loadConversations} />}
                {activePage === "Jobs" && <OperationsPage customers={customers} onOpenCustomer={setSelectedCustomer} />}
                {activePage === "Agents" && <GrowthPage customers={customers} atlasMemory={atlasMemory} subscriptionPlan={subscriptionPlan} isInternalWorkspace={workspaceMode === "demo"} onOpenCustomer={setSelectedCustomer} />}
                {activePage === "Money" && <BusinessPage customers={customers} />}
                {activePage === "Settings" && <div className="space-y-6"><SettingsPage theme={workspaceTheme} onThemeChange={changeTheme} /><BusinessSetupCard /><AfterHoursCard businessId={businessId} /><MessagingConnectionCard /><BillingCard /></div>}
              </>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

function BusinessSetupCard() { return <section className="rounded-3xl border border-[#d8e1ee] bg-white p-6 shadow-sm md:p-8"><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1555c6]">Launch setup</p><h3 className="font-display mt-3 text-2xl font-semibold text-[#06142f]">Business profile and lead capture</h3><p className="mt-3 max-w-2xl text-[#596a85]">Confirm the company details customers see, then test the private page that turns after-hours visitors into organized leads.</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/app/onboarding" className="inline-flex rounded-xl bg-[#246bfe] px-6 py-3 font-bold text-white transition hover:bg-[#1555c6]">Open business setup →</Link><Link href="/support" className="inline-flex rounded-xl border border-[#d8e1ee] px-6 py-3 font-bold text-[#06142f] transition hover:bg-[#eef3fb]">Get support</Link></div></section>; }
function Notice({ text }: { text: string }) { return <div className="mt-6 rounded-2xl border border-blue-100 bg-white/80 px-5 py-4 text-sm font-semibold text-[#596a85] shadow-sm backdrop-blur">{text}</div>; }
function ErrorState({ onRetry }: { onRetry: () => void }) { return <div className="mt-8 rounded-3xl border border-red-200 bg-white p-8 text-center shadow-lg"><h3 className="font-display text-2xl font-semibold text-[#06142f]">EMBUR could not load your command center.</h3><p className="mt-2 text-[#596a85]">Your data is safe. Check the connection, then try again.</p><button onClick={onRetry} className="mt-5 rounded-xl bg-[#06142f] px-5 py-3 font-bold text-white transition hover:bg-[#1555c6]">Try again</button></div>; }
function AfterHoursCard({ businessId }: { businessId: string }) { return <section className="relative overflow-hidden rounded-3xl border border-[#18315f] bg-[#06142f] p-6 text-white shadow-xl md:p-8"><div className="pointer-events-none absolute right-[-5rem] top-[-5rem] h-52 w-52 rounded-full bg-blue-500/25 blur-3xl" /><div className="relative"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8fb4ff]">After-Hours Agent</p><span className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold text-emerald-200"><span className="h-2 w-2 rounded-full bg-emerald-300" />Ready</span></div><h3 className="font-display mt-4 text-3xl font-semibold">Keep capturing work after closing.</h3><p className="mt-3 max-w-2xl leading-7 text-[#a8b9d4]">Share your private intake link on your website, Google Business profile, voicemail, or after-hours text. Every completed request enters Customers and Conversations automatically.</p><Link href={`/intake/${businessId}`} target="_blank" className="mt-6 inline-flex rounded-xl bg-white px-6 py-3 font-extrabold text-[#06142f] transition hover:-translate-y-0.5 hover:bg-blue-50">Open my intake page →</Link></div></section>; }
function BillingCard() { return <section className="rounded-3xl border border-[#d8e1ee] bg-white p-6 shadow-sm md:p-8"><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1555c6]">Subscription</p><h3 className="font-display mt-3 text-2xl font-semibold text-[#06142f]">Your EMBUR plan</h3><p className="mt-3 text-[#596a85]">Manage the plan and billing connected to this business.</p><Link href="/app/billing" className="mt-5 inline-flex rounded-xl bg-[#246bfe] px-6 py-3 font-bold text-white transition hover:bg-[#1555c6]">Manage billing →</Link></section>; }

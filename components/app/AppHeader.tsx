"use client";

import type { AppPage } from "@/components/app/AppSidebar";
import Button from "@/components/ui/Button";
import EmburIcon from "@/components/ui/EmburIcon";

export default function AppHeader({ activePage, selectedCustomerName, onStartMyDay }: { activePage: AppPage; selectedCustomerName?: string; onStartMyDay: () => void }) {
  const title = selectedCustomerName ?? (activePage === "Today" ? "Run the day with clarity." : activePage);
  return <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">{selectedCustomerName ? "Customer 360" : activePage}</p><h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">{title}</h2>{activePage === "Today" && !selectedCustomerName && <p className="mt-2 text-slate-500">Atlas has prioritized the work that matters most.</p>}</div><Button onClick={onStartMyDay}><span className="flex items-center gap-2"><EmburIcon name="activity" size={18} />Start My Day</span></Button></header>;
}

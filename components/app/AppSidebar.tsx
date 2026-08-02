"use client";

import EmburLogo from "@/components/brand/EmburLogo";
import EmburIcon, { type EmburIconName } from "@/components/ui/EmburIcon";

export type AppPage = "Today" | "Leads" | "Calls" | "Jobs" | "Agents" | "Money" | "Settings";

type AppSidebarProps = { activePage: AppPage; onPageChange: (page: AppPage) => void };

const navigation: Array<{ page: AppPage; icon: EmburIconName }> = [
  { page: "Today", icon: "today" },
  { page: "Leads", icon: "customers" },
  { page: "Calls", icon: "phone" },
  { page: "Jobs", icon: "activity" },
  { page: "Agents", icon: "star" },
  { page: "Money", icon: "business" },
  { page: "Settings", icon: "settings" },
];

export default function AppSidebar({ activePage, onPageChange }: AppSidebarProps) {
  return (
    <aside className="relative flex min-w-0 flex-col overflow-hidden bg-[#04112b] p-4 text-white md:p-6">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-blue-600/20 blur-[90px]" />
      <div className="relative flex items-center justify-between lg:block">
        <EmburLogo light />
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8fa5c6] lg:mt-5 lg:inline-flex">Agents online</span>
      </div>
      <nav aria-label="EMBUR application" className="relative mt-6 flex gap-2 overflow-x-auto pb-2 lg:mt-10 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
        {navigation.map((item) => {
          const isActive = activePage === item.page;
          return (
            <button type="button" key={item.page} onClick={() => onPageChange(item.page)} aria-current={isActive ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3.5 text-left font-semibold transition lg:w-full ${isActive ? "bg-white text-[#06142f] shadow-[0_14px_35px_-18px_rgba(0,0,0,0.65)]" : "text-[#9eb0ce] hover:bg-white/[0.07] hover:text-white"}`}>
              <EmburIcon name={item.icon} size={19} />
              <span>{item.page}</span>
            </button>
          );
        })}
      </nav>
      <div className="embur-glass relative mt-auto hidden rounded-2xl p-4 lg:block">
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-300 embur-soft-pulse" /><p className="text-xs font-bold uppercase tracking-wider text-emerald-200">Atlas online</p></div>
        <p className="font-display mt-3 text-lg font-semibold">The business is covered.</p>
        <p className="mt-2 text-sm leading-relaxed text-[#8297b8]">Calls, follow-up, referrals, and campaigns report here.</p>
      </div>
    </aside>
  );
}

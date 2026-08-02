"use client";

import type { AppPage } from "@/components/app/AppSidebar";
import EmburIcon from "@/components/ui/EmburIcon";

const pageCopy: Record<AppPage, { eyebrow: string; title: string; description: string }> = {
  Today: { eyebrow: "Today", title: "Money on the board.", description: "See the first move and the agents working behind it." },
  Leads: { eyebrow: "Leads", title: "People who can become jobs.", description: "Open the opportunity and move it forward." },
  Calls: { eyebrow: "Calls", title: "Every customer heard.", description: "Review what came in and what EMBUR said." },
  Jobs: { eyebrow: "Jobs", title: "Move the work. Get paid.", description: "Follow every opportunity from new to paid." },
  Agents: { eyebrow: "Agents", title: "Your workforce at work.", description: "Approve the moves. Watch the numbers." },
  Money: { eyebrow: "Money", title: "What came in. What is waiting.", description: "Revenue tied to real customers and jobs." },
  Settings: { eyebrow: "Settings", title: "Set the rules.", description: "Voice, hours, approvals, billing, and account controls." },
};

export default function AppHeader({ activePage, selectedCustomerName, onOpenAgents }: { activePage: AppPage; selectedCustomerName?: string; onOpenAgents: () => void }) {
  const copy = pageCopy[activePage];

  return (
    <header className="rounded-[1.75rem] border border-white/80 bg-white/75 p-5 shadow-[0_18px_55px_-38px_rgba(4,17,43,0.45)] backdrop-blur-xl md:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.19em] text-[#1555c6]">{selectedCustomerName ? "Customer 360" : copy.eyebrow}</p>
            {!selectedCustomerName && <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-700 md:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Live</span>}
          </div>
          <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.035em] text-[#06142f] md:text-4xl">{selectedCustomerName ?? copy.title}</h2>
          <p className="mt-2 text-[#66758d]">{selectedCustomerName ? "Complete customer context and the strongest next action." : copy.description}</p>
        </div>
        {activePage !== "Agents" && !selectedCustomerName && <button onClick={onOpenAgents} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#06142f] px-5 font-extrabold text-white shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-[#1555c6]">
          <EmburIcon name="star" size={18} /> View agents
        </button>}
      </div>
    </header>
  );
}

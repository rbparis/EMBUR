"use client";

import type { AppPage } from "@/components/app/AppSidebar";
import Button from "@/components/ui/Button";
import EmburIcon from "@/components/ui/EmburIcon";

type AppHeaderProps = {
  activePage: AppPage;
  selectedCustomerName?: string;
  onStartMyDay: () => void;
};

export default function AppHeader({
  activePage,
  selectedCustomerName,
  onStartMyDay,
}: AppHeaderProps) {
  const isToday =
    activePage === "Today" && !selectedCustomerName;

  return (
    <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
          {selectedCustomerName
            ? "Lead details"
            : activePage}
        </p>

        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          {selectedCustomerName
            ? selectedCustomerName
            : isToday
              ? "Morning, Mike."
              : activePage}
        </h2>

        {isToday && (
          <p className="mt-2 text-slate-500">
            One customer needs you. The rest is under
            control.
          </p>
        )}
      </div>

      <Button onClick={onStartMyDay}>
        <span className="flex items-center gap-2">
          <EmburIcon name="activity" size={18} />
          Start My Day
        </span>
      </Button>
    </header>
  );
}
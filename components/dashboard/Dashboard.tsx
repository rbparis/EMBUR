import { metrics } from "@/data/demoData";
import LiveActivityPanel from "@/components/dashboard/LiveActivityPanel";
import MetricCard from "@/components/dashboard/MetricCard";
import PriorityCard from "@/components/dashboard/PriorityCard";
import WeatherCard from "@/components/dashboard/WeatherCard";

type DashboardProps = {
  onViewLeads: () => void;
};

export default function Dashboard({ onViewLeads }: DashboardProps) {
  return (
    <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_360px]">
      <div>
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-blue-950 p-8 text-white">
          <p className="font-semibold text-blue-200">
            Today's Operations Brief
          </p>

          <h3 className="mt-4 text-5xl font-bold">$3,250</h3>

          <p className="mt-3 text-slate-300">
            Yesterday YOU recovered revenue that would have otherwise been lost.
          </p>

          <PriorityCard onViewLeads={onViewLeads} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              value={metric.value}
              label={metric.label}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <WeatherCard />
        <LiveActivityPanel />
      </div>
    </div>
  );
}
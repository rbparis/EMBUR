import Button from "@/components/ui/Button";
import BusinessPulse from "./BusinessPulse";
import BusinessStatus from "./BusinessStatus";
import RecommendedAction from "./RecommendedAction";
import TimeReturnedCard from "./TimeReturnedCard";
import YesterdaySummary from "./YesterdaySummary";

type TodayOverviewProps = {
  onViewLeads: () => void;
};

export default function TodayOverview({ onViewLeads }: TodayOverviewProps) {
  return (
    <div className="mt-8 space-y-8">
      <BusinessStatus />

      <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <YesterdaySummary />
          <RecommendedAction onViewLeads={onViewLeads} />
        </div>

        <div className="space-y-6">
          <TimeReturnedCard />
          <BusinessPulse />
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-blue-700">LIVE BUSINESS</p>
        <h3 className="mt-1 text-xl font-bold">Your business is moving.</h3>

        <div className="mt-6 space-y-4">
          {[
            "10:41 AM — John Smith booked emergency AC repair.",
            "10:46 AM — Review request delivered.",
            "10:48 AM — Missed call recovered.",
            "10:53 AM — Office notified automatically.",
          ].map((item) => (
            <div key={item} className="rounded-2xl bg-slate-50 p-4">
              {item}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button onClick={onViewLeads}>View Priority Leads</Button>
        </div>
      </div>
    </div>
  );
}
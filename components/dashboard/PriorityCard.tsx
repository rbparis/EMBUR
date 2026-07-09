import Button from "@/components/ui/Button";

type PriorityCardProps = {
  onViewLeads: () => void;
};

export default function PriorityCard({ onViewLeads }: PriorityCardProps) {
  return (
    <div className="mt-8 rounded-2xl bg-white p-6 text-slate-900">
      <p className="text-sm font-bold text-red-600">FIRST PRIORITY</p>

      <h4 className="mt-2 text-2xl font-bold">Call Mike Brown</h4>

      <p className="mt-2 text-slate-600">
        Emergency AC Repair • Waiting 11 hours • Potential $1,250 job
      </p>

      <div className="mt-5">
        <Button onClick={onViewLeads}>View Priority Leads</Button>
      </div>
    </div>
  );
}
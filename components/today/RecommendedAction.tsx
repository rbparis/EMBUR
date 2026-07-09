import Button from "@/components/ui/Button";

type RecommendedActionProps = {
  onViewLeads: () => void;
};

export default function RecommendedAction({
  onViewLeads,
}: RecommendedActionProps) {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold text-red-600">HERE'S WHAT I'D DO NEXT</p>

      <h3 className="mt-3 text-3xl font-bold">Call Mike Brown.</h3>

      <p className="mt-3 text-slate-600">
        Emergency AC Repair • Waiting 11 hours • Potential Revenue{" "}
        <strong>$1,250</strong>
      </p>

      <div className="mt-6 rounded-2xl bg-green-50 p-5">
        <p className="text-sm font-semibold text-green-700">Booking Chance</p>
        <p className="mt-2 text-4xl font-bold text-green-800">96%</p>
      </div>

      <p className="mt-5 text-slate-600">
        Why? Emergency cooling calls with this wait time are highly likely to
        book when contacted quickly.
      </p>

      <div className="mt-6 flex gap-4">
        <Button>📞 Call Mike Brown</Button>
        <Button variant="secondary" onClick={onViewLeads}>
          View Lead
        </Button>
      </div>
    </div>
  );
}
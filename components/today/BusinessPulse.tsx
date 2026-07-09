export default function BusinessPulse() {
  const items = [
    ["Weather", "☀️ 94°F", "High AC demand expected."],
    ["Technicians", "4 / 4 Scheduled", "Team is fully booked today."],
    ["Reviews", "2 Waiting", "Two completed jobs need review requests."],
    ["Missed Calls", "0 Urgent", "No critical calls waiting."],
  ];

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-blue-700">BUSINESS PULSE</p>

      <div className="mt-5 space-y-4">
        {items.map(([label, value, detail]) => (
          <div key={label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 font-bold">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
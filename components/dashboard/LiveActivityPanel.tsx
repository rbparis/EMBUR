export default function LiveActivityPanel() {
  const liveItems = [
    ["9:42 AM", "✅", "John Smith booked.", "Emergency AC repair added."],
    ["9:51 AM", "📱", "Sarah Johnson replied.", "Estimate follow-up received."],
    ["10:03 AM", "📞", "Missed call recovered.", "Customer info captured."],
    ["10:11 AM", "⭐", "Review request sent.", "Completed job follow-up."],
    ["10:16 AM", "💵", "Revenue updated.", "+$950 recovered opportunity."],
  ];

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">LIVE</p>
          <h3 className="text-xl font-bold">Activity Feed</h3>
        </div>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          Active
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {liveItems.map(([time, icon, title, detail]) => (
          <div key={time} className="rounded-2xl bg-slate-50 p-4">
            <div className="flex gap-3">
              <div className="text-xl">{icon}</div>
              <div>
                <p className="text-xs font-semibold text-slate-400">{time}</p>
                <p className="mt-1 font-semibold">{title}</p>
                <p className="mt-1 text-sm text-slate-500">{detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
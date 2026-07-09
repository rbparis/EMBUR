export default function YesterdaySummary() {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold text-blue-700">YESTERDAY</p>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div>
          <p className="text-sm text-slate-500">Revenue Recovered</p>
          <p className="mt-2 text-4xl font-bold">$3,250</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Time Returned</p>
          <p className="mt-2 text-4xl font-bold">2h 18m</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Appointments Booked</p>
          <p className="mt-2 text-4xl font-bold">4</p>
        </div>
      </div>

      <p className="mt-6 text-lg text-slate-600">
        Yesterday EMBUR handled work that gave you back{" "}
        <strong>2 hours and 18 minutes</strong>. That time is yours again.
      </p>
    </div>
  );
}
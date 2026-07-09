export default function TimeReturnedCard() {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-blue-700">TIME RETURNED</p>

      <h3 className="mt-3 text-4xl font-bold">43 hours</h3>

      <p className="mt-3 text-slate-600">
        Returned this month through recovered calls, automatic follow-ups, and
        review requests.
      </p>

      <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-blue-900">
        That's over one full work week back in your life.
      </div>
    </div>
  );
}
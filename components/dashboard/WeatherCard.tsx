export default function WeatherCard() {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-blue-700">TODAY'S WEATHER</p>
      <h3 className="mt-3 text-3xl font-bold">☀️ 94°F</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        High cooling demand expected. More emergency AC calls may come in today.
      </p>
    </div>
  );
}
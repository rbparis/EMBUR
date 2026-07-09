type MetricCardProps = {
  value: string;
  label: string;
};

export default function MetricCard({ value, label }: MetricCardProps) {
  return (
    <div className="min-w-0 rounded-2xl border bg-white p-5 text-center shadow-sm">
      <p className="text-3xl font-bold text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-snug text-slate-500">{label}</p>
    </div>
  );
}
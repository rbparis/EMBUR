type StatusBadgeProps = { status: string };

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase().replaceAll("-", "_").replaceAll(" ", "_");
  const style = normalized.includes("paid") || normalized.includes("booked") || normalized.includes("completed")
    ? "bg-green-100 text-green-700"
    : normalized.includes("waiting") || normalized.includes("new")
      ? "bg-amber-100 text-amber-800"
      : normalized.includes("lost") || normalized.includes("high")
        ? "bg-red-100 text-red-700"
        : normalized.includes("contact") || normalized.includes("follow") || normalized.includes("invoice")
          ? "bg-blue-100 text-blue-700"
          : "bg-slate-100 text-slate-700";

  const label = status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}>{label}</span>;
}

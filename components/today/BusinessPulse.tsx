import EmburIcon, {
  type EmburIconName,
} from "@/components/ui/EmburIcon";

const pulseItems: Array<{
  label: string;
  value: string;
  detail: string;
  icon: EmburIconName;
  iconStyle: string;
}> = [
  {
    label: "Weather",
    value: "94°F",
    detail: "High cooling demand expected.",
    icon: "weather",
    iconStyle: "bg-orange-100 text-orange-700",
  },
  {
    label: "Technicians",
    value: "4 of 4 scheduled",
    detail: "Your field team is fully booked.",
    icon: "customers",
    iconStyle: "bg-blue-100 text-blue-700",
  },
  {
    label: "Reviews",
    value: "2 waiting",
    detail: "Two completed jobs need follow-up.",
    icon: "star",
    iconStyle: "bg-amber-100 text-amber-700",
  },
  {
    label: "Missed Calls",
    value: "0 urgent",
    detail: "No critical calls are waiting.",
    icon: "phone",
    iconStyle: "bg-green-100 text-green-700",
  },
];

export default function BusinessPulse() {
  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
          Business pulse
        </p>

        <h3 className="mt-2 text-xl font-bold text-slate-950">
          Everything looks under control.
        </h3>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        {pulseItems.map((item) => (
          <div
            key={item.label}
            className="group flex items-start gap-4 rounded-2xl bg-slate-50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.iconStyle}`}
            >
              <EmburIcon name={item.icon} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">
                {item.label}
              </p>

              <p className="mt-0.5 font-bold text-slate-950">{item.value}</p>

              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
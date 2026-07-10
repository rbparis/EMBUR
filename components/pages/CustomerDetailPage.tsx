import type { Lead } from "@/types";
import Button from "@/components/ui/Button";
import EmburIcon from "@/components/ui/EmburIcon";
import StatusBadge from "@/components/ui/StatusBadge";

type CustomerDetailPageProps = {
  customer: Lead;
  onBack: () => void;
};

export default function CustomerDetailPage({
  customer,
  onBack,
}: CustomerDetailPageProps) {
  return (
    <section className="mt-8 rounded-3xl border bg-white p-5 shadow-xl md:p-8">
      <Button variant="secondary" onClick={onBack}>
        ← Back to Customers
      </Button>

      <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
            Lead profile
          </p>

          <h3 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            {customer.name}
          </h3>

          <p className="mt-2 text-lg text-slate-600">
            {customer.service}
          </p>
        </div>

        <StatusBadge status={customer.status} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <CustomerInfo label="Phone" value="(555) 555-1212" />
        <CustomerInfo
          label="Estimated Value"
          value={customer.value}
        />
        <CustomerInfo label="Address" value="123 Main Street" />
        <CustomerInfo
          label="Priority"
          value={customer.name === "Mike Brown" ? "High" : "Normal"}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl bg-green-50 p-6">
          <p className="text-sm font-bold uppercase tracking-wider text-green-700">
            Lead health
          </p>

          <p className="mt-3 text-5xl font-bold text-green-900">
            98%
          </p>

          <p className="mt-2 font-semibold text-green-800">
            Likely to book today.
          </p>

          <LeadSignal>Urgent service need</LeadSignal>
          <LeadSignal>Strong estimated value</LeadSignal>
        </div>

        <div className="rounded-3xl border p-6">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
            Recommended action
          </p>

          <h4 className="mt-3 text-2xl font-bold text-slate-950">
            Call within 30 minutes.
          </h4>

          <p className="mt-3 leading-relaxed text-slate-600">
            This customer has waited 11 hours and reported an urgent
            cooling problem. A quick personal call is the strongest
            next step.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button>
              <span className="flex items-center gap-2">
                <EmburIcon name="phone" size={18} />
                Call Customer
              </span>
            </Button>

            <Button variant="secondary">Send Text</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CustomerInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 font-bold text-slate-950">{value}</p>
    </div>
  );
}

function LeadSignal({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 flex items-center gap-2 text-sm text-green-800 first:mt-6">
      <EmburIcon name="check" size={18} />
      {children}
    </div>
  );
}
import type { Lead } from "@/types";
import EmburIcon from "@/components/ui/EmburIcon";
import StatusBadge from "@/components/ui/StatusBadge";

type CustomersPageProps = {
  customers: Lead[];
  onCustomerSelect: (customer: Lead) => void;
};

export default function CustomersPage({
  customers,
  onCustomerSelect,
}: CustomersPageProps) {
  return (
    <section className="mt-8 rounded-3xl border bg-white p-5 shadow-sm md:p-6">
      <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
        Customer opportunities
      </p>

      <h3 className="mt-2 text-2xl font-bold text-slate-950">
        People waiting for help
      </h3>

      <p className="mt-2 text-slate-500">
        Open a customer to see what happened and what deserves attention.
      </p>

      <div className="mt-6 space-y-4">
        {customers.map((customer) => (
          <button
            type="button"
            key={customer.id}
            onClick={() => onCustomerSelect(customer)}
            className="group w-full cursor-pointer rounded-2xl border border-transparent bg-slate-50 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-bold text-slate-950">
                  {customer.name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {customer.service}
                </p>

                <p className="mt-3 text-sm font-semibold text-green-700">
                  Estimated opportunity: {customer.value}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={customer.status} />

                <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700">
                  <EmburIcon name="arrowRight" />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
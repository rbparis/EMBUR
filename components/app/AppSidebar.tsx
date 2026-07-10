import EmburLogo from "@/components/brand/EmburLogo";
import EmburIcon, {
  type EmburIconName,
} from "@/components/ui/EmburIcon";

export type AppPage =
  | "Today"
  | "Customers"
  | "Conversations"
  | "Business"
  | "Settings";

type AppSidebarProps = {
  activePage: AppPage;
  onPageChange: (page: AppPage) => void;
};

const navigation: Array<{
  page: AppPage;
  icon: EmburIconName;
}> = [
  { page: "Today", icon: "today" },
  { page: "Customers", icon: "customers" },
  { page: "Conversations", icon: "conversations" },
  { page: "Business", icon: "business" },
  { page: "Settings", icon: "settings" },
];

export default function AppSidebar({
  activePage,
  onPageChange,
}: AppSidebarProps) {
  return (
    <aside className="flex flex-col bg-slate-950 p-5 text-white md:p-6">
      <EmburLogo light />

      <nav
        aria-label="EMBUR application"
        className="mt-8 flex gap-2 overflow-x-auto pb-2 lg:mt-10 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0"
      >
        {navigation.map((item) => {
          const isActive = activePage === item.page;

          return (
            <button
              type="button"
              key={item.page}
              onClick={() => onPageChange(item.page)}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition-all duration-200 lg:w-full ${
                isActive
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <EmburIcon name={item.icon} size={19} />
              <span>{item.page}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto hidden rounded-2xl border border-white/10 bg-white/5 p-4 lg:block">
        <p className="text-xs font-bold uppercase tracking-wider text-orange-300">
          Time returned
        </p>

        <p className="mt-2 text-2xl font-bold">43 hours</p>

        <p className="mt-1 text-sm leading-relaxed text-slate-400">
          Returned to your business this month.
        </p>
      </div>
    </aside>
  );
}
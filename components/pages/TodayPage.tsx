import TodayOverview from "@/components/today/TodayOverview";

type TodayPageProps = {
  onViewCustomers: () => void;
};

export default function TodayPage({
  onViewCustomers,
}: TodayPageProps) {
  return <TodayOverview onViewLeads={onViewCustomers} />;
}
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import FounderControlRoom from "@/components/founder/FounderControlRoom";
import { getFounderContext } from "@/lib/founderAccess.server";
import { getHostedSalesMetrics } from "@/lib/hosted-sales/metrics.server";

export default async function FounderPage() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    redirect("/sign-in?redirect_url=%2Ffounder");
  }

  const founder = await getFounderContext(userId);

  if (!founder) {
    notFound();
  }

  const hostedSalesMetrics = await getHostedSalesMetrics(founder.business.id);
  return <FounderControlRoom hostedSalesMetrics={hostedSalesMetrics} />;
}

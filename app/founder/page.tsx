import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import FounderControlRoom from "@/components/founder/FounderControlRoom";
import { getFounderContext } from "@/lib/founderAccess.server";
import { getHostedSalesMetrics } from "@/lib/hosted-sales/metrics.server";
import { resolveDatabaseUrl } from "@/lib/prisma/databaseUrl";

export default async function FounderPage() {
  const { isAuthenticated, userId } = await auth();

  if (process.env.VERCEL_ENV === "preview") {
    let databaseHostname = "unavailable";
    try { databaseHostname = new URL(resolveDatabaseUrl() ?? "").hostname; } catch {}
    console.info("EMBUR_FOUNDER_DIAGNOSTIC", {
      stage: "authentication",
      isAuthenticated,
      userId,
      expectedFounderIdentity: userId === "user_3KoWNPRBAAbNWj8ObXJGAWLPG9v",
      databaseHostname,
    });
  }

  if (!isAuthenticated || !userId) {
    redirect("/sign-in?redirect_url=%2Ffounder");
  }

  const founder = await getFounderContext(userId);

  if (process.env.VERCEL_ENV === "preview") {
    console.info("EMBUR_FOUNDER_DIAGNOSTIC", {
      stage: "authorization",
      userId,
      founderMatch: Boolean(founder),
    });
  }

  if (!founder) {
    notFound();
  }

  const hostedSalesMetrics = await getHostedSalesMetrics(founder.business.id);
  return <FounderControlRoom hostedSalesMetrics={hostedSalesMetrics} />;
}

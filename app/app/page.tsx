import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AppShellPreview from "@/components/app/AppShellPreview";
import { getFounderContext } from "@/lib/founderAccess.server";
import { getClientWorkspaceForUser } from "@/lib/clientWorkspace.server";

export default async function WorkspacePage() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    redirect("/sign-in?redirect_url=%2Fapp");
  }

  if (await getFounderContext(userId)) {
    redirect("/founder");
  }

  const { business, mode } = await getClientWorkspaceForUser(userId);

  if (!business.phone || !business.industry) {
    redirect("/app/onboarding");
  }

  return (
    <AppShellPreview
      businessId={business.id}
      subscriptionPlan={business.subscriptionPlan}
      workspaceMode={mode}
    />
  );
}

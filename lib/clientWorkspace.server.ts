import { prisma } from "@/lib/prisma";
import { getOrCreateBusinessForUser } from "@/lib/currentBusiness";
import { resolveWorkspaceAccess, type WorkspaceAccess } from "@/lib/workspacePolicy";

export class WorkspaceAccessError extends Error {
  constructor(
    public readonly code: "FOUNDER_WORKSPACE" | "DEMO_DISABLED",
    message: string
  ) {
    super(message);
    this.name = "WorkspaceAccessError";
  }
}

export async function getClientWorkspaceForUser(clerkUserId: string) {
  let user = await prisma.user.findUnique({
    where: { clerkUserId },
    include: { business: true },
  });

  if (!user) {
    await getOrCreateBusinessForUser(clerkUserId);
    user = await prisma.user.findUniqueOrThrow({
      where: { clerkUserId },
      include: { business: true },
    });
  }

  const access: WorkspaceAccess = resolveWorkspaceAccess(
    user,
    process.env.EMBUR_DEMO_MODE_ENABLED === "true"
  );

  if (access === "founder") {
    throw new WorkspaceAccessError(
      "FOUNDER_WORKSPACE",
      "Founder accounts use the private Founder Control Room."
    );
  }

  if (access === "denied") {
    throw new WorkspaceAccessError(
      "DEMO_DISABLED",
      "This seeded workspace is not available outside explicit demo mode."
    );
  }

  return {
    user,
    business: user.business,
    mode: access as "client" | "demo",
  };
}

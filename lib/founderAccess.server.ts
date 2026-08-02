import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import {
  EMBUR_FOUNDER_USER_ID,
  EMBUR_INTERNAL_BUSINESS_ID,
} from "@/lib/internalWorkspace";

export async function getFounderContext(clerkUserId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    include: { business: true },
  });

  if (
    !user ||
    user.id !== EMBUR_FOUNDER_USER_ID ||
    user.businessId !== EMBUR_INTERNAL_BUSINESS_ID ||
    user.role !== "owner"
  ) {
    return null;
  }

  return { user, business: user.business };
}

export async function getAuthenticatedFounder() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return null;
  }

  return getFounderContext(userId);
}

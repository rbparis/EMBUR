import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const demoBusinessId = "business-embur-demo";
const demoOwnerId = "user-mike-owner";

function userDisplayName(user: { firstName: string | null; lastName: string | null; username: string | null }) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return fullName || user.username || "Business Owner";
}

export async function getOrCreateBusinessForUser(clerkUserId: string) {
  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId },
    include: { business: true },
  });

  if (existingUser) {
    return existingUser.business;
  }

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(clerkUserId);
  const email = clerkUser.primaryEmailAddress?.emailAddress?.trim().toLowerCase();

  if (!email) {
    throw new Error("Your Clerk account needs a primary email address before EMBUR can create a workspace.");
  }

  const name = userDisplayName(clerkUser);

  const emailUser = await prisma.user.findUnique({
    where: { email },
    include: { business: true },
  });

  if (emailUser) {
    await prisma.user.update({
      where: { id: emailUser.id },
      data: { clerkUserId, name },
    });
    return emailUser.business;
  }

  const demoBusiness = await prisma.business.findUnique({
    where: { id: demoBusinessId },
    include: {
      users: true,
      _count: { select: { customers: true } },
    },
  });

  const demoOwner = demoBusiness?.users.find((user) => user.id === demoOwnerId);

  if (demoBusiness && demoBusiness._count.customers > 0 && demoOwner && !demoOwner.clerkUserId) {
    await prisma.user.update({
      where: { id: demoOwner.id },
      data: { clerkUserId, name, email },
    });
    return demoBusiness;
  }

  return prisma.business.create({
    data: {
      name: `${name}'s Business`,
      users: {
        create: { clerkUserId, name, email, role: "owner" },
      },
    },
  });
}

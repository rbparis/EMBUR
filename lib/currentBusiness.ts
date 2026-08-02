import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { resolveWorkspaceAccess } from "@/lib/workspacePolicy";

function assertWorkspaceMayOpen(user: { id: string; businessId: string; role: string }) {
  const access = resolveWorkspaceAccess(
    user,
    process.env.EMBUR_DEMO_MODE_ENABLED === "true"
  );
  if (access === "founder" || access === "denied") {
    throw new Error("This account cannot open a client workspace.");
  }
}

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
    assertWorkspaceMayOpen(existingUser);
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
    assertWorkspaceMayOpen(emailUser);
    await prisma.user.update({
      where: { id: emailUser.id },
      data: { clerkUserId, name },
    });
    return emailUser.business;
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

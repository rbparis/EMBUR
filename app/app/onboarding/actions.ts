"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getClientWorkspaceForUser } from "@/lib/clientWorkspace.server";

function getText(formData: FormData, name: string, maxLength: number) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function saveBusinessProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=%2Fapp%2Fonboarding");

  const name = getText(formData, "name", 120);
  const phone = getText(formData, "phone", 30);
  const industry = getText(formData, "industry", 80);
  const timezone = getText(formData, "timezone", 80);

  if (!name || !phone || !industry || !timezone) {
    redirect("/app/onboarding?error=missing");
  }

  const { business } = await getClientWorkspaceForUser(userId);

  await prisma.business.update({
    where: { id: business.id },
    data: { name, phone, industry, timezone },
  });

  revalidatePath("/app");
  revalidatePath("/app/onboarding");
  redirect("/app/onboarding?complete=1");
}

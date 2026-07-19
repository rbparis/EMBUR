import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import AppShellPreview from "@/components/app/AppShellPreview";
import EmburLogo from "@/components/brand/EmburLogo";
import { getOrCreateBusinessForUser } from "@/lib/currentBusiness";

export default async function WorkspacePage() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    redirect("/sign-in?redirect_url=%2Fapp");
  }

  const business = await getOrCreateBusinessForUser(userId);

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/app"><EmburLogo size="small" /></Link>
            <div className="hidden border-l border-slate-200 pl-4 md:block">
              <div className="font-bold text-slate-900">{business.name}</div>
              <div className="text-sm text-slate-500">Private Workspace</div>
            </div>
          </div>
          <UserButton />
        </div>
      </header>
      <AppShellPreview />
    </main>
  );
}

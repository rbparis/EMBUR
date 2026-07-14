import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  OrganizationSwitcher,
  UserButton,
} from "@clerk/nextjs";
import AppShellPreview from "@/components/app/AppShellPreview";
import EmburLogo from "@/components/brand/EmburLogo";
import { getOrCreateBusinessForOrganization } from "@/lib/currentBusiness";

export default async function WorkspacePage() {
  const {
    isAuthenticated,
    orgId,
    redirectToSignIn,
  } = await auth();

  if (!isAuthenticated) {
    return redirectToSignIn();
  }

  if (!orgId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 p-8">
        <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">
          <EmburLogo
            size="medium"
            className="justify-center"
          />

          <h1 className="mt-8 text-3xl font-bold">
            Select Your Company
          </h1>

          <p className="mt-4 text-slate-600">
            Choose the company you want to open
            inside EMBUR.
          </p>

          <div className="mt-8 flex justify-center">
            <OrganizationSwitcher />
          </div>

          <Link
            href="/"
            className="mt-8 inline-block font-semibold text-blue-700 hover:text-blue-800"
          >
            ← Back to Website
          </Link>
        </div>
      </main>
    );
  }

  const business =
    await getOrCreateBusinessForOrganization(
      orgId
    );

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/app">
              <EmburLogo size="small" />
            </Link>

            <div className="hidden border-l border-slate-200 pl-4 md:block">
              <div className="font-bold text-slate-900">
                {business.name}
              </div>

              <div className="text-sm text-slate-500">
                Private Workspace
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <OrganizationSwitcher />
            <UserButton />
          </div>
        </div>
      </header>

      <AppShellPreview />
    </main>
  );
}
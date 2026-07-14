import Link from "next/link";
import {
  OrganizationSwitcher,
  UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import AppShellPreview from "@/components/app/AppShellPreview";
import EmburLogo from "@/components/brand/EmburLogo";
import { getOrCreateBusinessForOrganization } from "@/lib/currentBusiness";

export default async function EmburWorkspacePage() {
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
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5 text-slate-950">
        <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl md:p-12">
          <EmburLogo
            size="medium"
            className="justify-center"
          />

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
            Company required
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Select your company.
          </h1>

          <p className="mx-auto mt-4 max-w-md leading-relaxed text-slate-600">
            EMBUR keeps each company&apos;s customers,
            conversations, and intelligence private. Select your
            company to enter its workspace.
          </p>

          <div className="mt-8 flex justify-center">
            <OrganizationSwitcher />
          </div>

          <Link
            href="/"
            className="mt-8 inline-block text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            Return to the EMBUR website
          </Link>
        </section>
      </main>
    );
  }

  const business =
    await getOrCreateBusinessForOrganization(orgId);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/app"
              aria-label="Return to Today"
            >
              <EmburLogo size="small" />
            </Link>

            <div className="hidden border-l border-slate-200 pl-4 sm:block">
              <p className="text-sm font-bold text-slate-950">
                {business.name}
              </p>

              <p className="text-xs text-slate-500">
                Private EMBUR workspace
              </p>
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
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import AppShellPreview from "@/components/app/AppShellPreview";
import EmburLogo from "@/components/brand/EmburLogo";

export default async function EmburWorkspacePage() {
  await auth.protect();

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              aria-label="Return to the EMBUR website"
            >
              <EmburLogo size="small" />
            </Link>

            <div className="hidden border-l border-slate-200 pl-4 sm:block">
              <p className="text-sm font-bold text-slate-950">
                Owner Workspace
              </p>

              <p className="text-xs text-slate-500">
                Private and secure
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hidden text-sm font-semibold text-slate-600 transition hover:text-blue-700 sm:block"
            >
              Public website
            </Link>

            <UserButton />
          </div>
        </div>
      </header>

      <AppShellPreview />
    </main>
  );
}
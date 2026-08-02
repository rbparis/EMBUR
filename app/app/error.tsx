"use client";

import { useEffect } from "react";

export default function WorkspaceError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("EMBUR workspace error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-6 py-16">
      <section className="w-full rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
          Workspace unavailable
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          EMBUR could not load your company.
        </h1>
        <p className="mt-3 text-slate-600">
          The connection may be temporarily unavailable. Try loading the workspace again.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="mt-6 rounded-xl bg-slate-950 px-6 py-3 font-bold text-white"
        >
          Try again
        </button>
      </section>
    </main>
  );
}

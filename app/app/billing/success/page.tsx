import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getStripe } from "@/lib/stripe";

type BillingSuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function BillingSuccessPage({
  searchParams,
}: BillingSuccessPageProps) {
  const {
    isAuthenticated,
    redirectToSignIn,
  } = await auth();

  if (!isAuthenticated) {
    return redirectToSignIn();
  }

  const { session_id: sessionId } =
    await searchParams;

  if (!sessionId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <p className="font-semibold text-red-700">
          The Checkout Session ID is missing.
        </p>
      </main>
    );
  }

  const stripe = getStripe();

  const session =
    await stripe.checkout.sessions.retrieve(
      sessionId
    );

  const completed =
    session.status === "complete";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5 py-12 text-slate-950">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          {completed ? "✓" : "…"}
        </div>

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-green-700">
          EMBUR subscription
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          {completed
            ? "Payment completed."
            : "Payment is processing."}
        </h1>

        <p className="mt-4 leading-relaxed text-slate-600">
          {completed
            ? "Your subscription is active and EMBUR is ready to work for your business."
            : "Your payment is still processing. EMBUR will update your workspace as soon as it is confirmed."}
        </p>

        <Link
          href="/app"
          className="mt-8 inline-flex rounded-xl bg-blue-600 px-7 py-4 font-bold text-white transition hover:bg-blue-700"
        >
          Return to EMBUR
        </Link>
      </section>
    </main>
  );
}

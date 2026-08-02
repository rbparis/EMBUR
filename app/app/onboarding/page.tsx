import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import EmburLogo from "@/components/brand/EmburLogo";
import { getFounderContext } from "@/lib/founderAccess.server";
import { getClientWorkspaceForUser } from "@/lib/clientWorkspace.server";
import { saveBusinessProfile } from "./actions";

export const metadata: Metadata = {
  title: "Set up your business",
  description: "Prepare your EMBUR workspace and after-hours lead intake.",
};

type Props = { searchParams: Promise<{ complete?: string; error?: string }> };

const industries = ["HVAC", "Plumbing", "Electrical", "Roofing", "General contracting", "Home services", "Other"];
const timezones = [
  ["America/New_York", "Eastern Time"],
  ["America/Chicago", "Central Time"],
  ["America/Denver", "Mountain Time"],
  ["America/Los_Angeles", "Pacific Time"],
  ["America/Phoenix", "Arizona Time"],
];

export default async function OnboardingPage({ searchParams }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=%2Fapp%2Fonboarding");

  if (await getFounderContext(userId)) redirect("/founder");
  const { business } = await getClientWorkspaceForUser(userId);
  const { complete, error } = await searchParams;
  const intakeUrl = `/intake/${business.id}`;

  return (
    <main className="min-h-screen bg-[#04112b] px-5 py-8 text-white md:px-8 md:py-12">
      <div className="pointer-events-none fixed inset-0 embur-hero-grid opacity-40" />
      <div className="pointer-events-none fixed right-[-10rem] top-[-8rem] h-[34rem] w-[34rem] rounded-full bg-blue-500/20 blur-[110px]" />
      <div className="relative mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/"><EmburLogo light /></Link>
          <Link href="/app" className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/10">Workspace</Link>
        </div>

        {complete === "1" ? (
          <section className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white text-[#06142f] shadow-2xl">
            <div className="bg-[#071832] p-7 text-white md:p-10">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-200">Ready to capture</p>
              <h1 className="font-display mt-4 text-4xl font-semibold tracking-[-0.045em] md:text-6xl">{business.name} is set up.</h1>
              <p className="mt-4 max-w-2xl leading-7 text-[#a8b9d4]">Your private intake page is live. Every completed request enters your EMBUR leads and conversations.</p>
            </div>
            <div className="grid gap-6 p-7 md:grid-cols-[1.15fr_0.85fr] md:p-10">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#1555c6]">Your after-hours link</p>
                <div className="mt-3 break-all rounded-2xl border border-[#d8e1ee] bg-[#eef3fb] p-4 font-semibold text-[#06142f]">https://getembur.com{intakeUrl}</div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={intakeUrl} target="_blank" className="rounded-xl bg-[#246bfe] px-5 py-3 font-extrabold text-white hover:bg-[#1555c6]">Test the customer experience</Link>
                  <Link href="/app" className="rounded-xl border border-[#d8e1ee] px-5 py-3 font-extrabold hover:bg-[#eef3fb]">Open workspace</Link>
                </div>
              </div>
              <div className="rounded-2xl bg-[#fff4ef] p-5">
                <p className="font-display text-xl font-semibold">Put this link where calls get lost.</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[#596a85]">
                  <li>• Website contact button</li>
                  <li>• Google Business Profile</li>
                  <li>• After-hours voicemail</li>
                  <li>• Missed-call text reply</li>
                </ul>
              </div>
            </div>
          </section>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <section className="pt-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-200">First five minutes</p>
              <h1 className="font-display mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.055em] md:text-6xl">Set the business. Start catching leads.</h1>
              <p className="mt-6 text-lg leading-8 text-[#a8b9d4]">These details power your workspace and the page customers use when nobody can answer.</p>
              <ol className="mt-8 space-y-4">
                <Step number="1" text="Confirm how customers know your business." />
                <Step number="2" text="Open and test the private intake page." />
                <Step number="3" text="Place the link on the channels you already own." />
              </ol>
            </section>

            <form action={saveBusinessProfile} className="rounded-[2rem] bg-white p-6 text-[#06142f] shadow-2xl md:p-9">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1555c6]">Business profile</p>
              <h2 className="font-display mt-3 text-3xl font-semibold">What should EMBUR represent?</h2>
              {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error === "missing" ? "Complete every field to continue." : "We could not match this account to a business."}</p>}
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <Field label="Business name" wide><input name="name" required maxLength={120} defaultValue={business.name} className={inputClass} autoComplete="organization" /></Field>
                <Field label="Business phone"><input name="phone" required maxLength={30} defaultValue={business.phone ?? ""} className={inputClass} autoComplete="tel" inputMode="tel" placeholder="(555) 555-0123" /></Field>
                <Field label="Industry"><select name="industry" required defaultValue={business.industry ?? ""} className={inputClass}><option value="" disabled>Select one</option>{industries.map((industry) => <option key={industry}>{industry}</option>)}</select></Field>
                <Field label="Time zone"><select name="timezone" required defaultValue={business.timezone} className={inputClass}>{timezones.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
              </div>
              <button className="mt-7 min-h-14 w-full rounded-2xl bg-[#ff6a3d] px-6 font-extrabold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-[#ff7a52]">Save and activate intake →</button>
              <p className="mt-4 text-center text-xs leading-5 text-[#7188ad]">You can change these details later. No customer is contacted automatically during setup.</p>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-[#d8e1ee] bg-white px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={wide ? "sm:col-span-2" : ""}><span className="text-sm font-bold text-[#52637e]">{label}</span>{children}</label>;
}

function Step({ number, text }: { number: string; text: string }) {
  return <li className="flex items-center gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] font-display font-semibold text-[#8fb4ff]">{number}</span><span className="font-semibold text-[#d5e1f7]">{text}</span></li>;
}

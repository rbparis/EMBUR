import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/marketing/SiteHeader";
import SiteActivityTracker from "@/components/marketing/SiteActivityTracker";

const title = "EMBUR — Organized after-hours follow-up";
const description = "Collect inquiries through an after-hours intake page, keep leads and conversations in one place, and use Atlas to prioritize follow-up.";
export const metadata: Metadata = {
  title: { absolute: title }, description,
  keywords: ["after-hours web intake", "organized follow-up", "customer records", "HVAC software"],
  openGraph: { title, description, siteName: "EMBUR", type: "website" },
  twitter: { card: "summary", title, description },
};
const workflow = [
  { title: "After-hours web intake", body: "A visitor submits a service request through the intake page." },
  { title: "Customer record", body: "The request is stored with the customer and conversation records." },
  { title: "Prioritized follow-up", body: "Atlas helps the owner review priorities and choose the next action." },
];
const agents = [
  ["Call", "Planned call handling."], ["Book", "Planned booking support."],
  ["Follow up", "Planned follow-up assistance."], ["Refer", "Planned referral support."],
  ["Reputation", "Planned reputation support."], ["Create", "Planned content tools."],
  ["Traffic", "Planned traffic tools."], ["Atlas", "Priorities and suggested next actions for owner review."],
];
export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#06142f]">
      <SiteActivityTracker /><SiteHeader />
      <section id="top" className="bg-[#04112b] px-5 py-20 text-white md:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[90rem] items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">After-hours web intake for local business</p>
            <h1 className="font-display mt-6 text-5xl font-semibold leading-tight tracking-tight md:text-7xl">Turn after-hours inquiries into organized follow-up.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">{description}</p>
            <Link href="/#early-access" className="mt-8 inline-flex rounded-full bg-white px-7 py-4 font-bold text-[#06142f]">Join early access</Link>
          </div>
          <div className="rounded-[2rem] border border-white/15 bg-[#071832] p-7 md:p-9">
            <h2 className="font-display text-2xl font-semibold">Illustrative workflow</h2>
            <p className="mt-3 text-sm leading-6 text-blue-200">Illustrative example — not a customer result.</p>
            <ol className="mt-7 space-y-4">{workflow.map((step, index) => <li key={step.title} className="rounded-2xl border border-white/10 p-5"><p className="text-xs font-bold text-blue-300">0{index + 1}</p><h3 className="mt-2 text-xl font-semibold">{step.title}</h3></li>)}</ol>
          </div>
        </div>
      </section>
      <section id="watch" className="mx-auto max-w-[90rem] px-5 py-20 md:px-8">
        <p className="text-sm font-bold text-blue-700">The current workflow</p>
        <h2 className="font-display mt-4 text-4xl font-semibold md:text-5xl">From web inquiry to owner review.</h2>
        <p className="mt-5 text-slate-600">Illustrative example — not a customer result. Follow-up is chosen and carried out by the business owner.</p>
        <div className="mt-9 grid gap-5 md:grid-cols-3">{workflow.map((step) => <article key={step.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-7"><h3 className="text-xl font-semibold">{step.title}</h3><p className="mt-4 leading-7 text-slate-600">{step.body}</p></article>)}</div>
      </section>
      <section id="agents" className="bg-[#06142f] px-5 py-20 text-white md:px-8">
        <div className="mx-auto max-w-[90rem]">
          <p className="text-sm font-bold text-blue-300">Availability</p><h2 className="font-display mt-4 text-4xl font-semibold md:text-5xl">What is available. What is planned.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{agents.map(([name, body]) => <article key={name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><p className="text-xs font-bold text-blue-200">{name === "Atlas" ? "Available in the current workspace" : "Coming soon"}</p><h3 className="mt-5 text-2xl font-semibold">{name}</h3><p className="mt-3 leading-7 text-slate-300">{body}</p></article>)}</div>
          <p className="mt-7 text-sm leading-7 text-slate-300">Planned agents are not live services. Atlas offers suggestions; it does not answer calls, book jobs, send messages, or run advertising.</p>
        </div>
      </section>
      <section id="early-access" className="bg-[#eef3fb] px-5 py-20 text-center md:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 md:p-12">
          <p className="text-sm font-bold text-blue-700">Early access</p><h2 className="font-display mt-4 text-4xl font-semibold">Pilot opening soon.</h2>
          <p className="mt-5 leading-8 text-slate-600">We are preparing a free pilot for 3–5 contractors. Applications are not open yet. Paid enrollment is paused.</p>
          <p className="mt-5 leading-7 text-slate-600">Questions about the pilot? Contact <a href="mailto:getembur@gmail.com" className="font-semibold text-blue-700 underline">getembur@gmail.com</a>.</p>
        </div>
      </section>
      <footer className="bg-[#030b1d] px-5 py-10 text-slate-300 md:px-8"><div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-6"><p>© {new Date().getFullYear()} EMBUR. Organized follow-up.</p><nav aria-label="Footer" className="flex flex-wrap gap-5">{["blog", "privacy", "terms", "refunds", "support"].map((page) => <Link key={page} href={`/${page}`} className="capitalize hover:text-white">{page === "blog" ? "Field notes" : page}</Link>)}</nav></div></footer>
    </main>
  );
}

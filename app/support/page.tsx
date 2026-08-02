import type { Metadata } from "next";
import Link from "next/link";
import EmburLogo from "@/components/brand/EmburLogo";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with your EMBUR account, billing, workspace, or after-hours intake.",
};

const help = [
  { title: "Account access", body: "Include the email used for EMBUR and describe what happens when you sign in." },
  { title: "Billing", body: "Include the charge date and amount. Never email a full card number or secret key." },
  { title: "Workspace help", body: "Tell us the page, the action you tried, and the exact message you saw." },
  { title: "Lead intake", body: "Include your business name and intake link. Do not send sensitive customer information unless requested." },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#eef3fb] text-[#06142f]">
      <header className="bg-[#04112b] text-white">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/"><EmburLogo light /></Link>
          <Link href="/sign-in" className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold hover:bg-white/10">Sign in</Link>
        </div>
      </header>
      <section className="relative overflow-hidden bg-[#06142f] px-5 py-20 text-white md:px-8 md:py-28">
        <div className="absolute right-[-8rem] top-[-8rem] h-96 w-96 rounded-full bg-blue-500/20 blur-[100px]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-200">Real help</p>
          <h1 className="font-display mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Tell us what is blocking the business.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#a8b9d4]">We will help with account access, billing, setup, or a workspace issue.</p>
          <a href="mailto:hello@getembur.com?subject=EMBUR%20support%20request" className="mt-8 inline-flex min-h-14 items-center rounded-full bg-[#ff6a3d] px-7 font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#ff7a52]">Email EMBUR support</a>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-4 md:grid-cols-2">
          {help.map((item) => (
            <article key={item.title} className="rounded-3xl border border-[#d8e1ee] bg-white p-6 shadow-sm md:p-8">
              <h2 className="font-display text-2xl font-semibold">{item.title}</h2>
              <p className="mt-3 leading-7 text-[#596a85]">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-3xl border border-blue-200 bg-blue-50 p-6 md:p-8">
          <p className="font-bold text-[#06142f]">Security reminder</p>
          <p className="mt-2 leading-7 text-[#596a85]">EMBUR support will never ask you to email passwords, full payment-card details, database connection strings, API secret keys, or one-time login codes.</p>
        </div>
      </section>
    </main>
  );
}

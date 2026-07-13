import Link from "next/link";
import EmburLogo from "@/components/brand/EmburLogo";
import GetMyTimeBack from "@/components/journey/GetMyTimeBack";
import EmburPromise from "@/components/marketing/EmburPromise";
import HeroSection from "@/components/marketing/HeroSection";
import InvestmentCard from "@/components/marketing/InvestmentCard";
import SiteHeader from "@/components/marketing/SiteHeader";
import TimeReturnCalculator from "@/components/marketing/TimeReturnCalculator";
import WhyEmburSection from "@/components/marketing/WhyEmburSection";

export default function Home() {
  return (
    <main
      id="top"
      className="min-h-screen bg-slate-50 text-slate-900"
    >
      <SiteHeader />

      <HeroSection />

      <WhyEmburSection />

      <section
        id="product"
        className="scroll-mt-24 border-y border-slate-200 bg-white py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-14 text-center text-white shadow-2xl md:px-12 md:py-20">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-300">
              The EMBUR workspace
            </p>

            <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Know what matters.
              <br />
              Let EMBUR handle the rest.
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
              Sign in to your private workspace to review Atlas
              Intelligence, customers, conversations, priorities,
              and the time EMBUR has returned.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/app"
                prefetch={false}
                className="rounded-xl bg-white px-7 py-4 font-bold text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Open My Workspace →
              </Link>

              <Link
                href="/sign-up"
                className="rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-bold text-white transition hover:bg-white/10"
              >
                Create an EMBUR Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TimeReturnCalculator />

      <InvestmentCard />

      <EmburPromise />

      <GetMyTimeBack />

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-10 text-center text-sm text-slate-500 md:flex-row md:px-8 md:text-left">
          <a
            href="#top"
            aria-label="Return to the EMBUR homepage"
          >
            <EmburLogo size="small" />
          </a>

          <p>
            © {new Date().getFullYear()} EMBUR. Returning
            time to local service business owners.
          </p>

          <Link
            href="/app"
            prefetch={false}
            className="font-semibold text-blue-700 transition hover:text-blue-800"
          >
            Open Workspace
          </Link>
        </div>
      </footer>
    </main>
  );
}
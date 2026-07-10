import MorningBrief from "@/components/MorningBrief";
import DashboardPreview from "@/components/DashboardPreview";
import ConversationPreview from "@/components/ConversationPreview";
import LeadDetailPreview from "@/components/LeadDetailPreview";
import AppShellPreview from "@/components/app/AppShellPreview";
import GetMyTimeBack from "@/components/journey/GetMyTimeBack";

export default function Home() {
  const promises = [
    {
      title: "Recover",
      description:
        "Turn missed calls and forgotten follow-ups into real opportunities.",
    },
    {
      title: "Organize",
      description:
        "Know what deserves attention without searching through disconnected tools.",
    },
    {
      title: "Return",
      description:
        "Give repetitive office work to EMBUR and take those hours back.",
    },
    {
      title: "Grow",
      description:
        "Book more jobs while building a business that does not depend on you every minute.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="sticky top-0 z-40 border-b bg-slate-50/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#" className="flex items-center gap-3">
            <img
              src="/embur-logo.png"
              alt="EMBUR"
              className="h-10 w-10 rounded-xl object-contain"
            />

            <span className="text-2xl font-bold text-slate-950">EMBUR</span>
          </a>

          <div className="hidden items-center gap-8 font-medium text-slate-600 md:flex">
            <a href="#dashboard" className="transition hover:text-blue-700">
              See EMBUR
            </a>

            <a href="#promise" className="transition hover:text-blue-700">
              Our Promise
            </a>

            <a href="#time-back" className="transition hover:text-blue-700">
              Get Time Back
            </a>
          </div>

          <a
            href="#time-back"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Get My Time Back
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-5 py-20 text-center md:px-8 md:py-28">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Built for local service business owners
        </div>

        <h1 className="mt-8 text-4xl font-bold leading-tight text-slate-950 md:text-6xl">
          Your business keeps moving.
          <br />
          Your time becomes yours again.
        </h1>

        <p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">
          EMBUR recovers missed opportunities, organizes what deserves your
          attention, and carries the repetitive work that keeps following you
          home.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#time-back"
            className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
          >
            Get My Time Back
          </a>

          <a
            href="#dashboard"
            className="rounded-xl border bg-white px-8 py-4 text-lg font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            See EMBUR in Action
          </a>
        </div>

        <p className="mt-5 text-sm text-slate-500">
          No sales pressure. A conversation about your business and your time.
        </p>
      </section>

      <section id="dashboard" className="scroll-mt-20">
        <AppShellPreview />
      </section>

      <MorningBrief />
      <DashboardPreview />
      <ConversationPreview />
      <LeadDetailPreview />

      <section
        id="promise"
        className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 md:px-8"
      >
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
            The EMBUR promise
          </p>

          <h2 className="mt-4 text-4xl font-bold text-slate-950">
            Built to return time to the owner.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Revenue proves the system works. Time returned is the product.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {promises.map((promise, index) => (
            <div
              key={promise.title}
              className="rounded-3xl border bg-white p-6 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 font-bold text-white">
                {index + 1}
              </div>

              <h3 className="mt-5 text-xl font-bold">{promise.title}</h3>

              <p className="mt-3 leading-relaxed text-slate-600">
                {promise.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-12 text-center text-white md:px-12">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-200">
            More life outside of work
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight">
            Owning a business should not mean sacrificing everything else.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            EMBUR quietly carries part of the workload so owners can spend more
            time on their health, families, teams, and future.
          </p>
        </div>
      </section>

      <GetMyTimeBack />

      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-10 text-sm text-slate-500 md:flex-row md:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/embur-logo.png"
              alt=""
              className="h-8 w-8 rounded-lg object-contain"
            />

            <span className="font-bold text-slate-900">EMBUR</span>
          </div>

          <p>
            © {new Date().getFullYear()} EMBUR. Returning time to local business
            owners.
          </p>
        </div>
      </footer>
    </main>
  );
}
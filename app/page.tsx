import MorningBrief from "@/components/MorningBrief";
import DashboardPreview from "@/components/DashboardPreview";
import ConversationPreview from "@/components/ConversationPreview";
import LeadDetailPreview from "@/components/LeadDetailPreview";
import AppShellPreview from "@/components/app/AppShellPreview";
import GetMyTimeBack from "@/components/journey/GetMyTimeBack";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-3">
          <img
            src="/embur-logo.png"
            alt="EMBUR logo"
            className="h-9 w-9 rounded-lg object-contain"
          />
          <span>EMBUR</span>
        </h1>

        <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
          <a href="#features" className="hover:text-blue-700 transition">
            Features
          </a>
          <a href="#dashboard" className="hover:text-blue-700 transition">
            Today
          </a>
          <a href="#time-back" className="hover:text-blue-700 transition">
            Get Time Back
          </a>
        </div>

        <a
          href="#time-back"
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 transition"
        >
          Get My Time Back
        </a>
      </nav>

      <section className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h2 className="text-5xl font-bold leading-tight">
          Every Missed Call Could Cost Thousands.
          <br />
          EMBUR Makes Sure It Doesn&apos;t.
        </h2>

        <p className="mt-8 text-xl text-slate-600 max-w-3xl mx-auto">
          EMBUR helps local service businesses recover missed opportunities,
          organize priorities, and give owners more time back.
        </p>

        <a
          href="#time-back"
          className="mt-10 inline-block rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition"
        >
          Get My Time Back
        </a>
      </section>

      <section id="dashboard">
        <AppShellPreview />
      </section>

      <MorningBrief />
      <DashboardPreview />
      <ConversationPreview />
      <LeadDetailPreview />

      <section id="features" className="max-w-6xl mx-auto px-8 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">
          Built to return time to the owner.
        </h3>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            "Recover Missed Calls",
            "Organize Priorities",
            "Book More Jobs",
            "Return Time",
          ].map((feature) => (
            <div
              key={feature}
              className="rounded-xl bg-white p-6 shadow-sm border"
            >
              <h4 className="font-semibold text-lg">{feature}</h4>
            </div>
          ))}
        </div>
      </section>

      <GetMyTimeBack />

      <footer className="border-t py-10 text-center text-slate-500">
        © {new Date().getFullYear()} EMBUR. Built for local service businesses.
      </footer>
    </main>
  );
}
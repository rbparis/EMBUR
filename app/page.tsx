import DashboardPreview from "@/components/DashboardPreview";
export default function Home() {
  const steps = [
    { icon: "📞", title: "Call", description: "A customer calls your HVAC business." },
    { icon: "🤖", title: "AI Replies", description: "RelayOps instantly follows up." },
    { icon: "📋", title: "Lead Saved", description: "Customer information is captured." },
    { icon: "📲", title: "Office Alert", description: "Your team gets notified." },
    { icon: "✅", title: "Appointment", description: "More missed calls become booked jobs." },
  ];

  const metrics = [
    { label: "Leads Today", value: "12" },
    { label: "Recovered Calls", value: "6" },
    { label: "Appointments", value: "4" },
    { label: "Pending Quotes", value: "9" },
  ];

  const activities = [
    { name: "John Smith", service: "Emergency AC Repair", status: "Booked" },
    { name: "Sarah Johnson", service: "New Install Estimate", status: "Follow-up Sent" },
    { name: "Mike Brown", service: "No Cooling", status: "Waiting" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-3">
          <span>🔷</span>
          <span>RelayOps</span>
        </h1>

        <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
          <a href="#features" className="hover:text-blue-700 transition">Features</a>
          <a href="#dashboard" className="hover:text-blue-700 transition">Dashboard</a>
          <a href="#pricing" className="hover:text-blue-700 transition">Pricing</a>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 transition">
          Book a Demo
        </button>
      </nav>

      <section className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h2 className="text-5xl font-bold leading-tight">
          Every Missed Call Could Cost Thousands.
          <br />
          RelayOps Makes Sure It Doesn't.
        </h2>

        <p className="mt-8 text-xl text-slate-600 max-w-3xl mx-auto">
          Never lose another lead because someone missed the phone. RelayOps
          follows up automatically, captures customer information, and keeps
          your schedule full.
        </p>

        <button className="mt-10 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition">
          Book Your Free Demo
        </button>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-16 text-center">
        <h3 className="text-3xl font-bold mb-12">How RelayOps Works</h3>

        <div className="grid gap-6 md:grid-cols-9 items-center">
          {steps.map((step, index) => (
            <div key={step.title} className="contents">
              <div className="rounded-2xl border bg-white p-6 shadow-sm min-h-44 flex flex-col items-center justify-center">
                <div className="text-3xl mb-3">{step.icon}</div>
                <h4 className="font-bold">{step.title}</h4>
                <p className="mt-2 text-sm text-slate-500">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block text-3xl text-slate-400">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <DashboardPreview />
      <section id="features" className="max-w-6xl mx-auto px-8 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">
          Everything You Need
        </h3>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            "Missed Call Recovery",
            "AI Follow-Ups",
            "Lead Dashboard",
            "Review Requests",
          ].map((feature) => (
            <div key={feature} className="rounded-xl bg-white p-6 shadow-sm border">
              <h4 className="font-semibold text-lg">{feature}</h4>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-10 text-center text-slate-500">
        © {new Date().getFullYear()} RelayOps. Built for HVAC companies.
      </footer>
    </main>
  );
}
export default function DashboardPreview() {
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
    <section id="dashboard" className="max-w-7xl mx-auto px-8 py-20">
      <div className="text-center mb-12">
        <p className="text-blue-700 font-semibold">Dashboard Preview</p>
        <h3 className="mt-3 text-4xl font-bold">
          See every missed opportunity in one place.
        </h3>
        <p className="mt-4 text-lg text-slate-600">
          RelayOps gives HVAC owners a simple command center for leads,
          follow-ups, appointments, and AI activity.
        </p>
      </div>

      <div className="rounded-3xl border bg-white shadow-xl overflow-hidden">
        <div className="border-b bg-slate-900 px-8 py-5 text-white flex items-center justify-between">
          <div>
            <h4 className="font-bold text-lg">RelayOps Dashboard</h4>
            <p className="text-sm text-slate-300">Today&apos;s customer activity</p>
          </div>

          <span className="rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-300">
            Live Preview
          </span>
        </div>

        <div className="p-8">
          <div className="grid gap-6 md:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border bg-slate-50 p-6">
                <p className="text-sm text-slate-500">{metric.label}</p>
                <p className="mt-3 text-4xl font-bold">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border p-6">
              <h5 className="font-bold text-lg mb-5">Recent Activity</h5>

              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.name}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                  >
                    <div>
                      <p className="font-semibold">{activity.name}</p>
                      <p className="text-sm text-slate-500">{activity.service}</p>
                    </div>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-6">
              <h5 className="font-bold text-lg mb-5">AI Assistant Summary</h5>

              <div className="space-y-4 text-slate-700">
                <p className="rounded-xl bg-green-50 p-4">
                  ✅ Followed up with 6 missed callers.
                </p>
                <p className="rounded-xl bg-green-50 p-4">
                  ✅ Helped book 4 appointments.
                </p>
                <p className="rounded-xl bg-green-50 p-4">
                  ✅ Sent 3 review requests after completed jobs.
                </p>
                <p className="rounded-xl bg-blue-50 p-4">
                  🔔 2 leads still need human review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
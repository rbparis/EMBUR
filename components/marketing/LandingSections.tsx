import Link from "next/link";
import EmburLogo from "@/components/brand/EmburLogo";

const serviceTypes = ["HVAC", "Plumbing", "Electrical", "Roofing", "Home services"];
const outcomes = [
  { number: "01", title: "Capture", body: "Turn missed calls and after-hours visits into complete, organized opportunities." },
  { number: "02", title: "Prioritize", body: "See the customer, estimate, or conversation that deserves attention first." },
  { number: "03", title: "Move", body: "Prepare the next action and keep follow-up moving without adding office chaos." },
  { number: "04", title: "Prove", body: "Track recovered revenue and returned time so the value is visible every month." },
];

export function ServiceRibbon() {
  return (
    <section aria-label="Industries served" className="border-y border-white/10 bg-[#071832] text-white">
      <div className="mx-auto flex max-w-[90rem] flex-col items-center gap-5 px-5 py-7 md:flex-row md:justify-between md:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7188ad]">Built for the businesses that keep life moving</p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {serviceTypes.map((type) => <span key={type} className="font-display text-sm font-semibold text-[#d5e1f7]">{type}</span>)}
        </div>
      </div>
    </section>
  );
}

export function OutcomeSection() {
  return (
    <section id="why-embur" className="bg-[#eef3fb] px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1555c6]">From reactive to in control</p>
            <h2 className="font-display mt-5 text-4xl font-semibold leading-[1.01] tracking-[-0.045em] text-[#06142f] md:text-6xl">
              Every opportunity has a next move.<br /><span className="text-[#7586a3]">EMBUR makes it impossible to miss.</span>
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[#52637e] lg:justify-self-end">Independent service businesses deserve the operating clarity of a national company - without more software, more meetings, or an owner who can never switch off.</p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-[#cfd9e9] bg-[#cfd9e9] shadow-[0_30px_80px_-45px_rgba(4,17,43,0.35)] md:grid-cols-2 xl:grid-cols-4">
          {outcomes.map((item) => (
            <article key={item.title} className="group bg-white p-7 transition duration-300 hover:bg-[#071832] md:min-h-72 md:p-8">
              <div className="flex items-center justify-between"><span className="font-display text-sm font-semibold text-[#1f64df] group-hover:text-[#8fb4ff]">{item.number}</span><span className="h-2.5 w-2.5 rounded-full bg-[#d9e2ef] transition group-hover:bg-[#ff6a3d]" /></div>
              <h3 className="font-display mt-20 text-3xl font-semibold tracking-tight text-[#06142f] transition group-hover:text-white">{item.title}</h3>
              <p className="mt-3 leading-7 text-[#5d6b80] transition group-hover:text-[#a9bad5]">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductStory() {
  return (
    <section id="product" className="overflow-hidden bg-white px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[90rem] gap-16 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1555c6]">Atlas intelligence inside</p>
          <h2 className="font-display mt-5 text-4xl font-semibold leading-[1.01] tracking-[-0.045em] text-[#06142f] md:text-6xl">Open EMBUR.<br />Know the move.<br /><span className="text-[#246bfe]">Own the day.</span></h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#596a85]">Customers, conversations, revenue risk, and recommended actions come together in one calm command center. Atlas explains what matters, why it matters, and what to do next.</p>
          <div className="mt-9 space-y-5">
            <ProductPoint title="Clarity before the day starts" body="See business health, revenue at risk, and the strongest opportunity in one brief." />
            <ProductPoint title="Automation with your approval" body="Atlas prepares the next move. You decide what gets sent and when." />
            <ProductPoint title="Results you can measure" body="Recovered jobs and returned hours become a visible operating record." />
          </div>
          <Link href="/sign-up" className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#071832] px-6 py-3.5 font-extrabold text-white shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-[#1555c6]">Sign up <span>→</span></Link>
        </div>

        <div className="relative">
          <div className="absolute -inset-12 rounded-full bg-blue-200/60 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-[#18315f] bg-[#06142f] p-4 shadow-[0_45px_110px_-38px_rgba(4,17,43,0.65)] md:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div><p className="font-display font-semibold text-white">Monday, July 21</p><p className="mt-1 text-xs text-[#7188ad]">Your business at a glance</p></div>
              <span className="rounded-full border border-blue-300/15 bg-blue-300/10 px-3 py-1.5 text-xs font-bold text-blue-100">Atlas brief</span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Metric label="Business health" value="88/100" accent="blue" />
              <Metric label="Revenue at risk" value="$12.4k" accent="orange" />
              <Metric label="Actions ready" value="3" accent="green" />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl bg-white p-5 text-[#06142f]">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1f64df]">Today&apos;s highest-value move</p>
                <p className="font-display mt-3 text-2xl font-semibold">Recover Sarah&apos;s open estimate.</p>
                <p className="mt-2 text-sm leading-6 text-[#63728a]">A $4,800 replacement estimate has been open for three days. A direct call is the strongest next move.</p>
                <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-[#246bfe] px-4 py-2 text-xs font-bold text-white">Open customer</span><span className="rounded-full bg-[#edf2f9] px-4 py-2 text-xs font-bold text-[#52637e]">Why this?</span></div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-white">
                <p className="text-xs text-[#7188ad]">This month</p><p className="font-display mt-2 text-4xl font-semibold text-orange-200">18h</p><p className="mt-1 text-sm text-[#91a4c2]">returned to the owner</p>
                <div className="mt-7 space-y-2">{[68, 82, 54, 92, 72].map((width, index) => <div key={index} className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#246bfe] to-[#78a9ff]" style={{ width: `${width}%` }} /></div>)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AfterHoursSection() {
  return (
    <section id="after-hours" className="relative isolate overflow-hidden bg-[#04112b] px-5 py-24 text-white md:px-8 md:py-32">
      <div className="pointer-events-none absolute right-[-12rem] top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-blue-500/20 blur-[120px]" />
      <div className="relative mx-auto grid max-w-[90rem] gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-200">Your business stays open after you clock out</p>
          <h2 className="font-display mt-5 text-4xl font-semibold leading-[1.01] tracking-[-0.045em] md:text-6xl">The call you miss tonight can still become tomorrow&apos;s job.</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#a8b9d4]">The EMBUR After-Hours Agent responds immediately, captures the complete service request, recognizes urgency, and places a qualified opportunity in your morning queue.</p>
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            <AfterHoursPoint number="01" title="Respond immediately" body="Give every visitor a professional next step, even at 2 AM." />
            <AfterHoursPoint number="02" title="Capture the whole job" body="Collect contact, service, urgency, address, and timing." />
            <AfterHoursPoint number="03" title="Escalate responsibly" body="Flag urgent needs while keeping emergency guidance clear." />
            <AfterHoursPoint number="04" title="Start ready" body="Wake up to an organized lead and a recommended action." />
          </div>
          <Link href="/sign-up" className="mt-10 inline-flex min-h-14 items-center justify-center rounded-full bg-[#ff6a3d] px-7 font-extrabold text-white shadow-xl shadow-orange-950/30 transition hover:-translate-y-0.5 hover:bg-[#ff7a52]">Sign up →</Link>
        </div>

        <div className="relative">
          <div className="absolute -inset-10 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-[#091b38] p-4 shadow-[0_45px_110px_-35px_rgba(0,0,0,0.78)] md:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div><p className="font-display font-semibold">After-Hours Agent</p><p className="mt-1 text-xs text-[#7188ad]">11:42 PM · New service request</p></div>
              <span className="flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold text-emerald-200"><span className="h-2 w-2 rounded-full bg-emerald-300" />Online</span>
            </div>
            <div className="mt-6 space-y-3">
              <ChatBubble side="agent">Hi - I&apos;m the after-hours assistant. I can get your request ready for the service team. What seems to be happening?</ChatBubble>
              <ChatBubble side="customer">Our AC stopped cooling and the house is already 82°. We have two young kids.</ChatBubble>
              <ChatBubble side="agent">I&apos;m sorry you&apos;re dealing with that. I&apos;ll mark this urgent. What&apos;s the service address and best number to reach you?</ChatBubble>
            </div>
            <div className="mt-6 rounded-2xl border border-orange-300/20 bg-orange-300/[0.08] p-4">
              <div className="flex items-center justify-between gap-4"><p className="text-xs font-bold uppercase tracking-[0.15em] text-orange-200">Opportunity prepared</p><span className="rounded-full bg-[#ff6a3d] px-2.5 py-1 text-[11px] font-black text-white">URGENT</span></div>
              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2"><p><span className="block text-xs text-[#7188ad]">Service</span><span className="font-semibold">AC not cooling</span></p><p><span className="block text-xs text-[#7188ad]">Next action</span><span className="font-semibold">Call first thing</span></p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AfterHoursPoint({ number, title, body }: { number: string; title: string; body: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4"><p className="text-xs font-bold text-[#8fb4ff]">{number}</p><h3 className="mt-3 font-display text-lg font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-[#8297b8]">{body}</p></div>;
}

function ChatBubble({ side, children }: { side: "agent" | "customer"; children: React.ReactNode }) {
  return <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${side === "agent" ? "rounded-tl-md bg-white/[0.08] text-[#d5e1f7]" : "ml-auto rounded-tr-md bg-[#246bfe] text-white"}`}>{children}</div>;
}

function ProductPoint({ title, body }: { title: string; body: string }) {
  return <div className="flex gap-4"><span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e6efff] text-xs font-black text-[#1555c6]">✓</span><div><h3 className="font-bold text-[#06142f]">{title}</h3><p className="mt-1 leading-6 text-[#596a85]">{body}</p></div></div>;
}

function Metric({ label, value, accent }: { label: string; value: string; accent: "blue" | "orange" | "green" }) {
  const color = accent === "blue" ? "text-[#9bbcff]" : accent === "orange" ? "text-orange-200" : "text-emerald-200";
  return <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"><p className="text-xs text-[#7188ad]">{label}</p><p className={`font-display mt-2 text-2xl font-semibold ${color}`}>{value}</p></div>;
}

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[#06142f] px-5 py-20 text-white md:px-8 md:py-28">
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-blue-500/20 blur-[110px]" />
      <div className="relative mx-auto flex max-w-[90rem] flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
        <div className="max-w-4xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-200">Enough talk</p><h2 className="font-display mt-5 text-5xl font-semibold leading-[0.92] tracking-[-0.055em] md:text-8xl">Put them<br />to work.</h2></div>
        <Link href="/sign-up" className="inline-flex min-h-14 shrink-0 items-center justify-center rounded-full bg-[#ff6a3d] px-7 font-extrabold shadow-xl shadow-orange-950/30 transition hover:-translate-y-0.5 hover:bg-[#ff7a52]">Sign up and choose a plan</Link>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#030b1d] px-5 py-10 text-[#8297b8] md:px-8">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-7 md:flex-row md:items-center md:justify-between">
        <a href="#top" aria-label="Return to the EMBUR homepage"><EmburLogo light size="small" /></a>
        <p className="text-sm">© {new Date().getFullYear()} EMBUR. Revenue recovered. Time returned.</p>
        <div className="flex flex-wrap gap-5 text-sm font-semibold"><Link href="/sign-in" className="hover:text-white">Sign in</Link><Link href="/app" prefetch={false} className="hover:text-white">Workspace</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/refunds" className="hover:text-white">Refunds</Link><Link href="/support" className="hover:text-white">Support</Link></div>
      </div>
    </footer>
  );
}

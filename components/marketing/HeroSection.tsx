import Link from "next/link";

export default function HeroSection() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#04112b] text-white">
      <div className="embur-hero-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute left-[-14rem] top-16 h-[42rem] w-[42rem] rounded-full bg-[#1257d8]/25 blur-[125px]" />
      <div className="pointer-events-none absolute right-[-10rem] top-[-12rem] h-[36rem] w-[36rem] rounded-full bg-[#246bfe]/20 blur-[120px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-[90rem] items-center gap-12 px-5 py-16 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:py-24">
        <div className="embur-rise-in max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#86adff]">Agents for local business</p>
          <h1 className="font-display mt-6 text-[clamp(4rem,8vw,8.2rem)] font-semibold leading-[0.83] tracking-[-0.07em]">
            More calls.
            <span className="block text-[#78a9ff]">More jobs.</span>
            <span className="block text-[#ff6a3d]">More money.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[#a8b9d4] md:text-xl">
            EMBUR puts trained agents on the work that grows your business.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#watch" className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-7 font-extrabold text-[#06142f] transition hover:-translate-y-0.5 hover:bg-blue-50">Watch EMBUR work</a>
            <Link href="/sign-up" className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 bg-white/[0.07] px-7 font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.12]">Sign up</Link>
          </div>
        </div>

        <CallMoment />
      </div>
    </section>
  );
}

function CallMoment() {
  return (
    <div className="relative mx-auto w-full max-w-[42rem] lg:ml-auto">
      <div className="absolute -inset-10 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2.2rem] border border-white/15 bg-[#071832]/95 p-5 shadow-[0_50px_120px_-35px_rgba(0,0,0,0.85)] backdrop-blur-2xl md:p-7">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-300/15 text-emerald-200">●</span>
            <div><p className="font-display font-semibold">Call Agent</p><p className="text-xs text-[#7188ad]">11:47 PM · Answered in 2 seconds</p></div>
          </div>
          <span className="rounded-full bg-emerald-300/10 px-3 py-1.5 text-xs font-bold text-emerald-200">LIVE</span>
        </div>

        <div className="py-9 md:py-12">
          <div className="mx-auto flex h-24 items-end justify-center gap-1.5" aria-hidden="true">
            {[28, 48, 72, 42, 88, 58, 34, 66, 92, 52, 30, 62, 80, 44, 24].map((height, index) => (
              <span key={index} className="w-1.5 rounded-full bg-gradient-to-t from-[#246bfe] to-[#8fb4ff] embur-wave" style={{ height: `${height}%`, animationDelay: `${index * 70}ms` }} />
            ))}
          </div>
          <p className="font-display mx-auto mt-7 max-w-lg text-center text-2xl font-semibold leading-snug md:text-3xl">
            &ldquo;You called the right place.<br />We&apos;ve got you.&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-center">
          <Stat value="Qualified" label="need" />
          <Stat value="$4,200" label="job value" />
          <Stat value="Booked" label="result" />
        </div>
      </div>
      <div className="absolute -bottom-5 left-6 rounded-2xl bg-[#ff6a3d] px-5 py-3 font-display font-semibold text-white shadow-xl shadow-orange-950/30">One missed call. One new job.</div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div className="rounded-xl bg-white/[0.045] px-2 py-3"><p className="font-display text-sm font-semibold text-white md:text-base">{value}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-[#7188ad]">{label}</p></div>;
}

"use client";

import { useEffect, useState } from "react";

const scenes = [
  { number: "01", title: "A call is missed.", agent: "Call Agent", action: "Answers in two seconds", money: "$4,200 opportunity", color: "#246bfe" },
  { number: "02", title: "The customer feels covered.", agent: "Booking Agent", action: "Qualifies and books", money: "Tuesday · 10:30 AM", color: "#22c55e" },
  { number: "03", title: "The job gets done.", agent: "Relationship Agent", action: "Sends a real thank-you", money: "$4,200 won", color: "#ff6a3d" },
  { number: "04", title: "Trust creates the next job.", agent: "Referral Agent", action: "Asks at the right moment", money: "2 introductions", color: "#a78bfa" },
];

export default function WatchEmburWork() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % scenes.length), 3200);
    return () => window.clearInterval(timer);
  }, []);

  const scene = scenes[active];

  return (
    <section id="watch" className="bg-white px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[90rem]">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#1555c6]">Watch EMBUR work</p><h2 className="font-display mt-4 text-5xl font-semibold tracking-[-0.055em] text-[#06142f] md:text-7xl">One call becomes more.</h2></div>
          <p className="text-lg font-semibold text-[#66758d]">No pitch. Just the flow.</p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-[#d8e1ee] bg-[#f4f7fc] shadow-[0_35px_90px_-52px_rgba(4,17,43,0.55)]">
          <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
            <div className="border-b border-[#d8e1ee] p-5 lg:border-b-0 lg:border-r lg:p-7">
              <div className="space-y-2">
                {scenes.map((item, index) => (
                  <button key={item.number} type="button" onClick={() => setActive(index)} aria-pressed={active === index} className={`flex w-full items-center gap-4 rounded-2xl p-4 text-left transition ${active === index ? "bg-[#06142f] text-white shadow-lg" : "text-[#66758d] hover:bg-white"}`}>
                    <span className={`font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${active === index ? "bg-white/10 text-[#8fb4ff]" : "bg-white text-[#1555c6]"}`}>{item.number}</span>
                    <span className="font-display font-semibold">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative min-h-[32rem] overflow-hidden bg-[#04112b] p-6 text-white md:p-10 lg:p-12">
              <div className="pointer-events-none absolute right-[-8rem] top-[-8rem] h-96 w-96 rounded-full opacity-25 blur-[90px] transition" style={{ backgroundColor: scene.color }} />
              <div className="relative flex h-full min-h-[25rem] flex-col">
                <div className="flex items-center justify-between"><span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8297b8]">Live customer journey</span><span className="h-3 w-3 rounded-full embur-soft-pulse" style={{ backgroundColor: scene.color }} /></div>
                <div className="my-auto py-10">
                  <p className="font-display text-xl font-semibold" style={{ color: scene.color }}>{scene.agent}</p>
                  <h3 className="font-display mt-3 max-w-3xl text-5xl font-semibold leading-[0.96] tracking-[-0.05em] md:text-7xl">{scene.action}</h3>
                </div>
                <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
                  <p className="text-sm font-semibold text-[#8297b8]">Outcome</p>
                  <p className="font-display text-3xl font-semibold md:text-4xl">{scene.money}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const agents = [
  { mark: "01", name: "Call", result: "Answers. Reassures. Qualifies." },
  { mark: "02", name: "Book", result: "Turns the need into a job." },
  { mark: "03", name: "Follow up", result: "Brings old money back." },
  { mark: "04", name: "Refer", result: "Asks when trust is highest." },
  { mark: "05", name: "Reputation", result: "Builds proof people believe." },
  { mark: "06", name: "Create", result: "Makes video, ads, and offers." },
  { mark: "07", name: "Traffic", result: "Finds what produces calls." },
  { mark: "08", name: "Atlas", result: "Learns. Directs. Improves." },
];

export default function GrowthEngineSection() {
  return (
    <section id="agents" className="bg-[#06142f] px-5 py-24 text-white md:px-8 md:py-32">
      <div className="mx-auto max-w-[90rem]">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#8fb4ff]">The EMBUR workforce</p>
        <h2 className="font-display mt-5 max-w-5xl text-5xl font-semibold leading-[0.91] tracking-[-0.055em] md:text-8xl">
          Every agent<br />has a job.
        </h2>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((agent) => (
            <article key={agent.name} className="group min-h-56 bg-[#071832] p-6 transition hover:bg-[#0b2550] md:p-7">
              <div className="flex items-center justify-between"><span className="font-display text-xs font-bold text-[#5f8fff]">{agent.mark}</span><span className="h-2 w-2 rounded-full bg-[#ff6a3d] opacity-40 transition group-hover:opacity-100" /></div>
              <h3 className="font-display mt-16 text-3xl font-semibold tracking-tight">{agent.name}</h3>
              <p className="mt-3 text-base font-semibold leading-6 text-[#8fa5c6]">{agent.result}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[1.5rem] border border-orange-300/20 bg-orange-300/[0.07] p-6 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-2xl font-semibold">They work in order. They share what they learn.</p>
          <p className="font-display text-2xl font-semibold text-orange-200">The number that matters: revenue.</p>
        </div>
      </div>
    </section>
  );
}

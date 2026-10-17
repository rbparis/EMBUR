export default function InvestmentCard() {
  return (
    <section id="early-access" className="bg-[#eef3fb] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1555c6]">Early access</p>
          <h2 className="font-display mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#06142f] md:text-6xl">Pilot opening soon.</h2>
          <p className="mt-5 text-lg leading-relaxed text-[#596a85]">We are preparing a free pilot for 3–5 contractors. No payment or subscription starts here.</p>
        </div>
        <div className="mx-auto mt-12 max-w-3xl rounded-[1.75rem] border border-[#d5dfed] bg-white p-7 text-center shadow-[0_24px_70px_-45px_rgba(4,17,43,0.45)] md:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Free pilot · 3–5 contractors</p>
          <p className="mt-4 text-lg leading-8 text-slate-700">Join early access is not open yet. We will add the application form only after the pilot database, access controls, and Preview tests are approved.</p>
          <p className="mt-4 text-sm font-semibold text-slate-500">Future pricing under evaluation: $99/month after the pilot. No price is final.</p>
        </div>
      </div>
    </section>
  );
}

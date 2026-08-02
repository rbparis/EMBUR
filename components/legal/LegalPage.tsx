import Link from "next/link";
import EmburLogo from "@/components/brand/EmburLogo";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export default function LegalPage({
  eyebrow,
  title,
  summary,
  sections,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  sections: LegalSection[];
}) {
  return (
    <main className="min-h-screen bg-[#eef3fb] text-[#06142f]">
      <header className="border-b border-white/10 bg-[#04112b] text-white">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/" aria-label="EMBUR home"><EmburLogo light /></Link>
          <Link href="/" className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/10">Back to EMBUR</Link>
        </div>
      </header>

      <section className="bg-[#06142f] px-5 py-16 text-white md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#8fb4ff]">{eyebrow}</p>
          <h1 className="font-display mt-5 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#a8b9d4]">{summary}</p>
          <p className="mt-5 text-sm font-semibold text-[#7188ad]">Effective July 25, 2026</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-[#d8e1ee] bg-white p-5 lg:sticky lg:top-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#1555c6]">In this policy</p>
          <nav className="mt-4 space-y-1" aria-label={`${title} sections`}>
            {sections.map((section, index) => (
              <a key={section.title} href={`#section-${index + 1}`} className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#596a85] transition hover:bg-[#eef3fb] hover:text-[#06142f]">{section.title}</a>
            ))}
          </nav>
        </aside>

        <article className="overflow-hidden rounded-[2rem] border border-[#d8e1ee] bg-white shadow-[0_24px_70px_-45px_rgba(4,17,43,0.4)]">
          {sections.map((section, index) => (
            <section id={`section-${index + 1}`} key={section.title} className="border-b border-[#e3e9f2] p-6 last:border-b-0 md:p-9">
              <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{section.title}</h2>
              <div className="mt-4 space-y-4 text-[15px] leading-7 text-[#596a85] md:text-base">
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && <ul className="space-y-3 pl-5">{section.bullets.map((bullet) => <li key={bullet} className="list-disc pl-1">{bullet}</li>)}</ul>}
              </div>
            </section>
          ))}
        </article>
      </div>

      <footer className="bg-[#030b1d] px-5 py-8 text-sm text-[#8297b8] md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} EMBUR</p>
          <div className="flex flex-wrap gap-5 font-semibold">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/refunds" className="hover:text-white">Refunds</Link>
            <Link href="/support" className="hover:text-white">Support</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

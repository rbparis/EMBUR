import type { Metadata } from "next";
import Link from "next/link";
import EmburLogo from "@/components/brand/EmburLogo";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Field Notes for Local Service Owners",
  description: "Notes on web intake, organized customer records, and owner-led follow-up.",
  alternates: { canonical: "https://getembur.com/blog" },
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#06142f]">
      <header className="border-b border-white/10 bg-[#06142f] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" aria-label="EMBUR home"><EmburLogo light /></Link>
          <Link href="/app" className="rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-[#06142f]">Open EMBUR</Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#1555c6]">EMBUR field notes</p>
        <h1 className="font-display mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">Notes on organized customer follow-up.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#60718d]">Notes for independent service owners about web inquiries, customer records, and follow-up. Examples are illustrative, not customer results.</p>

        {posts.length ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <article key={post.id} className="rounded-[1.75rem] border border-[#dce4ef] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#ff6a3d]">
                  {post.publishedAt?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
                <h2 className="font-display mt-3 text-2xl font-semibold leading-snug">
                  <Link href={`/blog/${post.slug}`} className="hover:text-[#1555c6]">{post.title}</Link>
                </h2>
                <p className="mt-3 leading-7 text-[#66758d]">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="mt-6 inline-flex font-extrabold text-[#1555c6]">Read field note →</Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-[1.75rem] border border-[#dce4ef] bg-white p-8">
            <h2 className="font-display text-2xl font-semibold">Field notes will appear here.</h2>
            <p className="mt-3 text-[#66758d]">No field notes have been published yet.</p>
          </div>
        )}
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/blog/ArticleBody";
import EmburLogo from "@/components/brand/EmburLogo";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  return prisma.blogPost.findFirst({ where: { slug, status: "published" } });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Field Note Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: `https://getembur.com/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `https://getembur.com/blog/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#06142f]">
      <header className="border-b border-white/10 bg-[#06142f] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" aria-label="EMBUR home"><EmburLogo light /></Link>
          <Link href="/blog" className="text-sm font-bold text-[#b8c7df] hover:text-white">All field notes</Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ff6a3d]">EMBUR field note</p>
        <h1 className="font-display mt-4 text-4xl font-semibold leading-tight md:text-6xl">{post.title}</h1>
        <p className="mt-5 text-lg leading-8 text-[#66758d]">{post.excerpt}</p>
        <p className="mt-5 text-sm font-bold text-[#7188ad]">
          {post.publishedAt?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="mt-10 rounded-[2rem] border border-[#dce4ef] bg-white p-6 shadow-sm md:p-10">
          <ArticleBody content={post.content} />
        </div>

        <aside className="mt-8 rounded-[2rem] bg-[#06142f] p-7 text-white md:p-9">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-200">Turn missed demand into booked work</p>
          <h2 className="font-display mt-3 text-3xl font-semibold">See what EMBUR catches for you.</h2>
          <p className="mt-3 max-w-2xl leading-7 text-[#a8b9d4]">Capture the request, organize the opportunity, and know the strongest next move.</p>
          <Link href="/sign-up" className="mt-6 inline-flex rounded-full bg-[#ff6a3d] px-6 py-3 font-extrabold text-white">Put EMBUR to work</Link>
        </aside>
      </article>
    </main>
  );
}

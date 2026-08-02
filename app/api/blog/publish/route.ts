import { NextResponse } from "next/server";
import { getAuthenticatedFounder } from "@/lib/founderAccess.server";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "embur-insight";
}

async function availableSlug(title: string) {
  const base = slugify(title);
  let slug = base;
  let suffix = 2;

  while (await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

export async function POST(request: Request) {
  const founder = await getAuthenticatedFounder();
  if (!founder) {
    return NextResponse.json({ success: false, message: "EMBUR publishing is private." }, { status: 403 });
  }

  const body = (await request.json()) as { artifactId?: string };
  if (!body.artifactId) {
    return NextResponse.json({ success: false, message: "Choose an article to publish." }, { status: 400 });
  }

  const business = founder.business;
  const artifact = await prisma.contentArtifact.findFirst({
    where: { id: body.artifactId, businessId: business.id, kind: "seo" },
  });

  if (!artifact) {
    return NextResponse.json({ success: false, message: "Article not found." }, { status: 404 });
  }
  if (artifact.status !== "approved") {
    return NextResponse.json(
      { success: false, message: "Approve the article before publishing it." },
      { status: 409 }
    );
  }

  const slug = await availableSlug(artifact.title);
  const publishedAt = new Date();
  const excerpt = artifact.summary.trim().slice(0, 240);

  const post = await prisma.$transaction(async (database) => {
    const created = await database.blogPost.create({
      data: {
        businessId: business.id,
        title: artifact.title,
        slug,
        excerpt,
        content: artifact.content,
        keywords: artifact.keywords,
        status: "published",
        publishedAt,
      },
    });

    await database.contentArtifact.update({
      where: { id: artifact.id },
      data: {
        status: "published",
        publishedAt,
        publishedUrl: `/blog/${slug}`,
      },
    });

    return created;
  });

  return NextResponse.json({
    success: true,
    post: { id: post.id, slug: post.slug, url: `/blog/${post.slug}` },
  });
}

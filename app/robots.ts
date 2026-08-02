import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/blog/"],
      disallow: ["/app/", "/api/"],
    },
    sitemap: "https://getembur.com/sitemap.xml",
  };
}

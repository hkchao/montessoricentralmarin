import type { MetadataRoute } from "next";
import { nav, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const extras = ["/curriculum"] as const;
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...nav.map((n) => ({
      url: `${site.url}${n.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...extras.map((href) => ({
      url: `${site.url}${href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

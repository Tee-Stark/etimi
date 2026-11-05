import type { MetadataRoute } from "next";
import { getPublicCollection } from "@/content";
import { sitemapRows } from "@/lib/feeds";
import { absoluteUrl } from "@/lib/site-url";

/** Published, canonical URLs only. Hidden, draft and preview entries never appear. */
export default function sitemap(): MetadataRoute.Sitemap {
  const rows = sitemapRows({
    caseStudies: getPublicCollection("caseStudies"),
    research: getPublicCollection("research"),
    notes: getPublicCollection("notes"),
    roles: getPublicCollection("roles"),
    projects: getPublicCollection("projects"),
    ventures: getPublicCollection("ventures"),
    talks: getPublicCollection("talks"),
    publications: getPublicCollection("publications"),
    community: getPublicCollection("community"),
  });
  return rows.map((r) => ({ url: absoluteUrl(r.path), ...(r.lastModified ? { lastModified: r.lastModified } : {}) }));
}

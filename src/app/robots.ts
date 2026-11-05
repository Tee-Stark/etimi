import type { MetadataRoute } from "next";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";

/*
 * Everything public may be crawled. Withheld content is kept out of the
 * build itself; robots.txt is not used to hide anything.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: getSiteUrl().origin,
  };
}

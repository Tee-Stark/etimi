import { getPublicCollection, getSite } from "@/content";
import { rssFeed } from "@/lib/feeds";
import { absoluteUrl } from "@/lib/site-url";

/** RSS 2.0 for published notes only (drafts and hidden notes never appear). Prerendered. */
export function GET() {
  return new Response(rssFeed(getSite(), getPublicCollection("notes"), absoluteUrl), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

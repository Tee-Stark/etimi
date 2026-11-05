import type { PublicEntry, PublicSite } from "@/content/types";

/*
 * Sitemap and RSS builders (IMPLEMENTATION_SPEC.md §8.11, §9.3). Pure
 * functions over *published* entries, so the routes stay thin and the rules
 * are unit-tested. Dates come from content (`updated`, note `date`), never the
 * clock, so output is identical on every build.
 */

export type SitemapRow = { path: string; lastModified?: string };

type Dated = { data: { updated: string } };

function latest(entries: Dated[]): string | undefined {
  return entries.map((e) => e.data.updated).sort().at(-1);
}

export function sitemapRows(collections: {
  caseStudies: PublicEntry<"caseStudies">[];
  research: PublicEntry<"research">[];
  notes: PublicEntry<"notes">[];
  roles: PublicEntry<"roles">[];
  projects: PublicEntry<"projects">[];
  ventures: PublicEntry<"ventures">[];
  talks: PublicEntry<"talks">[];
  publications: PublicEntry<"publications">[];
  community: PublicEntry<"community">[];
}): SitemapRow[] {
  const c = collections;
  const all = Object.values(c).flat() as Dated[];
  const rows: SitemapRow[] = [
    { path: "/", lastModified: latest(all) },
    { path: "/about", lastModified: latest([...c.community, ...c.research]) },
    { path: "/work", lastModified: latest([...c.roles, ...c.caseStudies]) },
    { path: "/research", lastModified: latest(c.research) },
    { path: "/projects", lastModified: latest(c.projects) },
    { path: "/ventures", lastModified: latest(c.ventures) },
    { path: "/speaking", lastModified: latest(c.talks) },
    { path: "/writing", lastModified: latest([...c.notes, ...c.publications]) },
    { path: "/contact" },
  ];
  for (const entry of [...c.caseStudies, ...c.research, ...c.notes] as Array<PublicEntry & Dated>) {
    if (entry.href) rows.push({ path: entry.href, lastModified: entry.data.updated });
  }
  return rows;
}

function xml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** RFC 822 date for an ISO calendar date, at 00:00 UTC. */
export function rfc822(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${DAYS[d.getUTCDay()]}, ${pad(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()} 00:00:00 GMT`;
}

/** RSS 2.0 for published notes, newest first. An empty channel is valid RSS. */
export function rssFeed(site: PublicSite, notes: PublicEntry<"notes">[], absolute: (path: string) => string): string {
  const items = [...notes].sort((a, b) => b.data.date.localeCompare(a.data.date));
  const newest = items[0]?.data.date;
  const body = items
    .map((n) => {
      const url = absolute(n.href!);
      return [
        "    <item>",
        `      <title>${xml(n.data.title)}</title>`,
        `      <link>${xml(url)}</link>`,
        `      <guid isPermaLink="true">${xml(url)}</guid>`,
        `      <pubDate>${rfc822(n.data.date)}</pubDate>`,
        `      <description>${xml(n.data.summary)}</description>`,
        ...n.data.tags.map((t) => `      <category>${xml(t)}</category>`),
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${xml(`${site.name} — Writing`)}</title>`,
    `    <link>${xml(absolute("/writing"))}</link>`,
    `    <description>${xml(`Notes and essays by ${site.name}.`)}</description>`,
    "    <language>en-gb</language>",
    `    <atom:link href="${xml(absolute("/feed.xml"))}" rel="self" type="application/rss+xml"/>`,
    ...(newest ? [`    <lastBuildDate>${rfc822(newest)}</lastBuildDate>`] : []),
    ...(body ? [body] : []),
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

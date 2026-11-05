import { describe, expect, it } from "vitest";
import { personSchema } from "@/components/seo/json-ld";
import { loadRepository } from "@/content/repository";
import { rfc822, rssFeed, sitemapRows } from "@/lib/feeds";
import { base, baseAbout, baseSite, fm, makeTree } from "../support/content-tree";

const repo = loadRepository(
  makeTree(
    {
      "notes/published-note.md": fm({ ...base("published-note", { tags: ["go", "a&b"] }), date: "2026-11-03", draft: false }),
      "notes/older-note.md": fm({ ...base("older-note"), date: "2026-10-01", draft: false }),
      "notes/draft-note.md": fm({ ...base("draft-note", { title: "Secret Draft Title" }), date: "2026-11-04", draft: true }),
      "notes/hidden-note.md": fm({ ...base("hidden-note", { visibility: "hidden", title: "Hidden Note Title" }), date: "2026-11-04", draft: false }),
      "case-studies/public-study.md": fm({ ...base("public-study"), status: "completed" }),
      "case-studies/hidden-study.md": fm({ ...base("hidden-study", { visibility: "hidden" }), status: "completed" }),
    },
    { ...baseSite, profiles: [{ label: "Confirmed", url: "https://example.com/me", visibility: "public" }, { label: "Unconfirmed", url: "https://example.com/not-yet", visibility: "hidden" }] },
  ),
);
const abs = (p: string) => `https://example.org${p}`;

describe("sitemap", () => {
  const rows = sitemapRows({ ...repo.published });
  const paths = rows.map((r) => r.path);

  it("lists static pages and published detail pages only", () => {
    expect(paths).toEqual(expect.arrayContaining(["/", "/about", "/work", "/writing", "/work/public-study", "/writing/published-note", "/writing/older-note"]));
    for (const hidden of ["/work/hidden-study", "/writing/draft-note", "/writing/hidden-note"]) expect(paths).not.toContain(hidden);
  });

  it("dates rows from content, not the clock", () => {
    expect(rows.find((r) => r.path === "/writing/published-note")?.lastModified).toBe("2026-11-04");
  });
});

describe("RSS", () => {
  const feed = rssFeed(repo.site, repo.published.notes, abs);

  it("includes published notes newest first and never drafts or hidden notes", () => {
    expect(feed.indexOf("published-note")).toBeLessThan(feed.indexOf("older-note"));
    expect(feed).not.toMatch(/Secret Draft Title|Hidden Note Title|draft-note|hidden-note/);
  });

  it("uses absolute URLs, RFC 822 dates and escapes XML", () => {
    expect(feed).toContain("<link>https://example.org/writing/published-note</link>");
    expect(feed).toContain(`<pubDate>${rfc822("2026-11-03")}</pubDate>`);
    expect(feed).toContain("<category>a&amp;b</category>");
    expect(rfc822("2026-11-03")).toBe("Tue, 03 Nov 2026 00:00:00 GMT");
  });

  it("is a valid, empty channel when there are no notes", () => {
    const empty = rssFeed(repo.site, [], abs);
    expect(empty).toContain("<channel>");
    expect(empty).not.toContain("<item>");
    expect(empty).not.toContain("lastBuildDate");
  });
});

describe("Person JSON-LD", () => {
  it("uses the display and alternate names and lists confirmed profiles only", () => {
    const person = personSchema(repo.site, { ...repo.about, education: [{ institution: "Example University", qualification: "B.Sc." }] });
    expect(person).toMatchObject({ "@type": "Person", name: baseSite.name, alternateName: baseSite.fullName, jobTitle: "Example title" });
    expect(person.sameAs).toEqual(["https://example.com/me"]);
    expect(person.alumniOf).toEqual([{ "@type": "CollegeOrUniversity", name: "Example University" }]);
  });

  it("omits sameAs entirely when no profile is confirmed", () => {
    const person = personSchema({ ...repo.site, profiles: [] }, { ...repo.about, ...baseAbout, body: "", format: "md" } as typeof repo.about);
    expect(person).not.toHaveProperty("sameAs");
  });
});

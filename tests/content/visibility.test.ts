import { describe, expect, it } from "vitest";
import { loadAllContent } from "@/content/loader";
import { EXPECTED_IMPACT_LABEL, publicMetrics } from "@/content/metrics";
import { loadRepository } from "@/content/repository";
import { isPreviewEnabled } from "@/content/visibility";
import { base, baseSite, fm, makeTree } from "../support/content-tree";

const tree = () =>
  makeTree({
    "roles/example-org.md": fm({ ...base("example-org"), organisation: "Example Org", role: "Engineer", start: "2024-11", end: null }),
    "roles/hidden-org.md": fm({ ...base("hidden-org", { visibility: "hidden" }), organisation: "Hidden Org", role: "Engineer" }),
    "case-studies/public-study.md": fm({
      ...base("public-study"),
      status: "completed",
      role: "hidden-org",
      metrics: [
        { label: "Latency", value: "SECRET-VALUE-1", kind: "measured", cleared: false },
        { label: "Throughput", value: "2x", kind: "measured", cleared: true },
        { label: "Defaults", value: "fewer", kind: "expected", cleared: true },
      ],
    }),
    "case-studies/hidden-study.md": fm({ ...base("hidden-study", { visibility: "hidden" }), status: "completed" }),
    "research/example-research.md": fm({
      ...base("example-research"),
      status: "active",
      collaborators: [
        { name: "Consenting Person", consent: true },
        { name: "Unconsenting Person", consent: false },
      ],
      embeds: [{ url: "https://example.com/explainer", title: "Explainer", visibility: "hidden", sandbox: "allow-scripts" }],
      links: [
        { label: "Public", url: "https://example.com/public", visibility: "public" },
        { label: "Secret", url: "https://example.com/secret", visibility: "hidden" },
      ],
      updates: [
        { date: "2026-11-01", title: "Shown", summary: "s" },
        { date: "2026-11-02", title: "Withheld", summary: "s", visibility: "hidden" },
      ],
    }),
    "ventures/example-venture.md": fm({
      ...base("example-venture"),
      status: "in-development",
      stage: "In development",
      milestones: [
        { text: "Public milestone", visibility: "public" },
        { text: "Withheld milestone", visibility: "hidden" },
      ],
    }),
    "talks/example-talk.md": fm({
      ...base("example-talk"),
      event: "Example Conf",
      date: "2026-10",
      format: "talk",
      stage: "delivered",
      abstract: "About things.",
      links: { slides: { url: "", visibility: "hidden" }, repo: { url: "https://example.com/repo", visibility: "public" } },
    }),
    "notes/published-note.md": fm({ ...base("published-note"), date: "2026-11-01", draft: false }, "Body."),
    "notes/draft-note.md": fm({ ...base("draft-note"), date: "2026-11-02", draft: true }, "Draft body."),
  });

describe("entry visibility", () => {
  it("excludes hidden and draft entries in production", () => {
    const repo = loadRepository(tree());
    expect(repo.published.roles.map((e) => e.slug)).toEqual(["example-org"]);
    expect(repo.published.caseStudies.map((e) => e.slug)).toEqual(["public-study"]);
    expect(repo.published.notes.map((e) => e.slug)).toEqual(["published-note"]);
    expect(repo.pages.notes.map((e) => e.slug)).toEqual(["published-note"]);
  });

  it("includes hidden and draft entries only when preview is requested, flagged", () => {
    const repo = loadRepository(tree(), { preview: true });
    const notes = repo.pages.notes.map((e) => [e.slug, e.preview]);
    expect(notes).toEqual([
      ["draft-note", true],
      ["published-note", false],
    ]);
    // Published collections never include preview entries.
    expect(repo.published.notes.map((e) => e.slug)).toEqual(["published-note"]);
  });

  it("enables preview only in development with CONTENT_PREVIEW=1", () => {
    expect(isPreviewEnabled({ NODE_ENV: "development", CONTENT_PREVIEW: "1" })).toBe(true);
    expect(isPreviewEnabled({ NODE_ENV: "production", CONTENT_PREVIEW: "1" })).toBe(false);
    expect(isPreviewEnabled({ NODE_ENV: "test", CONTENT_PREVIEW: "1" })).toBe(false);
    expect(isPreviewEnabled({ NODE_ENV: "development" })).toBe(false);
  });

  it("does not expose raw source or file paths in public entries", () => {
    const entry = loadRepository(tree()).published.roles[0] as unknown as Record<string, unknown>;
    expect(entry.raw).toBeUndefined();
    expect(entry.sourcePath).toBeUndefined();
  });
});

describe("hidden child objects", () => {
  const repo = loadRepository(tree());
  const serialised = JSON.stringify(repo);

  it("drops uncleared metrics and labels expected ones", () => {
    const metrics = repo.published.caseStudies[0].data.metrics;
    expect(metrics.map((m) => m.label)).toEqual(["Throughput", "Defaults"]);
    expect(metrics.find((m) => m.kind === "expected")?.qualifier).toBe(EXPECTED_IMPACT_LABEL);
    expect(serialised).not.toContain("SECRET-VALUE-1");
  });

  it("drops references to hidden entries", () => {
    expect(repo.published.caseStudies[0].data.role).toBeUndefined();
    expect(serialised).not.toContain("hidden-org");
  });

  it("names collaborators only with consent", () => {
    expect(repo.published.research[0].data.collaborators).toEqual(["Consenting Person"]);
    expect(serialised).not.toContain("Unconsenting Person");
  });

  it("drops hidden links, embeds, updates, milestones and talk links", () => {
    const research = repo.published.research[0].data;
    expect(research.links).toEqual([{ label: "Public", url: "https://example.com/public" }]);
    expect(research.embeds).toEqual([]);
    expect(research.updates.map((u) => u.title)).toEqual(["Shown"]);
    expect(repo.published.ventures[0].data.milestones.map((m) => m.text)).toEqual(["Public milestone"]);
    expect(repo.published.talks[0].data.links).toEqual({ repo: "https://example.com/repo" });
    for (const secret of ["https://example.com/secret", "https://example.com/explainer", "Withheld milestone", "Withheld"]) {
      expect(serialised).not.toContain(secret);
    }
  });

  it("removes hidden site contact details", () => {
    const repo2 = loadRepository(
      makeTree(
        {},
        {
          ...baseSite,
          email: { address: "hidden@example.com", visibility: "hidden" },
          profiles: [
            { label: "Shown", url: "https://example.com/me", visibility: "public" },
            { label: "Withheld", url: "https://example.com/not-yet", visibility: "hidden" },
          ],
        },
      ),
    );
    expect(repo2.site.email).toBeNull();
    expect(repo2.site.profiles).toEqual([{ label: "Shown", url: "https://example.com/me" }]);
    expect(JSON.stringify(repo2.site)).not.toMatch(/hidden@example\.com|not-yet/);
  });
});

describe("publicMetrics", () => {
  it("never publishes an uncleared metric, whatever its kind", () => {
    expect(
      publicMetrics([
        { label: "a", value: "1", kind: "measured", cleared: false, note: "" },
        { label: "b", value: "2", kind: "expected", cleared: false, note: "" },
      ]),
    ).toEqual([]);
  });
});

describe("loader", () => {
  it("keeps dates as strings and null as null", () => {
    const content = loadAllContent(tree());
    const role = content.entries.roles.find((r) => r.data.slug === "example-org")!;
    expect(role.data.start).toBe("2024-11");
    expect(role.data.end).toBeNull();
    expect(role.data.updated).toBe("2026-11-04");
  });
});

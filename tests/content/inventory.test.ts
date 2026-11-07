import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadAllContent } from "@/content/loader";
import { loadRepository } from "@/content/repository";

/*
 * Locks the public content inventory to PLAN.md §3 and the owner's
 * decisions. If an entry is added, removed or changes visibility, this test
 * fails until the change is made deliberately here as well.
 */

const root = path.join(process.cwd(), "content");
const repo = loadRepository(root);
const raw = loadAllContent(root);
const slugs = (name: keyof typeof repo.published) => repo.published[name].map((e) => e.slug).sort();

describe("public inventory matches PLAN.md", () => {
  it("roles", () => {
    expect(slugs("roles")).toEqual(["analytics-intelligence-africa", "fairmoney", "makeuseof", "naerospace", "scrim", "stacklent-network"]);
  });

  it("engineering case studies, with the selected six featured in order (Q31)", () => {
    expect(slugs("caseStudies")).toEqual([
      "bank-statement-processing",
      "batch-processing-go",
      "credit-intelligence",
      "distributed-tracing",
      "home-screen-latency",
      "instalment-schedule-engine",
      "loan-details-api",
      "loan-offer-generation",
      "scoring-latency",
      "stale-data-cleanup",
      "uav-video-streaming",
    ]);
    const featured = repo.published.caseStudies.filter((e) => e.data.featured).sort((a, b) => a.data.order - b.data.order);
    expect(featured.map((e) => e.slug)).toEqual([
      "batch-processing-go",
      "home-screen-latency",
      "stale-data-cleanup",
      "bank-statement-processing",
      "instalment-schedule-engine",
      "uav-video-streaming",
    ]);
  });

  it("research: HAUV active, Dechorder completed", () => {
    expect(slugs("research")).toEqual(["dechorder", "hauv"]);
    const status = Object.fromEntries(repo.published.research.map((e) => [e.slug, e.data.status]));
    expect(status).toEqual({ hauv: "active", dechorder: "completed" });
  });

  it("projects: DEX indexing public as an exploration; Document Intelligence Platform withheld", () => {
    expect(slugs("projects")).toEqual(["multi-chain-dex-indexing"]);
    expect(repo.published.projects[0].data.status).toBe("exploration");
    expect(repo.published.projects[0].data.stack).toEqual(["Go", "Docker", "AWS"]);
    expect(raw.entries.projects.find((e) => e.data.slug === "document-intelligence-platform")?.data.visibility).toBe("hidden");
  });

  it("ventures: Xealtha only, in development", () => {
    expect(slugs("ventures")).toEqual(["xealtha"]);
    expect(repo.published.ventures[0].data.status).toBe("in-development");
    expect(repo.published.ventures[0].data.milestones).toEqual([]);
    expect(repo.published.ventures[0].data.links).toEqual([]);
  });

  it("talks, all delivered; the poster cross-links to HAUV", () => {
    expect(slugs("talks")).toEqual(["beyond-crud", "mirg-icair-2026-poster", "the-gophers-trident"]);
    for (const t of repo.published.talks) expect(t.data.stage).toBe("delivered");
    expect(repo.published.talks.find((t) => t.slug === "mirg-icair-2026-poster")?.data.research).toBe("hauv");
    for (const t of repo.published.talks) expect(t.data.links).toEqual({});
  });

  it("writing: no notes; MakeUseOf as a past publication", () => {
    expect(slugs("notes")).toEqual([]);
    expect(slugs("publications")).toEqual(["makeuseof"]);
    expect(repo.published.publications[0].data.period).toBe("until 2023");
  });

  it("community and music", () => {
    expect(slugs("community")).toEqual(["backend-buildathon", "cacyof-skill-up-2026", "fulfilled-minstrels", "technical-writing-mentorship"]);
  });
});

describe("facts that must hold exactly", () => {
  it("dates are as recorded, unknown ones omitted", () => {
    const role = (slug: string) => repo.published.roles.find((r) => r.slug === slug)!.data;
    expect([role("fairmoney").start, role("fairmoney").end]).toEqual(["2024-11", null]);
    expect([role("analytics-intelligence-africa").start, role("analytics-intelligence-africa").end]).toEqual(["2024-09", "2024-10"]);
    expect([role("naerospace").start, role("naerospace").end]).toEqual(["2022-11", "2024-10"]);
    expect([role("makeuseof").start, role("makeuseof").end]).toEqual([undefined, "2023"]);
  });

  it("education: graduated August 2026, thesis linked", () => {
    expect(repo.about.education[0]).toEqual({
      institution: "University of Lagos",
      qualification: "B.Sc. Industrial Mathematics (Computer Option)",
      completed: "2026-08",
      thesis: "dechorder",
    });
  });

  it("skills: Go primary, Rust learning, no other markers", () => {
    const items = repo.about.skills.flatMap((g) => g.items);
    expect(items.filter((i) => i.note)).toEqual([
      { name: "Go", note: "primary" },
      { name: "Rust", note: "learning" },
    ]);
  });

  it("only figures cleared in Q31 are published; the rest stay withheld", () => {
    const withheld = raw.entries.caseStudies.flatMap((e) => e.data.metrics.filter((m) => !m.cleared).map((m) => `${e.data.slug}: ${m.value}`));
    expect(withheld).toEqual(["credit-intelligence: 15–20%", "loan-details-api: >12 s → <100 ms"]);
    const published = repo.published.caseStudies.flatMap((e) => e.data.metrics.map((m) => m.value));
    expect(published).not.toContain("15–20%");
    expect(published).not.toContain(">12 s → <100 ms");
    const labels = raw.entries.caseStudies.flatMap((e) => e.data.metrics.map((m) => m.label));
    expect(labels.join(" ")).not.toMatch(/landing precision/i);
    expect(repo.published.roles.flatMap((r) => r.data.highlights).join(" ")).not.toMatch(/precision by/i);
  });

  it("the First Payment Default figure is recorded as expected, never measured", () => {
    const study = raw.entries.caseStudies.find((e) => e.data.slug === "credit-intelligence")!;
    expect(study.data.metrics.map((m) => m.kind)).toEqual(["expected"]);
  });

  it("the estimated approvals figure carries the expected-impact label", () => {
    const study = repo.published.caseStudies.find((e) => e.slug === "bank-statement-processing")!;
    expect(study.data.metrics).toEqual([expect.objectContaining({ value: "~30%", qualifier: "Expected impact" })]);
  });

  it("Stacklent shows no figures, and Scrim omits the engagement figure (Q31)", () => {
    const role = (slug: string) => repo.published.roles.find((r) => r.slug === slug)!.data;
    expect(role("stacklent-network").highlights.join(" ")).not.toMatch(/\d+%/);
    expect(role("scrim").highlights.join(" ")).not.toMatch(/30%|engagement/);
  });

  it("AWS certifications are listed", () => {
    expect(repo.about.certifications.map((c) => c.abbreviation)).toEqual(["SAA", "CCP"]);
  });

  it("the HAUV explainer embed is withheld (open item O1)", () => {
    expect(repo.published.research.find((r) => r.slug === "hauv")?.data.embeds).toEqual([]);
  });

  it("no collaborator is named", () => {
    for (const r of repo.published.research) expect(r.data.collaborators).toEqual([]);
  });

  it("the site name follows Q26", () => {
    expect(repo.site.name).toBe("Timmy Omolana");
    expect(repo.site.fullName).toBe("Timilehin Omolana");
    expect(repo.site.email).toBe("hi@etimi.me");
    expect(repo.site.profiles).toEqual([
      { label: "LinkedIn", url: "https://linkedin.com/in/timmyomolana" },
      { label: "X", url: "https://x.com/t_starkx" },
    ]);
  });

  it("the biography opens with the full name and puts the choir in the past (Q29)", () => {
    expect(repo.about.body.startsWith("I'm Timilehin Omolana")).toBe(true);
    expect(repo.about.body).toContain("until August 2026 I led a university choir");
    expect(repo.about.body).not.toMatch(/\blead a university choir\b/);
  });

  it("the home Research thread points at the HAUV case study", () => {
    expect(repo.site.threads.find((t) => t.id === "research")?.href).toBe("/research/hauv");
  });
});

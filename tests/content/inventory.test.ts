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
    expect(slugs("roles")).toEqual(["analytics-intelligence-africa", "fairmoney", "makeuseof", "naerospace"]);
  });

  it("engineering case studies, with the selected five featured in order", () => {
    expect(slugs("caseStudies")).toEqual([
      "bank-statement-processing",
      "credit-intelligence",
      "loan-details-api",
      "loan-offer-generation",
      "scoring-latency",
      "stale-data-cleanup",
      "uav-video-streaming",
    ]);
    const featured = repo.published.caseStudies.filter((e) => e.data.featured).sort((a, b) => a.data.order - b.data.order);
    expect(featured.map((e) => e.slug)).toEqual([
      "loan-details-api",
      "stale-data-cleanup",
      "bank-statement-processing",
      "uav-video-streaming",
      "credit-intelligence",
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
    expect([role("naerospace").start, role("naerospace").end]).toEqual([undefined, undefined]);
    expect([role("makeuseof").start, role("makeuseof").end]).toEqual([undefined, "2023"]);
  });

  it("education: graduated August 2026, thesis linked", () => {
    expect(repo.about.education).toEqual([
      { institution: "University of Lagos", qualification: "B.Sc. Industrial Mathematics (Computer Option)", completed: "2026-08", thesis: "dechorder" },
    ]);
  });

  it("skills: Go primary, Rust learning, no other markers", () => {
    const items = repo.about.skills.flatMap((g) => g.items);
    expect(items.filter((i) => i.note)).toEqual([
      { name: "Go", note: "primary" },
      { name: "Rust", note: "learning" },
    ]);
  });

  it("every FairMoney and UAV metric is withheld until cleared", () => {
    for (const study of raw.entries.caseStudies) for (const m of study.data.metrics) expect(m.cleared, `${study.data.slug}: ${m.label}`).toBe(false);
    for (const study of repo.published.caseStudies) expect(study.data.metrics).toEqual([]);
  });

  it("the First Payment Default figure is recorded as expected, never measured", () => {
    const study = raw.entries.caseStudies.find((e) => e.data.slug === "credit-intelligence")!;
    expect(study.data.metrics.map((m) => m.kind)).toEqual(["expected"]);
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
    expect(repo.site.email).toBeNull();
    expect(repo.site.profiles).toEqual([]);
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

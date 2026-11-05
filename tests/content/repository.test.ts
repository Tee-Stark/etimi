import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadAllContent } from "@/content/loader";
import { loadRepository } from "@/content/repository";
import { validateContent } from "@/content/validation";
import { collectWithheld } from "@/content/withheld";
import { base, baseSite, fm, makeTree } from "../support/content-tree";

describe("the real content/ directory", () => {
  const root = path.join(process.cwd(), "content");

  it("validates", () => {
    expect(validateContent(loadAllContent(root))).toEqual([]);
  });

  it("never exposes hidden contact details", () => {
    const site = loadRepository(root).site;
    const raw = loadAllContent(root).site!;
    for (const profile of raw.profiles.filter((p) => p.visibility === "hidden")) {
      expect(site.profiles.map((p) => p.label)).not.toContain(profile.label);
    }
    if (raw.email.visibility === "hidden") expect(site.email).toBeNull();
  });
});

describe("withheld strings for the build-output scan", () => {
  it("collects hidden entry text, hidden URLs, uncleared metrics and unconsented names", () => {
    const root = makeTree(
      {
        "projects/hidden-project.md": fm({ ...base("hidden-project", { visibility: "hidden", title: "Secret Project Title" }), status: "active" }),
        "case-studies/s.md": fm({ ...base("s"), status: "completed", metrics: [{ label: "L", value: "~42 TB freed", kind: "measured", cleared: false }] }),
        "research/r.md": fm({ ...base("r"), status: "active", collaborators: [{ name: "Unnamed Colleague", consent: false }] }),
      },
      { ...baseSite, email: { address: "hidden@example.com", visibility: "hidden" } },
    );
    const values = collectWithheld(loadAllContent(root)).map((w) => w.value);
    expect(values).toEqual(expect.arrayContaining(["Secret Project Title", "~42 TB freed", "Unnamed Colleague", "hidden@example.com"]));
  });
});

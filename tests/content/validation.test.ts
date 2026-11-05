import { describe, expect, it } from "vitest";
import { ContentValidationError } from "@/content/issues";
import { externalUrlProblem, urlProblem } from "@/content/links";
import { loadAllContent } from "@/content/loader";
import { loadRepository } from "@/content/repository";
import { validateContent } from "@/content/validation";
import { base, baseSite, fm, makeTree } from "../support/content-tree";

const issuesFor = (files: Record<string, string>, site?: Record<string, unknown>) => validateContent(loadAllContent(makeTree(files, site)));
const rules = (files: Record<string, string>, site?: Record<string, unknown>) => issuesFor(files, site).map((i) => i.rule);

const role = (slug: string, extra: Record<string, unknown> = {}, body = "") =>
  fm({ ...base(slug, extra), organisation: "Example Org", role: "Engineer" }, body);

describe("schema errors are actionable", () => {
  it("reports file and field for invalid frontmatter", () => {
    const [issue] = issuesFor({ "roles/bad.md": fm({ ...base("bad"), role: "Engineer" }) });
    expect(issue).toMatchObject({ file: "content/roles/bad.md", field: "organisation", rule: "schema" });
  });

  it("reports unparseable files instead of crashing", () => {
    const [issue] = issuesFor({ "roles/broken.md": "no frontmatter here" });
    expect(issue).toMatchObject({ file: "content/roles/broken.md", rule: "parse" });
  });

  it("throws one error listing every problem when the repository is built", () => {
    const root = makeTree({ "roles/a.md": fm({ slug: "a" }), "roles/b.md": fm({ slug: "b" }) });
    try {
      loadRepository(root);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ContentValidationError);
      const message = (error as Error).message;
      expect(message).toContain("content/roles/a.md");
      expect(message).toContain("content/roles/b.md");
    }
  });
});

describe("slugs", () => {
  it("requires the file name to match the slug", () => {
    expect(rules({ "roles/file-name.md": role("other-slug") })).toContain("slug-filename");
  });

  it("rejects duplicate slugs within a collection", () => {
    const issues = issuesFor({ "roles/same.md": role("same"), "roles/same.mdx": role("same") });
    expect(issues.map((i) => i.rule)).toContain("slug-unique");
  });

  it("allows the same slug in different collections", () => {
    expect(rules({ "roles/same.md": role("same"), "projects/same.md": fm({ ...base("same"), status: "active" }) })).toEqual([]);
  });
});

describe("references", () => {
  it("requires case-study roles to exist", () => {
    expect(rules({ "case-studies/x.md": fm({ ...base("x"), status: "completed", role: "missing" }) })).toContain("reference");
  });

  it("requires talk research references to exist", () => {
    const talk = fm({ ...base("t"), event: "E", date: "2026-10", format: "poster", stage: "accepted", abstract: "A", research: "missing" });
    expect(rules({ "talks/t.md": talk })).toContain("reference");
  });

  it("accepts a valid reference", () => {
    expect(rules({ "roles/org.md": role("org"), "case-studies/x.md": fm({ ...base("x"), status: "completed", role: "org" }) })).toEqual([]);
  });
});

describe("internal links", () => {
  it("accepts links to static and published routes", () => {
    const body = "See [work](/work), [study](/work/x) and [anchor](#top).";
    expect(rules({ "case-studies/x.md": fm({ ...base("x"), status: "completed" }, body) })).toEqual([]);
  });

  it("rejects links to pages that do not exist", () => {
    expect(rules({ "roles/r.md": role("r", {}, "See [nowhere](/nowhere).") })).toContain("internal-link");
  });

  it("rejects links to hidden entries", () => {
    const issues = issuesFor({
      "case-studies/secret.md": fm({ ...base("secret", { visibility: "hidden" }), status: "completed" }),
      "roles/r.md": role("r", {}, "See [it](/work/secret)."),
    });
    expect(issues.find((i) => i.rule === "internal-link")?.message).toMatch(/hidden or draft/);
  });

  it("checks the site's thread links", () => {
    const site = { ...baseSite, threads: baseSite.threads.map((t, i) => (i === 1 ? { ...t, href: "/research/missing" } : t)) };
    expect(rules({}, site)).toContain("internal-link");
  });

  it("ignores links inside hidden entries", () => {
    expect(rules({ "roles/r.md": role("r", { visibility: "hidden" }, "See [nowhere](/nowhere).") })).toEqual([]);
  });
});

describe("placeholders", () => {
  it("rejects [CONFIRM] and TODO in public frontmatter and bodies", () => {
    expect(rules({ "roles/a.md": role("a", { summary: "Started [CONFIRM]." }) })).toContain("placeholder");
    expect(rules({ "roles/b.md": role("b", {}, "TODO: write this.") })).toContain("placeholder");
  });

  it("allows placeholders in hidden entries and hidden children", () => {
    expect(rules({ "roles/a.md": role("a", { visibility: "hidden", summary: "Dates [CONFIRM]." }) })).toEqual([]);
    const study = fm({
      ...base("s"),
      status: "completed",
      metrics: [{ label: "Latency", value: "[CONFIRM] exact figure", kind: "measured", cleared: false }],
    });
    expect(rules({ "case-studies/s.md": study })).toEqual([]);
  });

  it("reports the line of the placeholder", () => {
    const issue = issuesFor({ "roles/a.md": role("a", {}, "\nFine.\nTODO here.") }).find((i) => i.rule === "placeholder");
    expect(issue?.line).toBeGreaterThan(5);
  });
});

describe("URLs", () => {
  it("accepts https only for external links", () => {
    expect(externalUrlProblem("https://example.com/x")).toBeNull();
    expect(externalUrlProblem("http://example.com/x")).toMatch(/https/);
    expect(externalUrlProblem("javascript:alert(1)")).not.toBeNull();
    expect(externalUrlProblem("not a url")).not.toBeNull();
  });

  it("allows mailto only for the confirmed site email", () => {
    expect(urlProblem("mailto:me@example.com", { allowMailto: "me@example.com" })).toBeNull();
    expect(urlProblem("mailto:someone@example.com", { allowMailto: "me@example.com" })).not.toBeNull();
    expect(urlProblem("mailto:me@example.com", { allowMailto: null })).not.toBeNull();
  });

  it("rejects unsafe links in public bodies and data", () => {
    expect(rules({ "roles/a.md": role("a", {}, "[x](http://example.com)") })).toContain("url-safety");
    expect(rules({ "roles/b.md": role("b", {}, '<a href="javascript:alert(1)">x</a>') })).toContain("url-safety");
    const project = fm({ ...base("p"), status: "active", links: [{ label: "Site", url: "ftp://example.com", visibility: "public" }] });
    expect(rules({ "projects/p.md": project })).toContain("url-safety");
  });

  it("rejects a hidden URL that appears in public content", () => {
    const hiddenRepo = fm({ ...base("p"), status: "active", repo: { url: "https://example.com/private-repo", visibility: "hidden" } });
    const leaking = role("r", {}, "Code: [repo](https://example.com/private-repo)");
    expect(rules({ "projects/p.md": hiddenRepo, "roles/r.md": leaking })).toContain("hidden-url");
  });

  it("rejects hidden contact details used in public content", () => {
    const site = { ...baseSite, email: { address: "hidden@example.com", visibility: "hidden" } };
    expect(rules({ "roles/r.md": role("r", {}, "Write to [me](mailto:hidden@example.com).") }, site)).toEqual(
      expect.arrayContaining(["url-safety", "hidden-url"]),
    );
  });
});

describe("embeds", () => {
  it("rejects allow-scripts with allow-same-origin on public embeds", () => {
    const research = fm({
      ...base("r"),
      status: "active",
      embeds: [{ url: "https://example.com/e", title: "E", visibility: "public", sandbox: "allow-scripts allow-same-origin" }],
    });
    expect(rules({ "research/r.md": research })).toContain("embed-sandbox");
  });
});

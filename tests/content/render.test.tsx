import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { loadRepository } from "@/content/repository";
import { renderMarkdown } from "@/lib/markdown";

/*
 * Every published body must compile and render (KaTeX throws on bad maths),
 * so a broken equation or MDX syntax error fails the tests, not a page build.
 */

const repo = loadRepository(path.join(process.cwd(), "content"));
const bodies = [
  { id: "site/about", body: repo.about.body, format: repo.about.format },
  ...Object.values(repo.published)
    .flat()
    .filter((e) => e.body.trim())
    .map((e) => ({ id: e.id, body: e.body, format: e.format })),
];

describe("published bodies render", () => {
  it.each(bodies.map((b) => [b.id, b] as const))("%s", async (_id, { body, format }) => {
    const html = renderToStaticMarkup(await renderMarkdown(body, { format }));
    expect(html.length).toBeGreaterThan(0);
    expect(html).not.toContain("katex-error");
  });

  it("research equations are typeset", async () => {
    const hauv = repo.published.research.find((r) => r.slug === "hauv")!;
    const html = renderToStaticMarkup(await renderMarkdown(hauv.body, { format: hauv.format }));
    expect((html.match(/class="katex-display"/g) ?? []).length).toBe(3);
    expect(html).toContain('id="the-mathematics"');
  });
});

import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { dump } from "js-yaml";

/*
 * Builds throwaway content trees in a temp directory, so fixtures live in the
 * tests themselves (no fabricated personal content committed under content/).
 * All fixture text is obviously synthetic ("Example …").
 */

export function fm(data: Record<string, unknown>, body = ""): string {
  return `---\n${dump(data, { lineWidth: 200 })}---\n${body}`;
}

export const baseSite = {
  name: "Example Person",
  fullName: "Example Full Person",
  title: "Example title",
  location: "Example City",
  coordinates: "0.00° N 0.00° E",
  positioning: "Example positioning line.",
  heroIntro: "Example introduction.",
  threads: [
    { id: "engineering", label: "Engineering", description: "Example.", note: "Example note.", href: "/work" },
    { id: "research", label: "Research", description: "Example.", note: "Example note.", href: "/research" },
    { id: "creation", label: "Creation", description: "Example.", note: "Example note.", href: "/ventures" },
  ],
  email: { address: "", visibility: "hidden" },
  cv: { path: "", visibility: "hidden" },
  profiles: [],
};

export const base = (slug: string, extra: Record<string, unknown> = {}) => ({
  title: `Example ${slug}`,
  slug,
  summary: `Example summary for ${slug}.`,
  visibility: "public",
  updated: "2026-11-04",
  ...extra,
});

/** Create a content root. Keys are paths under content/, values are file text. */
export function makeTree(files: Record<string, string>, site: Record<string, unknown> | null = baseSite): string {
  const root = path.join(mkdtempSync(path.join(tmpdir(), "content-test-")), "content");
  const all = { ...(site ? { "site/profile.md": fm(site) } : {}), ...files };
  for (const [rel, text] of Object.entries(all)) {
    const abs = path.join(root, rel);
    mkdirSync(path.dirname(abs), { recursive: true });
    writeFileSync(abs, text);
  }
  return root;
}

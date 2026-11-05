/*
 * pnpm content:routes
 * Writes src/generated/route-manifest.json: the published slugs for each
 * detail section. Runs before `next dev` and `next build`, so the Proxy and
 * the pages always agree. Published entries only; never preview.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadRepository } from "../src/content/repository";
import type { RouteManifest } from "../src/lib/route-manifest";

const repo = loadRepository(path.join(process.cwd(), "content"));
const manifest: RouteManifest = {
  work: repo.published.caseStudies.map((e) => e.slug).sort(),
  research: repo.published.research.map((e) => e.slug).sort(),
  writing: repo.published.notes.map((e) => e.slug).sort(),
};

const out = path.join(process.cwd(), "src", "generated", "route-manifest.json");
mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(manifest, null, 2) + "\n");
console.log(`✓ Route manifest: ${Object.entries(manifest).map(([k, v]) => `${k} ${v.length}`).join(", ")}`);

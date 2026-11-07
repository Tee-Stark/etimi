/*
 * pnpm content:check-output   (runs automatically after `next build`)
 *
 * Scans the production build (rendered HTML, RSC payloads, route metadata,
 * sitemap, feeds, and client chunks) for anything that must not ship
 * (IMPLEMENTATION_SPEC.md §5.1 item 7, §16.4):
 *   - text of hidden/draft entries, hidden URLs and contact details,
 *     uncleared metric values, unconsented collaborator names
 *   - items REMOVED in PLAN.md
 *   - placeholders ([CONFIRM], TODO) and development-only markers
 *   - JSON-LD sameAs URLs that are not confirmed public profiles
 * The decisive surface is the built output, not the source.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { findRemovedTerms } from "../src/content/banned";
import { loadAllContent } from "../src/content/loader";
import { projectSite } from "../src/content/visibility";
import { collectWithheld } from "../src/content/withheld";

const ROOT = process.cwd();
const BUILD = path.join(ROOT, ".next");
const RENDERED_DIR = path.join(BUILD, "server", "app");
const CLIENT_DIR = path.join(BUILD, "static");

if (!existsSync(RENDERED_DIR)) {
  console.error("✗ No production build found (.next/server/app). Run `next build` first.");
  process.exit(1);
}

const BINARY = /\.(png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|map)$/i;

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  let out: string[] = [];
  for (const name of readdirSync(dir)) {
    const abs = path.join(dir, name);
    if (statSync(abs).isDirectory()) out = out.concat(walk(abs));
    else if (!BINARY.test(name)) out.push(abs);
  }
  return out;
}

/** Rendered output: everything under server/app except compiled server code. */
const rendered = walk(RENDERED_DIR).filter((f) => !/\.(js|cjs|mjs)$/.test(f) && !f.endsWith(".nft.json"));
/** Client bundles: checked for withheld data only (library code has its own TODOs). */
const client = walk(CLIENT_DIR).filter((f) => /\.(js|css)$/.test(f));

const content = loadAllContent(path.join(ROOT, "content"));
const withheld = collectWithheld(content);
const confirmedProfiles = new Set(content.site ? projectSite(content.site).profiles.map((p) => p.url) : []);

const DEV_MARKERS = ["Development · section pending", "HIDDEN — DEVELOPMENT ONLY", "Design lab — development only"];
const PLACEHOLDERS = [/\[CONFIRM\]/, /\bTODO\b/, /\bFIXME\b/, /\[PLACEHOLDER\]/i];

const problems: string[] = [];
const rel = (f: string) => path.relative(ROOT, f);

for (const file of [...rendered, ...client]) {
  const text = readFileSync(file, "utf8");
  for (const w of withheld) {
    if (text.includes(w.value)) problems.push(`${rel(file)}  withheld (${w.reason}, from ${w.source}): "${w.value}"`);
  }
}

for (const file of rendered) {
  const text = readFileSync(file, "utf8");
  for (const m of findRemovedTerms(text)) problems.push(`${rel(file)}  removed:${m.id} — "${m.text}"`);
  for (const p of PLACEHOLDERS) if (p.test(text)) problems.push(`${rel(file)}  placeholder ${p.source}`);
  for (const marker of DEV_MARKERS) if (text.includes(marker)) problems.push(`${rel(file)}  development-only marker "${marker}"`);

  for (const m of text.matchAll(/"sameAs"\s*:\s*\[([^\]]*)\]/g)) {
    for (const u of m[1].matchAll(/"([^"]+)"/g)) {
      if (!confirmedProfiles.has(u[1])) problems.push(`${rel(file)}  JSON-LD sameAs contains unconfirmed URL "${u[1]}"`);
    }
  }
}

if (problems.length > 0) {
  console.error(`\n✗ Build output check failed: ${problems.length} problem(s)\n`);
  console.error(problems.map((p) => `  ${p}`).join("\n"));
  console.error("");
  process.exit(1);
}
console.log(`✓ Build output clean (${rendered.length} rendered files, ${client.length} client files, ${withheld.length} withheld strings checked)`);

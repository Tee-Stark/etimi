/*
 * pnpm content:check-banned
 * Scans source-controlled content and code (content/, src/, public/ text
 * files) for items REMOVED in PLAN.md, and FairMoney content for
 * "microservice" wording and percentage cost-reduction claims
 * (IMPLEMENTATION_SPEC.md §5.1 items 3 and 8, §5.2, §5.3).
 *
 * Internal documents (PLAN.md, IMPLEMENTATION_SPEC.md, ABOUT_TIM.md) are out
 * of scope by design; so is the banned-term definition file and its test.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import {
  BANNED_DEFINITION_PATHS,
  findCostPercentageClaims,
  findMicroservice,
  findRemovedTerms,
  mentionsFairMoney,
} from "../src/content/banned";

const ROOT = process.cwd();
const SCAN_DIRS = ["content", "src", "public"];
const TEXT = /\.(md|mdx|ts|tsx|js|mjs|css|json|svg|txt|xml|html|ya?ml)$/i;

function walk(dir: string): string[] {
  let out: string[] = [];
  let names: string[];
  try {
    names = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of names) {
    const abs = path.join(dir, name);
    if (statSync(abs).isDirectory()) out = out.concat(walk(abs));
    else if (TEXT.test(name)) out.push(abs);
  }
  return out;
}

const problems: string[] = [];
for (const dir of SCAN_DIRS) {
  for (const abs of walk(path.join(ROOT, dir))) {
    const rel = path.relative(ROOT, abs).split(path.sep).join("/");
    if (BANNED_DEFINITION_PATHS.includes(rel)) continue;
    const text = readFileSync(abs, "utf8");

    for (const m of findRemovedTerms(text)) problems.push(`${rel}:${m.line}  [removed:${m.id}] ${m.reason}: "${m.text}"`);

    if (rel.startsWith("content/") && mentionsFairMoney(text)) {
      for (const m of findMicroservice(text)) problems.push(`${rel}:${m.line}  [${m.id}] ${m.reason}: "${m.text}"`);
      for (const m of findCostPercentageClaims(text)) problems.push(`${rel}:${m.line}  [${m.id}] ${m.reason}: "${m.text}"`);
    }
  }
}

if (problems.length > 0) {
  console.error(`\n✗ Banned content found: ${problems.length} problem(s)\n`);
  console.error(problems.map((p) => `  ${p}`).join("\n"));
  console.error("");
  process.exit(1);
}
console.log("✓ No banned content in content/, src/ or public/");

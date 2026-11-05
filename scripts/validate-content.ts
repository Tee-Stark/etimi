/*
 * pnpm content:validate
 * Validates every content file against its schema and every cross-entry
 * rule (IMPLEMENTATION_SPEC.md §5). Exits non-zero with a list of problems,
 * each with its file, line and field.
 */
import path from "node:path";
import { collectionNames } from "../src/content/collections";
import { formatIssues } from "../src/content/issues";
import { loadAllContent } from "../src/content/loader";
import { validateContent } from "../src/content/validation";
import { isPublished } from "../src/content/visibility";

const root = path.join(process.cwd(), "content");
const content = loadAllContent(root);
const issues = validateContent(content);

if (issues.length > 0) {
  console.error(`\n✗ Content validation failed: ${issues.length} problem(s)\n`);
  console.error(formatIssues(issues));
  console.error("");
  process.exit(1);
}

const rows = collectionNames.map((name) => {
  const list = content.entries[name];
  const published = list.filter(isPublished).length;
  return `  ${name.padEnd(14)} ${String(published).padStart(3)} published  ${String(list.length - published).padStart(3)} withheld`;
});
console.log(`✓ Content valid\n${rows.join("\n")}`);

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { CORE_SCHEMA, load as loadYaml } from "js-yaml";
import type { z } from "zod";
import { ABOUT_FILE, collections, SITE_FILE, type CollectionName } from "./collections";
import type { ContentIssue } from "./issues";
import { aboutSchema, siteSchema, type AboutData, type SiteData } from "./schemas/entities";

/*
 * Reads content files from disk, parses frontmatter, validates it against
 * the collection schema, and returns typed entries plus every problem found.
 *
 * No visibility policy here: this returns everything, hidden included. Route
 * code must never import this module directly; it goes through the
 * server-only facade in ./index.ts, which applies the publication policy.
 */

export type ContentFormat = "md" | "mdx";

export type CollectionData = {
  [N in CollectionName]: z.output<(typeof collections)[N]["schema"]>;
};

export type Entry<N extends CollectionName = CollectionName> = {
  collection: N;
  /** Stable identifier: "<collection>/<slug>". */
  id: string;
  /** Project-relative source path, for diagnostics. */
  sourcePath: string;
  format: ContentFormat;
  /** Markdown/MDX body (may be empty). */
  body: string;
  /** Whole file as written, for text-level checks (banned terms, line numbers). */
  raw: string;
  /** 1-based line where the body starts, so body issues can point at real lines. */
  bodyLine: number;
  data: CollectionData[N];
};

export type Singleton<T> = { data: T; body: string; format: ContentFormat; raw: string; sourcePath: string };

export type LoadedContent = {
  site: SiteData | null;
  /** Raw site profile text, for text-level checks. */
  siteRaw: string;
  about: Singleton<AboutData> | null;
  entries: { [N in CollectionName]: Entry<N>[] };
  issues: ContentIssue[];
};

type ParsedFile = { frontmatter: unknown; body: string; bodyLine: number };

/** Split `---` YAML frontmatter from the body. Dates stay strings (YAML core schema). */
export function parseFrontmatter(text: string): ParsedFile {
  const normalised = text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  if (!normalised.startsWith("---\n")) {
    throw new Error("File must start with a '---' frontmatter block");
  }
  const end = normalised.indexOf("\n---", 4);
  if (end === -1) throw new Error("Frontmatter block is not closed with '---'");
  const yaml = normalised.slice(4, end);
  const afterFence = normalised.indexOf("\n", end + 4);
  const body = afterFence === -1 ? "" : normalised.slice(afterFence + 1);
  const bodyLine = yaml.split("\n").length + 3;
  const frontmatter = loadYaml(yaml, { schema: CORE_SCHEMA }) ?? {};
  return { frontmatter, body, bodyLine };
}

function relative(root: string, file: string): string {
  return path.relative(path.dirname(root), file).split(path.sep).join("/");
}

function zodIssues(file: string, error: z.ZodError): ContentIssue[] {
  return error.issues.map((issue) => ({
    file,
    field: issue.path.length ? issue.path.join(".") : undefined,
    rule: "schema",
    message: issue.message,
  }));
}

/** Content files in a collection directory: *.md and *.mdx, ignoring dotfiles and _drafts. */
export function listContentFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => /\.(md|mdx)$/.test(name) && !name.startsWith(".") && !name.startsWith("_"))
    .sort()
    .map((name) => path.join(dir, name));
}

export function loadCollection<N extends CollectionName>(
  contentRoot: string,
  name: N,
): { entries: Entry<N>[]; issues: ContentIssue[] } {
  const def = collections[name];
  const entries: Entry<N>[] = [];
  const issues: ContentIssue[] = [];

  for (const abs of listContentFiles(path.join(contentRoot, def.dir))) {
    const file = relative(contentRoot, abs);
    let parsed: ParsedFile;
    const raw = readFileSync(abs, "utf8");
    try {
      parsed = parseFrontmatter(raw);
    } catch (error) {
      issues.push({ file, rule: "parse", message: (error as Error).message });
      continue;
    }

    const result = def.schema.safeParse(parsed.frontmatter);
    if (!result.success) {
      issues.push(...zodIssues(file, result.error));
      continue;
    }

    const data = result.data as CollectionData[N];
    const basename = path.basename(abs).replace(/\.(md|mdx)$/, "");
    if (basename !== data.slug) {
      issues.push({
        file,
        field: "slug",
        rule: "slug-filename",
        message: `File name "${basename}" must match slug "${data.slug}" (rename the file or fix the slug)`,
      });
    }

    entries.push({
      collection: name,
      id: `${name}/${data.slug}`,
      sourcePath: file,
      format: abs.endsWith(".mdx") ? "mdx" : "md",
      body: parsed.body,
      raw,
      bodyLine: parsed.bodyLine,
      data,
    });
  }

  return { entries, issues };
}

function loadSingleton<S extends z.ZodType>(
  contentRoot: string,
  relPath: string,
  schema: S,
): { value: Singleton<z.output<S>> | null; raw: string; issues: ContentIssue[] } {
  const abs = path.join(contentRoot, relPath);
  const file = relative(contentRoot, abs);
  if (!existsSync(abs)) return { value: null, raw: "", issues: [{ file, rule: "missing", message: `${relPath} is missing` }] };
  const raw = readFileSync(abs, "utf8");
  try {
    const { frontmatter, body } = parseFrontmatter(raw);
    const result = schema.safeParse(frontmatter);
    if (!result.success) return { value: null, raw, issues: zodIssues(file, result.error) };
    const format: ContentFormat = abs.endsWith(".mdx") ? "mdx" : "md";
    return { value: { data: result.data, body, format, raw, sourcePath: file }, raw, issues: [] };
  } catch (error) {
    return { value: null, raw, issues: [{ file, rule: "parse", message: (error as Error).message }] };
  }
}

export function loadSite(contentRoot: string): { site: SiteData | null; raw: string; issues: ContentIssue[] } {
  const { value, raw, issues } = loadSingleton(contentRoot, SITE_FILE, siteSchema);
  return { site: value?.data ?? null, raw, issues };
}

export function loadAbout(contentRoot: string): { about: Singleton<AboutData> | null; issues: ContentIssue[] } {
  const { value, issues } = loadSingleton(contentRoot, ABOUT_FILE, aboutSchema);
  return { about: value, issues };
}

export function loadAllContent(contentRoot: string): LoadedContent {
  const { site, raw: siteRaw, issues } = loadSite(contentRoot);
  const { about, issues: aboutIssues } = loadAbout(contentRoot);
  issues.push(...aboutIssues);
  const entries = {} as LoadedContent["entries"];
  for (const name of Object.keys(collections) as CollectionName[]) {
    const loaded = loadCollection(contentRoot, name);
    (entries as Record<CollectionName, Entry[]>)[name] = loaded.entries;
    issues.push(...loaded.issues);
  }
  return { site, siteRaw, about, entries, issues };
}

export const SITE_SOURCE_PATH = `content/${SITE_FILE}`;

export const DEFAULT_CONTENT_ROOT = path.join(process.cwd(), "content");

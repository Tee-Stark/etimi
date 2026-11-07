import { collections, staticRoutes, type CollectionName } from "./collections";
import { findCostPercentageClaims, findRemovedTerms, lineAt, mentionsFairMoney } from "./banned";
import type { ContentIssue } from "./issues";
import { isInternalPath, urlProblem } from "./links";
import { SITE_SOURCE_PATH, type Entry, type LoadedContent } from "./loader";
import type { SiteData } from "./schemas/entities";
import { isPublished, projectEntry, projectSite, publishedIds, type ProjectionContext } from "./visibility";

/*
 * Cross-entry validation (IMPLEMENTATION_SPEC.md §5.1). Rules apply to what
 * would be published; preview never relaxes them. Returns every problem.
 */

const PLACEHOLDER_TOKENS: Array<{ token: string; pattern: RegExp }> = [
  { token: "[CONFIRM]", pattern: /\[CONFIRM\]/ },
  { token: "TODO", pattern: /\bTODO\b/ },
  { token: "FIXME", pattern: /\bFIXME\b/ },
  { token: "[PLACEHOLDER]", pattern: /\[PLACEHOLDER\]/i },
];

type AllEntries = { [N in CollectionName]: Entry<N>[] };

function allEntries(content: LoadedContent): Entry[] {
  return (Object.values(content.entries) as Entry[][]).flat();
}

/** Line number in the raw file where `needle` first appears (best effort). */
function lineOf(raw: string, needle: string): number | undefined {
  const index = raw.indexOf(needle);
  return index === -1 ? undefined : lineAt(raw, index);
}

// ── URL extraction ──────────────────────────────────────────────────────

/** Link targets written in Markdown/MDX: [text](target), <a href="target">, <Link href="target">. */
export function extractBodyLinks(body: string): string[] {
  const out: string[] = [];
  for (const m of body.matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) out.push(m[1]);
  for (const m of body.matchAll(/\bhref\s*=\s*["'{]\s*["']?([^"'}\s]+)/g)) out.push(m[1]);
  for (const m of body.matchAll(/^\s*\[[^\]]+\]:\s*(\S+)/gm)) out.push(m[1]);
  return out;
}

/** Every string under a key named `url`/`href`, or in a `links` structure, within projected data. */
export function extractDataUrls(value: unknown, key = ""): string[] {
  if (typeof value === "string") {
    return ["url", "href", "repo", "slides", "video", "pdf"].includes(key) && value ? [value] : [];
  }
  if (Array.isArray(value)) return value.flatMap((v) => extractDataUrls(v, key));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => extractDataUrls(v, k === "links" ? "url" : k));
  }
  return [];
}

/** URLs that have been explicitly withheld anywhere in the content. */
export function collectHiddenUrls(content: LoadedContent): Set<string> {
  const hidden = new Set<string>();
  const visit = (value: unknown, parentHidden: boolean): void => {
    if (Array.isArray(value)) return value.forEach((v) => visit(v, parentHidden));
    if (!value || typeof value !== "object") return;
    const obj = value as Record<string, unknown>;
    const isHidden = parentHidden || obj.visibility === "hidden";
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string") {
        if (isHidden && ["url", "address", "path"].includes(k) && v.trim()) hidden.add(v.trim());
      } else visit(v, isHidden);
    }
  };
  if (content.site) visit(content.site, false);
  for (const entry of allEntries(content)) visit(entry.data, !isPublished(entry));
  hidden.delete("");
  return hidden;
}

// ── Rules ───────────────────────────────────────────────────────────────

function checkUniqueSlugs(entries: AllEntries): ContentIssue[] {
  const issues: ContentIssue[] = [];
  for (const [name, list] of Object.entries(entries) as Array<[CollectionName, Entry[]]>) {
    const seen = new Map<string, string>();
    for (const entry of list) {
      const prior = seen.get(entry.data.slug);
      if (prior) {
        issues.push({
          file: entry.sourcePath,
          field: "slug",
          rule: "slug-unique",
          message: `Slug "${entry.data.slug}" is already used by ${prior} in ${name}`,
        });
      } else seen.set(entry.data.slug, entry.sourcePath);
    }
  }
  return issues;
}

function checkReferences(entries: AllEntries): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const roleSlugs = new Set(entries.roles.map((e) => e.data.slug));
  const researchSlugs = new Set(entries.research.map((e) => e.data.slug));
  for (const cs of entries.caseStudies) {
    if (cs.data.role && !roleSlugs.has(cs.data.role)) {
      issues.push({ file: cs.sourcePath, field: "role", rule: "reference", message: `No role with slug "${cs.data.role}" exists in content/roles/` });
    }
  }
  for (const talk of entries.talks) {
    if (talk.data.research && !researchSlugs.has(talk.data.research)) {
      issues.push({ file: talk.sourcePath, field: "research", rule: "reference", message: `No research entry with slug "${talk.data.research}" exists in content/research/` });
    }
  }
  return issues;
}

/** Every route that will exist publicly, and the routes that belong to withheld entries. */
export function routeTable(content: LoadedContent): { publicRoutes: Set<string>; hiddenRoutes: Set<string> } {
  const publicRoutes = new Set<string>(staticRoutes);
  const hiddenRoutes = new Set<string>();
  for (const entry of allEntries(content)) {
    const route = (collections[entry.collection] as { route?: (slug: string) => string }).route;
    if (!route) continue;
    (isPublished(entry) ? publicRoutes : hiddenRoutes).add(route(entry.data.slug));
  }
  return { publicRoutes, hiddenRoutes };
}

function normalisePath(url: string): string {
  const pathOnly = url.split(/[?#]/)[0];
  return pathOnly.length > 1 ? pathOnly.replace(/\/+$/, "") : pathOnly;
}

function checkUrl(
  url: string,
  where: { file: string; field?: string; line?: number },
  ctx: { publicRoutes: Set<string>; hiddenRoutes: Set<string>; hiddenUrls: Set<string>; email: string | null },
): ContentIssue[] {
  const issues: ContentIssue[] = [];
  if (isInternalPath(url)) {
    const target = normalisePath(url);
    if (ctx.hiddenRoutes.has(target)) {
      issues.push({ ...where, rule: "internal-link", message: `Links to ${target}, which belongs to a hidden or draft entry` });
    } else if (!ctx.publicRoutes.has(target) && !target.startsWith("/images/") && !target.startsWith("/documents/") && !target.startsWith("/diagrams/")) {
      issues.push({ ...where, rule: "internal-link", message: `Links to ${target}, which is not a public page` });
    }
    return issues;
  }
  const problem = urlProblem(url, { allowMailto: ctx.email });
  if (problem) issues.push({ ...where, rule: "url-safety", message: problem });
  if (ctx.hiddenUrls.has(url)) {
    issues.push({ ...where, rule: "hidden-url", message: `"${url}" is marked hidden elsewhere and must not appear in public content` });
  }
  return issues;
}

function checkPlaceholders(text: string, where: { file: string; raw: string; field?: string }): ContentIssue[] {
  const issues: ContentIssue[] = [];
  for (const { token, pattern } of PLACEHOLDER_TOKENS) {
    if (pattern.test(text)) {
      issues.push({
        file: where.file,
        field: where.field,
        line: lineOf(where.raw, token),
        rule: "placeholder",
        message: `Public content contains the placeholder "${token}". Resolve it or set visibility: hidden`,
      });
    }
  }
  return issues;
}

function checkPublicSurface(content: LoadedContent, site: SiteData | null): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const ctxIds: ProjectionContext = { publishedIds: publishedIds(content.entries) };
  const { publicRoutes, hiddenRoutes } = routeTable(content);
  const hiddenUrls = collectHiddenUrls(content);
  const publicSite = site ? projectSite(site) : null;
  const urlCtx = { publicRoutes, hiddenRoutes, hiddenUrls, email: publicSite?.email ?? null };

  if (publicSite) {
    const file = SITE_SOURCE_PATH;
    issues.push(...checkPlaceholders(JSON.stringify(publicSite), { file, raw: content.siteRaw }));
    publicSite.threads.forEach((t, i) => issues.push(...checkUrl(t.href, { file, field: `threads.${i}.href`, line: lineOf(content.siteRaw, `href: ${t.href}`) }, urlCtx)));
    publicSite.profiles.forEach((p, i) => issues.push(...checkUrl(p.url, { file, field: `profiles.${i}.url` }, urlCtx)));
  }

  if (content.about) {
    const about = content.about;
    const file = about.sourcePath;
    issues.push(...checkPlaceholders(JSON.stringify(about.data), { file, raw: about.raw }));
    issues.push(...checkPlaceholders(about.body, { file, raw: about.raw, field: "body" }));
    for (const url of extractBodyLinks(about.body)) {
      issues.push(...checkUrl(url, { file, field: "body", line: lineOf(about.raw, url) }, urlCtx));
    }
    const researchSlugs = new Map(content.entries.research.map((e) => [e.data.slug, e]));
    about.data.education.forEach((edu, i) => {
      if (!edu.thesis) return;
      // A hidden thesis is allowed: its link is simply dropped from the public projection.
      if (!researchSlugs.has(edu.thesis)) {
        issues.push({ file, field: `education.${i}.thesis`, rule: "reference", message: `No research entry with slug "${edu.thesis}" exists` });
      }
    });
  }

  for (const entry of allEntries(content)) {
    if (!isPublished(entry)) continue;
    const projected = projectEntry(entry, ctxIds);
    const file = entry.sourcePath;
    issues.push(...checkPlaceholders(JSON.stringify(projected.data), { file, raw: entry.raw }));
    issues.push(...checkPlaceholders(entry.body, { file, raw: entry.raw, field: "body" }));

    for (const url of extractDataUrls(projected.data)) {
      issues.push(...checkUrl(url, { file, line: lineOf(entry.raw, url) }, urlCtx));
    }
    for (const url of extractBodyLinks(entry.body)) {
      issues.push(...checkUrl(url, { file, field: "body", line: lineOf(entry.raw, url) }, urlCtx));
    }
    // Hidden URLs written as plain text in the body.
    for (const url of hiddenUrls) {
      if (url.length >= 8 && entry.body.includes(url) && !extractBodyLinks(entry.body).includes(url)) {
        issues.push({ file, field: "body", line: lineOf(entry.raw, url), rule: "hidden-url", message: `"${url}" is marked hidden elsewhere and must not appear in public content` });
      }
    }
    // Embeds: allow-scripts + allow-same-origin together defeats the sandbox.
    if (entry.collection === "research") {
      for (const embed of (projected.data as { embeds: Array<{ sandbox: string; url: string }> }).embeds) {
        const tokens = embed.sandbox.split(/\s+/);
        if (tokens.includes("allow-scripts") && tokens.includes("allow-same-origin")) {
          issues.push({ file, field: "embeds", rule: "embed-sandbox", message: `Embed ${embed.url}: "allow-scripts" with "allow-same-origin" lets the frame remove its own sandbox` });
        }
      }
    }
  }
  return issues;
}

function checkBannedText(content: LoadedContent): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const files: Array<{ file: string; raw: string; entry?: Entry }> = [
    { file: SITE_SOURCE_PATH, raw: content.siteRaw },
    ...(content.about ? [{ file: content.about.sourcePath, raw: content.about.raw }] : []),
    ...allEntries(content).map((entry) => ({ file: entry.sourcePath, raw: entry.raw, entry })),
  ];

  const fairMoneyRoles = new Set(content.entries.roles.filter((r) => mentionsFairMoney(r.raw)).map((r) => r.data.slug));

  for (const { file, raw, entry } of files) {
    for (const m of findRemovedTerms(raw)) {
      issues.push({ file, line: m.line, rule: `removed:${m.id}`, message: `${m.reason}: "${m.text}"` });
    }
    const isFairMoney =
      mentionsFairMoney(raw) || (entry?.collection === "caseStudies" && fairMoneyRoles.has((entry.data as { role?: string }).role ?? ""));
    if (!isFairMoney) continue;
    for (const m of findCostPercentageClaims(raw)) {
      issues.push({ file, line: m.line, rule: m.id, message: `${m.reason}: "${m.text}"` });
    }
  }
  return issues;
}

/** All problems: schema/parse issues from loading plus every cross-entry rule. */
export function validateContent(content: LoadedContent): ContentIssue[] {
  return [
    ...content.issues,
    ...checkUniqueSlugs(content.entries),
    ...checkReferences(content.entries),
    ...checkPublicSurface(content, content.site),
    ...checkBannedText(content),
  ];
}

import { collectionNames, type CollectionName } from "./collections";
import { ContentValidationError } from "./issues";
import { loadAllContent, type LoadedContent } from "./loader";
import { validateContent } from "./validation";
import { projectAbout, projectSite, publishedIds, selectEntries, type PublicAbout, type PublicEntry, type PublicSite } from "./visibility";

/*
 * The content repository: load → validate → project. Framework-agnostic
 * (no Next.js, no server-only), so build scripts and tests use exactly the
 * same code path as the pages. A future CMS would replace `loadAllContent`
 * and keep everything downstream.
 */

export type Repository = {
  site: PublicSite;
  about: PublicAbout;
  /** Published entries only. Use for sitemap, feeds, metadata and structured data. */
  published: { [N in CollectionName]: PublicEntry<N>[] };
  /** Published entries, plus hidden/draft entries (flagged) when preview is on. Use for page rendering. */
  pages: { [N in CollectionName]: PublicEntry<N>[] };
};

export function buildRepository(content: LoadedContent, { preview = false }: { preview?: boolean } = {}): Repository {
  const issues = validateContent(content);
  if (issues.length > 0 || !content.site || !content.about) throw new ContentValidationError(issues);

  const ctx = { publishedIds: publishedIds(content.entries) };
  const published = {} as Repository["published"];
  const pages = {} as Repository["pages"];
  for (const name of collectionNames) {
    const entries = content.entries[name];
    (published as Record<CollectionName, PublicEntry[]>)[name] = selectEntries(entries, ctx);
    (pages as Record<CollectionName, PublicEntry[]>)[name] = preview ? selectEntries(entries, ctx, { preview: true }) : published[name];
  }
  return { site: projectSite(content.site), about: projectAbout(content.about, ctx), published, pages };
}

export function loadRepository(contentRoot: string, opts: { preview?: boolean } = {}): Repository {
  return buildRepository(loadAllContent(contentRoot), opts);
}

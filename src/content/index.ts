import "server-only";

import type { CollectionName } from "./collections";
import { DEFAULT_CONTENT_ROOT } from "./loader";
import { loadRepository, type Repository } from "./repository";
import { isPreviewEnabled, type PublicAbout, type PublicEntry, type PublicSite } from "./visibility";

/*
 * The only content API for routes and components (server-only).
 *
 *   getSite()                 site identity, hidden contact details removed
 *   getAbout()                About page facts and biography
 *   getCollection(name)       entries to render on pages; includes flagged
 *                             hidden entries only in development preview
 *   getEntry(name, slug)      one entry for a detail page, or undefined
 *   getPublicCollection(name) published entries only, never preview; use for
 *                             sitemap, RSS, metadata, JSON-LD, OG images
 *   getStaticSlugs(name)      published slugs (sitemap and similar)
 *   getRouteParams(name)      params for generateStaticParams on detail routes
 *
 * Content is validated on first use; invalid public content throws with a
 * list of every problem and the file/field it is in.
 */

let memo: Repository | null = null;

function repository(): Repository {
  // In development, reload on every request so content edits show immediately.
  if (memo && process.env.NODE_ENV === "production") return memo;
  memo = loadRepository(DEFAULT_CONTENT_ROOT, { preview: isPreviewEnabled() });
  return memo;
}

export function getSite(): PublicSite {
  return repository().site;
}

export function getAbout(): PublicAbout {
  return repository().about;
}

export function getCollection<N extends CollectionName>(name: N): PublicEntry<N>[] {
  return repository().pages[name] as PublicEntry<N>[];
}

export function getPublicCollection<N extends CollectionName>(name: N): PublicEntry<N>[] {
  return repository().published[name] as PublicEntry<N>[];
}

export function getEntry<N extends CollectionName>(name: N, slug: string): PublicEntry<N> | undefined {
  return getCollection(name).find((entry) => entry.slug === slug);
}

export function getStaticSlugs(name: CollectionName): Array<{ slug: string }> {
  return getPublicCollection(name).map((entry) => ({ slug: entry.slug }));
}

/**
 * Params for a detail route's generateStaticParams. Published slugs, plus
 * flagged preview slugs in development preview. With Cache Components the
 * list may not be empty, so an empty collection yields a sentinel that is
 * not a valid slug (slugs cannot contain "_") and therefore always 404s.
 */
export const NO_ENTRIES_SENTINEL = "_";
export function getRouteParams(name: CollectionName): Array<{ slug: string }> {
  const slugs = getCollection(name).map((entry) => ({ slug: entry.slug }));
  return slugs.length > 0 ? slugs : [{ slug: NO_ENTRIES_SENTINEL }];
}

export type { CollectionName } from "./collections";
export type { PublicAbout, PublicEntry, PublicSite } from "./visibility";
export type { PublicMetric } from "./metrics";
export { EXPECTED_IMPACT_LABEL } from "./metrics";

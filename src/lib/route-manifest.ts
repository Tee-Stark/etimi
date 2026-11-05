/*
 * Which detail-page slugs exist, per section. Generated at build time from
 * published content (scripts/generate-route-manifest.ts) and used by the
 * Proxy to return a real 404 status for unknown slugs before rendering
 * starts (Cache Components would otherwise stream a "soft" 404 with 200).
 */

export type RouteManifest = Record<string, string[]>;

/** Detail sections guarded by the manifest. */
export const DETAIL_SECTIONS = ["work", "research", "writing"] as const;

/**
 * True when `pathname` is a detail page for a slug not in the manifest.
 * Paths outside the guarded sections, and section index pages, are never
 * treated as unknown.
 */
export function isUnknownDetailPath(pathname: string, manifest: RouteManifest): boolean {
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  if (parts.length < 2) return false;
  const [section, slug, ...rest] = parts;
  if (!(DETAIL_SECTIONS as readonly string[]).includes(section)) return false;
  // Generated Open Graph / Twitter images live one level below a detail page.
  const isImageRoute = rest.length === 1 && /^(opengraph|twitter)-image(?:-[\w-]+)?$/.test(rest[0]);
  if (rest.length > 0 && !isImageRoute) return true;
  let decoded: string;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    return true;
  }
  return !(manifest[section] ?? []).includes(decoded);
}

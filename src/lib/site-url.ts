/*
 * Canonical origin (IMPLEMENTATION_SPEC.md §9.2). Never hard-code a guessed
 * domain. Local development falls back to localhost; Phase 5 makes the
 * production build fail when NEXT_PUBLIC_SITE_URL is missing.
 */

const DEV_FALLBACK = "http://localhost:3000";

export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return new URL(raw && raw.length > 0 ? raw : DEV_FALLBACK);
}

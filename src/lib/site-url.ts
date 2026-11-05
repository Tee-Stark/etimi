/*
 * Canonical origin (IMPLEMENTATION_SPEC.md §9.2; PLAN.md Q28). Never guessed:
 *   1. NEXT_PUBLIC_SITE_URL, if set;
 *   2. on Netlify, the platform's own `URL` variable: the site's main
 *      address (the custom domain once attached, otherwise *.netlify.app);
 *   3. locally, http://localhost:3000.
 * Netlify production deploys fail if neither 1 nor 2 yields a real https
 * origin (scripts/check-site-url.ts).
 */

const DEV_FALLBACK = "http://localhost:3000";

type Env = Record<string, string | undefined>;

/** The configured origin string, before falling back to localhost. */
export function configuredSiteUrl(env: Env = process.env): string | undefined {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit;
  const netlify = env.NETLIFY === "true" ? env.URL?.trim() : undefined;
  return netlify || undefined;
}

export function getSiteUrl(): URL {
  return new URL(configuredSiteUrl() ?? DEV_FALLBACK);
}

/** Absolute URL for a site path, e.g. "/work" → "https://example.org/work". */
export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}

/** Why a value can't be used as the production origin, or null if it can. */
export function siteUrlProblem(raw: string | undefined): string | null {
  const value = raw?.trim();
  if (!value) return "No site URL: NEXT_PUBLIC_SITE_URL is not set (and Netlify's URL is not available)";
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return `Site URL "${value}" is not a valid URL`;
  }
  if (url.protocol !== "https:") return `Site URL must use https: (got ${url.protocol})`;
  if (/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(url.hostname)) return "Site URL points at localhost";
  if (url.pathname !== "/" || url.search || url.hash) return "Site URL must be an origin only (no path, query or hash)";
  return null;
}

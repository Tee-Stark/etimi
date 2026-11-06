/*
 * Canonical origin (IMPLEMENTATION_SPEC.md §9.2; PLAN.md Q29, Q30). Never guessed:
 *   1. NEXT_PUBLIC_SITE_URL, if set (override for any environment);
 *   2. on Vercel (production and previews), the confirmed production domain,
 *      so preview deployments point canonical URLs at production rather than
 *      competing with it in search results;
 *   3. locally, http://localhost:3000.
 * Vercel production deploys fail without a real https origin
 * (scripts/check-site-url.ts).
 */

/** The owner-confirmed production domain (PLAN.md Q29). */
export const PRODUCTION_ORIGIN = "https://etimi.me";

const DEV_FALLBACK = "http://localhost:3000";

type Env = Record<string, string | undefined>;

/** The configured origin string, before falling back to localhost. */
export function configuredSiteUrl(env: Env = process.env): string | undefined {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit;
  if (env.VERCEL === "1") return PRODUCTION_ORIGIN;
  return undefined;
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
  if (!value) return "No site URL: NEXT_PUBLIC_SITE_URL is not set and this is not a Vercel build";
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

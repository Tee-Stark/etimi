import type { Link, OptionalUrl } from "./schemas/common";

/*
 * Link policy (IMPLEMENTATION_SPEC.md §5.1 items 2, 11, 12; §12).
 *   - Hidden links are dropped before data reaches a route.
 *   - Public external links must be https:. mailto: is allowed only for the
 *     confirmed site email. Everything else (http:, javascript:, data:…) is
 *     rejected.
 *   - Internal links are paths starting with a single "/".
 */

export type PublicLink = { label: string; url: string };

export function isInternalPath(url: string): boolean {
  return url.startsWith("/") && !url.startsWith("//");
}

/** Why an external URL is unacceptable for public output, or null if it is fine. */
export function externalUrlProblem(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return `"${url}" is not a valid absolute URL`;
  }
  if (parsed.protocol !== "https:") {
    return `"${url}" uses ${parsed.protocol} — public links must use https:`;
  }
  if (!parsed.hostname.includes(".")) return `"${url}" has no valid host name`;
  return null;
}

/** Why a URL is unacceptable anywhere in public content, or null if it is fine. */
export function urlProblem(url: string, opts: { allowMailto?: string | null } = {}): string | null {
  if (isInternalPath(url)) return null;
  if (url.startsWith("#")) return null;
  if (url.toLowerCase().startsWith("mailto:")) {
    const address = url.slice("mailto:".length).split("?")[0];
    return opts.allowMailto && address === opts.allowMailto
      ? null
      : `mailto: links are allowed only for the confirmed site email`;
  }
  return externalUrlProblem(url);
}

export function publicLinks(links: readonly Link[]): PublicLink[] {
  return links.filter((l) => l.visibility === "public" && l.url).map(({ label, url }) => ({ label, url }));
}

/** The URL if public and present, otherwise undefined (so nothing is serialised). */
export function publicUrl(value: OptionalUrl | undefined): string | undefined {
  return value && value.visibility === "public" && value.url ? value.url : undefined;
}

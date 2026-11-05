/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** True for absolute http(s) URLs, which are treated as external links. */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

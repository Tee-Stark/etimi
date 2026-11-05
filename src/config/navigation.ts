/*
 * Information architecture (PLAN.md §4, IMPLEMENTATION_SPEC.md §7.1).
 * Home is represented by the wordmark, so it is not listed here.
 */

export type NavItem = { label: string; href: string };

export const primaryNav: readonly NavItem[] = [
  { label: "Work", href: "/work" },
  { label: "Research", href: "/research" },
  { label: "Projects", href: "/projects" },
  { label: "Ventures", href: "/ventures" },
  { label: "Speaking", href: "/speaking" },
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** A nav item is active on its own page and on any page nested beneath it. */
export function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

import type { PublicEntry } from "@/content/types";

/*
 * Ordering helpers for page composition. Content decides what is featured
 * and in what order (`featured`, `order`, dates); pages only apply the rule.
 */

type WithOrder = { data: { order: number; title: string } };

/** Ascending `order`, then title, for deliberate curated ordering. */
export function byOrder<T extends WithOrder>(a: T, b: T): number {
  return a.data.order - b.data.order || a.data.title.localeCompare(b.data.title);
}

/** Reverse chronological on an ISO / partial date string (YYYY[-MM[-DD]] compares lexically). */
export function byDateDesc<T>(date: (entry: T) => string) {
  return (a: T, b: T) => date(b).localeCompare(date(a));
}

export function featuredFirst<T extends PublicEntry & WithOrder>(entries: T[]): T[] {
  return [...entries].sort((a, b) => Number(b.data.featured) - Number(a.data.featured) || byOrder(a, b));
}

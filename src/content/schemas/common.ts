import { z } from "zod";

/*
 * Shared schema building blocks. Every object schema is `.strict()`, so an
 * unknown or misspelt frontmatter key is reported instead of silently
 * ignored.
 */

export const visibilitySchema = z.enum(["public", "hidden"]);
export type Visibility = z.infer<typeof visibilitySchema>;

export const statusSchema = z.enum(["shipped", "active", "in-development", "completed", "exploration", "archived"]);
export type Status = z.infer<typeof statusSchema>;

export const threadSchema = z.enum(["engineering", "research", "creation"]);
export type ThreadId = z.infer<typeof threadSchema>;

/** Lowercase, hyphen-separated, URL-safe. */
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, digits and single hyphens (e.g. loan-details-api)");

function isRealDate(value: string): boolean {
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return date.getUTCFullYear() === y && date.getUTCMonth() === (m ?? 1) - 1 && date.getUTCDate() === (d ?? 1);
}

/** Full ISO calendar date: YYYY-MM-DD. */
export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use an ISO date: YYYY-MM-DD")
  .refine(isRealDate, "Not a real calendar date");

/**
 * Date at the precision actually known: YYYY, YYYY-MM or YYYY-MM-DD.
 * Never pad an unknown month or day to make a date look more precise.
 */
export const partialDateSchema = z
  .string()
  .regex(/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/, "Use YYYY, YYYY-MM or YYYY-MM-DD")
  .refine(isRealDate, "Not a real calendar date");

const nonEmpty = (label: string) => z.string().trim().min(1, `${label} is required`);
export { nonEmpty };

/**
 * A link that may be withheld. A hidden link may have an empty URL (a
 * placeholder for something not yet supplied); a public link must have a
 * URL. URL safety is checked by the link policy, not here, so the error can
 * say exactly what is wrong.
 */
export const linkSchema = z
  .object({
    label: nonEmpty("label"),
    url: z.string().trim(),
    visibility: visibilitySchema,
  })
  .strict()
  .refine((l) => l.visibility === "hidden" || l.url.length > 0, {
    message: "A public link needs a url (set visibility: hidden until it is supplied)",
    path: ["url"],
  });
export type Link = z.infer<typeof linkSchema>;

/** A single URL that may be withheld (talk slides, a publication page, a repo). */
export const optionalUrlSchema = z
  .object({
    url: z.string().trim(),
    visibility: visibilitySchema,
  })
  .strict()
  .refine((l) => l.visibility === "hidden" || l.url.length > 0, {
    message: "A public url needs a value (set visibility: hidden until it is supplied)",
    path: ["url"],
  });
export type OptionalUrl = z.infer<typeof optionalUrlSchema>;

/**
 * Fields shared by every collection entry (IMPLEMENTATION_SPEC.md §4.2).
 * `visibility` has no default: publication is always an explicit decision.
 */
export const baseShape = {
  title: nonEmpty("title"),
  slug: slugSchema,
  summary: nonEmpty("summary"),
  visibility: visibilitySchema,
  tags: z.array(nonEmpty("tag")).default([]),
  threads: z.array(threadSchema).default([]),
  featured: z.boolean().default(false),
  order: z.number().int().default(100),
  updated: isoDateSchema,
};

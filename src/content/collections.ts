import type { z } from "zod";
import {
  caseStudySchema,
  communitySchema,
  noteSchema,
  projectSchema,
  publicationSchema,
  researchSchema,
  roleSchema,
  talkSchema,
  ventureSchema,
} from "./schemas/entities";

/*
 * The collection registry: where each collection lives, how it is
 * validated, and (if it has detail pages) the URL its entries publish at.
 * Adding an entry is a content change; adding a collection is a change here.
 */

export type CollectionDefinition<S extends z.ZodType = z.ZodType> = {
  /** Directory under content/. */
  dir: string;
  schema: S;
  /** Detail-page URL for an entry, if this collection has detail pages. */
  route?: (slug: string) => string;
};

export const collections = {
  roles: { dir: "roles", schema: roleSchema },
  caseStudies: { dir: "case-studies", schema: caseStudySchema, route: (slug: string) => `/work/${slug}` },
  research: { dir: "research", schema: researchSchema, route: (slug: string) => `/research/${slug}` },
  projects: { dir: "projects", schema: projectSchema },
  ventures: { dir: "ventures", schema: ventureSchema },
  talks: { dir: "talks", schema: talkSchema },
  notes: { dir: "notes", schema: noteSchema, route: (slug: string) => `/writing/${slug}` },
  publications: { dir: "publications", schema: publicationSchema },
  community: { dir: "community", schema: communitySchema },
} satisfies Record<string, CollectionDefinition>;

export type CollectionName = keyof typeof collections;

export const collectionNames = Object.keys(collections) as CollectionName[];

/** Static public routes (PLAN.md §4). Dynamic routes come from `route` above. */
export const staticRoutes = [
  "/",
  "/about",
  "/work",
  "/research",
  "/projects",
  "/ventures",
  "/speaking",
  "/writing",
  "/contact",
] as const;

export const SITE_FILE = "site/profile.md";
export const ABOUT_FILE = "site/about.md";
